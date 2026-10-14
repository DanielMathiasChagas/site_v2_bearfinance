// =====================================================================
// Gera o site estático em /public a partir de src/data.js
// Arquitetura de informação mantida; camada visual conforme
// docs/design/design-system.md. `public/` é gerado: não edite à mão.
// =====================================================================
import { mkdir, writeFile, cp, rm, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as D from "./data.js";
import { BR } from "./brazil-geo.js";
import { ico as icoRaw } from "./icons.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public");
const ASSETS = join(ROOT, "src/assets");
const S = D.site;
const TODAY = new Date().toISOString().slice(0, 10);

/* =====================================================================
   UTILITÁRIOS
   ===================================================================== */
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const strip = (s) => String(s ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const img = (f) => `/assets/img/${f}`;
const has = (rel) => existsSync(join(ASSETS, rel));
const art = (f) => (has(`img/art/${f}`) ? `/assets/img/art/${f}` : "");
const isPh = (src) => /\/(ph-\d+|hero|avatar)\.svg$/.test(src);
const fmtDate = (d) => { const [y, m, dd] = d.split("-"); return `${dd}/${m}/${y}`; };
const fmtDateLong = (d) => new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
const hashOf = async (rel) => { try { return createHash("md5").update(await readFile(join(ASSETS, rel))).digest("hex").slice(0, 8); } catch { return "0"; } };
const VER = {
  css: await hashOf("css/site.css"), js: await hashOf("js/site.js"),
  brcss: await hashOf("css/brmap.css"), brjs: await hashOf("js/brmap.js"),
  geo: createHash("md5").update(JSON.stringify(BR)).digest("hex").slice(0, 8),
};
const ICON_MAP = { "fa-calculator": "calculator", "fa-chart-line": "chart-line", "fa-users": "users", "fa-magnifying-glass-chart": "search-chart", "fa-sitemap": "sitemap", "fa-industry": "factory", "fa-wheat-awn": "wheat", "fa-stethoscope": "stethoscope", "fa-helmet-safety": "hard-hat", "fa-truck-fast": "truck", "fa-store": "store", "fa-bolt": "bolt", "fa-laptop-code": "code", "fa-handshake": "handshake", "fa-shield-halved": "shield", "fa-lightbulb": "lightbulb", "fa-trophy": "trophy", "fa-leaf": "leaf", "fa-people-group": "people", "fa-scale-balanced": "scale", "fa-chart-column": "chart-bar", "fa-building-columns": "bank", "fa-users-gear": "users-gear", "fa-gauge-high": "gauge", "fa-robot": "cpu", "fa-lock": "lock" };
const ico = (n = "", cls = "") => icoRaw(ICON_MAP[n] || String(n).replace(/^fa-/, ""), cls);

const WA_NUM = S.whatsappNumber || String(S.phoneHref || "").replace(/\D/g, "") || "5511983148774";
const wa = (text = "") => `https://wa.me/${WA_NUM}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
const WA_DEFAULT = D.conversion?.whatsappText || "Olá! Quero conversar sobre a contabilidade da minha empresa com a Bear Finance.";
const SEO = D.seo || {};
const seo = (key, title, description) => ({ title: SEO[key]?.title || title, description: SEO[key]?.description || description });
const FO = D.formOptions || { segmentos: [...D.verticals.map((v) => v.name), "Outro"], servicos: [...D.services.map((s) => s.name), "Ainda não sei"] };
const VP = D.valueProp;
const DIFF = D.differentials;
const METHOD = D.method;
const CONV = D.conversion;
const SEGI = D.segmentsIntro;
const PLAT = D.platformTeaser;
const PRES = D.presence;

// Artes por serviço/segmento (entregues pelo creative-director); placeholders enquanto não existirem
const SVC_ART = { contabilidade: "svc-contabilidade.svg", "bpo-financeiro": "svc-bpo-financeiro.svg", "bpo-de-folha-de-pagamento": "svc-folha.svg", "auditoria-consultoria-tributaria": "svc-auditoria.svg", "estruturacoes-corporativas": "svc-estruturacoes.svg" };
const SEG_ART = { "contabilidade-industria": "seg-industria.svg", "contabilidade-agronegocio": "seg-agronegocio.svg", "contabilidade-saude": "seg-saude.svg", "contabilidade-mercado-imobiliario-e-construcao-civil": "seg-construcao.svg", "contabilidade-transportes-e-logistica": "seg-logistica.svg", "contabilidade-varejo-e-distribuicao": "seg-varejo.svg", "contabilidade-energia": "seg-energia.svg", "contabilidade-servicos": "seg-servicos.svg" };
const svcImg = (s) => art(SVC_ART[s.slug]) || img(s.img);
const segImg = (v) => art(SEG_ART[v.slug]) || img(v.img);
const segOf = (name) => D.verticals.find((v) => v.name === name);
const PLAT_ART = art("tech-plataforma.svg");
const HERO_ART = art("hero-neural.svg");
const CTA_ART = art("cta-banner.svg");
const OG_URL = S.url + img(has("img/og-image.jpg") ? "og-image.jpg" : "og-image.png");
// pôsteres de vídeo por página (variados, para não repetir a mesma arte)
const POSTER = { home: HERO_ART, sobre: art("svc-estruturacoes.svg"), cases: art("seg-industria.svg"), contato: art("svc-contabilidade.svg"), parcerias: art("svc-bpo-financeiro.svg"), plataforma: PLAT_ART, esg: art("seg-energia.svg"), verticais: art("seg-agronegocio.svg"), servicos: PLAT_ART };
const raster = (base) => (has(`img/${base}.webp`) ? img(`${base}.webp`) : img(`${base}.jpg`));

const ORG_LD = {
  "@context": "https://schema.org", "@type": ["AccountingService", "Organization"], "@id": `${S.url}/#org`,
  name: S.name, url: S.url, logo: S.url + img("URSO_GEOMETRICO_PURPLE.png"), description: strip(S.description || S.tagline),
  email: S.email, telephone: "+" + WA_NUM, areaServed: "BR",
  address: { "@type": "PostalAddress", streetAddress: "Rua Riachuelo, 231 – 4º andar", addressLocality: "São Paulo", addressRegion: "SP", postalCode: "01007-000", addressCountry: "BR" },
  ...(S.socialConfirmed ? { sameAs: [S.linkedin, S.instagram, S.youtube].filter(Boolean) } : {}), // perfis sociais entram no JSON-LD só depois de confirmados
};
const breadcrumbLd = (items) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [["Início", "/"], ...items].map(([t, h], i) => ({ "@type": "ListItem", position: i + 1, name: strip(t), ...(h ? { item: S.url + h } : {}) })) });
const faqLd = (items) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: strip(q), acceptedAnswer: { "@type": "Answer", text: strip(a) } })) });

/* =====================================================================
   LAYOUT
   ===================================================================== */
const brand = () => `<a class="brand" href="/"><img src="${has("img/URSO_GEOMETRICO_PURPLE.webp") ? img("URSO_GEOMETRICO_PURPLE.webp") : img("URSO_GEOMETRICO_PURPLE.png")}" alt="" width="44" height="44" decoding="async"><span>BEAR FINANCE<small>Inteligência contábil</small></span></a>`;
const social = () => [["linkedin", S.linkedin, "LinkedIn"], ["instagram", S.instagram, "Instagram"], ["youtube", S.youtube, "YouTube"], ["whatsapp", wa(WA_DEFAULT), "WhatsApp"]].filter(([, h]) => h).map(([i, h, l]) => `<li><a href="${h}" target="_blank" rel="noopener" aria-label="${l}">${ico(i)}</a></li>`).join("");

const NAV = () => [
  { key: "sobre", label: "Sobre", href: "/sobre/", items: [["A Bear Finance", "/sobre/", "Quem somos e como trabalhamos"], ["ESG", "/esg/", "Compromissos e práticas"], ["Carreira", "/carreira/", "Cultura e banco de talentos"], ["Casos de uso", "/cases/", "Situações que resolvemos"]] },
  { key: "atuacao", label: "Soluções", href: "/atuacao/", items: D.services.map((s) => [s.name, `/atuacao/${s.slug}/`, ""]) },
  { key: "verticais", label: "Segmentos", href: "/verticais/", wide: true, items: D.verticals.map((v) => [v.name, `/verticais/${v.slug}/`, v.short]) },
  { key: "parcerias", label: "Parcerias", href: "/parcerias/", items: [["Programas de parceria", "/parcerias/", "Visão geral dos dois programas"], ...D.partnerPrograms.map((p) => [p.name, `/parcerias/${p.slug}/`, p.short])] },
  { key: "plataforma", label: "Plataforma", href: "/plataforma/" },
  { key: "conteudo", label: "Conteúdo", href: "/conteudo/" },
  { key: "contato", label: "Contato", href: "/contato/", mobile: true },
];

function header(active) {
  const li = NAV().map((n) => {
    const cur = active === n.key;
    const cls = ["nav__item", n.items ? "has-sub" : "", cur ? "is-current" : "", n.mobile ? "nav__mobile-only" : ""].filter(Boolean).join(" ");
    const link = `<a class="nav__link" href="${n.href}"${cur ? ' aria-current="page"' : ""}>${n.label}</a>`;
    if (!n.items) return `<li class="${cls}">${link}</li>`;
    const id = `sub-${n.key}`;
    return `<li class="${cls}">${link}<button class="nav__link" type="button" aria-expanded="false" aria-controls="${id}" aria-label="Abrir submenu ${n.label}">${ico("chevron-down")}</button><div class="nav__panel${n.wide ? " nav__panel--wide" : ""}" id="${id}"><ul>${n.items.map(([t, h, d]) => `<li><a href="${h}">${t}${d ? `<small>${d}</small>` : ""}</a></li>`).join("")}</ul></div></li>`;
  }).join("");
  return `
<header class="hdr" id="masthead">
  <div class="inner hdr__in">
    ${brand()}
    <nav class="nav" id="site-navigation" aria-label="Menu principal">
      <ul class="nav__list">${li}<li class="nav__item nav__cta"><a class="btn btn--sm" href="/contato/#diagnostico" data-track="cta_click" data-label="header">Solicitar diagnóstico</a></li></ul>
      <div class="nav__foot"><a href="${wa(WA_DEFAULT)}" target="_blank" rel="noopener">${ico("whatsapp")} ${S.phone}</a><a href="mailto:${S.email}">${ico("mail")} ${S.email}</a></div>
    </nav>
    <div class="hdr__tools">
      <a class="hdr__wa" href="${wa(WA_DEFAULT)}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp" data-track="whatsapp_click">${ico("whatsapp")}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="Abrir menu"><span></span></button>
    </div>
  </div>
</header>`;
}

