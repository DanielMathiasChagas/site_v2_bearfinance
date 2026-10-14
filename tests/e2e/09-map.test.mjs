// Cobertura 9 — mapa neural (Canvas 2D) e ondas do hero (WebGL): canvas vivo no desktop, quadro estático com reduced-motion e < 768px,
// fallback SVG sem o script, sem erro não tratado.
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { gate, launch, openPage, goto, shotEl, dismissCookie } from "./_lib.mjs";

const SKIP = await gate();
const MAP = ".br-neural[data-brmap]";

const frame = (page) => page.evaluate(() => {
  const c = document.querySelector(".br-neural canvas");
  const ctx = c.getContext("2d");
  const { data } = ctx.getImageData(0, 0, c.width, c.height);
  let painted = 0, hash = 0;
  for (let i = 0; i < data.length; i += 4 * 7) { if (data[i + 3] > 8) painted++; hash = (hash * 31 + data[i] + data[i + 1] * 3 + data[i + 2] * 7 + data[i + 3] * 11) >>> 0; }
  return { w: c.width, h: c.height, painted, hash };
});
const fallbackState = (page) => page.evaluate(() => { const el = document.querySelector(".br-neural__fallback"); const cs = getComputedStyle(el); return { visibility: cs.visibility, opacity: Number(cs.opacity), hasSvg: !!el.querySelector("svg.br-map") }; });

describe("09 Mapa neural e WebGL", { skip: SKIP }, () => {
  let browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); });

  test("desktop 1440: canvas presente, .is-live, desenhado e animado; fallback SVG oculto", { timeout: 60_000 }, async () => {
    const { ctx, page, issues } = await openPage(browser, { width: 1440 });
    await goto(page, "/");
    await dismissCookie(page);
    assert.equal(await page.locator(`${MAP} canvas`).count(), 1, "canvas do mapa deve existir");
    await page.locator(MAP).scrollIntoViewIfNeeded();
    await page.waitForSelector(`${MAP}.is-live`, { timeout: 5000 });
    await page.mouse.move(700, 450);
    await page.waitForTimeout(800);
    const a = await frame(page);
    assert.ok(a.w > 100 && a.h > 100, `canvas sem dimensão (${a.w}x${a.h})`);
    assert.ok(a.painted > 50, `canvas aparentemente vazio (${a.painted} amostras pintadas)`);
    await page.waitForTimeout(600);
    const b = await frame(page);
    assert.notEqual(a.hash, b.hash, "no desktop o mapa deve animar (quadros diferentes)");
    const fb = await fallbackState(page);
    assert.equal(fb.visibility, "hidden", "fallback SVG deve ficar oculto quando o canvas está vivo");
    await shotEl(page.locator(MAP), "home-mapa-1440.png");
    assert.deepEqual(issues.pageErrors, []);
    assert.deepEqual(issues.consoleErrors, []);
    await ctx.close();
  });

  test("prefers-reduced-motion: quadro estático (.is-live, desenhado, sem animação) e layout íntegro", { timeout: 60_000 }, async () => {
    const { ctx, page, issues } = await openPage(browser, { width: 1440, reducedMotion: "reduce" });
    await goto(page, "/");
    await dismissCookie(page);
    await page.locator(MAP).scrollIntoViewIfNeeded();
    await page.waitForSelector(`${MAP}.is-live`, { timeout: 5000 });
    await page.mouse.move(700, 450);
    await page.waitForTimeout(500);
    const a = await frame(page);
    assert.ok(a.painted > 50, "quadro estático deve estar desenhado");
    await page.waitForTimeout(700);
    const b = await frame(page);
    assert.equal(a.hash, b.hash, "com reduced-motion o mapa não deve animar");
    await shotEl(page.locator(MAP), "home-mapa-reduced-1440.png");
    assert.deepEqual(issues.pageErrors, []);
    await ctx.close();
  });

  test("viewport 390 (< 768): quadro estático desenhado, sem animação", { timeout: 60_000 }, async () => {
    const { ctx, page, issues } = await openPage(browser, { width: 390 });
    await goto(page, "/");
    await dismissCookie(page);
    await page.locator(MAP).scrollIntoViewIfNeeded();
    await page.waitForSelector(`${MAP}.is-live`, { timeout: 5000 });
    await page.waitForTimeout(500);
    const a = await frame(page);
    assert.ok(a.painted > 50, "quadro estático deve estar desenhado no mobile");
    await page.waitForTimeout(700);
    const b = await frame(page);
    assert.equal(a.hash, b.hash, "abaixo de 768px o mapa não deve animar");
    await shotEl(page.locator(MAP), "home-mapa-390.png");
    assert.deepEqual(issues.pageErrors, []);
    await ctx.close();
  });

  test("sem o script do mapa: fallback SVG permanece visível e não há erro de página", { timeout: 60_000 }, async () => {
    const { ctx, page, issues } = await openPage(browser, { width: 1440 });
    await page.route("**/assets/js/brmap.js*", (r) => r.abort());
    await goto(page, "/");
    await page.waitForTimeout(800);
    assert.equal(await page.locator(`${MAP}.is-live`).count(), 0);
    const fb = await fallbackState(page);
    assert.equal(fb.hasSvg, true, "svg.br-map de fallback deve existir");
    assert.equal(fb.visibility, "visible");
    assert.equal(fb.opacity, 1);
    assert.equal(await page.locator(`${MAP} svg.br-map`).isVisible(), true);
    assert.deepEqual(issues.pageErrors, []);
    await ctx.close();
  });

  test("sem BR_GEO (dados do mapa): script avisa no console e mantém o SVG, sem erro", { timeout: 60_000 }, async () => {
    const { ctx, page, issues } = await openPage(browser, { width: 1440 });
    await page.route("**/assets/js/brazil-geo.js*", (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: "/* sem dados */" }));
    await goto(page, "/");
    await page.waitForTimeout(800);
    assert.equal(await page.locator(`${MAP}.is-live`).count(), 0);
    assert.equal(await page.locator(`${MAP} svg.br-map`).isVisible(), true);
    assert.ok(issues.warnings.some((w) => /brmap/.test(w)), "deve avisar [brmap] no console");
    assert.deepEqual(issues.pageErrors, []);
    assert.deepEqual(issues.consoleErrors, []);
    await ctx.close();
  });

  test("ondas do hero (WebGL): canvas presente; com WebGL ativa recebe .on, sem WebGL degrada em silêncio", { timeout: 60_000 }, async () => {
    const { ctx, page, issues } = await openPage(browser, { width: 1440 });
    await goto(page, "/");
    await page.waitForTimeout(500);
    assert.equal(await page.locator("canvas.fx-waves").count(), 1);
    const state = await page.evaluate(() => { const c = document.querySelector("canvas.fx-waves"); let gl = null; try { gl = document.createElement("canvas").getContext("webgl"); } catch { /* noop */ } return { on: c.classList.contains("on"), webgl: !!gl, w: c.width, h: c.height }; });
    console.log(`[webgl] disponível=${state.webgl} canvas.on=${state.on} ${state.w}x${state.h}`);
    if (state.webgl) assert.equal(state.on, true, "com WebGL disponível o canvas deve ser desenhado (.on)");
    assert.deepEqual(issues.pageErrors, []);
    assert.deepEqual(issues.consoleErrors.filter((e) => /webgl/i.test(e)), [], "erro de WebGL não tratado");
    await ctx.close();
  });
});
