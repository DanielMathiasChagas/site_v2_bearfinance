// Servidor Bear Finance — arquivos estáticos + API de formulários (sem dependências)
//
// Uso: `node server.js` (porta PORT, padrão 3000) ou, nos testes, `import { createApp } from "./server.js"`.
// Rotas: GET/HEAD estáticos de public/ · POST /api/<contato|newsletter|parceria|carreira> · GET /health
// Leads: data/<form>.jsonl (sempre) + LEADS_WEBHOOK_URL (opcional) + SMTP (opcional; ver .env.example)
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { readFile, appendFile, mkdir, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { once } from "node:events";
import { promisify } from "node:util";
import { gzip as gzipCb, brotliCompress as brotliCb, constants as Z } from "node:zlib";
import { randomBytes } from "node:crypto";
import net from "node:net";
import tls from "node:tls";
import os from "node:os";

const gzip = promisify(gzipCb);
const brotli = promisify(brotliCb);

const ROOT = fileURLToPath(new URL(".", import.meta.url));

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------
const BODY_LIMIT = 20 * 1024; // corpo máximo de um POST (20 KB)
const DRAIN_LIMIT = 1024 * 1024; // acima disso a conexão é derrubada sem resposta
const COMPRESS_MIN = 1024; // não comprime arquivos menores que 1 KB
const CACHE_MAX_FILE = 8 * 1024 * 1024; // arquivos maiores são servidos por stream, sem cache
const CACHE_MAX_BYTES = 64 * 1024 * 1024; // teto da memória usada pelo cache de estáticos

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
};
const COMPRESSIBLE = new Set([".html", ".css", ".js", ".mjs", ".json", ".map", ".webmanifest", ".xml", ".txt", ".svg"]);

// Origens externas usadas pelo site gerado: Google Fonts (CSS + woff2) e YouTube (nocookie) para vídeos.
// YouTube (youtube-nocookie + miniaturas) e o mapa incorporado do Google na página de contato.
export const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https://i.ytimg.com",
  "frame-src https://www.youtube-nocookie.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

// ---------------------------------------------------------------------------
// Contrato dos formulários
// ---------------------------------------------------------------------------
export const SEGMENTOS = [
  "Indústria",
  "Agronegócio",
  "Saúde",
  "Mercado Imobiliário e Construção Civil",
  "Transportes e Logística",
  "Varejo e Distribuição",
  "Energia",
  "Serviços e Tecnologia",
  "Outro",
];
export const SERVICOS = [
  "Contabilidade",
  "BPO Financeiro",
  "BPO de Folha de Pagamento",
  "Auditoria e Consultoria Tributária",
  "Estruturações Corporativas",
  "Ainda não sei",
];

// Tipos: text (1 linha) · textarea · email · phone · enum · consent ("sim") · url · path (metadado)
const text = (label, extra = {}) => ({ label, type: "text", max: 120, ...extra });
const name = (label, missing) => text(label, { required: true, min: 2, missing });
const email = (missing = "Informe seu e-mail.") => ({ label: "E-mail", type: "email", max: 254, required: true, missing });
const phone = (required, missing = "Informe seu telefone.") => ({ label: "Telefone", type: "phone", max: 40, required, missing });
const lgpd = () => ({ label: "Consentimento LGPD", type: "consent", max: 10, required: true, missing: "É necessário aceitar a Política de Privacidade para enviar." });
const textarea = (label) => ({ label, type: "textarea", max: 2000 });

export const FORMS = {
  contato: {
    ok: "Mensagem recebida! Um especialista entrará em contato em até 1 dia útil.",
    fields: {
      nome: name("Nome", "Informe seu nome."),
      empresa: name("Empresa", "Informe o nome da empresa."),
      email: email(),
      telefone: phone(true),
      segmento: { label: "Segmento", type: "enum", options: SEGMENTOS, required: true, missing: "Selecione o segmento da empresa." },
      servico: { label: "Serviço", type: "enum", options: SERVICOS, required: true, missing: "Selecione o serviço de interesse." },
      mensagem: textarea("Mensagem"),
      lgpd: lgpd(),
      origem: { label: "Página de origem", type: "path", max: 200 },
      cargo: text("Cargo"),
      erp: text("ERP"),
      faturamento: text("Faturamento anual"),
    },
  },
  newsletter: {
    ok: "Inscrição confirmada. Obrigado!",
    fields: { nome: text("Nome"), email: email(), telefone: phone(false), empresa: text("Empresa") },
  },
  parceria: {
    ok: "Cadastro recebido! Continue a conversa pelo WhatsApp.",
    fields: {
      programa: name("Programa", "Informe o programa de parceria."),
      nome: name("Nome", "Informe seu nome."),
      telefone: phone(true, "Informe seu WhatsApp."),
      email: email(),
      cidade: name("Cidade / UF", "Informe sua cidade."),
      escritorio: text("Nome do escritório", { max: 160 }),
      carteira: text("Clientes na carteira"),
      regimes: text("Regimes que mais atende", { max: 300 }),
      desafio: text("Maior desafio hoje"),
      perfil: text("Perfil profissional"),
      rede: text("Tamanho da rede"),
      setores: text("Setores com mais relacionamento", { max: 300 }),
      atuacao: text("Como pretende atuar"),
      mensagem: textarea("Mensagem"),
      lgpd: lgpd(),
    },
  },
  carreira: {
    ok: "Candidatura recebida. Boa sorte!",
    fields: {
      nome: name("Nome", "Informe seu nome."),
      email: email(),
      telefone: phone(true),
      vaga: text("Vaga"),
      curriculo: { label: "Currículo", type: "url", max: 300, required: true, missing: "Informe o link do seu LinkedIn ou currículo." },
      mensagem: textarea("Sobre você"),
      lgpd: lgpd(),
    },
  },
};