const newsletter = () => `
<div class="nl" id="newsletter"><div class="inner"><div class="nl__card">
  <div><p class="eyebrow">Newsletter</p><h2>Inteligência contábil <strong>na sua caixa de entrada</strong></h2><p>Artigos, mudanças na legislação e materiais práticos para quem decide. Sem spam; cancele quando quiser.</p></div>
  <form class="form form--dark" data-api="/api/newsletter" data-form="newsletter" novalidate>
    <input type="hidden" name="ts" value="">
    <div class="form__grid">
      <label class="field"><span>Nome</span><input type="text" name="nome" autocomplete="name" maxlength="120"></label>
      <label class="field"><span>E-mail <em>*</em></span><input type="email" name="email" autocomplete="email" required maxlength="160"><small class="field__err">Informe um e-mail válido.</small></label>
      <label class="field"><span>Empresa</span><input type="text" name="empresa" autocomplete="organization" maxlength="120"></label>
      <label class="field"><span>Telefone</span><input type="tel" name="telefone" autocomplete="tel" data-mask="phone" placeholder="(11) 90000-0000"></label>
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="form__actions"><p class="form__note">${ico("lock")} Seus dados ficam com a Bear.</p><button class="btn" type="submit">Assinar ${ico("arrow-right")}</button></div>
      <p class="form__msg" role="status" aria-live="polite"></p>
    </div>
  </form>
</div></div></div>`;

function footer(waHref) {
  const year = new Date().getFullYear();
  return `
<footer class="foot" id="colophon">
  ${newsletter()}
  <div class="inner foot__grid">
    <div class="foot__brand">${brand()}<p>${S.description || S.tagline}</p><ul class="social" aria-label="Redes sociais">${social()}</ul></div>
    <nav class="foot__col" aria-label="Soluções"><h3>Soluções</h3><ul>${D.services.map((s) => `<li><a href="/atuacao/${s.slug}/">${s.name}</a></li>`).join("")}<li><a href="/plataforma/">Plataforma Bear</a></li></ul></nav>
    <nav class="foot__col" aria-label="Segmentos"><h3>Segmentos</h3><ul>${D.verticals.map((v) => `<li><a href="/verticais/${v.slug}/">${v.name}</a></li>`).join("")}</ul></nav>
    <nav class="foot__col" aria-label="Institucional"><h3>Institucional</h3><ul><li><a href="/sobre/">Sobre a Bear</a></li><li><a href="/esg/">ESG</a></li><li><a href="/carreira/">Carreira</a></li><li><a href="/cases/">Casos de uso</a></li><li><a href="/parcerias/">Parcerias</a></li><li><a href="/conteudo/">Conteúdo</a></li><li><a href="/contato/">Contato</a></li></ul></nav>
    <div class="foot__col foot__contact"><h3>Contato</h3><address><strong>${S.city}</strong><br>${S.address}<br><a href="${wa(WA_DEFAULT)}" target="_blank" rel="noopener">${S.phone} · WhatsApp</a><br><a href="mailto:${S.email}">${S.email}</a><br><span>Atendimento digital em todo o Brasil</span></address></div>
  </div>
  <div class="inner foot__legal">
    <p>© ${year} ${S.name}${S.razaoSocial ? ` · ${S.razaoSocial}` : ""}${S.cnpj ? ` · CNPJ ${S.cnpj}` : ""}. Todos os direitos reservados.</p>
    <p class="foot__dmc">Parte do ecossistema ${S.dmcUrl ? `<a href="${S.dmcUrl}" target="_blank" rel="noopener">${S.dmcName}</a>` : `<strong>${S.dmcName || "Complexo DMC"}</strong>`}</p>
    <nav aria-label="Políticas"><a href="/privacidade/">Privacidade</a><a href="/privacidade/#cookies">Cookies</a></nav>
  </div>
<div class="foot__floats"><a class="totop" href="#top" aria-label="Voltar ao topo">${ico("chevron-up")}</a>
<a class="wa-float" href="${waHref}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp" data-track="whatsapp_click">${ico("whatsapp")}</a>
<div class="cookie is-light" hidden role="region" aria-label="Aviso de cookies"><p><strong>Cookies.</strong> Usamos cookies essenciais para o site funcionar e, se você permitir, de desempenho para melhorá-lo. Veja a <a href="/privacidade/#cookies">Política de Cookies</a>.</p><div class="cookie__btns"><button class="btn btn--sm btn--dark" type="button" data-cookie="accept">Aceitar</button><button class="btn btn--sm btn--outline" type="button" data-cookie="reject">Só essenciais</button></div></div></div>`;
}

// Corpo dentro de <main>: remove o <main> interno das páginas e, quando a página não tem a seção de
// diagnóstico, redireciona as âncoras #diagnostico para /contato/#diagnostico (evita âncora sem destino).
const mainBody = (body) => {
  const inner = body.replace('<main id="main" class="site-main">', "").replace("</main>", "");
  return /\sid="diagnostico"/.test(inner) ? inner : inner.replace(/href="#diagnostico"/g, 'href="/contato/#diagnostico"');
};
function page({ key = "", title, description, active = "", bodyClass = "", body, path = "/", jsonld = [], crumbs = null, waHref = wa(WA_DEFAULT), ogType = "website", extraHead = "", extraScripts = "", noindex = false }) {
  const url = S.url + path;
  const ogFile = has("img/og-image.jpg") ? "og-image.jpg" : has("img/og-image.png") ? "og-image.png" : "";
  const hasOg = Boolean(ogFile);
  const ogImage = S.url + (hasOg ? img(ogFile) : img("URSO_GEOMETRICO_PURPLE.png"));
  const favSvg = art("favicon.svg");
  const apple = has("img/apple-touch-icon.png") ? "/assets/img/apple-touch-icon.png" : img("URSO_GEOMETRICO_PURPLE.png");
  const favPng = has("img/icon-192.png") ? "/assets/img/icon-192.png" : img("URSO_GEOMETRICO_PURPLE.png"); // PNG leve (13 KB) para navegadores sem favicon SVG
  const favSizes = favPng.endsWith("icon-192.png") ? " sizes=\"192x192\"" : "";
  const ogAlt = `${S.name} — ${strip(S.tagline)}`;
  // Fonte self-hosted (Plus Jakarta Sans variável, SIL OFL): tira o CSS bloqueante de terceiro do caminho crítico e antecipa o swap.
  // Se os arquivos não existirem, volta para o Google Fonts.
  const fontLatin = has("fonts/plus-jakarta-sans-latin.woff2") ? "/assets/fonts/plus-jakarta-sans-latin.woff2?v=1" : "";
  const fontLatinExt = has("fonts/plus-jakarta-sans-latin-ext.woff2") ? "/assets/fonts/plus-jakarta-sans-latin-ext.woff2?v=1" : "";
  const fontFace = (u, range) => `@font-face{font-family:"Plus Jakarta Sans";font-style:normal;font-weight:300 800;font-display:swap;src:url(${u}) format("woff2");unicode-range:${range}}`;
  const fontHead = fontLatin
    ? `<link rel="preload" href="${fontLatin}" as="font" type="font/woff2" crossorigin>
<style>${fontFace(fontLatin, "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD")}${fontLatinExt ? fontFace(fontLatinExt, "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF") : ""}</style>`
    : `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap">`;
  const ld = [ORG_LD, ...(crumbs ? [breadcrumbLd(crumbs)] : []), ...jsonld];
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${noindex ? "noindex" : "index,follow,max-image-preview:large"}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(S.name)}">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="${hasOg ? 1200 : 500}">
<meta property="og:image:height" content="${hasOg ? 630 : 500}">
<meta property="og:image:type" content="${/\.jpe?g$/i.test(ogImage) ? "image/jpeg" : "image/png"}">
<meta property="og:image:alt" content="${esc(ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
<meta name="twitter:image:alt" content="${esc(ogAlt)}">
<meta name="theme-color" content="#07050d">
${favSvg ? `<link rel="icon" href="${favSvg}" type="image/svg+xml">` : ""}
<link rel="icon" href="${favPng}" type="image/png"${favSizes}>
<link rel="apple-touch-icon" href="${apple}">
${fontHead}
<link rel="stylesheet" href="/assets/css/site.css?v=${VER.css}">
${extraHead}
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
</head>
<body class="${[bodyClass, S.placeholderLabels === false ? "hide-ph" : ""].filter(Boolean).join(" ")}" data-page="${key || active || "home"}">
<a class="skip" href="#main">Ir para o conteúdo</a>
<span id="top"></span>
${header(active)}
<main id="main" class="site-main">
${mainBody(body)}
</main>
${footer(waHref)}
<script src="/assets/js/site.js?v=${VER.js}" defer></script>
${extraScripts}
</body>
</html>`;
}

/* =====================================================================
   COMPONENTES
   ===================================================================== */
const crumbsNav = (items) => `<nav class="crumbs" aria-label="Navegação estrutural"><ol><li><a href="/">Início</a></li>${items.map(([t, h], i) => `<li>${h && i < items.length - 1 ? `<a href="${h}">${t}</a>` : `<span aria-current="page">${t}</span>`}</li>`).join("")}</ol></nav>`;

const sectionHead = ({ eyebrow = "", h2, p = "", two = false, center = false, cls = "" }) => `
<div class="shead${two ? " shead--two" : ""}${center ? " shead--center" : ""}${cls ? " " + cls : ""} reveal">
  <div class="shead__t">${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}<h2>${h2}</h2>${!two && p ? `<p class="lead">${p}</p>` : ""}</div>
  ${two && p ? `<div class="shead__p"><p class="lead">${p}</p></div>` : ""}
</div>`;

const media = (src, alt = "", { cls = "", ratio = "", eager = false, w = 1200, h = 800, kb = true } = {}) => `<div class="media${cls ? " " + cls : ""}${kb ? " kb" : ""}${isPh(src) ? " ph" : ""}"${ratio ? ` style="--ratio:${ratio}"` : ""}><img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}></div>`;

const iconCard = ({ icon, title, text }, { glass = false, n = "" } = {}) => `<article class="card${glass ? " card--glass" : ""}">${n ? `<span class="card__n" aria-hidden="true">${n}</span>` : ""}<span class="card__ico">${ico(icon)}</span>${title ? `<h3>${title}</h3>` : ""}<p>${text}</p></article>`;
const svcCard = (s) => `<article class="card card--svc"><span class="card__ico">${ico(s.icon)}</span><h3><a href="/atuacao/${s.slug}/">${s.name}</a></h3><p>${s.excerpt}</p><span class="link">Saiba mais ${ico("arrow-right")}</span></article>`;
const stepsBlock = (steps) => `<ol class="steps reveal-group">${steps.map((st, i) => `<li class="step" style="--i:${i}"><span class="step__n" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><h3>${st.title}</h3><p>${st.text}</p></li>`).join("")}</ol>`;
const factsBlock = (facts, cls = "") => (facts && facts.length ? `<ul class="facts${cls ? " " + cls : ""} reveal-group">${facts.map((f, i) => `<li class="fact" style="--i:${i}"><strong>${f.value}</strong><span>${f.label}</span></li>`).join("")}</ul>` : "");
const grid = (items, cls = "grid3") => `<div class="${cls} reveal-group">${items.map((h, i) => h.replace(/^<(\w+)/, `<$1 style="--i:${i}"`)).join("")}</div>`;

const curve = (target, { to = "light", from = "deep" } = {}) => `
<div class="curve${to === "soft" ? " curve--soft" : ""}${from === "dark" ? " curve--from-dark" : ""}"><svg viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true"><path d="M0,0 H1440 V0 C1260,0 1160,6 1040,33 C930,58 860,110 720,110 C580,110 510,58 400,33 C280,6 180,0 0,0 Z"/></svg><a class="curve__btn" href="${target}" aria-label="Rolar para o conteúdo">${ico("chevron-down")}</a></div>`;

