// Cobertura 7 — console e rede limpos em todas as rotas: zero console.error, zero pageerror, zero respostas >= 400.
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { ORIGIN, KEY_PAGES, gate, allRoutes, launch, openPage, goto, scrollThrough, resetIssues, isPending } from "./_lib.mjs";

const SKIP = await gate();
const isLocal = (url) => url.startsWith(ORIGIN);
const urlOf = (entry) => (entry.match(/https?:\/\/\S+/) || [""])[0];

/** Separa o que reprova do que é apenas registrado (assets pendentes, CDN inacessível por rede). */
function triage(path, issues) {
  const fail = [], note = [];
  for (const e of issues.pageErrors) fail.push(`${path}: pageerror: ${e}`);
  for (const e of issues.consoleErrors) (isPending(urlOf(e)) ? note : fail).push(`${path}: console.error: ${e}`);
  for (const e of issues.badResponses) (isPending(urlOf(e)) ? note : fail).push(`${path}: ${e}`);
  for (const e of issues.failedRequests) {
    if (/net::ERR_ABORTED/.test(e)) continue; // cancelamentos do próprio navegador
    const u = urlOf(e);
    if (!isLocal(u) && /ERR_INTERNET_DISCONNECTED|ERR_NAME_NOT_RESOLVED|ERR_CONNECTION|ERR_NETWORK|ERR_TIMED_OUT|ERR_BLOCKED_BY_CLIENT/.test(e)) note.push(`${path}: CDN inacessível (rede): ${e}`);
    else if (isPending(u)) note.push(`${path}: ${e}`);
    else fail.push(`${path}: requestfailed: ${e}`);
  }
  return { fail, note };
}

async function sweep(browser, width, routes) {
  const { ctx, page, issues } = await openPage(browser, { width });
  const fails = [], notes = [], warnings = [];
  for (const path of routes) {
    resetIssues(issues);
    await goto(page, path, { settle: 300 });
    await scrollThrough(page);
    await page.waitForTimeout(1200); // carregamentos sob demanda (carrossel, lazy)
    const t = triage(path, issues);
    fails.push(...t.fail); notes.push(...t.note);
    for (const w of issues.warnings) warnings.push(`${path}: ${w}`);
  }
  await ctx.close();
  return { fails: [...new Set(fails)], notes: [...new Set(notes)], warnings: [...new Set(warnings)] };
}

describe("07 Console e rede limpos", { skip: SKIP }, () => {
  let browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); });

  test("todas as rotas @1440: zero console.error, zero pageerror, zero respostas >= 400", { timeout: 600_000 }, async () => {
    const routes = await allRoutes();
    const r = await sweep(browser, 1440, routes);
    console.log(`[console] ${routes.length} rotas varridas @1440`);
    if (r.notes.length) console.log("[console] REGISTRADO (não reprova):\n  " + r.notes.join("\n  "));
    if (r.warnings.length) console.log("[console] console.warn:\n  " + r.warnings.join("\n  "));
    assert.deepEqual(r.fails, []);
  });

  test("páginas-chave @390: zero console.error, zero pageerror, zero respostas >= 400", { timeout: 300_000 }, async () => {
    const r = await sweep(browser, 390, Object.values(KEY_PAGES));
    if (r.notes.length) console.log("[console] REGISTRADO @390 (não reprova):\n  " + r.notes.join("\n  "));
    if (r.warnings.length) console.log("[console] console.warn @390:\n  " + r.warnings.join("\n  "));
    assert.deepEqual(r.fails, []);
  });
});
