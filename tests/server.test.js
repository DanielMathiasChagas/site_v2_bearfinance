// Testes do servidor (node --test). Sem dependências: sobe createApp() em porta aleatória
// com public/ e data/ temporários, e um servidor SMTP falso para a entrega por e-mail.
import { test, before, after, describe } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import net from "node:net";
import { createApp } from "../server.js";

const quiet = { info() {}, warn() {}, error() {} };
const VALID = { nome: "Teste Silva", empresa: "ACME Indústria", email: "teste@acme.com.br", telefone: "(11) 98888-7777", segmento: "Indústria", servico: "Contabilidade", mensagem: "Quero um diagnóstico.", lgpd: "sim", origem: "/atuacao/contabilidade/" };

let root, dataDir, publicDir;
async function fixtures() {
  root = await mkdtemp(join(tmpdir(), "bf-test-"));
  dataDir = join(root, "data"); publicDir = join(root, "public");
  await mkdir(publicDir, { recursive: true });
  await writeFile(join(publicDir, "index.html"), "<!doctype html><title>home</title><h1>Home</h1>");
  await writeFile(join(publicDir, "404.html"), "<!doctype html><title>404</title><h1>Não encontrada</h1>");
  await writeFile(join(publicDir, "a.css"), "body{color:red;background:#fff}\n".repeat(300));
}
async function start(options = {}) {
  const server = createApp({ dataDir, publicDir, webhook: null, smtp: null, log: quiet, rateLimit: { ip: { max: 1000, windowMs: 60_000 }, email: { max: 1000, windowMs: 60_000 } }, ...options });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  server.base = `http://127.0.0.1:${server.address().port}`;
  return server;
}
const stop = (s) => new Promise((r) => s.close(r));
const post = (base, path, body, headers = {}) => fetch(`${base}${path}`, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) });
const decodeMail = (raw) => {
  const subject = (raw.match(/^Subject: (.*)$/m) || [])[1] || "";
  const subj = subject.replace(/=\?UTF-8\?B\?([^?]+)\?=/gi, (_, b) => Buffer.from(b, "base64").toString("utf8")).replace(/=\?UTF-8\?Q\?([^?]+)\?=/gi, (_, q) => q.replace(/_/g, " ").replace(/=([0-9A-F]{2})/gi, (m, h) => String.fromCharCode(parseInt(h, 16))));
  const [head, ...rest] = raw.split("\n\n");
  let body = rest.join("\n\n");
  if (/Content-Transfer-Encoding: base64/i.test(head)) body = Buffer.from(body.replace(/\s+/g, ""), "base64").toString("utf8");
  else if (/Content-Transfer-Encoding: quoted-printable/i.test(head)) body = Buffer.from(body.replace(/=\r?\n/g, "").replace(/=([0-9A-F]{2})/gi, (m, h) => String.fromCharCode(parseInt(h, 16))), "latin1").toString("utf8");
  return { head, subj, body };
};
const lines = async (form) => (await readFile(join(dataDir, `${form}.jsonl`), "utf8").catch(() => "")).split("\n").filter(Boolean).map((l) => JSON.parse(l));