// ---------------------------------------------------------------------------
// Validação
// ---------------------------------------------------------------------------
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/;
const INVISIBLE_CHARS = /[​-‏‪-‮⁠-⁤⁦-⁩﻿]/g;
const EMAIL_RE = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.info", "10minutemail.com", "10minutemail.net", "tempmail.com",
  "temp-mail.org", "yopmail.com", "yopmail.fr", "trashmail.com", "sharklasers.com", "getnada.com", "dispostable.com",
  "throwawaymail.com", "maildrop.cc", "fakeinbox.com", "mohmal.com", "emailondeck.com", "mailnesia.com", "tempr.email",
]);
const URL_RE = /^https?:\/\/[^\s<>"'`]{3,}$/i;
const PATH_RE = /^\/[\w\-./%?=&#~+]*$/;
const LINK_RE = /\b(?:https?:\/\/|www\.)/gi;

/** Normaliza um valor de entrada: NFC, sem invisíveis, espaços colapsados. Devolve null se houver caracteres de controle. */
export function cleanText(value, multiline = false) {
  if (value == null) return "";
  if (typeof value !== "string") {
    if (typeof value === "number" || typeof value === "boolean") value = String(value);
    else return "";
  }
  value = value.normalize("NFC").replace(INVISIBLE_CHARS, "");
  if (CONTROL_CHARS.test(value)) return null;
  value = value.replace(/\r\n?/g, "\n");
  value = multiline
    ? value.replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").replace(/\n{3,}/g, "\n\n")
    : value.replace(/\s+/g, " ");
  return value.trim();
}

/** Telefone BR: devolve só os dígitos (10–13) ou null. Aceita "(11) 98314-8774", "11983148774", "+55 11 98314-8774". */
export function normalizePhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) return null;
  if (/^(\d)\1+$/.test(digits)) return null; // 0000000000, 1111111111…
  if (digits.length >= 12 && !digits.startsWith("55")) return null; // com código de país, só +55
  return digits;
}

