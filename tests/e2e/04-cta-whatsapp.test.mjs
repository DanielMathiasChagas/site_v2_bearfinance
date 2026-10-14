// Cobertura 4 — CTAs principais levam ao formulário/WhatsApp; links wa.me com número do projeto e texto codificado.
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { WA, gate, allRoutes, fetchHtml, tags, hasId, launch, openPage, goto, dismissCookie } from "./_lib.mjs";

const SKIP = await gate();
const NUMBERS = new Set(Object.values(WA));
const isWa = (h) => /wa\.me|w\.app|api\.whatsapp\.com|whatsapp\.com\/send/i.test(h || "");

describe("04 CTAs e WhatsApp", { skip: SKIP }, () => {
  const pages = new Map();
  let browser;
  before(async () => { for (const p of await allRoutes()) pages.set(p, (await fetchHtml(p)).html); browser = await launch(); });
  after(async () => { await browser?.close(); });

  test("todos os links de WhatsApp usam os números do projeto, texto pré-formatado codificado, target=_blank e rel=noopener", () => {
    const fails = [];
    let count = 0, withText = 0;
    for (const [path, html] of pages) {
      for (const a of tags(html, "a")) {
        if (!isWa(a.href)) continue;
        count++;
        let u; try { u = new URL(a.href); } catch { fails.push(`${path}: href inválido ${a.href}`); continue; }
        if (u.hostname !== "wa.me") fails.push(`${path}: use wa.me (${u.hostname})`);
        const num = u.pathname.replace(/\//g, "");
        if (!NUMBERS.has(num)) fails.push(`${path}: número fora do projeto ${num}`);
        if (!/^[\x21-\x7E]+$/.test(a.href)) fails.push(`${path}: href com caracteres não codificados ${a.href.slice(0, 80)}`);
        const text = u.searchParams.get("text");
        if (text !== null) { withText++; if (!/^Olá!/.test(text)) fails.push(`${path}: texto pré-formatado inesperado "${text.slice(0, 40)}"`); }
        if (a.target !== "_blank") fails.push(`${path}: wa link sem target=_blank (${a.href.slice(0, 60)})`);
        if (!/\bnoopener\b/.test(a.rel || "")) fails.push(`${path}: wa link sem rel=noopener`);
        if (path.startsWith("/parcerias/") && (a["data-wa-open"] !== undefined) && num !== WA.parcerias) fails.push(`${path}: botão de reabrir WhatsApp deveria usar o número de parcerias`);
      }
      for (const f of tags(html, "form")) {
        if (f["data-wa-form"] !== undefined && f["data-wa"] !== WA.parcerias) fails.push(`${path}: form de parceria com data-wa=${f["data-wa"]}`);
        if (f["data-form"] === "diagnostico") { const u = new URL(f["data-wa"]); if (u.pathname !== `/${WA.comercial}` || !u.searchParams.get("text")) fails.push(`${path}: data-wa do diagnóstico inválido`); }
      }
      if (!tags(html, "a").some((a) => /\bwa-float\b/.test(a.class || ""))) fails.push(`${path}: sem botão flutuante de WhatsApp`);
    }
    console.log(`[wa] ${count} links de WhatsApp verificados (${withText} com texto pré-formatado) em ${pages.size} páginas`);
    assert.deepEqual([...new Set(fails)], []);
  });

  test("textos do WhatsApp são específicos por serviço, segmento e programa de parceria", () => {
    const texts = (path) => tags(pages.get(path), "a").filter((a) => isWa(a.href)).map((a) => new URL(a.href).searchParams.get("text") || "");
    assert.ok(texts("/atuacao/contabilidade/").some((t) => /contabilidade consultiva/i.test(t)), "serviço: texto específico de Contabilidade");
    assert.ok(texts("/atuacao/bpo-financeiro/").some((t) => /BPO Financeiro/i.test(t)), "serviço: texto específico de BPO Financeiro");
    assert.ok(texts("/verticais/contabilidade-agronegocio/").some((t) => /agroneg/i.test(t)), "vertical: texto específico de agronegócio");
    assert.ok(texts("/parcerias/business-partner/").some((t) => /Business Partner/.test(t)), "parceria: texto do programa");
    assert.ok(tags(pages.get("/parcerias/business-partner/"), "a").some((a) => isWa(a.href) && new URL(a.href).pathname === `/${WA.parcerias}`), "parceria: número de parcerias presente");
  });

  test("CTAs principais apontam para o formulário de diagnóstico (âncora existente) ou WhatsApp", () => {
    const fails = [];
    for (const [path, html] of pages) {
      const ctas = tags(html, "a").filter((a) => /\bbtn\b/.test(a.class || "") && !/btn--outline|btn--sm|pform|btn--wa/.test(a.class || ""));
      for (const a of ctas) {
        const h = a.href || "";
        const ok = isWa(h) || h === "/contato/#diagnostico" || h === "/contato/" || h.startsWith("#") || /^\/(atuacao|verticais|conteudo|parcerias|plataforma|cases|carreira|sobre|esg)\//.test(h) || h === "/";
        if (!ok) fails.push(`${path}: CTA "${h}"`);
        if (h.startsWith("#") && !hasId(html, h.slice(1))) fails.push(`${path}: CTA ${h} sem âncora na página`);
      }
      const header = tags(html, "a").find((a) => a["data-label"] === "header");
      if (!header || header.href !== "/contato/#diagnostico") fails.push(`${path}: CTA do cabeçalho deveria levar a /contato/#diagnostico`);
    }
    assert.deepEqual([...new Set(fails)], []);
  });

  test("home: CTA do hero rola até o formulário de diagnóstico; CTA do cabeçalho leva a /contato/#diagnostico", { timeout: 60_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    await goto(page, "/");
    await dismissCookie(page);
    await page.locator(".hero .actions a.btn").first().click();
    await page.waitForFunction(() => location.hash === "#diagnostico", null, { timeout: 3000 });
    await page.waitForTimeout(1200); // rolagem suave
    const inView = await page.evaluate(() => { const r = document.querySelector("#diagnostico").getBoundingClientRect(); return r.top < innerHeight * 0.5 && r.bottom > 0; });
    assert.equal(inView, true, "seção #diagnostico deve estar visível após o clique no CTA do hero");
    assert.equal(await page.locator("#form-diagnostico").isVisible(), true);

    await page.locator(".nav__cta a").click();
    await page.waitForURL(/\/contato\/#diagnostico$/, { timeout: 5000 });
    await page.waitForTimeout(600);
    const inView2 = await page.evaluate(() => { const r = document.querySelector("#diagnostico").getBoundingClientRect(); return r.top < innerHeight * 0.6 && r.bottom > 0; });
    assert.equal(inView2, true, "/contato/#diagnostico deve abrir com o formulário à vista");
    await ctx.close();
  });

  test("botão flutuante e links de WhatsApp abrem em nova aba com o link do projeto", async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    await ctx.route(/^https:\/\/wa\.me\//, (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>wa stub</title>ok" }));
    await goto(page, "/");
    await dismissCookie(page);
    const [popup] = await Promise.all([ctx.waitForEvent("page", { timeout: 5000 }), page.locator(".wa-float").click()]);
    await popup.waitForLoadState();
    const u = new URL(popup.url());
    assert.equal(u.hostname, "wa.me");
    assert.equal(u.pathname, `/${WA.comercial}`);
    assert.match(u.searchParams.get("text") || "", /^Olá!/);
    assert.equal(await popup.evaluate(() => window.opener), null, "nova aba não deve ter acesso a window.opener");
    await ctx.close();
  });
});