const ctaPair = (waText, href = "#diagnostico", label = "Solicitar diagnóstico") => `<div class="actions"><a class="btn btn--lg" href="${href}" data-track="cta_click">${label} ${ico("arrow-right")}</a><a class="wa-inline" href="${wa(waText)}" target="_blank" rel="noopener" data-track="whatsapp_click">${ico("whatsapp")} Falar no WhatsApp</a></div>`;

const videoBox = ({ id = "", title = "Vídeo", sub = "", poster = "" }) => `
<div class="video"><button class="video__poster${isPh(poster) ? " ph" : ""}" type="button" ${id ? `data-embed="${id}"` : ""} data-title="${esc(title)}" aria-label="Reproduzir: ${esc(title)}">${poster ? `<img src="${poster}" alt="" width="1200" height="675" loading="lazy" decoding="async">` : ""}<span class="video__play">${ico("play")}</span><span class="video__label">${title}<small>${sub}${id ? "" : " · em breve"}</small></span></button></div>`;
const videoSection = (v, h2, p, { poster = "", sid = "video", dark = true } = {}) => `
<section id="${sid}" class="sec ${dark ? "sec--dark" : "sec--light"}"><div class="inner vsec">
  <div class="vsec__t reveal"><h2>${h2}</h2><p class="lead">${p}</p></div>
  <div class="vsec__m reveal">${videoBox({ ...v, poster })}</div>
</div></section>`;
const videoInline = (v, h2, poster) => `
<section class="sec sec--light pt0"><div class="inner vsec vsec--rev"><div class="vsec__t reveal"><h2>${h2}</h2><p class="lead">${v.sub || ""}</p></div><div class="vsec__m reveal">${videoBox({ ...v, poster })}</div></div></section>`;

const faqBlock = (items, { title = "Perguntas <strong>frequentes</strong>", lead = "O que os empresários mais nos perguntam antes de começar.", pre = "faq" } = {}) => `
<section id="faq" class="sec sec--light faq"><div class="inner faq__in">
  <div class="faq__head reveal"><p class="eyebrow">Dúvidas</p><h2>${title}</h2><p class="lead">${lead}</p><a class="link" href="#diagnostico">Não encontrou? Fale com a gente ${ico("arrow-right")}</a></div>
  <div class="faq__list reveal">${items.map(([q, a], i) => `<div class="faq__item"><h3><button class="faq__q" type="button" aria-expanded="false" aria-controls="${pre}-${i}" id="${pre}-q-${i}">${q}<span class="faq__ico">${ico("plus")}</span></button></h3><div class="faq__a" id="${pre}-${i}" role="region" aria-labelledby="${pre}-q-${i}" hidden><p>${a}</p></div></div>`).join("")}</div>
</div></section>`;

const erpSection = (h2 = "Operamos no <strong>ERP que a sua empresa já usa</strong>", p = "Integração com os principais sistemas de gestão do mercado, sem retrabalho e sem duplicidade de lançamentos.") => `
<section id="erps" class="sec sec--soft"><div class="inner">${sectionHead({ eyebrow: "Integrações", h2, p, two: true })}<ul class="erps reveal-group" aria-label="ERPs integrados">${D.erps.map((e, i) => `<li style="--i:${i}">${ico("cube")}${e}</li>`).join("")}</ul></div></section>`;

const quoteBand = (html) => `<section class="band band--quote"><div class="inner reveal">${ico("quote")}<p>${html}</p></div></section>`;
const ctaBand = (text, { btn = "Solicitar diagnóstico", href = "#diagnostico", waText = "" } = {}) => `
<section class="band band--cta"><div class="inner"><p class="reveal">${text}</p><div class="actions reveal"><a class="btn" href="${href}" data-track="cta_click">${btn} ${ico("arrow-right")}</a>${waText ? `<a class="wa-inline" href="${wa(waText)}" target="_blank" rel="noopener" data-track="whatsapp_click">${ico("whatsapp")} WhatsApp</a>` : ""}</div></div></section>`;

const platformTeaser = () => `
<section class="sec teaser"><div class="inner">
  <div class="reveal"><p class="eyebrow">${PLAT.eyebrow}</p><h2>${PLAT.h2}</h2><p class="lead">${PLAT.p}</p><ul class="checks">${PLAT.bullets.map((b) => `<li>${b}</li>`).join("")}</ul><div class="actions"><a class="btn" href="/plataforma/">Conhecer a plataforma ${ico("arrow-right")}</a></div></div>
  <div class="teaser__art reveal">${PLAT_ART ? `<img src="${PLAT_ART}" alt="Ilustração da Plataforma Bear: painéis financeiros conectados" width="1200" height="900" loading="lazy" decoding="async">` : media(raster("SISTEMA"), "Ilustração da Plataforma Bear", { ratio: "4/5", cls: "media--shadow", w: 1024, h: 1536 })}</div>
</div></section>`;

function diagForm({ servico = "", segmento = "", waText = "", level = 3, title = "Solicite um diagnóstico", intro = "Preencha os dados. Um especialista do seu setor analisa o cenário e retorna com os próximos passos." } = {}) {
  const opt = (list, sel) => `<option value="">Selecione</option>` + list.map((o) => `<option${o === sel ? " selected" : ""}>${o}</option>`).join("");
  return `
<div class="fcard">
  <h${level}>${title}</h${level}><p>${intro}</p>
  <form class="form" id="form-diagnostico" data-api="/api/contato" data-form="diagnostico" data-wa="${wa(waText || WA_DEFAULT)}" novalidate>
    <input type="hidden" name="origem" value=""><input type="hidden" name="ts" value="">
    <div class="form__grid">
      <label class="field"><span>Nome <em>*</em></span><input type="text" name="nome" autocomplete="name" required minlength="2" maxlength="120"><small class="field__err">Informe seu nome.</small></label>
      <label class="field"><span>Empresa <em>*</em></span><input type="text" name="empresa" autocomplete="organization" required minlength="2" maxlength="120"><small class="field__err">Informe a empresa.</small></label>
      <label class="field"><span>E-mail corporativo <em>*</em></span><input type="email" name="email" autocomplete="email" required maxlength="160" inputmode="email"><small class="field__err">Informe um e-mail válido.</small></label>
      <label class="field"><span>Telefone / WhatsApp <em>*</em></span><input type="tel" name="telefone" autocomplete="tel" required inputmode="tel" data-mask="phone" minlength="14" placeholder="(11) 90000-0000"><small class="field__err">Informe um telefone com DDD.</small></label>
      <label class="field"><span>Segmento <em>*</em></span><select name="segmento" required>${opt(FO.segmentos, segmento)}</select><small class="field__err">Selecione o segmento.</small></label>
      <label class="field"><span>Serviço de interesse <em>*</em></span><select name="servico" required>${opt(FO.servicos, servico)}</select><small class="field__err">Selecione um serviço.</small></label>
      <label class="field form__row"><span>Mensagem <small>(opcional)</small></span><textarea name="mensagem" maxlength="2000" rows="4" placeholder="Conte brevemente como é a operação hoje: regime, sistemas, volume."></textarea></label>
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="consent"><input type="checkbox" name="lgpd" value="sim" required><span>Autorizo a Bear Finance a entrar em contato e tratar meus dados conforme a <a href="/privacidade/" target="_blank" rel="noopener">Política de Privacidade</a>.</span></label>
      <div class="form__actions"><button class="btn" type="submit" data-track="form_submit">${CONV.primary?.label || "Solicitar diagnóstico"} ${ico("arrow-right")}</button><p class="form__note">${ico("lock")} Dados protegidos. Sem spam.</p></div>
      <p class="form__msg" role="status" aria-live="polite"></p>
    </div>
  </form>
</div>`;
}

const conversion = (preset = {}) => `
<section id="diagnostico" class="sec sec--dark conv">
  ${CTA_ART ? `<div class="conv__art" aria-hidden="true"><img src="${CTA_ART}" alt="" width="1600" height="600" loading="lazy" decoding="async"></div>` : ""}
  <div class="inner conv__in">
    <div class="conv__copy reveal"><p class="eyebrow">${CONV.eyebrow}</p><h2>${CONV.h2}</h2><p class="lead">${CONV.p}</p><ul class="checks">${(CONV.bullets || []).map((b) => `<li>${b}</li>`).join("")}</ul><a class="btn btn--wa" href="${wa(preset.waText || WA_DEFAULT)}" target="_blank" rel="noopener" data-track="whatsapp_click">${ico("whatsapp")} Falar no WhatsApp</a></div>
    <div class="conv__form reveal">${diagForm(preset)}</div>
  </div>
</section>`;

// Mapa do Brasil por UF (malha IBGE em src/brazil-geo.js): fallback estático e acessível do mapa neural
function brazilMap() {
  const { w, h, states, capitals } = BR;
  const sp = capitals.find((c) => c.uf === "SP");
  const arcs = capitals.filter((c) => c !== sp).map((c, i) => {
    const mx = (sp.x + c.x) / 2, my = (sp.y + c.y) / 2, dx = c.x - sp.x, dy = c.y - sp.y, k = 0.18;
    return `<path d="M${sp.x},${sp.y} Q${(mx - dy * k).toFixed(1)},${(my + dx * k).toFixed(1)} ${c.x},${c.y}" style="animation-delay:${(i * 0.23).toFixed(2)}s"/>`;
  }).join("");
  const ufs = states.map((s) => `<path class="uf${s.uf === "SP" ? " uf--sede" : ""}" d="${s.d}"><title>${s.name}</title></path>`).join("");
  const dots = capitals.filter((c) => c !== sp).map((c, i) => `<circle cx="${c.x}" cy="${c.y}" r="4.5" style="animation-delay:${(i * 0.23 + 1.2).toFixed(2)}s"><title>${c.city} – ${c.uf}</title></circle>`).join("");
  const lx = w + 20, ly = sp.y + 60;
  return `<svg class="br-map" viewBox="0 0 ${w + 210} ${h}" role="img" aria-label="Mapa do Brasil: sede em São Paulo e atendimento digital nos 26 estados e no Distrito Federal">
  <defs><radialGradient id="br-glow"><stop offset="0" stop-color="#8b5cf6" stop-opacity=".55"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient></defs>
  <g class="br-ufs">${ufs}</g><g class="br-arcs">${arcs}</g><g class="br-caps">${dots}</g>
  <circle cx="${sp.x}" cy="${sp.y}" r="70" fill="url(#br-glow)"/><circle class="br-pulse" cx="${sp.x}" cy="${sp.y}" r="10"/><circle cx="${sp.x}" cy="${sp.y}" r="9" fill="#fff"/>
  <polyline class="br-callout" points="${sp.x + 12},${sp.y + 8} ${sp.x + 60},${ly} ${lx - 10},${ly}"/><text class="br-label" x="${lx}" y="${ly + 8}">São Paulo</text><text class="br-sub" x="${lx}" y="${ly + 36}">Sede</text>
  <g class="br-legend" transform="translate(${lx} ${h - 70})"><circle cx="8" cy="0" r="8" fill="#fff"/><text x="26" y="7">Sede</text><circle cx="8" cy="34" r="5"/><text x="26" y="41">Atendimento digital</text></g>
</svg>`;
}
const neuralMap = () => `
<div class="br-neural" data-brmap data-focus="SP"${has("js/brmap.js") ? ` data-geo="/assets/js/brazil-geo.js?v=${VER.geo}" data-src="/assets/js/brmap.js?v=${VER.brjs}"` : ""}>
  <canvas class="br-neural__canvas" aria-hidden="true"></canvas>
  <div class="br-neural__fallback">${art("brasil-presenca.svg") ? `<img src="${art("brasil-presenca.svg")}" alt="Mapa do Brasil com sede em São Paulo e conexões digitais com todas as capitais" width="900" height="900" loading="lazy" decoding="async">` : brazilMap()}</div>
  <div class="br-neural__label" aria-hidden="true"><strong>São Paulo</strong><span>Sede</span></div>
</div>`;
const MAP_HEAD = has("css/brmap.css") ? `<link rel="stylesheet" href="/assets/css/brmap.css?v=${VER.brcss}">` : "";
const MAP_SCRIPTS = ""; // brazil-geo.js + brmap.js são injetados pelo site.js só em desktop com ponteiro fino (mobile usa a imagem estática)

