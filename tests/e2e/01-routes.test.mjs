// Cobertura 1 — rotas do sitemap + 404: status, <title>, meta description, um único <h1>.
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { BASE, PUBLIC, gate, sitemapRoutes, fetchHtml, title, meta, h1s } from "./_lib.mjs";

const SKIP = await gate();

describe("01 Rotas (sitemap + 404)", { skip: SKIP }, () => {
  test("sitemap.xml lista todas as páginas geradas em public/ (e só elas), únicas, canônicas e com barra final", async () => {
    const routes = await sitemapRoutes();
    const files = await readdir(PUBLIC, { recursive: true });
    const built = files.filter((f) => f === "index.html" || f.endsWith("/index.html")).map((f) => "/" + f.replace(/index\.html$/, "")).sort();
    console.log(`[rotas] ${routes.length} rotas no sitemap + /404.html (${built.length} páginas geradas)`);
    assert.deepEqual([...routes].sort(), built, "sitemap e páginas geradas divergem");
    assert.deepEqual(routes.filter((r) => !r.endsWith("/")), [], "rotas sem barra final");
    assert.equal(new Set(routes).size, routes.length, "rotas duplicadas");
    assert.ok(routes.length >= 30, `poucas rotas: ${routes.length}`);
  });

  test("cada rota do sitemap responde 200 (HTML) com <title>, meta description e exatamente um <h1>", async () => {
    const fails = [];
    for (const path of await sitemapRoutes()) {
      const { status, html, type } = await fetchHtml(path);
      const p = [];
      if (status !== 200) p.push(`status ${status}`);
      if (!/text\/html/.test(type)) p.push(`content-type ${type}`);
      if (!title(html)) p.push("sem <title>");
      if (!meta(html, "description")) p.push("sem meta description");
      const n = h1s(html); if (n !== 1) p.push(`${n} <h1>`);
      if (!/<html[^>]*\slang="pt-BR"/i.test(html)) p.push("sem lang=pt-BR");
      if (!/<meta name="viewport"/.test(html)) p.push("sem meta viewport");
      if (p.length) fails.push(`${path}: ${p.join(", ")}`);
    }
    assert.deepEqual(fails, []);
  });

  test("HEAD das rotas do sitemap responde 200", async () => {
    const fails = [];
    for (const path of await sitemapRoutes()) {
      const r = await fetch(BASE + path, { method: "HEAD" });
      if (r.status !== 200) fails.push(`${path}: ${r.status}`);
    }
    assert.deepEqual(fails, []);
  });

  test("/404.html responde 200 com title, description, um <h1> e noindex", async () => {
    const { status, html } = await fetchHtml("/404.html");
    assert.equal(status, 200);
    assert.match(title(html), /não encontrada/i);
    assert.ok(meta(html, "description"), "sem meta description");
    assert.equal(h1s(html), 1);
    assert.match(html, /<meta name="robots" content="noindex"/);
  });

  test("rota inexistente responde 404 com a página de erro em HTML (title + h1)", async () => {
    for (const path of ["/rota-que-nao-existe/", "/404", "/atuacao/nao-existe/", "/assets/img/nao-existe.png"]) {
      const r = await fetch(BASE + path);
      const html = await r.text();
      assert.equal(r.status, 404, `${path} → ${r.status}`);
      assert.match(r.headers.get("content-type") || "", /text\/html/, `${path}: content-type`);
      assert.match(title(html), /não encontrada/i, `${path}: title`);
      assert.equal(h1s(html), 1, `${path}: h1`);
    }
  });

  test("URL sem barra final redireciona (301) para a canônica com barra", async () => {
    const r = await fetch(`${BASE}/sobre`, { redirect: "manual" });
    assert.equal(r.status, 301);
    assert.equal(new URL(r.headers.get("location"), BASE).pathname, "/sobre/");
  });

  test("robots.txt e sitemap.xml são servidos", async () => {
    for (const [path, re] of [["/robots.txt", /Sitemap:/i], ["/sitemap.xml", /<urlset/]]) {
      const r = await fetch(BASE + path);
      assert.equal(r.status, 200, `${path} → ${r.status}`);
      assert.match(await r.text(), re, `${path}: conteúdo inesperado`);
    }
  });
});
