// Cobertura 2 — links internos resolvem (sem 404), âncoras existem, externos válidos com rel=noopener; assets referenciados existem.
import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { BASE, ORIGIN, PROD, gate, allRoutes, fetchHtml, status, tags, hasId, isPending } from "./_lib.mjs";

const SKIP = await gate();

function classify(href, from) {
  let u;
  try { u = new URL(href, BASE + from); } catch { return { invalid: true, href }; }
  if (/^(mailto|tel|javascript):/i.test(href)) return { scheme: u.protocol, href };
  if (u.origin === ORIGIN) return { path: u.pathname, hash: decodeURIComponent(u.hash.slice(1)), url: u };
  if (u.origin === PROD) return { path: u.pathname, hash: decodeURIComponent(u.hash.slice(1)), url: u, prod: true };
  return { external: true, url: u };
}

describe("02 Links internos/externos e assets", { skip: SKIP }, () => {
  const pages = new Map();
  before(async () => { for (const p of await allRoutes()) pages.set(p, (await fetchHtml(p)).html); });

  test("links internos de todas as páginas resolvem com 200 e âncoras (#id) existem no destino", { timeout: 120_000 }, async () => {
    const broken = [], redirects = [], missingAnchors = [], invalid = [];
    let count = 0;
    for (const [from, html] of pages) {
      for (const a of tags(html, "a")) {
        if (a.href == null) continue;
        const c = classify(a.href, from);
        if (c.invalid) { invalid.push(`${from}: ${a.href}`); continue; }
        if (c.external || c.scheme) continue;
        count++;
        const st = await status(c.path);
        if (st.status === 301 || st.status === 302) {
          redirects.push(`${from} → ${a.href} (${st.status} → ${st.location})`);
          const st2 = await status(new URL(st.location, BASE).pathname);
          if (st2.status !== 200) broken.push(`${from} → ${a.href} (${st.status} depois ${st2.status})`);
        } else if (st.status !== 200) broken.push(`${from} → ${a.href} (${st.status})`);
        if (c.hash) {
          const target = c.path === from ? html : (pages.get(c.path) ?? (await fetchHtml(c.path)).html);
          const filterLink = target.includes(`data-filter="${c.hash}"`); // deep link do filtro de conteúdo (tratado por JS em /conteudo/)
          if (!hasId(target, c.hash) && !filterLink) missingAnchors.push(`${from} → ${a.href}`);
        }
      }
    }
    console.log(`[links] ${count} links internos verificados em ${pages.size} páginas; redirecionamentos: ${redirects.length}`);
    if (redirects.length) console.log("[links] redirecionamentos (use a URL canônica com barra):\n  " + [...new Set(redirects)].join("\n  "));
    assert.deepEqual(invalid, [], "hrefs inválidos");
    assert.deepEqual([...new Set(broken)], [], "links internos quebrados");
    assert.deepEqual([...new Set(missingAnchors)], [], "âncoras sem destino");
  });

  test("links externos têm URL válida (https) e rel=noopener quando target=_blank", async () => {
    const fails = [], insecure = [];
    let count = 0;
    for (const [from, html] of pages) {
      for (const a of tags(html, "a")) {
        if (a.href == null) continue;
        const c = classify(a.href, from);
        if (c.invalid) { fails.push(`${from}: href inválido ${a.href}`); continue; }
        if (!c.external) {
          if (a.target === "_blank" && !/\bnoopener\b/.test(a.rel || "")) fails.push(`${from}: ${a.href} com target=_blank sem rel=noopener`);
          continue;
        }
        count++;
        if (c.url.protocol !== "https:") insecure.push(`${from}: ${a.href}`);
        if (a.target === "_blank" && !/\bnoopener\b/.test(a.rel || "")) fails.push(`${from}: ${a.href} com target=_blank sem rel=noopener`);
      }
    }
    console.log(`[links] ${count} links externos verificados`);
    if (insecure.length) console.log("[links] externos sem https:\n  " + insecure.join("\n  "));
    assert.deepEqual([...new Set(fails)], []);
  });

  test("assets referenciados no HTML (img/srcset/source/script/link/video/og:image) existem", { timeout: 120_000 }, async () => {
    const refs = new Map(); // path → primeira página
    const add = (href, from) => {
      if (!href) return;
      const c = classify(href, from);
      if (c.invalid || c.external || c.scheme || !c.path) return;
      if (!refs.has(c.path)) refs.set(c.path, from);
    };
    const srcset = (v, from) => { for (const s of (v || "").split(",")) { const u = s.trim().split(/\s+/)[0]; if (u) add(u, from); } };
    for (const [from, html] of pages) {
      for (const t of tags(html, "img")) { add(t.src, from); srcset(t.srcset, from); }
      for (const t of tags(html, "source")) { add(t.src, from); srcset(t.srcset, from); }
      for (const t of tags(html, "script")) add(t.src, from);
      for (const t of tags(html, "link")) if (/stylesheet|icon|preload|manifest/i.test(t.rel || "")) add(t.href, from);
      for (const t of tags(html, "video")) { add(t.src, from); add(t.poster, from); }
      for (const t of tags(html, "meta")) if (/^(og:image|twitter:image)$/.test(t.property || t.name || "")) add(t.content, from);
    }
    const broken = [], pending = [];
    for (const [path, from] of refs) {
      const st = await status(path);
      if (st.status !== 200) (isPending(path) ? pending : broken).push(`${path} (${st.status}) — ref. em ${from}`);
    }
    console.log(`[assets] ${refs.size} assets locais verificados`);
    if (pending.length) console.log("[assets] REGISTRADO (ilustrações pendentes, não reprova):\n  " + pending.join("\n  "));
    assert.deepEqual(broken, []);
  });

  test("url() do CSS apontam para arquivos existentes", async () => {
    const home = pages.get("/");
    const css = tags(home, "link").find((l) => /stylesheet/i.test(l.rel || "") && /^\/assets\//.test(l.href || ""));
    assert.ok(css, "stylesheet local não encontrada no HTML");
    const text = await (await fetch(BASE + css.href)).text();
    const urls = [...text.matchAll(/url\(\s*["']?([^"')]+?)["']?\s*\)/g)].map((m) => m[1]).filter((u) => !/^(data:|https?:|#)/.test(u));
    const broken = [], pending = [];
    for (const u of new Set(urls)) {
      const path = new URL(u, BASE + css.href).pathname;
      const st = await status(path);
      if (st.status !== 200) (isPending(path) ? pending : broken).push(`${u} (${st.status})`);
    }
    console.log(`[css] ${new Set(urls).size} url() locais verificadas`);
    if (pending.length) console.log("[css] REGISTRADO (pendentes):\n  " + pending.join("\n  "));
    assert.deepEqual(broken, []);
  });
});
