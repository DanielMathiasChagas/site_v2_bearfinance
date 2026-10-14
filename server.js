// Servidor Bear Finance — arquivos estáticos + API de formulários (sem dependências)
import { createServer } from "node:http";
import { readFile, appendFile, mkdir, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC = join(ROOT, "public");
const DATA = join(ROOT, "data");
const PORT = Number(process.env.PORT) || 3000;
const WEBHOOK = process.env.LEADS_WEBHOOK_URL; // opcional: encaminha leads (ex.: CRM, Zapier, n8n)

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".webp": "image/webp",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FORMS = {
  contato: { required: ["nome", "email", "telefone", "lgpd"], fields: ["nome", "empresa", "cargo", "email", "telefone", "erp", "faturamento", "interesse", "mensagem", "lgpd"], ok: "Mensagem recebida! Um especialista entrará em contato em até 1 dia útil." },
  newsletter: { required: ["email"], fields: ["nome", "email", "telefone", "empresa"], ok: "Inscrição confirmada. Obrigado!" },
  parceria: { required: ["programa", "nome", "telefone", "email", "cidade", "lgpd"], fields: ["programa", "nome", "telefone", "email", "cidade", "escritorio", "carteira", "regimes", "desafio", "perfil", "rede", "setores", "atuacao", "mensagem", "lgpd"], ok: "Cadastro recebido! Continue a conversa pelo WhatsApp." },
  carreira: { required: ["nome", "email", "telefone", "curriculo", "lgpd"], fields: ["nome", "email", "telefone", "vaga", "curriculo", "mensagem", "lgpd"], ok: "Candidatura recebida. Boa sorte!" },
};

// Limite simples por IP: 10 envios / 10 min
const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 600_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 10;
};

const send = (res, code, body, headers = {}) => {
  res.writeHead(code, { "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", ...headers });
  res.end(body);
};
const json = (res, code, obj) => send(res, code, JSON.stringify(obj), { "Content-Type": "application/json; charset=utf-8" });

async function readBody(req, limit = 20_000) {
  let size = 0;
  const chunks = [];
  for await (const c of req) {
    size += c.length;
    if (size > limit) throw Object.assign(new Error("Conteúdo muito grande."), { status: 413 });
    chunks.push(c);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function handleForm(name, req, res) {
  const form = FORMS[name];
  if (!form) return json(res, 404, { error: "Formulário inexistente." });
  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;
  if (limited(ip)) return json(res, 429, { error: "Muitas tentativas. Tente novamente em alguns minutos." });

  let input;
  try {
    input = JSON.parse(await readBody(req));
  } catch (e) {
    return json(res, e.status || 400, { error: e.status ? e.message : "Dados inválidos." });
  }
  if (input.website) return json(res, 200, { message: form.ok }); // honeypot: descarta bots silenciosamente

  const entry = {};
  for (const f of form.fields) entry[f] = String(input[f] ?? "").trim().slice(0, 2000);
  const missing = form.required.filter((f) => !entry[f]);
  if (missing.length) return json(res, 422, { error: "Preencha os campos obrigatórios." });
  if (entry.email && !EMAIL.test(entry.email)) return json(res, 422, { error: "E-mail inválido." });

  const record = { form: name, at: new Date().toISOString(), ip, ...entry };
  await mkdir(DATA, { recursive: true });
  await appendFile(join(DATA, `${name}.jsonl`), JSON.stringify(record) + "\n");
  console.log(`[lead] ${name} ${entry.email}`);

  if (WEBHOOK) {
    fetch(WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record) })
      .catch((err) => console.error("[webhook] falhou:", err.message));
  }
  return json(res, 201, { message: form.ok });
}

async function serveStatic(req, res) {
  const url = new URL(req.url, "http://x");
  let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(PUBLIC, path);
  if (!file.startsWith(PUBLIC)) return send(res, 403, "Forbidden");
  try {
    const st = await stat(file);
    if (st.isDirectory()) {
      if (!url.pathname.endsWith("/")) return send(res, 301, "", { Location: url.pathname + "/" + url.search });
      file = join(file, "index.html");
    }
    const body = await readFile(file);
    const ext = extname(file).toLowerCase();
    const cache = ext === ".html" ? "no-cache" : "public, max-age=604800";
    return send(res, 200, req.method === "HEAD" ? "" : body, { "Content-Type": TYPES[ext] || "application/octet-stream", "Cache-Control": cache });
  } catch {
    const body = await readFile(join(PUBLIC, "404.html")).catch(() => "Página não encontrada");
    return send(res, 404, body, { "Content-Type": TYPES[".html"] });
  }
}

createServer(async (req, res) => {
  try {
    const m = req.url.match(/^\/api\/([a-z]+)\/?$/);
    if (m) {
      if (req.method !== "POST") return json(res, 405, { error: "Método não permitido." });
      return await handleForm(m[1], req, res);
    }
    if (req.url === "/health") return json(res, 200, { ok: true });
    if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Method Not Allowed");
    return await serveStatic(req, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) json(res, 500, { error: "Erro interno." });
  }
}).listen(PORT, () => console.log(`Bear Finance em http://localhost:${PORT}`));
