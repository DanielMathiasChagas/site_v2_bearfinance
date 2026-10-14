// Cobertura 3 — menu desktop (hover/foco abre submenu, botão alterna, Esc fecha) e mobile (drawer, submenus, foco preso, Esc).
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { gate, launch, openPage, goto, shot, overflowInfo, dismissCookie } from "./_lib.mjs";

const SKIP = await gate();
const ITEM = (n) => `#site-navigation .nav__list > .nav__item:nth-child(${n})`;
const active = (page) => page.evaluate(() => { const el = document.activeElement; return el ? `${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).split(/\s+/)[0] : ""}|${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30)}` : ""; });

describe("03 Menu desktop e mobile", { skip: SKIP }, () => {
  let browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); });

  test("desktop 1440: hover abre o submenu e sair fecha; foco por teclado abre (focus-within) e Tab entra nos itens", { timeout: 60_000 }, async () => {
    const { ctx, page, issues } = await openPage(browser, { width: 1440 });
    await goto(page, "/");
    assert.equal(await page.locator(".burger").isVisible(), false, "o botão hambúrguer não deve aparecer no desktop");
    assert.equal(await page.locator("#sub-sobre").isVisible(), false, "submenu deve iniciar fechado");

    await page.hover(`${ITEM(1)} > a.nav__link`);
    await page.locator("#sub-sobre").waitFor({ state: "visible", timeout: 3000 });
    await page.mouse.move(720, 600);
    await page.locator("#sub-sobre").waitFor({ state: "hidden", timeout: 3000 });

    await page.locator(`${ITEM(2)} > a.nav__link`).focus();
    await page.locator("#sub-atuacao").waitFor({ state: "visible", timeout: 3000 });
    await page.keyboard.press("Tab"); // botão do submenu
    assert.match(await active(page), /^button\.nav__link\|Abrir submenu/);
    await page.keyboard.press("Tab"); // primeiro item do painel
    assert.equal(await page.evaluate(() => !!document.activeElement.closest("#sub-atuacao")), true, "Tab deve entrar no submenu aberto por foco");
    await shot(page, "home-menu-desktop-1440.png");
    assert.deepEqual(issues.pageErrors, []);
    await ctx.close();
  });

  test("desktop 1440: botão do submenu alterna aria-expanded/is-open; Esc e clique fora fecham", { timeout: 60_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    await goto(page, "/");
    const btn = page.locator(`${ITEM(3)} > button`);
    await btn.focus();
    await page.keyboard.press("Enter");
    assert.equal(await btn.getAttribute("aria-expanded"), "true");
    assert.equal(await page.locator(ITEM(3)).evaluate((li) => li.classList.contains("is-open")), true);
    await page.keyboard.press("Escape");
    assert.equal(await btn.getAttribute("aria-expanded"), "false", "Esc deve fechar o submenu");
    assert.equal(await page.locator(ITEM(3)).evaluate((li) => li.classList.contains("is-open")), false);
    await btn.click();
    assert.equal(await btn.getAttribute("aria-expanded"), "true");
    await page.mouse.click(8, 520); // clique fora (área do hero)
    assert.equal(await btn.getAttribute("aria-expanded"), "false", "clique fora deve fechar o submenu");
    await ctx.close();
  });

  test("breakpoint: hambúrguer aparece abaixo de 992px e some a partir de 992px", async () => {
    for (const [w, expected] of [[991, true], [992, false], [768, true], [1024, false]]) {
      const { ctx, page } = await openPage(browser, { width: w, height: 800 });
      await goto(page, "/", { settle: 0 });
      assert.equal(await page.locator(".burger").isVisible(), expected, `burger @${w}px`);
      await ctx.close();
    }
  });

  test("mobile 390: ao abrir o drawer o foco vai para o primeiro item do menu", { timeout: 60_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 390 });
    await goto(page, "/");
    await dismissCookie(page);
    await page.locator(".burger").click();
    await page.locator("#site-navigation").waitFor({ state: "visible", timeout: 3000 });
    await page.waitForTimeout(600); // transição do drawer
    const inDrawer = await page.evaluate(() => !!document.activeElement.closest("#site-navigation"));
    assert.equal(inDrawer, true, `foco deveria estar no drawer; está em ${await active(page)}`);
    await ctx.close();
  });

  test("mobile 390: botão abre o drawer, submenus expandem (um por vez), foco preso, Esc fecha e devolve o foco", { timeout: 60_000 }, async () => {
    const { ctx, page, issues } = await openPage(browser, { width: 390 });
    await goto(page, "/");
    await dismissCookie(page);
    const burger = page.locator(".burger");
    assert.equal(await burger.isVisible(), true);
    assert.equal(await burger.getAttribute("aria-expanded"), "false");
    assert.equal(await page.locator("#site-navigation").isVisible(), false, "drawer deve iniciar fechado");

    await burger.click();
    await page.locator("#site-navigation").waitFor({ state: "visible", timeout: 3000 });
    assert.equal(await burger.getAttribute("aria-expanded"), "true");
    assert.equal(await page.evaluate(() => document.body.classList.contains("nav-open")), true);
    const info = await overflowInfo(page);
    assert.ok(info.scrollWidth <= info.innerWidth, `overflow horizontal com o drawer aberto: ${info.scrollWidth} > ${info.innerWidth}`);

    const b2 = page.locator(`${ITEM(2)} > button`), b3 = page.locator(`${ITEM(3)} > button`);
    await b2.click();
    assert.equal(await b2.getAttribute("aria-expanded"), "true");
    await page.locator("#sub-atuacao").waitFor({ state: "visible", timeout: 2000 });
    assert.equal(await page.locator("#sub-atuacao a").first().isVisible(), true);
    await b3.click();
    assert.equal(await b3.getAttribute("aria-expanded"), "true");
    assert.equal(await b2.getAttribute("aria-expanded"), "false", "abrir outro submenu deve fechar o anterior");
    assert.equal(await page.locator("#sub-atuacao").isVisible(), false);
    await shot(page, "home-menu-mobile-390.png");

    // foco preso: Tab a partir do último focável volta ao hambúrguer; Shift+Tab a partir do primeiro também
    await page.locator("#site-navigation .nav__foot a").last().focus();
    await page.keyboard.press("Tab");
    assert.match(await active(page), /^button\.burger/, "Tab após o último item deve voltar ao hambúrguer");
    await page.locator("#site-navigation a").first().focus();
    await page.keyboard.press("Shift+Tab");
    assert.match(await active(page), /^button\.burger/, "Shift+Tab antes do primeiro item deve ir ao hambúrguer");

    await page.keyboard.press("Escape");
    await page.locator("#site-navigation").waitFor({ state: "hidden", timeout: 3000 });
    assert.equal(await burger.getAttribute("aria-expanded"), "false");
    assert.equal(await page.evaluate(() => document.body.classList.contains("nav-open")), false);
    assert.match(await active(page), /^button\.burger/, "Esc deve devolver o foco ao hambúrguer");
    assert.equal(await b3.getAttribute("aria-expanded"), "false", "fechar o drawer deve fechar submenus");
    assert.deepEqual(issues.pageErrors, []);
    await ctx.close();
  });
});
