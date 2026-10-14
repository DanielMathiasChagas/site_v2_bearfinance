// Cobertura 8 — teclado: Tab percorre menu, CTAs, FAQ (Enter/Espaço), abas (setas), formulário; foco visível.
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { gate, launch, openPage, goto, shot, dismissCookie } from "./_lib.mjs";

const SKIP = await gate();

const FOCUS_INFO = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el), r = el.getBoundingClientRect();
  let outline = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
  let shadow = !!cs.boxShadow && cs.boxShadow !== "none";
  if (el.matches(".chip input") && el.nextElementSibling) { const s = getComputedStyle(el.nextElementSibling); shadow = shadow || (s.boxShadow && s.boxShadow !== "none"); }
  const inView = r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
  return {
    tag: el.tagName.toLowerCase(), cls: typeof el.className === "string" ? el.className.trim().split(/\s+/)[0] : "", name: el.name || null,
    label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40), href: el.getAttribute("href"),
    indicator: outline || shadow, inView, focusVisible: el.matches(":focus-visible"),
  };
};

describe("08 Teclado e foco visível", { skip: SKIP }, () => {
  let browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); });

  test("home 1440: Tab percorre skip link → marca → menu (incluindo submenus) → CTA do cabeçalho → CTAs do hero, sempre com foco visível", { timeout: 120_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    await goto(page, "/");
    await dismissCookie(page);
    await page.reload({ waitUntil: "load" }); // documento novo: a navegação por Tab começa do início (aviso já dispensado)
    await page.waitForTimeout(300);
    const seq = [], noIndicator = [], offscreen = [];
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(i === 0 ? 350 : 60); // transições (o skip link desliza para dentro da tela)
      const f = await page.evaluate(FOCUS_INFO);
      if (!f) break;
      seq.push(f);
      if (!f.indicator) noIndicator.push(`${f.tag}.${f.cls} "${f.label}"`);
      if (!f.inView) offscreen.push(`${f.tag}.${f.cls} "${f.label}" (${f.href || ""})`);
      if (i === 8) await shot(page, "home-teclado-1440.png");
      if (f.href === "#servicos") break;
    }
    const hrefs = seq.map((f) => f.href);
    assert.equal(seq[0]?.cls, "skip", "primeiro Tab deve ir ao link 'Ir para o conteúdo'");
    assert.equal(seq[0]?.inView, true, "skip link deve ficar visível ao receber foco");
    assert.equal(seq[1]?.cls, "brand");
    for (const h of ["/sobre/", "/esg/", "/atuacao/", "/atuacao/contabilidade/", "/verticais/", "/verticais/contabilidade-agronegocio/", "/parcerias/", "/parcerias/business-partner/", "/plataforma/", "/conteudo/", "/contato/#diagnostico", "#diagnostico", "#servicos"]) assert.ok(hrefs.includes(h), `Tab deveria alcançar ${h} (alcançou: ${hrefs.filter(Boolean).join(" ")})`);
    assert.deepEqual(noIndicator, [], "elementos focados sem indicador visível (outline/box-shadow)");
    assert.deepEqual(offscreen, [], "elementos focados fora da área visível");
    await ctx.close();
  });

  test("FAQ (/atuacao/contabilidade/): Enter e Espaço abrem/fecham; Tab vai à próxima pergunta com foco visível", { timeout: 60_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    await goto(page, "/atuacao/contabilidade/");
    await dismissCookie(page);
    const q = page.locator(".faq__q");
    assert.ok((await q.count()) >= 3, "FAQ deve ter perguntas");
    const first = q.first();
    const panelId = await first.getAttribute("aria-controls");
    await first.focus();
    await page.keyboard.press("Enter");
    assert.equal(await first.getAttribute("aria-expanded"), "true");
    assert.equal(await page.locator(`#${panelId}`).isVisible(), true, "painel deve abrir com Enter");
    await page.keyboard.press("Space");
    assert.equal(await first.getAttribute("aria-expanded"), "false");
    assert.equal(await page.locator(`#${panelId}`).isVisible(), false, "painel deve fechar com Espaço");
    await page.keyboard.press("Space");
    assert.equal(await first.getAttribute("aria-expanded"), "true");
    await page.keyboard.press("Tab");
    const f = await page.evaluate(FOCUS_INFO);
    assert.equal(f.cls, "faq__q", "Tab deve ir à próxima pergunta (painel aberto não tem focáveis)");
    assert.equal(f.indicator, true, "foco visível na pergunta");
    await ctx.close();
  });

  test("abas (/verticais/contabilidade-agronegocio/): setas, Home/End movem seleção e foco; Tab sai da lista", { timeout: 60_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    await goto(page, "/verticais/contabilidade-agronegocio/");
    await dismissCookie(page);
    const tabs = page.locator("[role=tablist] [role=tab]");
    const n = await tabs.count();
    assert.ok(n >= 2, "deve haver abas");
    const sel = () => page.evaluate(() => { const t = document.querySelector("[role=tab][aria-selected='true']"); const p = document.getElementById(t.getAttribute("aria-controls")); return { id: t.id, focused: document.activeElement === t, panelVisible: !!p && !p.hidden && p.getBoundingClientRect().height > 0, hiddenPanels: [...document.querySelectorAll("[role=tabpanel]")].filter((x) => x.hidden).length }; });
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    let s = await sel();
    assert.equal(s.id, "tab-1"); assert.equal(s.focused, true); assert.equal(s.panelVisible, true); assert.equal(s.hiddenPanels, n - 1);
    await page.keyboard.press("End"); s = await sel(); assert.equal(s.id, `tab-${n - 1}`);
    await page.keyboard.press("ArrowRight"); s = await sel(); assert.equal(s.id, "tab-0", "ArrowRight na última aba volta à primeira");
    await page.keyboard.press("ArrowLeft"); s = await sel(); assert.equal(s.id, `tab-${n - 1}`, "ArrowLeft na primeira vai à última");
    await page.keyboard.press("Home"); s = await sel(); assert.equal(s.id, "tab-0");
    assert.equal((await page.evaluate(FOCUS_INFO)).indicator, true, "aba focada deve ter indicador visível");
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute("role")), null, "Tab deve sair da lista de abas (tabindex -1 nas inativas)");
    await ctx.close();
  });

  test("formulário (/contato/): ordem de Tab segue os campos, pula o honeypot e chega ao botão com foco visível", { timeout: 60_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    await goto(page, "/contato/");
    await dismissCookie(page);
    await page.locator("#form-diagnostico [name=nome]").focus();
    const order = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const f = await page.evaluate(FOCUS_INFO);
      order.push(f);
      if (f.tag === "button") break;
    }
    const names = order.map((f) => f.name || f.tag);
    assert.deepEqual(names.slice(0, 7), ["empresa", "email", "telefone", "segmento", "servico", "mensagem", "lgpd"], `ordem: ${names.join(" → ")}`);
    assert.ok(!names.includes("website"), "honeypot não pode entrar na ordem de Tab");
    assert.equal(order.at(-1).tag, "button");
    assert.deepEqual(order.filter((f) => !f.indicator).map((f) => f.name || f.tag), [], "todos os campos focados devem ter indicador visível");
    await ctx.close();
  });
});
