// Acessibilidade automática (axe-core, WCAG 2.x A/AA) nas páginas-chave: violações critical/serious reprovam; moderate/minor são registradas.
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { ROOT, KEY_PAGES, gate, launch, openPage, goto, dismissCookie, scrollThrough } from "./_lib.mjs";

const SKIP = await gate();
const AXE = join(ROOT, "node_modules", "axe-core", "axe.min.js");
const PAGES = { ...KEY_PAGES, "404": "/404.html", conteudo: "/conteudo/", artigo: "/conteudo/reforma-tributaria-ibs-cbs-o-que-muda/" };

async function runAxe(page) {
  await page.addScriptTag({ path: AXE });
  return page.evaluate(() => axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }, resultTypes: ["violations"] }).then((r) => r.violations.map((v) => ({
    id: v.id, impact: v.impact, help: v.help, count: v.nodes.length,
    nodes: v.nodes.slice(0, 4).map((n) => { const d = n.any[0] && n.any[0].data; const extra = d && d.fgColor ? ` {fg ${d.fgColor} / bg ${d.bgColor} = ${d.contrastRatio}:1, mín. ${d.expectedContrastRatio}, ${d.fontSize} ${d.fontWeight}}` : ""; return n.target.join(" ") + extra; }),
  }))));
}

describe("12 Acessibilidade (axe-core)", { skip: SKIP }, () => {
  let browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); });

  for (const width of [1440, 390]) {
    test(`páginas-chave @${width}px: sem violações critical/serious (moderate/minor registradas)`, { timeout: 300_000 }, async () => {
      const serious = [], minor = [];
      for (const [key, path] of Object.entries(PAGES)) {
        if (width === 390 && !["home", "contato", "parceria"].includes(key)) continue;
        const { ctx, page } = await openPage(browser, { width, bypassCSP: true });
        await goto(page, path);
        await dismissCookie(page);
        await scrollThrough(page); // conclui os reveals (opacity 0 → 1) antes de medir contraste
        await page.waitForTimeout(900);
        const v = await runAxe(page);
        for (const x of v) (["critical", "serious"].includes(x.impact) ? serious : minor).push(`${path}: [${x.impact}] ${x.id} — ${x.help} (${x.count}×) ex.: ${x.nodes.join(" ; ")}`);
        await ctx.close();
      }
      if (minor.length) console.log(`[axe] moderate/minor @${width} (registrado):\n  ` + minor.join("\n  "));
      assert.deepEqual(serious, []);
    });
  }
});
