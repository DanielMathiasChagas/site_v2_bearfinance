// Utilidades compartilhadas da suíte E2E (não é arquivo de teste: o runner só executa *.test.mjs).
// Servidor alvo: E2E_BASE_URL ou http://127.0.0.1:3300 (PORT=3300 node server.js). Chrome do sistema via playwright-core.
import { chromium } from "playwright-core";
import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";

export const ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url)));
export const PUBLIC = join(ROOT, "public");
export const SHOTS = join(ROOT, "docs", "qa", "screenshots", "depois");
export const PORT = Number(process.env.E2E_PORT || 3300);
export const BASE = (process.env.E2E_BASE_URL || `http://127.0.0.1:${PORT}`).replace(/\/$/, "");
export const ORIGIN = new URL(BASE).origin;
export const PROD = "https://www.bearfinance.com.br";

export const WIDTHS = [320, 375, 390, 768, 1024, 1440, 1920];
export const HEIGHTS = { 320: 568, 375: 667, 390: 844, 768: 1024, 1024: 768, 1440: 900, 1920: 1080 };
export const KEY_PAGES = {
  home: "/",
  servico: "/atuacao/contabilidade/",
  vertical: "/verticais/contabilidade-agronegocio/",
  contato: "/contato/",
  parceria: "/parcerias/business-partner/",
};
export const WA = { comercial: "5511983148774", parcerias: "5511915267749" };
// Caminhos cujo 404 é apenas registrado (ilustrações ainda em geração, conforme briefing do orquestrador).
export const PENDING_ASSETS = [/\/assets\/img\/art\//];
export const isPending = (url) => PENDING_ASSETS.some((re) => re.test(url));

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function healthy() {
  try { const r = await fetch(`${BASE}/health`, { signal: AbortSignal.timeout(2000) }); return r.ok; } catch { return false; }
}

/** Devolve `false` quando o servidor responde, ou a mensagem de skip. Com E2E_REQUIRE=1 lança erro (runner). */
export async function gate() {
  if (await healthy()) return false;
  const msg = `servidor E2E indisponível em ${BASE} — inicie com "PORT=${PORT} node server.js" ou rode "node tests/e2e/run.mjs"`;
  if (process.env.E2E_REQUIRE === "1") throw new Error(msg);
  return msg;
}

export async function sitemapRoutes() {
  const xml = await readFile(join(PUBLIC, "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1].trim()).pathname);
}
export async function allRoutes() { return [...(await sitemapRoutes()), "/404.html"]; }

// ---------------------------------------------------------------------------
// Navegador
// ---------------------------------------------------------------------------
export async function launch() { return chromium.launch({ channel: "chrome", headless: true }); }

export function watch(page) {
  const issues = { consoleErrors: [], pageErrors: [], badResponses: [], failedRequests: [], warnings: [] };
  page.on("console", (m) => {
    const t = m.type(); const loc = m.location() || {};
    const entry = `${m.text()}${loc.url ? ` @ ${loc.url}` : ""}`;
    if (t === "error") issues.consoleErrors.push(entry); else if (t === "warning") issues.warnings.push(entry);
  });
  page.on("pageerror", (e) => issues.pageErrors.push(String((e && e.message) || e)));
  page.on("response", (r) => { if (r.status() >= 400) issues.badResponses.push(`${r.status()} ${r.url()}`); });
  page.on("requestfailed", (r) => issues.failedRequests.push(`${(r.failure() || {}).errorText || "?"} ${r.url()}`));
  return issues;
}
export function resetIssues(issues) { for (const k of Object.keys(issues)) issues[k].length = 0; }

export async function openPage(browser, { width = 1440, height, reducedMotion = "no-preference", bypassCSP = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: height || HEIGHTS[width] || 900 }, reducedMotion, locale: "pt-BR", deviceScaleFactor: 1, bypassCSP });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15_000); // ações travadas viram erro explícito em vez de esperar 30 s
  const issues = watch(page);
  return { ctx, page, issues };
}

export async function goto(page, path, { settle = 300 } = {}) {
  const res = await page.goto(BASE + path, { waitUntil: "load" });
  await page.evaluate(() => Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 5000))]).then(() => true)).catch(() => {});
  if (settle) await page.waitForTimeout(settle);
  return res;
}