export function formatPhone(digits) {
  let d = String(digits ?? "").replace(/\D/g, "");
  let cc = "";
  if (d.length >= 12 && d.startsWith("55")) { cc = "+55 "; d = d.slice(2); }
  if (d.length === 11) return `${cc}(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `${cc}(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return cc + d;
}

/**
 * Valida `input` contra `form.fields`. Devolve { ok: true, entry } (campos limpos, só os conhecidos)
 * ou { ok: false, error, field } com mensagem em português para exibir ao usuário.
 */
export function validateForm(form, input) {
  const fail = (error, field) => ({ ok: false, error, field });
  const entry = {};
  let links = 0;
  for (const [key, spec] of Object.entries(form.fields)) {
    let v = cleanText(input[key], spec.type === "textarea");
    if (v === null) return fail(`${spec.label}: caracteres inválidos.`, key);
    if (!v) {
      if (spec.required) return fail(spec.missing || `Preencha o campo "${spec.label}".`, key);
      continue;
    }
    if (v.length > spec.max) return fail(`${spec.label}: no máximo ${spec.max} caracteres.`, key);
    if (spec.min && v.length < spec.min) return fail(`${spec.label}: no mínimo ${spec.min} caracteres.`, key);
    switch (spec.type) {
      case "email":
        v = v.toLowerCase();
        if (!EMAIL_RE.test(v)) return fail("E-mail inválido. Confira o endereço digitado.", key);
        if (DISPOSABLE_DOMAINS.has(v.split("@")[1])) return fail("E-mails temporários não são aceitos. Use seu e-mail corporativo ou pessoal.", key);
        break;
      case "phone": {
        const d = normalizePhone(v);
        if (!d) return fail("Telefone inválido. Informe DDD + número, ex.: (11) 98765-4321.", key);
        v = d;
        break;
      }
      case "enum":
        if (!spec.options.includes(v)) return fail(`${spec.label}: selecione uma das opções disponíveis.`, key);
        break;
      case "consent":
        if (!/^(sim|on|true|1)$/i.test(v)) return fail(spec.missing, key);
        v = "sim";
        break;
      case "url":
        if (!URL_RE.test(v)) return fail(`${spec.label}: informe um link válido começando com http:// ou https://.`, key);
        break;
      case "path":
        if (!PATH_RE.test(v)) continue; // metadado opcional: descarta em silêncio se vier estranho
        break;
      default:
        links += (v.match(LINK_RE) || []).length;
    }
    entry[key] = v;
  }
  if (links > 3) return fail("Mensagem com excesso de links. Remova os links e tente novamente.", "mensagem");
  return { ok: true, entry };
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
export const maskEmail = (e = "") => {
  const [user, domain] = String(e).split("@");
  return domain ? `${user.slice(0, 1)}***@${domain}` : "***";
};
export const maskIp = (ip = "") => (ip.includes(":") ? ip.split(":").slice(0, 3).join(":") + ":…" : ip.replace(/\.\d+$/, ".x"));

const httpError = (status, message) => Object.assign(new Error(message), { status });

// 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127/8, 169.254/16, ::1, fc00::/7, fe80::/10
const PRIVATE_IP = /^(?:::ffff:)?(?:127\.|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|169\.254\.)|^(?:::1$|f[cd][0-9a-f]{2}:|fe80:)/i;

function parseTrustProxy(value) {
  if (value === undefined || value === null || value === "" || value === "auto") return "auto";
  if (value === true || value === "true") return 1;
  if (value === false || value === "false") return 0;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : "auto";
}

/** IP do cliente. Só lê X-Forwarded-For quando há proxy confiável (TRUST_PROXY=n ou, em "auto", quando o par é rede privada/loopback). */
export function clientIp(req, trustProxy = "auto") {
  const remote = (req.socket?.remoteAddress || "").replace(/^::ffff:/, "");
  const hops = trustProxy === "auto" ? (PRIVATE_IP.test(req.socket?.remoteAddress || "") ? 1 : 0) : trustProxy;
  if (hops > 0) {
    const xff = String(req.headers["x-forwarded-for"] || "").split(",").map((s) => s.trim()).filter(Boolean);
    const ip = xff[xff.length - hops];
    if (ip) return ip.replace(/^::ffff:/, "").slice(0, 64);
  }
  return remote || "desconhecido";
}

/** Janela deslizante em memória (uma instância). `hit()` devolve false quando o limite foi atingido. */
class RateLimit {
  constructor(max, windowMs) { this.max = max; this.windowMs = windowMs; this.map = new Map(); }
  hit(key) {
    const now = Date.now();
    const list = (this.map.get(key) || []).filter((t) => now - t < this.windowMs);
    const allowed = list.length < this.max;
    if (allowed) list.push(now);
    this.map.set(key, list);
    return allowed;
  }
  sweep() {
    const now = Date.now();
    for (const [key, list] of this.map) {
      const fresh = list.filter((t) => now - t < this.windowMs);
      if (fresh.length) this.map.set(key, fresh); else this.map.delete(key);
    }
    if (this.map.size > 50_000) this.map.clear(); // salvaguarda contra inundação de chaves
  }
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const declared = Number(req.headers["content-length"]);
    let size = 0, over = Number.isFinite(declared) && declared > limit, done = false;
    const chunks = [];
    const finish = (fn, value) => { if (!done) { done = true; fn(value); } };
    req.on("data", (chunk) => {
      size += chunk.length;
      if (over) { if (size > DRAIN_LIMIT) req.destroy(); return; } // drena o resto para responder 413 limpo
      if (size > limit) { over = true; chunks.length = 0; return; }
      chunks.push(chunk);
    });
    req.on("end", () => (over ? finish(reject, httpError(413, "Conteúdo muito grande (máximo 20 KB).")) : finish(resolve, Buffer.concat(chunks))));
    req.on("error", (err) => finish(reject, err));
    req.on("close", () => finish(reject, httpError(400, "Conexão encerrada antes do fim do envio.")));
  });
}

function pickEncoding(req) {
  const header = String(req.headers["accept-encoding"] || "");
  if (!header) return null;
  const ok = new Map();
  for (const part of header.split(",")) {
    const [enc, ...params] = part.trim().split(";");
    const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    ok.set(enc.trim().toLowerCase(), q ? parseFloat(q.slice(2)) > 0 : true);
  }
  if (ok.get("br")) return "br";
  if (ok.get("gzip")) return "gzip";
  return null;
}

const compress = (enc, buf) => (enc === "br"
  ? brotli(buf, { params: { [Z.BROTLI_PARAM_QUALITY]: 6, [Z.BROTLI_PARAM_SIZE_HINT]: buf.length } })
  : gzip(buf, { level: 6 }));

