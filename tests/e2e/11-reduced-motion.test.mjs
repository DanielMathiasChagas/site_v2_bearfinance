// Cobertura 11 — prefers-reduced-motion: reduce não quebra layout (conteúdo visível sem reveal, sem overflow, sem erros).
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { KEY_PAGES, gate, launch, openPage, goto, shot, overflowInfo, dismissCookie } from "./_lib.mjs";

const SKIP = await gate();

describe("11 prefers-reduced-motion", { skip: SKIP }, () => {
  let browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); });

  for (const w of [1440, 390]) {
    for (const [key, path] of Object.entries(KEY_PAGES)) {
      test(`${key} ${path} @${w}px com reduced-motion: conteúdo visível sem rolar, sem overflow, sem erros`, { timeout: 90_000 }, async () => {
        const { ctx, page, issues } = await openPage(browser, { width: w, reducedMotion: "reduce" });
        await goto(page, path);
        await dismissCookie(page);
        assert.equal(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), true, "emulação ativa");
        const hidden = await page.evaluate(() => [...document.querySelectorAll(".reveal, .reveal-group > *")].filter((el) => { const cs = getComputedStyle(el); return Number(cs.opacity) < 0.99 && el.getBoundingClientRect().height > 0 && !el.closest("[hidden]"); }).map((el) => el.tagName.toLowerCase() + "." + String(el.className).split(/\s+/)[0]).slice(0, 10));
        assert.deepEqual(hidden, [], "com reduced-motion todo conteúdo .reveal deve estar visível sem rolar");
        const h1 = await page.locator("h1").first();
        assert.equal(await h1.isVisible(), true);
        assert.equal(await h1.evaluate((el) => Number(getComputedStyle(el).opacity)), 1);
        const info = await overflowInfo(page);
        assert.ok(info.scrollWidth <= info.innerWidth && info.bodyScrollWidth <= info.innerWidth, `overflow: ${info.scrollWidth}/${info.bodyScrollWidth} > ${info.innerWidth}; ${info.culprits.join(" | ")}`);
        if (key === "home" && w === 1440) await shot(page, "home-reduced-1440.png", { fullPage: true, clip: { x: 0, y: 0, width: w, height: 3000 } });
        assert.deepEqual(issues.pageErrors, []);
        assert.deepEqual(issues.consoleErrors, []);
        await ctx.close();
      });
    }
  }

  test("home com reduced-motion: texto digitado do hero não anima e rolagem por âncora é imediata", { timeout: 60_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440, reducedMotion: "reduce" });
    await goto(page, "/");
    await dismissCookie(page);
    const before = await page.textContent(".typed");
    await page.waitForTimeout(3200);
    assert.equal(await page.textContent(".typed"), before, "efeito de digitação deve ficar desligado");
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), "auto");
    await ctx.close();
  });
});