const phead = ({ crumbs, eyebrow = "", h1, p = "", actions = "", art: a = "", side = "", cls = "", list = [], extra = "" }) => `
<header class="phead${cls ? " " + cls : ""}">
  <div class="phead__bg" aria-hidden="true">${a ? `<img src="${a}" alt="" width="1200" height="800" fetchpriority="high" decoding="async">` : ""}</div>
  <div class="inner phead__in">
    ${crumbsNav(crumbs)}
    <div class="phead__grid${side ? " has-side" : ""}">
      <div class="phead__t">${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}<h1>${h1}</h1>${p ? `<p class="lead">${p}</p>` : ""}${list.length ? `<ul class="checks">${list.map((l) => `<li>${l}</li>`).join("")}</ul>` : ""}${actions}</div>
      ${side ? `<div class="phead__side">${side}</div>` : ""}
    </div>
    ${extra}
  </div>
</header>`;

const postCard = (p) => `
<article class="post" data-category="${esc(p.cat)}">
  <div class="post__img${isPh(img(p.img)) ? " ph" : ""}"><img src="${img(p.img)}" alt="" width="1200" height="750" loading="lazy" decoding="async"></div>
  <div class="post__meta"><a href="/conteudo/#${encodeURIComponent(p.cat)}">${p.cat}</a><time datetime="${p.date}">${fmtDate(p.date)}</time></div>
  <h3><a href="/conteudo/${p.slug}/">${p.title}</a></h3>
  <p>${p.excerpt}</p>
</article>`;

const vcard = (v, i) => `
<a class="vcard" href="/verticais/${v.slug}/">
  <img src="${segImg(v)}" alt="" width="1200" height="800" loading="lazy" decoding="async">
  <span class="vcard__n" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
  <span class="vcard__in"><span class="vcard__ico">${ico(v.icon)}</span><h3>${v.name}</h3><p>${v.short}</p><span class="link">Conheça mais ${ico("arrow-right")}</span></span>
</a>`;

/* =====================================================================
   PÁGINAS
   ===================================================================== */
function home() {
  const H = D.hero;
  const m = seo("home", `${S.name} | Contabilidade consultiva e BPO financeiro`, strip(S.description));
  const ctaHref = /#diagnostico$/.test(H.ctaHref || "") || !H.ctaHref ? "#diagnostico" : H.ctaHref;
  const body = `
<section class="hero" id="inicio">
  <div class="hero__bg" aria-hidden="true">
    ${S.heroVideo ? `<div id="video-home" data-video="${S.heroVideo}"></div>` : `<canvas class="fx-waves"></canvas>`}
    ${HERO_ART ? `<img class="hero__art" src="${HERO_ART}" alt="" width="1600" height="900" fetchpriority="high" decoding="async">` : ""}
    <div class="hero__veil"></div>
  </div>
  <div class="inner hero__in">
    <div class="hero__copy">
      <p class="hero__eyebrow"><span class="pulse"></span>Soluções <strong class="typed" data-words='${JSON.stringify(H.typedWords)}'>${H.typedWords[0]}</strong></p>
      <h1 class="display">${H.title}</h1>
      ${H.sub ? `<p class="lead">${H.sub}</p>` : ""}
      <div class="actions"><a class="btn btn--lg" href="${ctaHref}" data-track="cta_click" data-label="hero">${H.cta} ${ico("arrow-right")}</a><a class="btn btn--outline btn--lg" href="${H.cta2Href || "#servicos"}">${H.cta2 || "Conhecer soluções"}</a></div>
    </div>
    <ul class="hero__badges" aria-label="Capacidades">${(H.badges || []).map((b) => `<li>${ico(b.icon)}<span>${b.text}</span></li>`).join("")}</ul>
  </div>
</section>
${curve("#proposta")}
<main id="main" class="site-main">
  <section id="proposta" class="sec sec--light"><div class="inner">
    ${sectionHead({ eyebrow: VP.eyebrow, h2: VP.h2, p: VP.p, two: true })}
    ${grid(VP.pillars.map((p) => iconCard(p)))}
  </div></section>

  <section id="servicos" class="sec sec--soft"><div class="inner">
    ${sectionHead({ eyebrow: "Soluções", h2: "Soluções contábeis <strong>e empresariais</strong>", p: "Contabilidade, finanças, pessoas e tributos em uma operação única. Escolha por onde começar; o restante se integra.", two: true })}
    ${grid(D.services.map(svcCard), "svc-grid")}
    <p class="sec__more reveal"><a class="link" href="/atuacao/">Ver todas as soluções ${ico("arrow-right")}</a></p>
  </div></section>

  ${videoSection(D.videos.home, "Conheça a <strong>Bear Finance</strong>", "Como unimos contabilidade consultiva, BPO financeiro e tecnologia própria para empresas em todo o Brasil.", { poster: POSTER.home || img("ph-09.svg") })}

  <section id="diferenciais" class="sec sec--deep"><div class="inner">
    ${sectionHead({ eyebrow: DIFF.eyebrow, h2: DIFF.h2, p: DIFF.p, two: true })}
    ${grid(DIFF.items.map((d, i) => iconCard(d, { glass: true, n: String(i + 1).padStart(2, "0") })))}
  </div></section>

  <section id="segmentos" class="sec sec--light">
    <div class="inner">${sectionHead({ eyebrow: SEGI.eyebrow, h2: SEGI.h2, p: SEGI.p, two: true })}</div>
    <div class="vwrap">
      <div class="carousel" data-carousel>
        <div class="carousel__track" tabindex="0" aria-label="Segmentos atendidos (use as setas para navegar)">${D.verticals.map((v, i) => `<div class="carousel__item">${vcard(v, i)}</div>`).join("")}</div>
        <div class="carousel__dots" aria-label="Posição do carrossel"></div>
      </div>
      <button class="vnav vnav--prev" type="button" data-carousel-prev aria-label="Segmento anterior">${ico("arrow-left")}</button><button class="vnav vnav--next" type="button" data-carousel-next aria-label="Próximo segmento">${ico("arrow-right")}</button>
    </div>
  </section>

  ${erpSection()}

  <section id="presenca" class="sec sec--deep"><div class="inner presenca">
    <div class="presenca__t reveal"><p class="eyebrow">${PRES.eyebrow || "Presença nacional"}</p><h2>${PRES.h2 || "Sede em São Paulo, <strong>operação em todo o Brasil</strong>"}</h2><p class="lead">${PRES.p}</p>${factsBlock(PRES.facts)}</div>
    <div class="presenca__map reveal">${neuralMap()}</div>
  </div></section>

  <section id="metodologia" class="sec sec--light"><div class="inner">
    ${sectionHead({ eyebrow: METHOD.eyebrow, h2: METHOD.h2, p: METHOD.p, two: true })}
    ${stepsBlock(METHOD.steps)}
  </div></section>

  <section id="conteudo" class="sec sec--soft"><div class="inner">
    ${sectionHead({ eyebrow: "Conteúdo", h2: "Inteligência contábil <strong>para decidir</strong>", p: "Artigos sobre Reforma Tributária, gestão financeira e estruturação societária, escritos para quem toma decisão.", two: true })}
    ${grid(D.posts.slice(0, 3).map(postCard))}
    <p class="sec__more reveal"><a class="btn btn--outline" href="/conteudo/">Ver todos os conteúdos</a></p>
  </div></section>

  ${faqBlock(D.faq)}
  ${conversion()}
</main>`;
  return page({ key: "home", title: m.title, description: m.description, active: "home", bodyClass: "home", body, path: "/", jsonld: [faqLd(D.faq)], extraHead: MAP_HEAD, extraScripts: MAP_SCRIPTS });
}

function servicePage(s) {
  const a = svcImg(s);
  const waText = s.waText || `Olá! Quero saber mais sobre ${s.name} da Bear Finance.`;
  const title = s.metaTitle || `${s.name} para empresas | ${S.name}`;
  const description = s.metaDescription || strip(s.headline.p);
  const body = `
${phead({ crumbs: [["Soluções", "/atuacao/"], [s.name]], eyebrow: s.name, h1: s.headline.h2, p: s.headline.p, actions: ctaPair(waText), art: a })}
${curve("#conteudo")}
<main id="main" class="site-main">
  <section id="conteudo" class="sec sec--light"><div class="inner split">
    <div class="split__t h2-before reveal"><h2>${s.intro.h2}</h2><p class="lead">${s.intro.p}</p><ul class="arrows">${s.intro.arrows.map((x) => `<li>${x}</li>`).join("")}</ul><p>${s.intro.close}</p></div>
    <div class="split__m reveal">${media(a, `Ilustração: ${s.name}`, { ratio: "4/3", cls: "media--shadow" })}</div>
  </div></section>
  ${s.outcomes?.length ? `<section class="sec sec--soft"><div class="inner">${sectionHead({ eyebrow: "O que você recebe", h2: "Entregas <strong>concretas</strong>, todo mês", two: false })}<div class="outcomes reveal-group">${s.outcomes.map((o, i) => `<div class="outcome" style="--i:${i}">${ico("check")}<span>${o}</span></div>`).join("")}</div></div></section>` : ""}
  ${videoInline(s.video, "Veja <strong>como funciona</strong>", PLAT_ART || img(s.img2))}
  <section class="sec sec--soft"><div class="inner split split--rev">
    <div class="split__m reveal">${media(art("tech-plataforma.svg") || img(s.img2), "Ilustração de processo", { ratio: "4/3" })}</div>
    <div class="split__t h2-before reveal"><h2>${s.method.h2}</h2><ol class="mlist">${s.method.items.map(([t, p]) => `<li><div><strong>${t}</strong><span>${p}</span></div></li>`).join("")}</ol></div>
  </div></section>
  ${erpSection()}
  ${quoteBand(s.quote)}
  ${platformTeaser()}
  ${faqBlock(s.faq)}
  ${conversion({ servico: s.name, waText })}
</main>`;
  return page({ key: "servico", title, description, active: "atuacao", bodyClass: "single-servico", body, path: `/atuacao/${s.slug}/`, crumbs: [["Soluções", "/atuacao/"], [s.name]], waHref: wa(waText), jsonld: [faqLd(s.faq), { "@context": "https://schema.org", "@type": "Service", name: s.name, serviceType: s.name, description: strip(description), provider: { "@id": `${S.url}/#org` }, areaServed: "BR", url: `${S.url}/atuacao/${s.slug}/` }] });
}

