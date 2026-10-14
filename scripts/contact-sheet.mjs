// Folha de contato das ilustrações: node scripts/contact-sheet.mjs <saida.png>
import { chromium } from "playwright-core";
import { readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const dir = resolve("src/assets/img/art");
const files = readdirSync(dir).filter((f) => f.endsWith(".svg")).sort();
const html = `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#07050d;font:13px system-ui;color:#c4b5fd"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:12px">${files.map((f) => `<figure style="margin:0;background:#150f24;padding:8px"><img src="file://${dir}/${f}" style="width:100%;height:320px;object-fit:contain;background:#0d0a17"><figcaption>${f}</figcaption></figure>`).join("")}</div></body>`;
const tmp = resolve(process.argv[2] + ".html");
writeFileSync(tmp, html);
const b = await chromium.launch({ channel: "chrome", headless: true });
const p = await b.newPage({ viewport: { width: 1600, height: 1200 } });
await p.goto("file://" + tmp, { waitUntil: "load" });
await p.waitForTimeout(800);
await p.screenshot({ path: process.argv[2], fullPage: true });
await b.close();
console.log("contact sheet:", process.argv[2], files.length, "svgs");
