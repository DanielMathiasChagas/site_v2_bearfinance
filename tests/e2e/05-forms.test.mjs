// Cobertura 5 — formulários contra o servidor real: validação, sucesso, erro de servidor, honeypot, anti-bot por tempo, parcerias → WhatsApp.
// Orçamento: o servidor limita 10 POST por IP a cada 10 min — este arquivo faz 8. Reinicie o servidor entre execuções próximas.
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ROOT, WA, gate, launch, openPage, goto, shot, shotEl, dismissCookie } from "./_lib.mjs";

const SKIP = await gate();
const RUN = Date.now();
const email = (tag) => `qa-${tag}-${RUN}@bearfinance-qa.com.br`;
const LOCAL = !process.env.E2E_BASE_URL; // só confere data/*.jsonl quando o servidor é o local
const leadStored = async (form, mail) => (await readFile(join(ROOT, "data", `${form}.jsonl`), "utf8").catch(() => "")).includes(mail.toLowerCase());

const F = "#form-diagnostico";
async function fillDiagnostico(page, mail) {
  await page.fill(`${F} [name=nome]`, "QA Teste Automático");
  await page.fill(`${F} [name=empresa]`, "QA Indústria Ltda");
  await page.fill(`${F} [name=email]`, mail);
  await page.locator(`${F} [name=telefone]`).pressSequentially("11987654321");
  await page.selectOption(`${F} [name=segmento]`, { index: 1 });
  await page.selectOption(`${F} [name=servico]`, { index: 1 });
  await page.fill(`${F} [name=mensagem]`, "Envio automático da suíte E2E — pode descartar.");
  await page.check(`${F} [name=lgpd]`);
}
const setTs = (page, sel, delta) => page.evaluate(([s, d]) => { document.querySelector(s).elements.ts.value = String(Date.now() - d); }, [sel, delta]);
async function submit(page, sel, api) {
  const [res] = await Promise.all([
    page.waitForResponse((r) => r.url().includes(api) && r.request().method() === "POST", { timeout: 15_000 }),
    page.click(`${sel} [type=submit]`),
  ]);
  return res;
}