function etagMatches(header, etag) {
  if (!header) return false;
  const strong = etag.replace(/^W\//, "");
  return String(header).split(",").some((t) => { t = t.trim(); return t === "*" || t === etag || t === strong; });
}

function parseRange(header, size) {
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(header || "").trim());
  if (!m || (!m[1] && !m[2])) return null;
  let start, end;
  if (!m[1]) { start = Math.max(0, size - Number(m[2])); end = size - 1; }
  else { start = Number(m[1]); end = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1; }
  if (start > end || start >= size) return { invalid: true };
  return { start, end };
}

const fmtDate = (iso) => {
  try { return new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" }) + " (Brasília)"; }
  catch { return iso; }
};

// ---------------------------------------------------------------------------
// E-mail (SMTP sem dependências): STARTTLS (587) ou TLS implícito (465), AUTH PLAIN/LOGIN
// ---------------------------------------------------------------------------
const headerSafe = (v) => String(v ?? "").replace(/[\r\n]+/g, " ").trim();
const encodeHeader = (v) => (/^[\x20-\x7e]*$/.test(v) ? v : `=?UTF-8?B?${Buffer.from(v, "utf8").toString("base64")}?=`);
const addrOf = (v) => {
  const m = /<([^<>\s]+)>\s*$/.exec(String(v ?? "").trim());
  const addr = (m ? m[1] : String(v ?? "").trim()).toLowerCase();
  if (!/^[^\s<>@,;"]+@[^\s<>@,;"]+\.[a-z0-9-]+$/i.test(addr)) throw new Error(`endereço de e-mail inválido: ${headerSafe(v)}`);
  return addr;
};

/** Lê/normaliza a configuração SMTP a partir das variáveis de ambiente. Só ativa com todas presentes. */
export function smtpFromEnv(env = process.env) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, LEADS_TO, LEADS_FROM, SMTP_SECURE, SMTP_STARTTLS } = env;
  if (!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && LEADS_TO && LEADS_FROM)) return null;
  const port = Number(SMTP_PORT);
  return normalizeSmtp({
    host: SMTP_HOST, port, user: SMTP_USER, pass: SMTP_PASS, to: LEADS_TO, from: LEADS_FROM,
    secure: SMTP_SECURE === undefined || SMTP_SECURE === "" ? port === 465 : SMTP_SECURE === "1",
    starttls: SMTP_STARTTLS === "0" ? false : true,
  });
}

function normalizeSmtp(cfg) {
  if (!cfg) return null;
  const port = Number(cfg.port);
  if (!cfg.host || !Number.isInteger(port) || port <= 0) throw new Error("SMTP: host/porta inválidos.");
  const to = [].concat(cfg.to || []).flatMap((s) => String(s).split(",")).map((s) => s.trim()).filter(Boolean);
  if (!to.length || !cfg.from) throw new Error("SMTP: LEADS_TO e LEADS_FROM são obrigatórios.");
  return {
    host: cfg.host, port, user: cfg.user || "", pass: cfg.pass || "", to, from: cfg.from,
    secure: Boolean(cfg.secure), starttls: cfg.secure ? false : cfg.starttls !== false,
    servername: cfg.servername, tls: cfg.tls, timeout: cfg.timeout || 15_000,
  };
}

class SmtpConnection {
  constructor(cfg) { this.cfg = cfg; this.buf = ""; this.lines = []; this.ready = []; this.waiter = null; this.error = null; this.sock = null; }

  async connect() {
    const { host, port, secure, servername, tls: tlsOpts, timeout } = this.cfg;
    const sock = secure ? tls.connect({ host, port, servername: servername || host, ...(tlsOpts || {}) }) : net.connect({ host, port });
    this.attach(sock, timeout);
    await once(sock, secure ? "secureConnect" : "connect");
    await this.read(["220"]);
  }

  attach(sock, timeout) {
    this.sock = sock; this.buf = ""; this.lines = [];
    sock.on("data", (d) => { this.buf += d.toString("latin1"); this.pump(); });
    sock.on("error", (err) => this.fail(err));
    sock.on("close", () => this.fail(new Error("conexão encerrada pelo servidor")));
    sock.setTimeout(timeout, () => { this.fail(new Error("tempo de resposta esgotado")); sock.destroy(); });
  }

  fail(err) {
    if (!this.error) this.error = err;
    if (this.waiter) { const w = this.waiter; this.waiter = null; w.reject(err); }
  }

  pump() {
    let i;
    while ((i = this.buf.indexOf("\n")) !== -1) {
      const line = this.buf.slice(0, i).replace(/\r$/, "");
      this.buf = this.buf.slice(i + 1);
      this.lines.push(line);
      if (/^\d{3}(?: |$)/.test(line)) {
        const lines = this.lines; this.lines = [];
        const reply = { code: line.slice(0, 3), lines, text: lines.map((l) => l.slice(4)).join(" ") };
        if (this.waiter) { const w = this.waiter; this.waiter = null; w.resolve(reply); } else this.ready.push(reply);
      }
    }
  }

