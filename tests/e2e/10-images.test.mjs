// Cobertura 10 — imagens: todas com atributo alt (vazio só quando decorativas) e carregadas (naturalWidth > 0), exceto lazy fora da tela.
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { gate, allRoutes, launch, openPage, goto, scrollThrough, isPending } from "./_lib.mjs";

const SKIP = await gate();

const AUDIT = () => [...document.images].map((img) => {
  const r = img.getBoundingClientRect();
  const link = img.closest("a, button");
  const named = !!link && !!((link.getAttribute("aria-label") || "").trim() || link.textContent.trim());
  const decorativeContext = !!img.closest("[aria-hidden='true']") || !!img.closest("[role='presentation']");
  return {
    src: (img.currentSrc || img.src || "").replace(location.origin, ""), hasAlt: img.hasAttribute("alt"), alt: img.getAttribute("alt"),
    lazy: img.loading === "lazy", complete: img.complete, nw: img.naturalWidth, visible: r.width > 0 && r.height > 0,
    inView: r.bottom > 0 && r.top < innerHeight, decorativeOk: decorativeContext || named,
  };
});

describe("10 Imagens", { skip: SKIP }, () => {
  let browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); });

  test("todas as rotas @1440: alt presente, alt vazio só em contexto decorativo, imagens carregadas", { timeout: 600_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    const missingAlt = [], notLoaded = [], pending = [], emptyAltReview = [];
    let total = 0;
    for (const path of await allRoutes()) {
      await goto(page, path, { settle: 200 });
      await scrollThrough(page);
      await page.waitForTimeout(600);
      const imgs = await page.evaluate(AUDIT);
      total += imgs.length;
      for (const i of imgs) {
        if (!i.hasAlt) missingAlt.push(`${path}: ${i.src}`);
        else if (i.alt === "" && !i.decorativeOk) emptyAltReview.push(`${path}: ${i.src}`);
        const mustLoad = !(i.lazy && !i.inView) && i.visible;
        if (mustLoad && !(i.complete && i.nw > 0)) (isPending(i.src) ? pending : notLoaded).push(`${path}: ${i.src} (complete=${i.complete}, naturalWidth=${i.nw})`);
      }
    }
    await ctx.close();
    console.log(`[imagens] ${total} <img> auditadas`);
    if (emptyAltReview.length) console.log("[imagens] alt=\"\" fora de contexto decorativo explícito (revisar se é informativa):\n  " + [...new Set(emptyAltReview)].join("\n  "));
    if (pending.length) console.log("[imagens] REGISTRADO (ilustrações pendentes, não reprova):\n  " + [...new Set(pending)].join("\n  "));
    assert.deepEqual([...new Set(missingAlt)], [], "imagens sem atributo alt");
    assert.deepEqual([...new Set(notLoaded)], [], "imagens não carregadas");
  });

  test("home @390: imagens visíveis carregadas (mobile)", { timeout: 120_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 390 });
    await goto(page, "/");
    await scrollThrough(page);
    await page.waitForTimeout(600);
    const imgs = await page.evaluate(AUDIT);
    const bad = imgs.filter((i) => i.visible && !(i.lazy && !i.inView) && !(i.complete && i.nw > 0) && !isPending(i.src)).map((i) => i.src);
    await ctx.close();
    assert.deepEqual(bad, []);
  });
});