function servicesIndex() {
  const m = seo("atuacao", `Soluções contábeis e empresariais | ${S.name}`, "Contabilidade consultiva, BPO financeiro, folha de pagamento, auditoria e consultoria tributária e estruturações corporativas para empresas em todo o Brasil.");
  const body = `
${phead({ crumbs: [["Soluções"]], eyebrow: "Soluções", h1: "Soluções contábeis e empresariais para <strong>cada desafio</strong> do seu negócio", p: "Escolha por onde começar. Cada serviço funciona sozinho e se integra aos demais dentro da Plataforma Bear.", actions: ctaPair(WA_DEFAULT), art: HERO_ART })}
${curve("#lista", { to: "soft" })}
<main id="main" class="site-main">
  <section id="lista" class="sec sec--soft pt0"><div class="inner"><h2 class="sr-only">Nossas soluções</h2>${grid(D.services.map(svcCard), "svc-grid")}</div></section>
  ${videoSection(D.videos.home, "Veja a Bear <strong>em ação</strong>", "Como entregamos contabilidade, finanças e tributos em uma única operação integrada.", { poster: POSTER.servicos || img("ph-09.svg") })}
  <section class="sec sec--light"><div class="inner">${sectionHead({ eyebrow: METHOD.eyebrow, h2: METHOD.h2, p: METHOD.p, two: true })}${stepsBlock(METHOD.steps)}</div></section>
  ${erpSection()}
  ${faqBlock(D.faq)}
  ${conversion()}
</main>`;
  return page({ key: "atuacao", title: m.title, description: m.description, active: "atuacao", body, path: "/atuacao/", crumbs: [["Soluções", "/atuacao/"]] });
}

