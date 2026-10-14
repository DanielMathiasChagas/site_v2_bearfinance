// Cobertura 6 — responsividade: 5 páginas × 7 larguras, screenshot de página inteira e sem overflow horizontal.
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { WIDTHS, KEY_PAGES, gate, launch, openPage, goto, shot, scrollThrough, overflowInfo, dismissCookie, pendingReveals } from "./_lib.mjs";

const SKIP = await gate();
const MAX_H = 6000; // altura máxima da captura (páginas longas)

describe("06 Responsividade (320–1920)", { skip: SKIP }, () => {
  let browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); });

  for (const [key, path] of Object.entries(KEY_PAGES)) {
    for (const w of WIDTHS) {
      test(`${key} ${path} @${w}px: sem overflow horizontal (screenshot ${key}-${w}.png)`, { timeout: 90_000 }, async () => {
        const { ctx, page, issues } = await openPage(browser, { width: w });
        await goto(page, path);
        await dismissCookie(page);
        await scrollThrough(page);
        await page.waitForTimeout(900); // transições de reveal
        const info = await overflowInfo(page);
        const pending = await pendingReveals(page);
        const h = Math.min(await page.evaluate(() => document.documentElement.scrollHeight), MAX_H);
        await shot(page, `${key}-${w}.png`, { fullPage: true, clip: { x: 0, y: 0, width: w, height: h } });
        await ctx.close();
        assert.ok(info.scrollWidth <= info.innerWidth && info.bodyScrollWidth <= info.innerWidth,
          `overflow horizontal: scrollWidth=${info.scrollWidth} body=${info.bodyScrollWidth} innerWidth=${info.innerWidth}; elementos: ${info.culprits.join(" | ") || "—"}`);
        assert.deepEqual(pending, [], "conteúdo .reveal que não apareceu após rolar a página inteira (ficaria invisível na captura/para o usuário)");
        assert.deepEqual(issues.pageErrors, [], "erros de página durante a captura");
      });
    }
  }

  test("aviso de cookies: visível na primeira visita (390 e 1440) sem causar overflow; escolha persiste", { timeout: 60_000 }, async () => {
    for (const w of [390, 1440]) {
      const { ctx, page } = await openPage(browser, { width: w });
      await goto(page, "/");
      assert.equal(await page.locator(".cookie").isVisible(), true, `aviso de cookies @${w}`);
      const info = await overflowInfo(page);
      assert.ok(info.scrollWidth <= info.innerWidth, `overflow com o aviso de cookies @${w}`);
      await shot(page, `home-cookies-${w}.png`);
      await page.click(".cookie [data-cookie=accept]");
      assert.equal(await page.locator(".cookie").isVisible(), false);
      await page.reload({ waitUntil: "load" });
      assert.equal(await page.locator(".cookie").isVisible(), false, "escolha deve persistir após recarregar");
      await ctx.close();
    }
  });
});