describe("API de formulários", () => {
  let app;
  before(async () => { await fixtures(); app = await start(); });
  after(async () => { await stop(app); await rm(root, { recursive: true, force: true }); });

  test("contato válido → 201, grava JSONL com telefone normalizado", async () => {
    const res = await post(app.base, "/api/contato", VALID);
    assert.equal(res.status, 201);
    const json = await res.json();
    assert.match(json.message, /recebid/i);
    const rows = await lines("contato");
    const last = rows.at(-1);
    assert.equal(last.form, "contato");
    assert.equal(last.telefone, "11988887777");
    assert.equal(last.segmento, "Indústria");
    assert.equal(last.origem, "/atuacao/contabilidade/");
  });
  test("campo obrigatório ausente → 422 com nome do campo", async () => {
    const res = await post(app.base, "/api/contato", { ...VALID, nome: "" });
    assert.equal(res.status, 422);
    const json = await res.json();
    assert.equal(json.field, "nome");
    assert.match(json.error, /nome/i);
  });
  test("e-mail inválido → 422", async () => {
    const res = await post(app.base, "/api/contato", { ...VALID, email: "nao-e-email" });
    assert.equal(res.status, 422);
    assert.equal((await res.json()).field, "email");
  });
  test("telefone inválido → 422; formatos BR válidos passam", async () => {
    assert.equal((await post(app.base, "/api/contato", { ...VALID, telefone: "123" })).status, 422);
    assert.equal((await post(app.base, "/api/contato", { ...VALID, telefone: "0000000000" })).status, 422);
    for (const t of ["11988887777", "+55 11 98888-7777", "(11) 3333-4444"]) assert.equal((await post(app.base, "/api/contato", { ...VALID, email: `t${t.replace(/\D/g, "")}@acme.com.br`, telefone: t })).status, 201, t);
  });
  test("segmento/serviço fora do enum → 422", async () => {
    assert.equal((await post(app.base, "/api/contato", { ...VALID, segmento: "Outra coisa" })).status, 422);
    assert.equal((await post(app.base, "/api/contato", { ...VALID, servico: "Mágica" })).status, 422);
  });
  test("sem consentimento LGPD → 422", async () => {
    const res = await post(app.base, "/api/contato", { ...VALID, lgpd: "" });
    assert.equal(res.status, 422);
    assert.equal((await res.json()).field, "lgpd");
  });
  test("honeypot preenchido → 200 e nada gravado", async () => {
    const before = (await lines("contato")).length;
    const res = await post(app.base, "/api/contato", { ...VALID, website: "http://spam" });
    assert.equal(res.status, 200);
    assert.equal((await lines("contato")).length, before);
  });
  test("envio rápido demais (ts recente) → 200 e nada gravado", async () => {
    const before = (await lines("contato")).length;
    const res = await post(app.base, "/api/contato", { ...VALID, ts: Date.now() });
    assert.equal(res.status, 200);
    assert.equal((await lines("contato")).length, before);
    const ok = await post(app.base, "/api/contato", { ...VALID, email: "lento@acme.com.br", ts: Date.now() - 10_000 });
    assert.equal(ok.status, 201);
  });
  test("mensagem com excesso de links → 422", async () => {
    const res = await post(app.base, "/api/contato", { ...VALID, mensagem: "http://a.com http://b.com http://c.com http://d.com" });
    assert.equal(res.status, 422);
  });
  test("JSON inválido → 400; corpo > 20 KB → 413; Content-Type errado → 415", async () => {
    assert.equal((await post(app.base, "/api/contato", "{nope")).status, 400);
    assert.equal((await post(app.base, "/api/contato", { ...VALID, mensagem: "x".repeat(25_000) })).status, 413);
    assert.equal((await post(app.base, "/api/contato", JSON.stringify(VALID), { "Content-Type": "text/plain" })).status, 415);
  });
  test("GET em /api → 405; formulário inexistente → 404", async () => {
    assert.equal((await fetch(`${app.base}/api/contato`)).status, 405);
    assert.equal((await post(app.base, "/api/naoexiste", VALID)).status, 404);
  });
  test("newsletter: válido → 201; e-mail ruim → 422", async () => {
    assert.equal((await post(app.base, "/api/newsletter", { email: "news@acme.com.br", nome: "Ana" })).status, 201);
    assert.equal((await post(app.base, "/api/newsletter", { email: "x" })).status, 422);
  });
  test("carreira: exige currículo (URL) e LGPD", async () => {
    const base = { nome: "Teste Silva", email: "c@acme.com.br", telefone: "(11) 98888-7777", vaga: "Banco de talentos", lgpd: "sim" };
    assert.equal((await post(app.base, "/api/carreira", base)).status, 422);
    assert.equal((await post(app.base, "/api/carreira", { ...base, curriculo: "https://linkedin.com/in/teste" })).status, 201);
  });
  test("parceria: válido → 201", async () => {
    const res = await post(app.base, "/api/parceria", { programa: "Business Partner", nome: "Teste Silva", telefone: "(11) 98888-7777", email: "p@acme.com.br", cidade: "São Paulo/SP", lgpd: "sim", setores: "Indústria, Agro" });
    assert.equal(res.status, 201);
  });
});

