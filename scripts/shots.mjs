// Varredura visual e técnica: node scripts/shots.mjs <pasta-de-saida> [base-url]
// Para cada rota × largura: status, h1 único, tamanho do <title>, overflow horizontal, erros de console;
// screenshots de página inteira em 1440 e 390 (rolando antes para disparar as revelações).
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
const out = process.argv[2] || "docs/qa/screenshots/depois";
const base = process.argv[3] || "http://localhost:3100";
mkdirSync(out, { recursive: true });
const pages = ["/", "/atuacao/contabilidade/", "/verticais/contabilidade-agronegocio/", "/contato/", "/parcerias/business-partner/", "/parcerias/", "/sobre/", "/conteudo/", "/conteudo/reforma-tributaria-ibs-cbs-o-que-muda/", "/cases/", "/plataforma/", "/carreira/", "/esg/", "/atuacao/", "/verticais/", "/privacidade/", "/nao-existe/"];
const widths = [320, 375, 390, 768, 1024, 1440, 1920];
const browser = await chromium.launch({ channel: "chrome", headless: true });
let problems = 0;
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => { try { localStorage.setItem("bf-cookies", "reject"); } catch (_) {} });
  for (const p of pages) {
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 140)); });
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 140)));
    page.on("requestfailed", (r) => { if (!/cdnjs|gstatic|googleapis/.test(r.url())) errors.push("reqfail: " + r.url()); });
    const res = await page.goto(base + p, { waitUntil: "load" });
    await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 700) { scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 60)); } scrollTo({ top: 0, behavior: "instant" }); });
    await page.waitForTimeout(700);
    const m = await page.evaluate(() => {
      const vw = innerWidth, culprits = [];
      if (document.documentElement.scrollWidth > vw) document.querySelectorAll("body *").forEach((el) => { if (el.closest(".nav, .hdr, .cookie, .wa-float, .totop, .phead__bg, .hero__bg")) return; const r = el.getBoundingClientRect(); if (r.right > vw + 1 && r.width > 0) culprits.push(el.tagName.toLowerCase() + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "") + "@" + Math.round(r.right)); });
      return { sw: document.documentElement.scrollWidth, vw, h: document.documentElement.scrollHeight, h1: document.querySelectorAll("h1").length, title: document.title.length, culprits: culprits.slice(0, 6) };
    });
    const bad = m.sw > m.vw || m.h1 !== 1 || (errors.length && !p.includes("nao-existe"));
    if (bad) problems++;
    console.log(`${String(w).padStart(4)} ${p.padEnd(48)} ${res.status()} h1=${m.h1} title=${m.title} h=${m.h} ${m.sw > m.vw ? "OVERFLOW " + JSON.stringify(m.culprits) : "ok"} ${errors.length ? "ERR " + JSON.stringify([...new Set(errors)].slice(0, 4)) : ""}`);
    if ((w === 1440 || w === 390) && !p.includes("nao-existe")) await page.screenshot({ path: `${out}/${(p.replace(/\//g, "_").replace(/^_|_$/g, "") || "home")}-${w}.png`, fullPage: true });
    await page.close();
  }
  await ctx.close();
}
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { try { localStorage.setItem("bf-cookies", "reject"); } catch (_) {} });
const page = await ctx.newPage();
const errs = [];
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errs.push(m.type() + ": " + m.text().slice(0, 160)); });
await page.goto(base + "/", { waitUntil: "load" });
await page.locator("#presenca").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
const box = await page.locator(".br-neural").boundingBox();
await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.6);
await page.waitForTimeout(2500);
console.log("map live:", await page.evaluate(() => document.querySelector(".br-neural")?.classList.contains("is-live")), "canvas:", await page.evaluate(() => { const c = document.querySelector(".br-neural__canvas"); return c ? c.width + "x" + c.height : null; }), "label:", (await page.locator(".br-neural__label").innerText()).replace(/\n/g, " / "));
await page.locator("#presenca").screenshot({ path: `${out}/map-1440.png` });
await page.mouse.move(10, 10);
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(600);
await page.locator(".hero").screenshot({ path: `${out}/hero-1440.png` });
const m = await ctx.newPage(); await m.setViewportSize({ width: 390, height: 844 }); await m.goto(base + "/", { waitUntil: "load" }); await m.click(".burger"); await m.waitForTimeout(600); await m.click(".nav__item.has-sub > button"); await m.waitForTimeout(400); await m.screenshot({ path: `${out}/menu-mobile-390.png` });
console.log("map console:", JSON.stringify(errs));
console.log(problems ? `PROBLEMAS: ${problems}` : "SEM PROBLEMAS");
await browser.close();