function verticalPage(v) {
  const a = segImg(v);
  const waText = v.waText || `Olá! Quero saber mais sobre a contabilidade da Bear Finance para ${v.name}.`;
  const title = v.metaTitle || `Contabilidade para ${v.name} | ${S.name}`;
  const description = v.metaDescription || strip(v.headline);
  const next = D.verticals[(D.verticals.indexOf(v) + 3) % D.verticals.length];
  const body = `
${phead({ crumbs: [["Segmentos", "/verticais/"], [v.name]], eyebrow: "Segmento", h1: `Contabilidade para <strong>${v.name}</strong>`, p: v.headline, actions: ctaPair(waText), art: a })}
<main id="main" class="site-main">
  <section class="sec sec--dark pt0"><div class="inner hl reveal"><p class="hl__main">${v.g[0]}</p>${v.g.slice(1).map((x) => `<p class="hl__item">${x}</p>`).join("")}</div></section>
  <section class="sec sec--light"><div class="inner">
    <div class="split"><div class="split__t h2-before reveal"><p class="eyebrow">${v.block1.eyebrow}</p><h2>${v.block1.h2}</h2>${v.block1.p.map((p) => `<p class="lead">${p}</p>`).join("")}</div><div class="split__m reveal">${media(a, `Ilustração: ${v.name}`, { ratio: "4/3", cls: "media--shadow" })}</div></div>
    <div class="split split--rev" style="margin-top:var(--s-9)"><div class="split__m reveal">${media(segImg(next), "", { ratio: "4/3" })}</div><div class="split__t h2-before reveal"><p class="eyebrow">${v.block2.eyebrow}</p><h2>${v.block2.h2}</h2>${v.block2.p.map((p) => `<p class="lead">${p}</p>`).join("")}</div></div>
  </div></section>
  ${videoInline({ id: "", title: `Contabilidade para ${v.name}`, sub: "Como atendemos o setor" }, `Veja como atendemos <strong>${v.name}</strong>`, a)}
  <section class="sec sec--soft"><div class="inner">
    ${sectionHead({ eyebrow: v.atuacao.eyebrow, h2: v.atuacao.h2, p: v.atuacao.p, two: true })}
    <ul class="tags reveal" aria-label="Atividades atendidas">${v.atuacao.items.map((it) => `<li>${ico("check")}${it}</li>`).join("")}</ul>
  </div></section>
  <section class="sec sec--dark"><div class="inner statement reveal"><div><h3>${v.partner.h3}</h3><p class="lead">${v.partner.p}</p></div><div><span class="statement__badge">${ico("book")} Legislação e entidades do setor</span></div></div></section>
  <section class="sec sec--light"><div class="inner">
    ${sectionHead({ eyebrow: "Escopo", h2: "O que fazemos pelo <strong>seu setor</strong>", p: "Quatro frentes que trabalham juntas, dentro da mesma plataforma e com o mesmo time.", two: true })}
    <div class="tabs reveal">
      <div class="tabs__list" role="tablist" aria-label="Frentes de atuação">${v.tabs.map(([t], i) => `<button role="tab" type="button" id="tab-${i}" aria-controls="panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t}</button>`).join("")}</div>
      ${v.tabs.map(([t, items], i) => `<div class="tabs__panel" role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}"${i ? " hidden" : ""}><h3>${t}</h3><ul class="checks">${items.map((li) => `<li>${li}</li>`).join("")}</ul></div>`).join("")}
    </div>
  </div></section>
  ${faqBlock(v.faq)}
  ${conversion({ segmento: v.name, waText })}
</main>`;
  return page({ key: "vertical", title, description, active: "verticais", bodyClass: "single-segmento", body, path: `/verticais/${v.slug}/`, crumbs: [["Segmentos", "/verticais/"], [v.name]], waHref: wa(waText), jsonld: [faqLd(v.faq)] });
}

function verticalsIndex() {
  const m = seo("verticais", `Contabilidade por segmento | ${S.name}`, "Contabilidade especializada para indústria, agronegócio, saúde, construção civil, logística, varejo, energia e serviços.");
  const body = `
${phead({ crumbs: [["Segmentos"]], eyebrow: "Segmentos", h1: SEGI.h2, p: SEGI.p, actions: ctaPair(WA_DEFAULT), art: HERO_ART })}
<main id="main" class="site-main">
  <section class="sec sec--light"><div class="inner"><h2 class="sr-only">Segmentos atendidos</h2>${grid(D.verticals.map(vcard), "vgrid")}</div></section>
  ${videoSection(D.videos.cases, "Conhecimento <strong>setorial</strong>", "Como nossos times se especializam por vertical para entregar mais do que conformidade.", { poster: POSTER.verticais || img("ph-06.svg") })}
  ${conversion()}
</main>`;
  return page({ key: "verticais", title: m.title, description: m.description, active: "verticais", body, path: "/verticais/", crumbs: [["Segmentos", "/verticais/"]] });
}

function about() {
  const A = D.about;
  const m = seo("sobre", `Sobre a ${S.name}`, strip(S.description));
  const body = `
${phead({ crumbs: [["Sobre"]], eyebrow: "Sobre a Bear", h1: A.headline, p: "", art: HERO_ART })}
<main id="main" class="site-main">
  ${A.facts?.length ? `<section class="sec sec--dark pt0"><div class="inner">${factsBlock(A.facts, "facts--3")}</div></section>` : ""}
  <section class="sec sec--light"><div class="inner split split--rev">
    <div class="split__m reveal">${media(raster("URSO_CARA"), "Arte da Bear Finance: urso em rede neural", { ratio: "3/2", cls: "media--shadow media--brand", w: 1536, h: 1024 })}</div>
    <div class="split__t h2-before reveal"><h2>${A.h2}</h2>${A.p.map((p) => `<p class="lead">${p}</p>`).join("")}</div>
  </div></section>
  ${videoSection(D.videos.sobre, "Nossa <strong>história</strong>", "De um escritório de contabilidade a uma plataforma de gestão financeira com inteligência artificial.", { poster: POSTER.sobre || img("ph-03.svg") })}
  <section class="sec sec--soft"><div class="inner">
    ${sectionHead({ eyebrow: "Sócios", h2: "Quem está <strong>à frente</strong>", p: "Nomes, fotos e biografias serão publicados após confirmação.", two: true })}
    <div class="team reveal-group">${A.team.map(([n, r, b], i) => `<div class="team__card" style="--i:${i}"><div class="team__avatar ph">${ico("user")}</div><h3>${n}</h3><p class="role">${r}</p><p>${b}</p></div>`).join("")}</div>
  </div></section>
  <section class="sec sec--light"><div class="inner">
    ${sectionHead({ eyebrow: "Valores", h2: "O que guia <strong>cada decisão</strong>", two: false })}
    ${grid(A.values.map(([icon, title, text]) => iconCard({ icon, title, text })), "grid4")}
  </div></section>
  ${ctaBand("Quer conhecer a Bear de perto? <strong>Agende uma conversa</strong> com o nosso time.", { btn: "Agendar conversa", href: "/contato/#diagnostico", waText: WA_DEFAULT })}
  ${faqBlock(D.faq)}
</main>`;
  return page({ key: "sobre", title: m.title, description: m.description, active: "sobre", body, path: "/sobre/", crumbs: [["Sobre", "/sobre/"]], jsonld: [faqLd(D.faq)] });
}

function esgPage() {
  const E = D.esg;
  const m = seo("esg", `ESG | ${S.name}`, "Práticas ambientais, sociais e de governança da Bear Finance.");
  const body = `
${phead({ crumbs: [["Sobre", "/sobre/"], ["ESG"]], eyebrow: "ESG", h1: E.headline, p: E.p[0] || "", art: art("seg-energia.svg") || "" })}
<main id="main" class="site-main">
  <section class="sec sec--light"><div class="inner">
    <div class="split"><div class="split__t h2-before reveal"><h2>Compromisso que<br><strong>começa em casa</strong></h2>${E.p.map((p) => `<p class="lead">${p}</p>`).join("")}</div><div class="split__m reveal">${media(art("seg-energia.svg") || img("ph-07.svg"), "", { ratio: "4/3" })}</div></div>
    <div style="margin-top:var(--s-8)">${grid(E.pillars.map(([icon, title, text]) => iconCard({ icon, title, text })))}</div>
  </div></section>
  ${videoSection(D.videos.esg, "Nosso compromisso <strong>ESG</strong>", "Práticas, metas e resultados do nosso programa.", { poster: art("seg-energia.svg") || img("ph-08.svg") })}
  ${ctaBand("Governança começa com informação confiável. <strong>Vamos conversar?</strong>", { href: "/contato/#diagnostico", waText: WA_DEFAULT })}
</main>`;
  return page({ key: "esg", title: m.title, description: m.description, active: "sobre", body, path: "/esg/", crumbs: [["Sobre", "/sobre/"], ["ESG", "/esg/"]] });
}

function careers() {
  const c = D.career;
  const m = seo("carreira", `Carreira | ${S.name}`, "Vagas, cultura e banco de talentos da Bear Finance.");
  const jobs = c.jobs || [];
  const body = `
${phead({ crumbs: [["Carreira"]], eyebrow: "Carreira", h1: c.headline, p: c.sub, actions: `<div class="actions"><a class="btn btn--lg" href="#candidatura">Enviar candidatura ${ico("arrow-right")}</a></div>`, art: HERO_ART })}
<main id="main" class="site-main">
  <section class="sec sec--dark"><div class="inner">
    ${sectionHead({ eyebrow: "Cultura", h2: "O nosso jeito <strong>de fazer as coisas</strong>", two: false })}
    <ul class="culture reveal-group">${c.culture.map(([a, k, b], i) => `<li style="--i:${i}">${a}<em>${k}</em>${b}</li>`).join("")}</ul>
  </div></section>
  <section class="sec sec--light"><div class="inner split">
    <div class="split__t h2-before reveal"><h2>Áreas em que <strong>você pode crescer</strong></h2><ul class="tags">${c.areas.map((a) => `<li>${ico("check")}${a}</li>`).join("")}</ul><p class="lead" style="margin-top:var(--s-5)">${c.talents[0]}</p></div>
    <div class="split__m reveal">${videoBox({ ...D.videos.carreira, poster: img("ph-07.svg") })}</div>
  </div></section>
  <section class="sec sec--soft"><div class="inner">
    <div class="split"><div class="split__t h2-before reveal"><h2><strong>Diversidade</strong></h2>${c.diversity.map((p, i) => `<p class="${i === 0 ? "lead" : ""}">${p}</p>`).join("")}</div><div class="split__m reveal">${media(img("ph-04.svg"), "", { ratio: "4/3" })}</div></div>
    <div class="people reveal-group" style="margin-top:var(--s-7)">${c.people.map(([t, im], i) => `<figure class="media ph" style="--i:${i};--ratio:4/5"><img src="${img(im)}" alt="" width="800" height="1000" loading="lazy" decoding="async"><figcaption>${t}</figcaption></figure>`).join("")}</div>
  </div></section>
  <section class="sec sec--light"><div class="inner split split--even">
    <div class="split__t h2-before reveal"><h2>Programa de<br><strong>novos talentos</strong></h2>${c.talents.slice(1).map((p) => `<p>${p}</p>`).join("")}</div>
    <div class="reveal"><h3 style="margin-bottom:var(--s-4)">Vagas abertas</h3>${jobs.length ? `<ul id="vagas-list" class="jobs">${jobs.map(([t, l]) => `<li><div><h3>${t}</h3><span>${ico("pin")} ${l}</span></div><a class="btn btn--sm" href="#candidatura" data-job="${esc(t)}">Candidatar-se</a></li>`).join("")}</ul>` : `<div class="empty"><strong>Nenhuma vaga publicada no momento.</strong>Cadastre-se no banco de talentos: entramos em contato quando abrir uma posição com o seu perfil.</div>`}</div>
  </div></section>
  <section id="candidatura" class="sec sec--soft"><div class="inner inner--narrow">
    <div class="fcard reveal"><h3>Envie sua candidatura</h3><p>Banco de talentos da Bear. Seus dados são usados apenas para recrutamento.</p>
      <form class="form" data-api="/api/carreira" data-form="carreira" novalidate>
        <input type="hidden" name="ts" value="">
        <div class="form__grid">
          <label class="field"><span>Nome <em>*</em></span><input type="text" name="nome" autocomplete="name" required minlength="2" maxlength="120"><small class="field__err">Informe seu nome.</small></label>
          <label class="field"><span>E-mail <em>*</em></span><input type="email" name="email" autocomplete="email" required maxlength="160"><small class="field__err">Informe um e-mail válido.</small></label>
          <label class="field"><span>Telefone <em>*</em></span><input type="tel" name="telefone" autocomplete="tel" required data-mask="phone" minlength="14" placeholder="(11) 90000-0000"><small class="field__err">Informe um telefone com DDD.</small></label>
          <label class="field"><span>Área ou vaga</span><select id="c-vaga" name="vaga"><option>Banco de talentos</option>${[...c.areas, ...jobs.map(([t]) => t)].map((t) => `<option>${t}</option>`).join("")}</select></label>
          <label class="field form__row"><span>LinkedIn ou link do currículo <em>*</em></span><input type="url" name="curriculo" required placeholder="https://" maxlength="300"><small class="field__err">Informe um link válido (https://…).</small></label>
          <label class="field form__row"><span>Sobre você <small>(opcional)</small></span><textarea name="mensagem" maxlength="2000" rows="4"></textarea></label>
          <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <label class="consent"><input type="checkbox" name="lgpd" value="sim" required><span>Autorizo o tratamento dos meus dados para fins de recrutamento, conforme a <a href="/privacidade/" target="_blank" rel="noopener">Política de Privacidade</a>.</span></label>
          <div class="form__actions"><button class="btn" type="submit">Enviar candidatura ${ico("arrow-right")}</button></div>
          <p class="form__msg" role="status" aria-live="polite"></p>
        </div>
      </form>
    </div>
  </div></section>
</main>`;
  return page({ key: "carreira", title: m.title, description: m.description, active: "sobre", body, path: "/carreira/", crumbs: [["Carreira", "/carreira/"]] });
}

function casesPage() {
  const C = D.cases;
  const m = seo("cases", `Casos de uso | ${S.name}`, "Cenários típicos que a Bear Finance atende, sem identificar clientes.");
  const body = `
${phead({ crumbs: [["Casos de uso"]], eyebrow: C.intro.eyebrow, h1: C.intro.h2, p: C.intro.p, art: HERO_ART })}
<main id="main" class="site-main">
  <section class="sec sec--light"><div class="inner"><h2 class="sr-only">Cenários de atuação</h2>${grid(C.items.map((c) => `<article class="case"><span class="case__seg">${c.segment}</span><h3>${c.title}</h3><dl><div><dt>Situação</dt><dd>${c.challenge}</dd></div><div><dt>Como atuamos</dt><dd>${c.approach}</dd></div></dl><ul class="checks">${c.deliverables.map((d) => `<li>${d}</li>`).join("")}</ul><a class="link" href="/verticais/${segOf(c.segment)?.slug || ""}/">Ver o segmento ${ico("arrow-right")}</a></article>`))}</div></section>
  ${videoSection(D.videos.cases, "Como atuamos <strong>por setor</strong>", "Veja como organizamos times, rotinas e tecnologia para cada mercado.", { poster: POSTER.cases || img("ph-02.svg") })}
  ${conversion()}
</main>`;
  return page({ key: "cases", title: m.title, description: m.description, active: "sobre", body, path: "/cases/", crumbs: [["Casos de uso", "/cases/"]] });
}

function platformPage() {
  const p = D.platform;
  const m = seo("plataforma", `Plataforma Bear | Gestão financeira com IA`, strip(p.p));
  const body = `
${phead({ crumbs: [["Plataforma"]], eyebrow: "Plataforma Bear", h1: p.headline, p: p.p, actions: `<div class="actions"><a class="btn btn--lg" href="#diagnostico" data-track="cta_click">Ver demonstração ${ico("arrow-right")}</a>${S.platformUrl ? `<a class="btn btn--outline btn--lg" href="${S.platformUrl}" target="_blank" rel="noopener">Acessar plataforma ${ico("external")}</a>` : ""}</div>`, art: PLAT_ART })}
<main id="main" class="site-main">
  <section class="sec sec--light"><div class="inner split split--rev">
    <div class="split__m reveal">${media(raster("SISTEMA"), "Ilustração isométrica da Plataforma Bear", { ratio: "4/5", cls: "media--shadow", w: 1024, h: 1536 })}</div>
    <div class="split__t h2-before reveal"><h2>Nova geração de<br><strong>gestão financeira</strong></h2><p class="lead">${PLAT.p}</p><ul class="arrows">${PLAT.bullets.map((b) => `<li>${b}</li>`).join("")}</ul></div>
  </div></section>
  <section class="sec sec--soft"><div class="inner">${sectionHead({ eyebrow: "Recursos", h2: "O que a plataforma <strong>faz por você</strong>", two: false })}${grid(p.features.map(([icon, title, text]) => iconCard({ icon, title, text })))}</div></section>
  ${videoSection(D.videos.plataforma, "Tour pela <strong>Plataforma Bear</strong>", "Dashboards, conciliação automática e alertas de compliance em um só lugar.", { poster: PLAT_ART || img("ph-02.svg") })}
  <section class="sec sec--light"><div class="inner">${sectionHead({ eyebrow: "Como funciona", h2: "Da conversa inicial <strong>à operação</strong>", two: false })}${stepsBlock(p.steps.map(([title, text]) => ({ title, text })))}</div></section>
  ${erpSection("Integrada aos <strong>principais ERPs</strong>")}
  ${conversion({ waText: "Olá! Quero ver uma demonstração da Plataforma Bear." })}
</main>`;
  return page({ key: "plataforma", title: m.title, description: m.description, active: "plataforma", body, path: "/plataforma/", crumbs: [["Plataforma", "/plataforma/"]] });
}

function contact() {
  const m = seo("contato", `Contato | ${S.name}`, "Fale com a Bear Finance: diagnóstico, WhatsApp e e-mail.");
  const steps = METHOD.steps.slice(0, 3);
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Rua Riachuelo, 231, Sé, São Paulo - SP");
  const body = `
${phead({ crumbs: [["Contato"]], eyebrow: "Contato", h1: "Fale com a <strong>Bear</strong>", p: "Diagnóstico sem custo, WhatsApp e e-mail. Escolha o canal; a resposta vem de um especialista do seu setor.", cls: "phead--short" })}
<main id="main" class="site-main">
  <section id="diagnostico" class="sec sec--dark conv"><div class="inner conv__in">
    <div class="conv__form reveal">${diagForm({ level: 2 })}</div>
    <div class="conv__copy reveal">
      <p class="eyebrow">Canais diretos</p>
      <ul class="contact-list">
        <li>${ico("whatsapp")}<div><a href="${wa(WA_DEFAULT)}" target="_blank" rel="noopener" data-track="whatsapp_click">${S.phone}</a><small>WhatsApp comercial</small></div></li>
        <li>${ico("mail")}<div><a href="mailto:${S.email}">${S.email}</a><small>E-mail</small></div></li>
        <li>${ico("pin")}<div>${S.address}<br>${S.city}<small><a href="${mapsUrl}" target="_blank" rel="noopener">Abrir no Google Maps ${ico("external")}</a></small></div></li>
        <li>${ico("globe")}<div>Atendimento digital<small>Clientes em todos os estados e no DF</small></div></li>
      </ul>
      <p class="eyebrow" style="margin-top:var(--s-6)">Depois do envio</p>
      <ol class="mlist">${steps.map((s) => `<li><div><strong>${s.title}</strong><span>${s.text}</span></div></li>`).join("")}</ol>
    </div>
  </div></section>
  <section class="sec sec--soft"><div class="inner">${sectionHead({ eyebrow: "Unidades", h2: "Onde <strong>estamos</strong>", two: false })}<div class="grid2 reveal-group">${PRES.offices.map(([c, a, t], i) => `<div class="office" style="--i:${i}"><h3>${c}</h3><p>${a}</p>${t ? `<p><a href="${S.phoneHref}">${t}</a></p>` : ""}${i === 0 ? `<a class="link" href="${mapsUrl}" target="_blank" rel="noopener">Como chegar ${ico("external")}</a>` : ""}</div>`).join("")}</div></div></section>
  ${videoSection(D.videos.contato, "Como funciona o <strong>primeiro contato</strong>", "Diagnóstico, proposta e onboarding: o que acontece em cada etapa.", { poster: POSTER.contato || img("ph-01.svg") })}
  ${faqBlock(D.faq)}
</main>`;
  return page({ key: "contato", title: m.title, description: m.description, active: "contato", body, path: "/contato/", crumbs: [["Contato", "/contato/"]], jsonld: [faqLd(D.faq)] });
}

function blog() {
  const cats = [...new Set(D.posts.map((p) => p.cat))];
  const m = seo("conteudo", `Conteúdo | ${S.name}`, "Artigos sobre contabilidade, finanças, Reforma Tributária e estruturação societária.");
  const body = `
${phead({ crumbs: [["Conteúdo"]], eyebrow: "Conteúdo", h1: "Inteligência contábil <strong>para decidir</strong>", p: "Reforma Tributária, gestão financeira, folha e estruturação societária, explicados para quem toma decisão.", cls: "phead--short" })}
<main id="main" class="site-main">
  <section class="sec sec--light"><div class="inner">
    <h2 class="sr-only">Artigos</h2><div class="filters reveal" role="group" aria-label="Filtrar por categoria"><button type="button" data-filter="all" aria-pressed="true">Todas</button>${cats.map((c) => `<button type="button" data-filter="${esc(c)}" aria-pressed="false">${c}</button>`).join("")}</div>
    ${grid(D.posts.map(postCard))}
  </div></section>
  ${ctaBand("Receba os próximos artigos <strong>no seu e-mail</strong>.", { btn: "Assinar a newsletter", href: "#newsletter" })}
</main>`;
  return page({ key: "conteudo", title: m.title, description: m.description, active: "conteudo", body, path: "/conteudo/", crumbs: [["Conteúdo", "/conteudo/"]] });
}

function post(p) {
  const html = p.body.map(([t, c]) => (t === "ul" ? `<ul>${c.map((li) => `<li>${li}</li>`).join("")}</ul>` : `<${t}>${c}</${t}>`)).join("\n");
  const url = `${S.url}/conteudo/${p.slug}/`;
  const body = `
${phead({ crumbs: [["Conteúdo", "/conteudo/"], [p.cat]], h1: p.title, cls: "phead--short", extra: "", eyebrow: "", p: "", actions: `<p class="small" style="color:var(--ink-300)">${fmtDateLong(p.date)} · ${S.name}</p><div class="share"><button type="button" data-share="linkedin" aria-label="Compartilhar no LinkedIn">${ico("linkedin")}</button><button type="button" data-share="whatsapp" aria-label="Compartilhar no WhatsApp">${ico("whatsapp")}</button><button type="button" data-share="copy" aria-label="Copiar link">${ico("link")}</button></div>` })}
<main id="main" class="site-main">
  <section class="sec sec--light"><div class="inner split">
    <article class="article"><p class="lead">${p.excerpt}</p>${html}<p style="margin-top:var(--s-7)"><a class="link" href="/conteudo/">${ico("arrow-left")} Voltar para conteúdos</a></p></article>
    <aside class="aside">
      <div class="aside__box"><h3>Leia também</h3><ul>${D.posts.filter((o) => o !== p).slice(0, 4).map((o) => `<li><a href="/conteudo/${o.slug}/">${o.title}</a></li>`).join("")}</ul></div>
      <div class="aside__box aside__box--dark"><h3>Fale com um especialista</h3><p class="small">Tire dúvidas sobre este tema com o nosso time.</p><a class="btn btn--sm" href="/contato/#diagnostico">Solicitar diagnóstico</a></div>
    </aside>
  </div></section>
</main>`;
  return page({ key: "post", title: p.title.length > 46 ? p.title : `${p.title} | ${S.name}`, description: strip(p.excerpt), active: "conteudo", bodyClass: "single-post", body, path: `/conteudo/${p.slug}/`, ogType: "article", crumbs: [["Conteúdo", "/conteudo/"], [p.title]], jsonld: [{ "@context": "https://schema.org", "@type": "Article", headline: p.title, description: strip(p.excerpt), datePublished: p.date, dateModified: p.date, mainEntityOfPage: url, image: OG_URL, author: { "@type": "Organization", name: S.name, url: S.url }, publisher: { "@id": `${S.url}/#org` } }] });
}

/* ---------- Parcerias ---------- */
const waLink = (text = "") => `https://wa.me/${D.partnerWhatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

function partnerForm(pr) {
  const fl = (name, label, type = "text", attrs = "") => `<div class="fl"><input id="pf-${pr.key}-${name}" name="${name}" type="${type}" placeholder=" " data-label="${label}" ${attrs}><label for="pf-${pr.key}-${name}">${label}</label></div>`;
  const field = (f) => {
    const id = `pf-${pr.key}-${f.name}`, req = f.required ? " required" : "";
    if (f.type === "select") return `<div class="fl fl--select"><select id="${id}" name="${f.name}" data-label="${f.label}"${req}><option value="" selected disabled hidden></option>${f.options.map((o) => `<option>${o}</option>`).join("")}</select><label for="${id}">${f.label}${f.required ? "" : " (opcional)"}</label>${ico("chevron-down")}</div>`;
    if (f.type === "chips" || f.type === "radio") {
      const t = f.type === "chips" ? "checkbox" : "radio";
      return `<fieldset class="chips full"><legend>${f.label}${f.type === "chips" ? " <small>(marque quantos quiser)</small>" : ""}</legend>${f.options.map((o, i) => `<label class="chip"><input type="${t}" name="${f.name}" value="${o}" data-label="${f.label}"${f.required && i === 0 ? " required" : ""}><span>${o}</span></label>`).join("")}</fieldset>`;
    }
    return `<div class="full">${fl(f.name, f.label, f.type, req)}</div>`;
  };
  return `
<div class="pform" id="form-parceria">
  <div class="pform-head">
    <span class="pform-tag">${ico("whatsapp")} Resposta rápida pelo WhatsApp</span>
    <h2>${pr.form.title}</h2>
    <div class="pform-progress" aria-hidden="true"><span></span></div>
    <ol class="pform-steps"><li class="on"><b>1</b>Seus dados</li><li><b>2</b>${pr.form.step2}</li></ol>
  </div>
  <form data-wa-form data-wa="${D.partnerWhatsapp.number}" data-api="/api/parceria" novalidate>
    <input type="hidden" name="programa" value="${pr.name}"><input type="hidden" name="ts" value="">
    <fieldset class="pform-step" data-step="1"><legend class="sr-only">Seus dados</legend>
      <div class="pgrid">
        <div class="full">${fl("nome", "Seu nome completo", "text", 'required autocomplete="name"')}</div>
        <div>${fl("telefone", "WhatsApp", "tel", 'required inputmode="tel" autocomplete="tel" data-mask="phone" pattern="\\(\\d{2}\\) \\d{4,5}-\\d{4}"')}</div>
        <div>${fl("email", "E-mail", "email", 'required autocomplete="email"')}</div>
        <div class="full">${fl("cidade", "Cidade / UF", "text", 'required autocomplete="address-level2"')}</div>
      </div>
      <button type="button" class="btn pform-next" data-next>Continuar ${ico("arrow-right")}</button>
    </fieldset>
    <fieldset class="pform-step" data-step="2" hidden><legend class="sr-only">${pr.form.step2}</legend>
      <div class="pgrid">${pr.form.fields.map(field).join("")}<div class="full"><div class="fl"><textarea id="pf-${pr.key}-mensagem" name="mensagem" placeholder=" " data-label="Mensagem"></textarea><label for="pf-${pr.key}-mensagem">Quer contar algo mais? (opcional)</label></div></div></div>
      <label class="consent"><input type="checkbox" name="lgpd" value="sim" required><span>Autorizo a Bear Finance a entrar em contato e tratar meus dados conforme a <a href="/privacidade/" target="_blank" rel="noopener">Política de Privacidade</a>.</span></label>
      <div class="pform-actions"><button type="button" class="pform-back" data-prev>${ico("arrow-left")} Voltar</button><button type="submit" class="btn btn--wa">${ico("whatsapp")} Continuar no WhatsApp</button></div>
    </fieldset>
    <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="pform-done" hidden>${ico("whatsapp")}<h3>Tudo certo!</h3><p>Abrimos o WhatsApp com a sua mensagem pronta. É só tocar em <strong>enviar</strong>.</p><a class="btn btn--wa" data-wa-open href="${waLink()}" target="_blank" rel="noopener">${ico("whatsapp")} Abrir WhatsApp novamente</a></div>
    <p class="form__msg" role="status" aria-live="polite"></p>
  </form>
  <p class="pform-foot">Prefere ir direto? <a href="${waLink(`Olá! Quero saber mais sobre o programa ${pr.name} da Bear Finance.`)}" target="_blank" rel="noopener">${ico("whatsapp")} ${D.partnerWhatsapp.display}</a></p>
  <noscript><p class="pform-foot">Seu navegador está sem JavaScript. Fale com a gente em <a href="${waLink()}">${D.partnerWhatsapp.display}</a>.</p></noscript>
</div>`;
}

function partnerHubPage() {
  const H = D.partnerHub;
  const m = seo("parcerias", `Parcerias | ${S.name}`, "Business Partner Outsourcing para contadores e Business Partner para prospectores de negócios.");
  const hubWa = waLink("Olá! Quero conhecer os programas de parceria da Bear Finance.");
  const body = `
${phead({ crumbs: [["Parcerias"]], eyebrow: "Parcerias", h1: H.h2, p: H.p, actions: `<div class="actions">${D.partnerPrograms.map((p, i) => `<a class="btn${i ? " btn--outline" : ""} btn--lg" href="/parcerias/${p.slug}/">${p.name}</a>`).join("")}</div>`, art: HERO_ART })}
${curve("#programas")}
<main id="main" class="site-main">
  <section id="programas" class="sec sec--light pt0"><div class="inner">
    ${sectionHead({ eyebrow: "Programas", h2: "Escolha o seu <strong>programa</strong>", p: "Dois caminhos independentes. Você pode começar por um e evoluir para o outro, ou participar dos dois.", two: true })}
    <div class="programs reveal-group">${D.partnerPrograms.map((pr, i) => `
      <article class="program${i ? " program--dark" : ""}" id="${pr.key}" style="--i:${i}"><span class="program__n" aria-hidden="true">${i + 1}</span><span class="program__tag">${pr.tag}</span><h3>${pr.name}</h3><p class="program__sub">${pr.short}</p><p>${pr.lead}</p><h4>Como funciona</h4><ul class="checks">${pr.how.map((h) => `<li>${h}</li>`).join("")}</ul><h4>Para quem é</h4><ul class="tags">${pr.who.map((f) => `<li>${f}</li>`).join("")}</ul><a class="btn" href="/parcerias/${pr.slug}/" style="margin-top:var(--s-5)">Conhecer o ${pr.name} ${ico("arrow-right")}</a></article>`).join("")}</div>
  </div></section>
  <section class="sec sec--soft"><div class="inner">
    ${sectionHead({ eyebrow: "Comparativo", h2: "Lado a <strong>lado</strong>", two: false })}
    <div class="compare reveal" role="table" aria-label="Comparação entre os programas">
      <div class="compare-row compare-head" role="row"><div role="columnheader"></div>${D.partnerPrograms.map((p) => `<div role="columnheader">${ico(p.icon)}${p.name}<small>${p.short}</small></div>`).join("")}</div>
      ${H.compare.map(([k, a, b]) => `<div class="compare-row" role="row"><div role="rowheader">${k}</div><div role="cell" data-th="${D.partnerPrograms[0].name}">${a}</div><div role="cell" data-th="${D.partnerPrograms[1].name}">${b}</div></div>`).join("")}
    </div>
  </div></section>
  ${videoSection(H.video, "Parcerias <strong>Bear</strong>", "Veja em poucos minutos como funcionam os dois programas e qual combina mais com você.", { poster: POSTER.parcerias || img("ph-06.svg") })}
  ${ctaBand("Ficou com dúvida sobre qual programa escolher? <strong>Fale com o time de parcerias.</strong>", { btn: "WhatsApp de parcerias", href: hubWa })}
  ${faqBlock(H.faq)}
</main>`;
  return page({ key: "parcerias", title: m.title, description: m.description, active: "parcerias", bodyClass: "page-parcerias", body, path: "/parcerias/", crumbs: [["Parcerias", "/parcerias/"]], jsonld: [faqLd(H.faq)], waHref: hubWa });
}

function partnerProgramPage(pr) {
  const other = D.partnerPrograms.find((o) => o !== pr);
  const prWa = waLink(`Olá! Quero saber mais sobre o programa ${pr.name} da Bear Finance.`);
  const gridItem = ([t, d]) => `<div class="item-grid"><strong>${t}</strong><span>${d}</span></div>`;
  const body = `
${phead({ crumbs: [["Parcerias", "/parcerias/"], [pr.name]], eyebrow: pr.tag, h1: pr.headline.h2, p: pr.headline.p, list: pr.how.slice(0, 3), side: partnerForm(pr), art: HERO_ART })}
<main id="main" class="site-main">
  <section class="sec sec--dark" style="padding-top:calc(var(--sec) + 100px)"><div class="inner">${factsBlock(pr.facts)}<div class="statement reveal" style="margin-top:var(--s-7)"><h3>${pr.about}</h3><div><a class="btn" href="#form-parceria">Quero participar ${ico("arrow-right")}</a></div></div></div></section>
  <section class="sec sec--light"><div class="inner">
    ${sectionHead({ eyebrow: "Como a Bear apoia", h2: pr.diagram.h3, p: pr.diagram.h6, center: true })}
    <div class="grid-infos reveal"><div class="col-infos">${pr.diagram.left.map(gridItem).join("")}</div><div class="hub"><div class="hub-ring"></div><img src="${img("URSO_GEOMETRICO_PURPLE.png")}" alt="Bear Finance" width="140" height="140"><span>${pr.key === "bpo" ? "Seu escritório" : "Você"}</span></div><div class="col-infos">${pr.diagram.right.map(gridItem).join("")}</div></div>
    <div class="hub-bottom reveal"><div class="item-grid"><strong>${pr.diagram.bottom[0]}</strong><span>${pr.diagram.bottom[1]}</span></div></div>
  </div></section>
  ${ctaBand(pr.call, { btn: "Quero participar", href: "#form-parceria" })}
  <section class="sec sec--light"><div class="inner split split--even">
    <div class="split__t h2-before reveal"><h2>Como <strong>funciona</strong></h2><ul class="checks lead">${pr.how.map((h) => `<li>${h}</li>`).join("")}</ul></div>
    <div class="reveal"><div class="who-box"><h3>Para quem é</h3><ul class="tags">${pr.who.map((f) => `<li>${f}</li>`).join("")}</ul><p>${pr.lead}</p><a class="btn" href="#form-parceria">Quero ser ${pr.name}</a></div></div>
  </div></section>
  <section class="sec sec--soft"><div class="inner split split--even">
    <div class="split__t h2-before reveal"><h2>${pr.benefits.h2}</h2><p class="lead">${pr.benefits.p}</p><ul class="benefits">${pr.benefits.items.map((b) => `<li>${b}</li>`).join("")}</ul></div>
    <div class="reveal">${videoBox({ ...pr.video, poster: POSTER.parcerias || img("ph-06.svg") })}</div>
  </div></section>
  <section class="sec sec--light"><div class="inner">${sectionHead({ eyebrow: "Etapas", h2: "Simplicidade <strong>e transparência</strong>", p: "A entrada no programa foi desenhada para você começar rápido, com regras claras desde o primeiro dia.", two: true })}${stepsBlock(pr.steps.map(([title, text]) => ({ title, text })))}</div></section>
  ${ctaBand(pr.cta, { btn: D.partnerWhatsapp.display, href: prWa })}
  <section class="sec sec--soft"><div class="inner">${sectionHead({ eyebrow: "Mercados", h2: "Oportunidades nos <strong>principais setores</strong> do Brasil", p: "Nossa atuação por verticais abre portas em indústria, agro, saúde, construção, logística, varejo, energia e serviços.", two: true })}${grid(D.verticals.map(vcard), "vgrid")}</div></section>
  <section class="sec sec--light"><div class="inner statement reveal"><div><p class="eyebrow">Conheça também</p><h3 style="color:var(--ink-900)">${other.name} <span class="text-roxo">· ${other.short}</span></h3><p class="lead">${other.lead}</p></div><div><a class="btn btn--dark" href="/parcerias/${other.slug}/">Ver programa ${ico("arrow-right")}</a></div></div></section>
  ${faqBlock(pr.faq)}
</main>`;
  return page({ key: "parceria", title: `${pr.name} | Parcerias ${S.name}`, description: strip(pr.lead), active: "parcerias", bodyClass: "page-parcerias page-partner-program", body, path: `/parcerias/${pr.slug}/`, crumbs: [["Parcerias", "/parcerias/"], [pr.name]], jsonld: [faqLd(pr.faq)], waHref: prWa });
}

function privacy() {
  const m = seo("privacidade", `Política de Privacidade | ${S.name}`, "Como a Bear Finance trata dados pessoais e cookies, conforme a LGPD.");
  const body = `
${phead({ crumbs: [["Política de Privacidade"]], eyebrow: "Privacidade", h1: "Como tratamos <strong>os seus dados</strong>", p: "Conforme a Lei 13.709/2018 (Lei Geral de Proteção de Dados). Última atualização: ${fmtDate(TODAY)}.", cls: "phead--short" })}
<main id="main" class="site-main"><section class="sec sec--light"><div class="inner"><article class="article">
  <h2>1. Controlador</h2><p>${S.name}${S.razaoSocial ? ` (${S.razaoSocial}${S.cnpj ? `, CNPJ ${S.cnpj}` : ""})` : ""}, com sede em ${S.address}, ${S.city}. Contato para assuntos de privacidade: <a href="mailto:${S.email}">${S.email}</a>.</p>
  <h2>2. Dados que coletamos</h2><ul><li><strong>Formulários:</strong> nome, empresa, e-mail, telefone, segmento, serviço de interesse e mensagem (diagnóstico); nome, e-mail, empresa e telefone (newsletter); nome, e-mail, telefone, link de currículo e mensagem (candidaturas); dados do formulário de parcerias.</li><li><strong>Navegação:</strong> endereço IP, páginas acessadas e dados técnicos do navegador, registrados nos logs do servidor para segurança e prevenção de abuso.</li><li><strong>Cookies:</strong> apenas os essenciais para o funcionamento do site e a lembrança da sua escolha sobre cookies.</li></ul>
  <h2>3. Finalidades e bases legais</h2><ul><li>Responder solicitações de diagnóstico e enviar propostas (execução de medidas pré-contratuais a pedido do titular).</li><li>Enviar a newsletter que você assinou (consentimento, revogável a qualquer momento).</li><li>Conduzir processos de recrutamento (execução de medidas pré-contratuais).</li><li>Proteger o site contra abuso e fraude (legítimo interesse).</li></ul>
  <h2>4. Compartilhamento</h2><p>Não vendemos dados pessoais. Podemos compartilhá-los com fornecedores que operam serviços em nosso nome (hospedagem, e-mail, CRM), sob contrato e com obrigação de confidencialidade, e com autoridades quando houver obrigação legal.</p>
  <h2>5. Retenção</h2><p>Dados de solicitações comerciais são mantidos pelo período necessário ao atendimento e, havendo contrato, pelos prazos legais aplicáveis. Dados de candidatura são mantidos por até 12 meses. Você pode pedir a exclusão antes disso.</p>
  <h2>6. Seus direitos</h2><p>Confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamento e revogação do consentimento. Solicite pelo e-mail <a href="mailto:${S.email}">${S.email}</a>; respondemos nos prazos da LGPD.</p>
  <h2>7. Segurança</h2><p>Adotamos controles técnicos e organizacionais proporcionais ao risco: transmissão criptografada (HTTPS), controle de acesso, limitação de tentativas e registro de eventos.</p>
  <h2 id="cookies">8. Política de Cookies</h2><p>Usamos cookies essenciais (funcionamento e segurança) e, somente se você aceitar no aviso exibido, cookies de desempenho para entender como o site é usado. Você pode mudar a escolha apagando os dados do site no navegador. Não usamos cookies de publicidade.</p>
  <h2>9. Alterações</h2><p>Esta política pode ser atualizada. A data da última revisão aparece no topo da página.</p>
</article></div></section></main>`;
  return page({ key: "privacidade", title: m.title, description: m.description, body, path: "/privacidade/", crumbs: [["Política de Privacidade", "/privacidade/"]] });
}

function notFound() {
  const body = `${phead({ crumbs: [["Página não encontrada"]], eyebrow: "Erro 404", h1: "Página <strong>não encontrada</strong>", p: "O endereço acessado não existe ou foi movido.", actions: `<div class="actions"><a class="btn btn--lg" href="/">Voltar ao início</a><a class="btn btn--outline btn--lg" href="/atuacao/">Ver soluções</a></div>`, cls: "phead--short" })}<main id="main" class="site-main">${ctaBand("Precisa de ajuda? <strong>Fale com a gente.</strong>", { href: "/contato/#diagnostico", waText: WA_DEFAULT })}</main>`;
  return page({ key: "404", title: `Página não encontrada | ${S.name}`, description: "Página não encontrada.", body, path: "/404", noindex: true });
}

/* =====================================================================
   BUILD
   ===================================================================== */
async function out(path, html) {
  const file = path.endsWith(".html") ? join(OUT, path) : join(OUT, path, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp(ASSETS, join(OUT, "assets"), { recursive: true });
await writeFile(join(OUT, "assets/js/brazil-geo.js"), `window.BR_GEO=${JSON.stringify(BR)};`);

const pages = [
  ["/", home()], ["sobre", about()], ["esg", esgPage()], ["carreira", careers()], ["cases", casesPage()], ["plataforma", platformPage()],
  ["parcerias", partnerHubPage()], ...D.partnerPrograms.map((p) => [`parcerias/${p.slug}`, partnerProgramPage(p)]),
  ["contato", contact()], ["conteudo", blog()], ["atuacao", servicesIndex()], ["verticais", verticalsIndex()], ["privacidade", privacy()], ["404.html", notFound()],
  ...D.services.map((s) => [`atuacao/${s.slug}`, servicePage(s)]),
  ...D.verticals.map((v) => [`verticais/${v.slug}`, verticalPage(v)]),
  ...D.posts.map((p) => [`conteudo/${p.slug}`, post(p), p.date]),
];
for (const [p, html] of pages) await out(p, html);

const urls = pages.filter(([p]) => !p.endsWith(".html")).map(([p, , lm]) => [p === "/" ? "/" : `/${p}/`, lm || TODAY]);
await writeFile(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, lm]) => `  <url><loc>${S.url}${u}</loc><lastmod>${lm}</lastmod></url>`).join("\n")}\n</urlset>\n`);
await writeFile(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${S.url}/sitemap.xml\n`);
console.log(`✓ ${pages.length} páginas geradas em /public`);