describe("Limites de envio", () => {
  before(fixtures);
  after(async () => rm(root, { recursive: true, force: true }));
  test("por IP → 429 com Retry-After", async () => {
    const app = await start({ rateLimit: { ip: { max: 2, windowMs: 60_000 }, email: { max: 100, windowMs: 60_000 } } });
    try {
      assert.equal((await post(app.base, "/api/newsletter", { email: "a@acme.com.br" })).status, 201);
      assert.equal((await post(app.base, "/api/newsletter", { email: "b@acme.com.br" })).status, 201);
      const res = await post(app.base, "/api/newsletter", { email: "c@acme.com.br" });
      assert.equal(res.status, 429);
      assert.ok(res.headers.get("retry-after"));
    } finally { await stop(app); }
  });
  test("por e-mail → 429", async () => {
    const app = await start({ rateLimit: { ip: { max: 100, windowMs: 60_000 }, email: { max: 1, windowMs: 60_000 } } });
    try {
      assert.equal((await post(app.base, "/api/contato", VALID)).status, 201);
      assert.equal((await post(app.base, "/api/contato", VALID)).status, 429);
    } finally { await stop(app); }
  });
});

describe("Estáticos e segurança", () => {
  let app;
  before(async () => { await fixtures(); app = await start(); });
  after(async () => { await stop(app); await rm(root, { recursive: true, force: true }); });

  test("GET / → 200 com cabeçalhos de segurança", async () => {
    const res = await fetch(`${app.base}/`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-security-policy"), /default-src 'self'/);
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
    assert.equal(res.headers.get("x-frame-options"), "SAMEORIGIN");
    assert.ok(res.headers.get("permissions-policy"));
    assert.equal(res.headers.get("cache-control"), "no-cache");
    assert.equal(res.headers.get("strict-transport-security"), null);
  });
  test("HSTS só atrás de HTTPS (X-Forwarded-Proto)", async () => {
    const res = await fetch(`${app.base}/`, { headers: { "x-forwarded-proto": "https" } });
    assert.match(res.headers.get("strict-transport-security") || "", /max-age/);
  });
  test("HEAD / → 200 sem corpo", async () => {
    const res = await fetch(`${app.base}/`, { method: "HEAD" });
    assert.equal(res.status, 200);
    assert.equal((await res.text()).length, 0);
  });
  test("rota inexistente → 404 em HTML", async () => {
    const res = await fetch(`${app.base}/nada-aqui/`);
    assert.equal(res.status, 404);
    assert.match(res.headers.get("content-type"), /text\/html/);
    assert.match(await res.text(), /encontrada/);
  });
  test("path traversal bloqueado", async () => {
    const res = await fetch(`${app.base}/..%2F..%2Fserver.js`);
    assert.notEqual(res.status, 200);
    const res2 = await fetch(`${app.base}/assets/../../package.json`);
    assert.notEqual(res2.status, 200);
  });
  test("gzip/brotli quando aceito; ETag e 304", async () => {
    const gz = await fetch(`${app.base}/a.css`, { headers: { "accept-encoding": "gzip" } });
    assert.equal(gz.status, 200);
    assert.equal(gz.headers.get("content-encoding"), "gzip");
    const etag = gz.headers.get("etag");
    assert.ok(etag);
    const notMod = await fetch(`${app.base}/a.css`, { headers: { "if-none-match": etag } });
    assert.equal(notMod.status, 304);
  });
  test("cache: ?v= imutável por 1 ano; sem versão, 1 hora", async () => {
    const v = await fetch(`${app.base}/a.css?v=abc123`);
    assert.match(v.headers.get("cache-control"), /max-age=31536000/);
    assert.match(v.headers.get("cache-control"), /immutable/);
    const nv = await fetch(`${app.base}/a.css`);
    assert.match(nv.headers.get("cache-control"), /max-age=3600/);
  });
  test("/health → 200", async () => {
    const res = await fetch(`${app.base}/health`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });
  });
});