export async function dismissCookie(page) {
  try {
    const b = page.locator(".cookie:not([hidden]) [data-cookie='reject']");
    if ((await b.count()) && (await b.first().isVisible())) await b.first().click();
  } catch { /* banner ausente */ }
}

/** Rola a página até o fim em passos curtos (dispara reveals por IntersectionObserver e carregamentos sob demanda) e volta ao topo.
 *  Passos de 40% da viewport com 150 ms garantem que todo .reveal receba .in (passos largos/rápidos deixavam seções com opacity 0). */
export async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(innerHeight * 0.4));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); }
    scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
  });
}
/** Reveals pendentes fora de contêineres ocultos (deve ser 0 após scrollThrough). */
export async function pendingReveals(page) {
  return page.evaluate(() => [...document.querySelectorAll(".reveal:not(.in), .reveal-group:not(.in)")].filter((el) => !el.closest("[hidden]") && el.getBoundingClientRect().height > 0).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(/\s+/)[0]}`));
}

export async function overflowInfo(page) {
  return page.evaluate(() => {
    const de = document.documentElement, iw = innerWidth, culprits = [];
    const name = (el) => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : "") + (typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "");
    if (de.scrollWidth > iw || document.body.scrollWidth > iw) {
      const fixedSeen = new Set();
      const inFixed = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { if (fixedSeen.has(e)) return true; if (getComputedStyle(e).position === "fixed") { fixedSeen.add(e); return true; } } return false; };
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect(); if (!r.width && !r.height) continue;
        if (inFixed(el) || el.classList.contains("hp")) continue; // drawer/botões fixos e honeypot (left:-9999px) não geram rolagem
        if (r.right > iw + 1) { culprits.push(`${name(el)} [${Math.round(r.left)}..${Math.round(r.right)}]`); if (culprits.length >= 10) break; }
      }
    }
    return { scrollWidth: de.scrollWidth, bodyScrollWidth: document.body.scrollWidth, innerWidth: iw, culprits };
  });
}

export async function shot(page, name, opts = {}) {
  await mkdir(SHOTS, { recursive: true });
  const path = join(SHOTS, name);
  await page.screenshot({ path, ...opts });
  return path;
}
export async function shotEl(locator, name) {
  await mkdir(SHOTS, { recursive: true });
  const path = join(SHOTS, name);
  await locator.screenshot({ path });
  return path;
}

// ---------------------------------------------------------------------------
// HTML (parser leve, suficiente para o HTML gerado pelo build)
// ---------------------------------------------------------------------------
export function tags(html, tag) {
  const out = [];
  const re = new RegExp(`<${tag}\\s([^>]*?)\\/?>`, "gi");
  for (const m of html.matchAll(re)) {
    const attrs = {};
    for (const a of m[1].matchAll(/([a-zA-Z_:-][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) attrs[a[1].toLowerCase()] = (a[2] ?? a[3] ?? a[4] ?? "").replace(/&amp;/g, "&");
    out.push(attrs);
  }
  return out;
}
export const meta = (html, name) => { const m = html.match(new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, "i")); return m ? m[1] : null; };
export const title = (html) => { const m = html.match(/<title>([^<]*)<\/title>/i); return m ? m[1].trim() : ""; };
export const h1s = (html) => (html.match(/<h1[\s>]/gi) || []).length;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const hasId = (html, id) => new RegExp(`\\sid="${escapeRe(id)}"`).test(html);

const htmlCache = new Map();
export function fetchHtml(path) {
  if (!htmlCache.has(path)) htmlCache.set(path, fetch(BASE + path, { redirect: "manual" }).then(async (r) => ({ status: r.status, html: await r.text(), location: r.headers.get("location"), type: r.headers.get("content-type") || "" })));
  return htmlCache.get(path);
}
const statusCache = new Map();
/** Status de um caminho local (GET sem seguir redirecionamentos). */
export function status(path) {
  if (!statusCache.has(path)) statusCache.set(path, fetch(BASE + path, { redirect: "manual" }).then(async (r) => { try { await r.arrayBuffer(); } catch { /* noop */ } return { status: r.status, location: r.headers.get("location") }; }).catch((e) => ({ status: 0, error: e.message })));
  return statusCache.get(path);
}
