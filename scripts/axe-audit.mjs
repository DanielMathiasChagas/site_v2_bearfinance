// Auditoria axe-core: node scripts/axe-audit.mjs <saida.json> [base-url] — 5 páginas, em 390 (mobile) e 1440 (desktop)
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
const out = process.argv[2]; const base = process.argv[3] || "http://localhost:3500";
const axeSrc = readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const pages = ["/", "/atuacao/contabilidade/", "/verticais/contabilidade-agronegocio/", "/contato/", "/parcerias/business-partner/"];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
for (const [label, vp] of [["mobile", { width: 390, height: 844 }], ["desktop", { width: 1440, height: 900 }]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, bypassCSP: true, reducedMotion: "reduce" }); // bypassCSP: a CSP do servidor bloqueia a injeção do axe; reducedMotion: revela tudo de imediato (evita falso positivo de contraste em elementos em transição)
  for (const p of pages) {
    const page = await ctx.newPage();
    await page.goto(base + p, { waitUntil: "load" });
    await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 800) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } scrollTo(0, 0); });
    await page.waitForTimeout(900);
    await page.addScriptTag({ content: axeSrc });
    const res = await page.evaluate(async () => { const r = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } }); return { violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, tags: v.tags.filter((t) => /wcag|best/.test(t)), nodes: v.nodes.slice(0, 6).map((n) => ({ target: n.target.join(" "), html: n.html.slice(0, 160), msg: (n.any[0] || n.all[0] || n.none[0] || {}).message?.slice(0, 200) })), count: v.nodes.length })), incomplete: r.incomplete.map((v) => ({ id: v.id, count: v.nodes.length })), passes: r.passes.length }; });
    results.push({ page: p, mode: label, ...res });
    console.log(`${label.padEnd(7)} ${p.padEnd(40)} violations=${res.violations.length} (${res.violations.map((v) => `${v.id}×${v.count}[${v.impact}]`).join(", ") || "nenhuma"}) incomplete=${res.incomplete.length}`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
writeFileSync(out, JSON.stringify(results, null, 2));
console.log("salvo em", out);