  read(expect) {
    return new Promise((resolve, reject) => {
      if (this.ready.length) return resolve(this.ready.shift());
      if (this.error) return reject(this.error);
      this.waiter = { resolve, reject };
    }).then((reply) => {
      if (expect && !expect.includes(reply.code)) throw new Error(`SMTP respondeu ${reply.code} ${reply.text.slice(0, 120)}`);
      return reply;
    });
  }

  cmd(line, expect) {
    if (this.error) return Promise.reject(this.error);
    this.sock.write(line + "\r\n");
    return this.read(expect);
  }

  async ehlo() {
    const host = os.hostname().replace(/[^a-z0-9.-]/gi, "") || "localhost";
    const reply = await this.cmd(`EHLO ${host}`, ["250"]);
    const caps = new Map();
    for (const l of reply.lines.slice(1)) {
      const [key, ...rest] = l.slice(4).trim().split(/\s+/);
      if (key) caps.set(key.toUpperCase(), rest.map((s) => s.toUpperCase()));
    }
    return caps;
  }

  async upgrade() {
    const plain = this.sock;
    for (const ev of ["data", "error", "close", "timeout"]) plain.removeAllListeners(ev);
    plain.setTimeout(0);
    const secure = tls.connect({ socket: plain, servername: this.cfg.servername || this.cfg.host, ...(this.cfg.tls || {}) });
    this.attach(secure, this.cfg.timeout);
    await once(secure, "secureConnect");
  }

  async auth(caps) {
    const { user, pass } = this.cfg;
    if (!user) return;
    const methods = caps.get("AUTH") || [];
    if (methods.includes("PLAIN") || !methods.length) {
      await this.cmd(`AUTH PLAIN ${Buffer.from(`\0${user}\0${pass}`, "utf8").toString("base64")}`, ["235"]);
    } else if (methods.includes("LOGIN")) {
      await this.cmd("AUTH LOGIN", ["334"]);
      await this.cmd(Buffer.from(user, "utf8").toString("base64"), ["334"]);
      await this.cmd(Buffer.from(pass, "utf8").toString("base64"), ["235"]);
    } else {
      throw new Error(`SMTP: servidor não oferece AUTH PLAIN/LOGIN (oferece: ${methods.join(", ") || "nada"})`);
    }
  }

  close() {
    if (!this.sock) return;
    for (const ev of ["error", "close", "timeout"]) this.sock.removeAllListeners(ev);
    this.sock.on("error", () => {});
    this.sock.end();
    this.sock.destroy();
  }
}

/** Monta a mensagem MIME (text/plain, UTF-8, base64) com cabeçalhos saneados. */
export function buildMime({ from, to, replyTo, subject, text }) {
  const recipients = [].concat(to);
  const domain = addrOf(from).split("@")[1];
  const headers = [
    `From: ${headerSafe(from)}`,
    `To: ${recipients.map(headerSafe).join(", ")}`,
    replyTo ? `Reply-To: ${headerSafe(replyTo)}` : null,
    `Subject: ${encodeHeader(headerSafe(subject))}`,
    `Date: ${new Date().toUTCString().replace(/GMT$/, "+0000")}`,
    `Message-ID: <${Date.now().toString(36)}.${randomBytes(8).toString("hex")}@${domain}>`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="utf-8"',
    "Content-Transfer-Encoding: base64",
    "X-Mailer: bearfinance-site",
  ].filter(Boolean);
  const body = Buffer.from(String(text ?? ""), "utf8").toString("base64").replace(/.{76}/g, "$&\r\n");
  return (headers.join("\r\n") + "\r\n\r\n" + body).replace(/\r\n\./g, "\r\n..");
}

/**
 * Envia um e-mail. `smtp` = { host, port, user, pass, secure, starttls, servername?, tls?, timeout? };
 * `message` = { from, to, replyTo?, subject, text }. Lança erro em qualquer falha (quem chama decide o que fazer).
 */
export async function sendMail(smtp, message) {
  const cfg = normalizeSmtp({ to: message.to, from: message.from, ...smtp });
  const conn = new SmtpConnection(cfg);
  try {
    await conn.connect();
    let caps = await conn.ehlo();
    if (!cfg.secure && cfg.starttls) {
      if (!caps.has("STARTTLS")) throw new Error("SMTP: servidor não oferece STARTTLS (use SMTP_SECURE=1 na 465 ou SMTP_STARTTLS=0 para um relay local)");
      await conn.cmd("STARTTLS", ["220"]);
      await conn.upgrade();
      caps = await conn.ehlo();
    }
    await conn.auth(caps);
    await conn.cmd(`MAIL FROM:<${addrOf(cfg.from)}>`, ["250"]);
    for (const to of cfg.to) await conn.cmd(`RCPT TO:<${addrOf(to)}>`, ["250", "251"]);
    await conn.cmd("DATA", ["354"]);
    await conn.cmd(buildMime({ ...message, from: cfg.from, to: cfg.to }) + "\r\n.", ["250"]);
    await conn.cmd("QUIT", ["221"]).catch(() => {});
  } finally {
    conn.close();
  }
}