describe("Entrega por SMTP (servidor falso)", () => {
  let smtpServer, port, mails;
  before(async () => {
    await fixtures();
    mails = [];
    smtpServer = net.createServer((sock) => {
      let buf = "", data = false, body = "", auth = 0;
      sock.write("220 fake.smtp ESMTP\r\n");
      sock.on("data", (chunk) => {
        buf += chunk.toString("latin1");
        let i;
        while ((i = buf.indexOf("\r\n")) >= 0) {
          const line = buf.slice(0, i); buf = buf.slice(i + 2);
          if (data) {
            if (line === ".") { data = false; mails.push(body); body = ""; sock.write("250 2.0.0 queued\r\n"); }
            else body += line + "\n";
            continue;
          }
          const cmd = line.split(" ")[0].toUpperCase();
          if (auth === 1) { auth = 2; sock.write("334 UGFzc3dvcmQ6\r\n"); continue; }      // recebeu usuário → pede senha
          if (auth === 2 || auth === 3) { auth = 0; sock.write("235 2.7.0 ok\r\n"); continue; } // recebeu senha / PLAIN em 2 passos
          if (cmd === "EHLO" || cmd === "HELO") sock.write("250-fake.smtp\r\n250-AUTH PLAIN LOGIN\r\n250 8BITMIME\r\n");
          else if (cmd === "AUTH") { if (/^AUTH LOGIN$/i.test(line)) { auth = 1; sock.write("334 VXNlcm5hbWU6\r\n"); } else if (/^AUTH PLAIN$/i.test(line)) { auth = 3; sock.write("334 \r\n"); } else sock.write("235 2.7.0 ok\r\n"); }
          else if (cmd === "MAIL" || cmd === "RCPT") sock.write("250 2.1.0 ok\r\n");
          else if (cmd === "DATA") { data = true; sock.write("354 go ahead\r\n"); }
          else if (cmd === "QUIT") { sock.write("221 bye\r\n"); sock.end(); }
          else if (cmd === "NOOP" || cmd === "RSET") sock.write("250 ok\r\n");
          else sock.write("500 unknown\r\n");
        }
      });
    });
    await new Promise((r) => smtpServer.listen(0, "127.0.0.1", r));
    port = smtpServer.address().port;
  });
  after(async () => { await new Promise((r) => smtpServer.close(r)); await rm(root, { recursive: true, force: true }); });

  test("lead de contato é enviado por e-mail com assunto e campos", async () => {
    const app = await start({ smtp: { host: "127.0.0.1", port, user: "user", pass: "pass", to: "leads@bear.test", from: "site@bear.test", secure: false, starttls: false } });
    try {
      const delivered = new Promise((resolve) => app.once("delivered", resolve));
      const res = await post(app.base, "/api/contato", VALID);
      assert.equal(res.status, 201);
      const { results } = await delivered;
      assert.equal(results.length, 1);
      assert.equal(results[0].status, "fulfilled", String(results[0].reason && results[0].reason.message));
      assert.equal(mails.length, 1);
      const mail = decodeMail(mails[0]);
      assert.match(mail.head, /^To: leads@bear\.test$/m);
      assert.match(mail.head, /^Reply-To: teste@acme\.com\.br$/m);
      assert.match(mail.subj, /Teste Silva/);
      assert.match(mail.body, /Teste Silva/);
      assert.match(mail.body, /ACME/);
      assert.match(mail.body, /11988887777|\(11\) 98888-7777/);
    } finally { await stop(app); }
  });
  test("falha no SMTP não derruba a resposta ao usuário", async () => {
    const app = await start({ smtp: { host: "127.0.0.1", port: 1, user: "u", pass: "p", to: "leads@bear.test", from: "site@bear.test", secure: false, starttls: false } });
    try {
      const delivered = new Promise((resolve) => app.once("delivered", resolve));
      const res = await post(app.base, "/api/contato", { ...VALID, email: "falha@acme.com.br" });
      assert.equal(res.status, 201);
      const { results } = await delivered;
      assert.equal(results[0].status, "rejected");
      assert.equal((await lines("contato")).at(-1).email, "falha@acme.com.br");
    } finally { await stop(app); }
  });
});
