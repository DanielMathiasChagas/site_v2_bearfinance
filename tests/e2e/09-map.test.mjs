// Cobertura 9 — mapa neural (Canvas 2D carregado sob demanda) e ondas do hero (WebGL).
// Contrato atual (site.js): os scripts do mapa só carregam em desktop com ponteiro fino, >= 768px e sem reduced-motion;
// nos demais casos permanece a imagem estática de fallback. Sem BR_GEO ou erro: fallback mantido, sem erro não tratado.
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { gate, launch, openPage, goto, shotEl, dismissCookie, scrollThrough } from "./_lib.mjs";

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
const fallbackState = (page) => page.evaluate(() => {
  const el = document.querySelector(".br-neural__fallback"); const cs = getComputedStyle(el);
  const img = el.querySelector("img"), svg = el.querySelector("svg");
  return { visibility: cs.visibility, opacity: Number(cs.opacity), kind: img ? "img" : svg ? "svg" : "none", loaded: img ? img.complete && img.naturalWidth > 0 : !!svg, alt: img ? img.getAttribute("alt") : null };
});
const trackMapScripts = (page) => { const urls = []; page.on("request", (r) => { if (/brmap\.js|brazil-geo\.js/.test(r.url())) urls.push(r.url()); }); return urls; };

describe("09 Mapa neural e WebGL", { skip: SKIP }, () => {
  let browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); });

  test("desktop 1440: scripts carregam sob demanda, canvas .is-live desenhado e animado; fallback oculto", { timeout: 60_000 }, async () => {
    const { ctx, page, issues } = await openPage(browser, { width: 1440 });
    const scripts = trackMapScripts(page);
    await goto(page, "/");
    await dismissCookie(page);
    assert.equal(await page.locator(`${MAP} canvas`).count(), 1, "canvas do mapa deve existir");
    await page.locator(MAP).scrollIntoViewIfNeeded();
    await page.waitForSelector(`${MAP}.is-live`, { timeout: 10_000 });
    assert.ok(scripts.some((u) => /brazil-geo\.js/.test(u)) && scripts.some((u) => /brmap\.js/.test(u)), `scripts do mapa deveriam ter sido carregados (${scripts.join(", ")})`);
    await page.mouse.move(700, 450);
    await page.waitForTimeout(800);
    const a = await frame(page);
    assert.ok(a.w > 100 && a.h > 100, `canvas sem dimensão (${a.w}x${a.h})`);
    assert.ok(a.painted > 50, `canvas aparentemente vazio (${a.painted} amostras pintadas)`);
    await page.waitForTimeout(600);
    const b = await frame(page);
    assert.notEqual(a.hash, b.hash, "no desktop o mapa deve animar (quadros diferentes)");
    const fb = await fallbackState(page);
    assert.equal(fb.visibility, "hidden", "fallback deve ficar oculto quando o canvas está vivo");
    await shotEl(page.locator(MAP), "home-mapa-1440.png");
    assert.deepEqual(issues.pageErrors, []);
    assert.deepEqual(issues.consoleErrors, []);
    await ctx.close();
  });

  for (const [label, opts] of [["prefers-reduced-motion @1440", { width: 1440, reducedMotion: "reduce" }], ["viewport 390 (< 768)", { width: 390 }]]) {
    test(`${label}: fallback estático (imagem carregada, com alt), sem carregar scripts do mapa, sem erros`, { timeout: 60_000 }, async () => {
      const { ctx, page, issues } = await openPage(browser, opts);
      const scripts = trackMapScripts(page);
      await goto(page, "/");
      await dismissCookie(page);
      await page.locator(MAP).scrollIntoViewIfNeeded();
      await scrollThrough(page);
      await page.locator(MAP).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      assert.deepEqual(scripts, [], "scripts do mapa não devem ser baixados neste modo");
      assert.equal(await page.locator(`${MAP}.is-live`).count(), 0);
      const fb = await fallbackState(page);
      assert.equal(fb.visibility, "visible");
      assert.equal(fb.opacity, 1);
      assert.notEqual(fb.kind, "none", "fallback deve conter imagem ou svg");
      assert.equal(fb.loaded, true, "imagem de fallback deve estar carregada");
      if (fb.kind === "img") assert.ok((fb.alt || "").length > 10, "imagem de fallback precisa de alt descritivo");
      await shotEl(page.locator(MAP), opts.reducedMotion ? "home-mapa-reduced-1440.png" : "home-mapa-390.png");
      assert.deepEqual(issues.pageErrors, []);
      assert.deepEqual(issues.consoleErrors, []);
      await ctx.close();
    });
  }

  test("sem o script do mapa (bloqueado): fallback permanece visível e não há erro de página", { timeout: 60_000 }, async () => {
    const { ctx, page, issues } = await openPage(browser, { width: 1440 });
    await page.route("**/assets/js/brmap.js*", (r) => r.abort());
    await goto(page, "/");
    await page.locator(MAP).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    assert.equal(await page.locator(`${MAP}.is-live`).count(), 0);
    const fb = await fallbackState(page);
    assert.equal(fb.visibility, "visible");
    assert.notEqual(fb.kind, "none");
    assert.equal(fb.loaded, true);
    assert.deepEqual(issues.pageErrors, []);
    await ctx.close();
  });

  test("sem BR_GEO (malha vazia): script avisa [brmap] no console, mantém o fallback, sem erro", { timeout: 60_000 }, async () => {
    const { ctx, page, issues } = await openPage(browser, { width: 1440 });
    await page.route("**/assets/js/brazil-geo.js*", (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: "/* sem dados */" }));
    await goto(page, "/");
    await page.locator(MAP).scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    assert.equal(await page.locator(`${MAP}.is-live`).count(), 0);
    assert.equal((await fallbackState(page)).visibility, "visible");
    assert.ok(issues.warnings.some((w) => /\[brmap\]/.test(w)), `deveria avisar [brmap] no console (avisos: ${issues.warnings.join(" | ") || "nenhum"})`);
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