/** Texto do e-mail de lead: um campo por linha, com rótulos do contrato. */
export function buildLeadMail(formName, form, record) {
  const who = record.nome || record.email || "sem nome";
  const extra = record.empresa ? ` (${record.empresa})` : record.escritorio ? ` (${record.escritorio})` : "";
  const subject = `[Bear Finance] Novo lead (${formName}): ${who}${extra}`.slice(0, 160);
  const lines = ["Novo lead recebido pelo site Bear Finance.", "", `Formulário: ${formName}`, `Recebido em: ${fmtDate(record.at)}`, ""];
  for (const [key, spec] of Object.entries(form.fields)) {
    if (record[key] === undefined || record[key] === "") continue;
    const value = spec.type === "phone" ? formatPhone(record[key]) : record[key];
    if (spec.type === "textarea") lines.push(`${spec.label}:`, value, "");
    else lines.push(`${spec.label}: ${value}`);
  }
  lines.push("", `IP de origem: ${record.ip}`, "", "— Enviado automaticamente pelo site. Responda este e-mail para falar com o lead.");
  return { subject, text: lines.join("\n"), replyTo: record.email };
}

// ---------------------------------------------------------------------------
// Aplicação
// ---------------------------------------------------------------------------
/**
 * Cria o servidor HTTP (sem `listen`).
 * options: { dataDir, publicDir, webhook, smtp, rateLimit: { ip: {max, windowMs}, email: {max, windowMs} },
 *            minFillMs, trustProxy, env, log }
 * Eventos: "lead" (record gravado) · "delivered" ({ record, results }) após webhook/SMTP terminarem.
 */