describe("05 Formulários (servidor real)", { skip: SKIP }, () => {
  let browser;
  before(async () => { browser = await launch(); });
  after(async () => { await browser?.close(); });

  test("diagnóstico: obrigatórios vazios → campos destacados (is-invalid/aria-invalid), foco no primeiro, mensagem de erro e nenhum envio", { timeout: 60_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    await goto(page, "/contato/");
    await dismissCookie(page);
    const posts = [];
    page.on("request", (r) => { if (r.method() === "POST") posts.push(r.url()); });
    await page.click(`${F} [type=submit]`);
    await page.waitForTimeout(400);
    const invalid = await page.$$eval(`${F} .field.is-invalid`, (els) => els.map((e) => e.querySelector("input,select,textarea").name));
    for (const n of ["nome", "empresa", "email", "telefone", "segmento", "servico"]) assert.ok(invalid.includes(n), `campo ${n} deveria estar destacado (destacados: ${invalid.join(",")})`);
    assert.equal(await page.evaluate(() => document.activeElement.name), "nome", "foco deve ir ao primeiro campo inválido");
    assert.equal(await page.getAttribute(`${F} [name=nome]`, "aria-invalid"), "true");
    assert.equal(await page.locator(`${F} .field.is-invalid .field__err`).first().isVisible(), true, "mensagem do campo deve aparecer");
    assert.equal(await page.locator(`${F} .form__msg.is-err`).isVisible(), true);
    assert.match(await page.textContent(`${F} .form__msg`), /Revise os campos/);
    assert.deepEqual(posts, [], "nenhum POST deve sair com o formulário inválido");
    await shotEl(page.locator("#diagnostico"), "contato-form-validacao-1440.png");
    // corrigir remove o destaque; máscara de telefone
    await page.fill(`${F} [name=nome]`, "QA");
    assert.equal(await page.getAttribute(`${F} [name=nome]`, "aria-invalid"), null, "corrigir o campo deve remover aria-invalid");
    await page.locator(`${F} [name=telefone]`).pressSequentially("11987654321");
    assert.equal(await page.inputValue(`${F} [name=telefone]`), "(11) 98765-4321", "máscara (00) 00000-0000");
    await ctx.close();
  });

  test("diagnóstico: envio válido → 201, formulário substituído por .form__done com botão de WhatsApp; lead gravado", { timeout: 60_000 }, async () => {
    const { ctx, page, issues } = await openPage(browser, { width: 1440 });
    await goto(page, "/contato/");
    await dismissCookie(page);
    const mail = email("ok");
    await fillDiagnostico(page, mail);
    await setTs(page, F, 10_000);
    const res = await submit(page, F, "/api/contato");
    assert.equal(res.status(), 201, `esperado 201, veio ${res.status()}: ${res.status() === 201 ? "" : await res.text().catch(() => "")}`);
    await page.locator(`${F} .form__done`).waitFor({ state: "visible", timeout: 5000 });
    assert.match(await page.textContent(`${F} .form__done h3`), /Recebemos/);
    const wa = page.locator(`${F} .form__done a.btn--wa`);
    assert.equal(await wa.count(), 1, "botão 'Adiantar pelo WhatsApp' deve existir");
    assert.match(await wa.getAttribute("href"), new RegExp(`^https://wa\\.me/${WA.comercial}\\?text=`));
    assert.equal(await wa.getAttribute("target"), "_blank");
    assert.match(await wa.getAttribute("rel"), /noopener/);
    await shotEl(page.locator("#diagnostico"), "contato-form-sucesso-1440.png");
    if (LOCAL) assert.equal(await leadStored("contato", mail), true, "lead deveria estar em data/contato.jsonl");
    assert.deepEqual(issues.pageErrors, []);
    await ctx.close();
  });

  test("diagnóstico: honeypot preenchido → servidor finge sucesso (200, não 201) e não grava lead", { timeout: 60_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    await goto(page, "/contato/");
    await dismissCookie(page);
    const mail = email("honeypot");
    await fillDiagnostico(page, mail);
    await page.evaluate((s) => { document.querySelector(s).elements.website.value = "http://spam.example"; }, F);
    await setTs(page, F, 10_000);
    const res = await submit(page, F, "/api/contato");
    assert.equal(res.status(), 200, "honeypot deve ser descartado com 200 (sucesso fingido)");
    await page.locator(`${F} .form__done`).waitFor({ state: "visible", timeout: 5000 }); // o robô não percebe
    if (LOCAL) assert.equal(await leadStored("contato", mail), false, "lead de honeypot não pode ser gravado");
    await ctx.close();
  });

  test("diagnóstico: envio em menos de 3 s após o carregamento (ts) → descartado em silêncio (200)", { timeout: 60_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    await goto(page, "/contato/");
    await dismissCookie(page);
    const mail = email("rapido");
    await fillDiagnostico(page, mail);
    await setTs(page, F, 0);
    const res = await submit(page, F, "/api/contato");
    assert.equal(res.status(), 200);
    if (LOCAL) assert.equal(await leadStored("contato", mail), false, "envio rápido demais não pode virar lead");
    await ctx.close();
  });

  test("diagnóstico: erro do servidor (500 simulado) → .form__msg.is-err com orientação; 422 real → mensagem do servidor", { timeout: 60_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    await goto(page, "/contato/");
    await dismissCookie(page);
    await fillDiagnostico(page, email("erro500"));
    await setTs(page, F, 10_000);
    await page.route("**/api/contato", (r) => r.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "Erro interno. Tente novamente ou fale conosco pelo WhatsApp." }) }));
    await page.click(`${F} [type=submit]`);
    await page.locator(`${F} .form__msg.is-err`).waitFor({ state: "visible", timeout: 5000 });
    const msg = await page.textContent(`${F} .form__msg`);
    assert.match(msg, /Erro interno/);
    assert.match(msg, /WhatsApp/);
    assert.equal(await page.locator(`${F} [name=nome]`).isVisible(), true, "formulário deve continuar na tela para nova tentativa");
    assert.equal(await page.getAttribute(`${F} [type=submit]`, "aria-busy"), null, "botão não pode ficar ocupado após o erro");
    await shotEl(page.locator("#diagnostico"), "contato-form-erro-1440.png");
    await page.unroute("**/api/contato");

    // 422 real: e-mail descartável é rejeitado pelo servidor
    await page.fill(`${F} [name=email]`, `qa-${RUN}@mailinator.com`);
    const res = await submit(page, F, "/api/contato");
    assert.equal(res.status(), 422);
    await page.locator(`${F} .form__msg.is-err`).waitFor({ state: "visible", timeout: 5000 });
    assert.match(await page.textContent(`${F} .form__msg`), /tempor/i);
    await ctx.close();
  });

  test("newsletter (rodapé): e-mail obrigatório validado; envio válido → 201, .form__msg.is-ok e formulário limpo", { timeout: 60_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    await goto(page, "/sobre/");
    await dismissCookie(page);
    const N = "form[data-form=newsletter]";
    await page.click(`${N} [type=submit]`);
    await page.waitForTimeout(300);
    assert.equal(await page.locator(`${N} .field.is-invalid input[name=email]`).count(), 1, "e-mail vazio deve ser destacado");
    assert.equal(await page.locator(`${N} .form__msg.is-err`).isVisible(), true);
    await page.fill(`${N} [name=email]`, "nao-e-email");
    await page.click(`${N} [type=submit]`);
    await page.waitForTimeout(300);
    assert.equal(await page.getAttribute(`${N} [name=email]`, "aria-invalid"), "true", "e-mail inválido deve ser destacado");
    const mail = email("news");
    await page.fill(`${N} [name=nome]`, "QA Newsletter");
    await page.fill(`${N} [name=email]`, mail);
    await setTs(page, N, 10_000);
    const res = await submit(page, N, "/api/newsletter");
    assert.equal(res.status(), 201, res.status() === 201 ? "" : await res.text().catch(() => ""));
    await page.locator(`${N} .form__msg.is-ok`).waitFor({ state: "visible", timeout: 5000 });
    assert.ok((await page.textContent(`${N} .form__msg`)).trim().length > 10);
    assert.equal(await page.inputValue(`${N} [name=email]`), "", "formulário deve ser limpo após o sucesso");
    if (LOCAL) assert.equal(await leadStored("newsletter", mail), true);
    await ctx.close();
  });

  test("carreira: link de currículo inválido é barrado; candidatura válida → 201 e .form__msg.is-ok", { timeout: 60_000 }, async () => {
    const { ctx, page } = await openPage(browser, { width: 1440 });
    await goto(page, "/carreira/");
    await dismissCookie(page);
    const C = "form[data-form=carreira]";
    await page.fill(`${C} [name=nome]`, "QA Candidato");
    await page.fill(`${C} [name=email]`, email("carreira"));
    await page.locator(`${C} [name=telefone]`).pressSequentially("11977776666");
    await page.selectOption(`${C} [name=vaga]`, { index: 1 });
    await page.fill(`${C} [name=curriculo]`, "linkedin.com/in/qa-sem-esquema");
    await page.check(`${C} [name=lgpd]`);
    await page.click(`${C} [type=submit]`);
    await page.waitForTimeout(300);
    assert.equal(await page.getAttribute(`${C} [name=curriculo]`, "aria-invalid"), "true", "URL sem https:// deve ser rejeitada localmente");
    await page.fill(`${C} [name=curriculo]`, "https://www.linkedin.com/in/qa-teste-bear");
    await setTs(page, C, 10_000);
    const res = await submit(page, C, "/api/carreira");
    assert.equal(res.status(), 201, res.status() === 201 ? "" : await res.text().catch(() => ""));
    await page.locator(`${C} .form__msg.is-ok`).waitFor({ state: "visible", timeout: 5000 });
    await ctx.close();
  });

  for (const [key, path, programa, width, step2] of [
    ["business-partner", "/parcerias/business-partner/", "Business Partner", 390, async (page) => {
      await page.selectOption("#pf-bp-perfil", { index: 1 });
      await page.selectOption("#pf-bp-rede", { index: 1 });
      await page.click("label.chip:has(input[name=setores][value='Saúde']) span");
      await page.click("label.chip:has(input[name=atuacao][value='Os dois']) span");
    }],
    ["business-partner-outsourcing", "/parcerias/business-partner-outsourcing/", "Business Partner Outsourcing", 1440, async (page) => {
      await page.fill("#pf-bpo-escritorio", "QA Contábil Ltda");
      await page.selectOption("#pf-bpo-carteira", { index: 1 });
      await page.click("label.chip:has(input[name=regimes][value='Lucro Real']) span");
      await page.selectOption("#pf-bpo-desafio", { index: 1 });
    }],
  ]) {
    test(`parceria ${programa} @${width}px: 2 etapas validadas, abre wa.me/${WA.parcerias} com mensagem codificada, registra lead e mostra .pform-done`, { timeout: 90_000 }, async () => {
      const { ctx, page, issues } = await openPage(browser, { width });
      await ctx.route(/^https:\/\/wa\.me\//, (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>wa stub</title>ok" }));
      await goto(page, path);
      await dismissCookie(page);
      const P = "form[data-wa-form]";
      const step = (n) => page.locator(`${P} .pform-step[data-step='${n}']`);
      await page.click(`${P} [data-next]`);
      await page.waitForTimeout(200);
      assert.equal(await step(2).isVisible(), false, "etapa 1 vazia não pode avançar");
      assert.equal(await page.evaluate(() => document.activeElement && document.activeElement.name), "nome", "reportValidity deve focar o primeiro campo inválido");
      await page.fill(`${P} [name=nome]`, "QA Parceiro Teste");
      await page.locator(`${P} [name=telefone]`).pressSequentially("11988887777");
      await page.fill(`${P} [name=email]`, email(key));
      await page.fill(`${P} [name=cidade]`, "São Paulo / SP");
      await page.click(`${P} [data-next]`);
      await step(2).waitFor({ state: "visible", timeout: 3000 });
      assert.equal(await step(1).isVisible(), false);
      await step2(page);
      // etapa 2 sem LGPD não envia
      const popups = [];
      ctx.on("page", (p) => popups.push(p));
      await page.click(`${P} [type=submit]`);
      await page.waitForTimeout(400);
      assert.equal(popups.length, 0, "sem consentimento LGPD não pode abrir o WhatsApp");
      await page.check(`${P} input[name=lgpd]`);
      await setTs(page, P, 10_000); // anti-bot: o servidor descarta envios feitos < 3 s após o carregamento
      const popupP = ctx.waitForEvent("page", { timeout: 8000 });
      const respP = page.waitForResponse((r) => r.url().includes("/api/parceria") && r.request().method() === "POST", { timeout: 15_000 });
      await page.click(`${P} [type=submit]`);
      const popup = await popupP;
      await popup.waitForLoadState();
      const url = popup.url();
      const u = new URL(url);
      assert.equal(u.hostname, "wa.me");
      assert.equal(u.pathname, `/${WA.parcerias}`);
      assert.ok(/^[\x21-\x7E]+$/.test(url), "URL do WhatsApp deve estar totalmente codificada");
      const text = u.searchParams.get("text") || "";
      assert.match(text, new RegExp(`Quero ser \\*${programa}\\*`));
      assert.match(text, /\*Seu nome completo:\* QA Parceiro Teste/);
      assert.match(text, /\*WhatsApp:\* \(11\) 98888-7777/);
      assert.doesNotMatch(text, /lgpd|website/i, "mensagem não deve expor campos técnicos");
      const resp = await respP; // fetch keepalive: o corpo não é legível via Playwright — só o status
      assert.equal(resp.status(), 201, `lead de parceria deveria responder 201 (veio ${resp.status()})`);
      await page.locator(`${P} .pform-done`).waitFor({ state: "visible", timeout: 3000 });
      assert.equal(await page.getAttribute(`${P} [data-wa-open]`, "href"), url, "botão 'abrir novamente' deve reutilizar a mesma URL");
      await shot(page, `parceria-wa-${width}.png`);
      assert.deepEqual(issues.pageErrors, []);
      await ctx.close();
    });
  }
});