export function createApp(options = {}) {
  const env = options.env || process.env;
  const publicDir = resolve(options.publicDir || join(ROOT, "public"));
  const dataDir = resolve(options.dataDir || join(ROOT, "data"));
  const webhook = options.webhook === undefined ? env.LEADS_WEBHOOK_URL || null : options.webhook;
  const smtp = options.smtp === undefined ? smtpFromEnv(env) : normalizeSmtp(options.smtp);
  const log = options.log || console;
  const limits = { ip: { max: 10, windowMs: 600_000 }, email: { max: 5, windowMs: 3_600_000 }, ...(options.rateLimit || {}) };
  const minFillMs = options.minFillMs ?? 3000;
  const trustProxy = parseTrustProxy(options.trustProxy ?? env.TRUST_PROXY);
  const forceHsts = env.FORCE_HSTS === "1";

  const ipLimit = new RateLimit(limits.ip.max, limits.ip.windowMs);
  const emailLimit = new RateLimit(limits.email.max, limits.email.windowMs);
  const cache = new Map(); // caminho → { etag, raw, gz?, br? }
  let cacheBytes = 0;
  let plainSmtpWarned = false;

  // ---- respostas ----
  const baseHeaders = (req) => {
    const h = {
      "Content-Security-Policy": CSP,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "SAMEORIGIN",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Cross-Origin-Opener-Policy": "same-origin",
    };
    const proto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim().toLowerCase();
    if (forceHsts || proto === "https") h["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
    return h;
  };
  const send = (req, res, code, body, headers = {}) => {
    if (res.destroyed || res.headersSent) return;
    const h = { ...baseHeaders(req), ...headers };
    if (code !== 304 && body != null && !("Content-Length" in h)) h["Content-Length"] = Buffer.byteLength(body);
    res.writeHead(code, h);
    res.end(req.method === "HEAD" || code === 304 ? undefined : body);
  };
  const json = (req, res, code, obj, headers = {}) =>
    send(req, res, code, JSON.stringify(obj), { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers });
  const notFound = async (req, res) => {
    const body = await readFile(join(publicDir, "404.html")).catch(() => "<!doctype html><meta charset=\"utf-8\"><title>Página não encontrada</title><h1>Página não encontrada</h1>");
    return send(req, res, 404, body, { "Content-Type": TYPES[".html"], "Cache-Control": "no-cache" });
  };

  // ---- entrega de leads (não bloqueia a resposta) ----
  function deliver(formName, form, record) {
    const tasks = [];
    if (webhook) {
      tasks.push(fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record), signal: AbortSignal.timeout(10_000) })
        .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return "webhook ok"; })
        .catch((err) => { log.error(`[webhook] falhou (${formName} ${maskEmail(record.email)}): ${err.message}`); throw err; }));
    }
    if (smtp) {
      if (!smtp.secure && !smtp.starttls && !plainSmtpWarned) { plainSmtpWarned = true; log.warn("[smtp] aviso: conexão sem TLS (SMTP_STARTTLS=0); use só com relay local"); }
      const mail = buildLeadMail(formName, form, record);
      tasks.push(sendMail(smtp, { from: smtp.from, to: smtp.to, ...mail })
        .then(() => { log.info(`[smtp] lead ${formName} ${maskEmail(record.email)} enviado para ${smtp.to.map(maskEmail).join(", ")}`); return "smtp ok"; })
        .catch((err) => { log.error(`[smtp] falhou (${formName} ${maskEmail(record.email)}): ${err.message}`); throw err; }));
    }
    Promise.allSettled(tasks).then((results) => server.emit("delivered", { record, results }));
  }

  // ---- API ----
  async function handleForm(formName, req, res) {
    const form = FORMS[formName];
    if (!form) return json(req, res, 404, { error: "Formulário inexistente." });
    const ip = clientIp(req, trustProxy);
    if (!ipLimit.hit(ip)) {
      log.warn(`[rate] ip ${maskIp(ip)} bloqueado em ${formName}`);
      return json(req, res, 429, { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." }, { "Retry-After": String(Math.ceil(limits.ip.windowMs / 1000)) });
    }
    const ctype = String(req.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
    if (ctype !== "application/json") return json(req, res, 415, { error: "Envie os dados em JSON (Content-Type: application/json)." });

    let input;
    try {
      input = JSON.parse((await readBody(req, BODY_LIMIT)).toString("utf8"));
    } catch (err) {
      if (res.destroyed) return;
      return json(req, res, err.status || 400, { error: err.status ? err.message : "Dados inválidos." }, err.status === 413 ? { Connection: "close" } : {});
    }
    if (!input || typeof input !== "object" || Array.isArray(input)) return json(req, res, 400, { error: "Dados inválidos." });

    // Robôs: honeypot preenchido ou envio rápido demais → finge sucesso e descarta.
    if (input.website) { log.warn(`[spam] ${formName} honeypot ip=${maskIp(ip)}`); return json(req, res, 200, { message: form.ok }); }
    const ts = Number(input.ts);
    if (input.ts !== undefined && input.ts !== "" && Number.isFinite(ts)) {
      const elapsed = Date.now() - ts;
      if (elapsed >= 0 && elapsed < minFillMs) { log.warn(`[spam] ${formName} enviado em ${elapsed} ms ip=${maskIp(ip)}`); return json(req, res, 200, { message: form.ok }); }
    }

    const result = validateForm(form, input);
    if (!result.ok) return json(req, res, 422, { error: result.error, field: result.field });
    const { entry } = result;
    if (entry.email && !emailLimit.hit(entry.email)) {
      log.warn(`[rate] e-mail ${maskEmail(entry.email)} bloqueado em ${formName}`);
      return json(req, res, 429, { error: "Já recebemos vários envios com este e-mail. Aguarde um pouco e tente novamente." }, { "Retry-After": String(Math.ceil(limits.email.windowMs / 1000)) });
    }

    const record = { form: formName, at: new Date().toISOString(), ip, ...entry };
    await mkdir(dataDir, { recursive: true });
    await appendFile(join(dataDir, `${formName}.jsonl`), JSON.stringify(record) + "\n");
    log.info(`[lead] ${formName} ${maskEmail(entry.email)} ip=${maskIp(ip)}${entry.origem ? ` origem=${entry.origem}` : ""}`);
    server.emit("lead", record);
    deliver(formName, form, record);
    return json(req, res, 201, { message: form.ok });
  }

  // ---- estáticos ----
  async function cached(file, etag, size) {
    const hit = cache.get(file);
    if (hit && hit.etag === etag) return hit;
    if (hit) { cacheBytes -= hit.bytes; cache.delete(file); }
    const raw = await readFile(file);
    const entry = { etag, raw, bytes: raw.length };
    cache.set(file, entry);
    cacheBytes += entry.bytes;
    for (const [key, old] of cache) { // expulsa os mais antigos até caber
      if (cacheBytes <= CACHE_MAX_BYTES) break;
      cache.delete(key); cacheBytes -= old.bytes;
    }
    return entry;
  }

  async function serveStatic(req, res, url) {
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { return send(req, res, 400, "Bad Request", { "Content-Type": TYPES[".txt"] }); }
    if (pathname.includes("\0")) return send(req, res, 400, "Bad Request", { "Content-Type": TYPES[".txt"] });
    if (/(^|\/)\.[^/]/.test(pathname)) return notFound(req, res); // arquivos ocultos (.git, .env…)
    let file = resolve(publicDir, "." + pathname);
    if (file !== publicDir && !file.startsWith(publicDir + sep)) return notFound(req, res); // fora de public/

    let st;
    try {
      st = await stat(file);
      if (st.isDirectory()) {
        if (!pathname.endsWith("/")) {
          const location = url.pathname.replace(/\/{2,}/g, "/") + "/" + url.search;
          return send(req, res, 301, "", { Location: location, "Cache-Control": "no-cache" });
        }
        file = join(file, "index.html");
        st = await stat(file);
      }
      if (!st.isFile()) return notFound(req, res);
    } catch {
      return notFound(req, res);
    }

    const ext = extname(file).toLowerCase();
    const etag = `W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
    const headers = {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : url.searchParams.has("v") ? "public, max-age=31536000, immutable" : "public, max-age=3600",
      ETag: etag,
      "Last-Modified": st.mtime.toUTCString(),
    };
    const compressible = COMPRESSIBLE.has(ext) && st.size <= CACHE_MAX_FILE;
    if (compressible) headers.Vary = "Accept-Encoding";
    if (etagMatches(req.headers["if-none-match"], etag)) return send(req, res, 304, null, headers);

    if (compressible) {
      const entry = await cached(file, etag, st.size);
      let body = entry.raw;
      const enc = st.size >= COMPRESS_MIN ? pickEncoding(req) : null;
      if (enc) {
        if (!entry[enc]) entry[enc] = await compress(enc, entry.raw);
        body = entry[enc];
        headers["Content-Encoding"] = enc;
      }
      return send(req, res, 200, body, headers);
    }

    // Binários (imagens, fontes, vídeo): stream com suporte a Range (necessário para <video> no Safari).
    headers["Accept-Ranges"] = "bytes";
    let status = 200, start = 0, end = st.size - 1;
    const range = req.headers.range ? parseRange(req.headers.range, st.size) : null;
    if (range?.invalid) return send(req, res, 416, "", { "Content-Range": `bytes */${st.size}`, "Content-Type": TYPES[".txt"] });
    if (range) { status = 206; ({ start, end } = range); headers["Content-Range"] = `bytes ${start}-${end}/${st.size}`; }
    headers["Content-Length"] = st.size === 0 ? 0 : end - start + 1;
    if (req.method === "HEAD" || st.size === 0) return send(req, res, status, "", headers);
    const stream = createReadStream(file, { start, end });
    try { await once(stream, "open"); } catch { return notFound(req, res); }
    res.writeHead(status, { ...baseHeaders(req), ...headers });
    stream.pipe(res);
    res.on("close", () => stream.destroy());
  }

  // ---- roteador ----
  const server = createServer(async (req, res) => {
    let url;
    try { url = new URL(req.url, "http://localhost"); } catch { return send(req, res, 400, "Bad Request", { "Content-Type": TYPES[".txt"] }); }
    try {
      const api = url.pathname.match(/^\/api\/([a-z]+)\/?$/);
      if (api) {
        if (req.method !== "POST") return json(req, res, 405, { error: "Método não permitido." }, { Allow: "POST" });
        return await handleForm(api[1], req, res);
      }
      if (url.pathname === "/health") {
        if (req.method !== "GET" && req.method !== "HEAD") return json(req, res, 405, { error: "Método não permitido." }, { Allow: "GET, HEAD" });
        return json(req, res, 200, { ok: true });
      }
      if (req.method !== "GET" && req.method !== "HEAD") return send(req, res, 405, "Method Not Allowed", { "Content-Type": TYPES[".txt"], Allow: "GET, HEAD" });
      return await serveStatic(req, res, url);
    } catch (err) {
      log.error(`[erro] ${req.method} ${url.pathname}: ${err?.stack || err}`);
      if (res.headersSent) return res.destroy();
      if (url.pathname.startsWith("/api/")) return json(req, res, 500, { error: "Erro interno. Tente novamente ou fale conosco pelo WhatsApp." });
      return send(req, res, 500, "Erro interno", { "Content-Type": TYPES[".txt"] });
    }
  });

  server.headersTimeout = 20_000;
  server.requestTimeout = 30_000;
  server.keepAliveTimeout = 5_000;
  server.maxHeadersCount = 100;

  const sweeper = setInterval(() => { ipLimit.sweep(); emailLimit.sweep(); }, 60_000);
  sweeper.unref();
  server.on("close", () => clearInterval(sweeper));
  server.on("listening", () => {
    if (smtp) log.info(`[leads] e-mail via ${smtp.host}:${smtp.port} (${smtp.secure ? "TLS" : smtp.starttls ? "STARTTLS" : "sem TLS"}) para ${smtp.to.map(maskEmail).join(", ")}`);
    else log.warn(`[leads] entrega por e-mail não configurada; leads ficam em data/*.jsonl${webhook ? " (e no webhook)" : ""}`);
    if (webhook) log.info(`[leads] webhook: ${new URL(webhook).origin}/…`);
  });
  return server;
}

// ---------------------------------------------------------------------------
// `node server.js`
// ---------------------------------------------------------------------------
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const PORT = /^\d+$/.test(process.env.PORT || "") ? Number(process.env.PORT) : 3000; // PORT=0 → porta aleatória
  const server = createApp();
  server.listen(PORT, () => console.log(`Bear Finance em http://localhost:${server.address().port}`));
  const stop = () => {
    server.close(() => process.exit(0));
    server.closeAllConnections?.();
    setTimeout(() => process.exit(0), 5000).unref();
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}
