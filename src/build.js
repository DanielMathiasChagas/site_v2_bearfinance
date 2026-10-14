// =====================================================================
// Gera o site estático em /public a partir de src/data.js
// Estrutura, seções e proporções seguem o modelo de referência;
// paleta, textos, imagens e vídeos são da Bear Finance.
// =====================================================================
import { mkdir, writeFile, cp, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as D from "./data.js";
import { BR } from "./brazil-geo.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public");
const { site } = D;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const strip = (s) => String(s).replace(/<[^>]+>/g, "");
const img = (f) => `/assets/img/${f}`;
const bg = (f) => `style="background-image:url('${img(f)}')"`;
const fmtDate = (d) => { const [y, m, dd] = d.split("-"); return `${dd}/${m}`; };
const fmtDateLong = (d) => new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
const ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`;

/* =====================================================================
   LAYOUT
   ===================================================================== */
function header(active = "") {
  const cur = (k) => (active === k ? " current" : "");
  return `
<header id="masthead" class="site-header">
  <div class="site-branding">
    <div class="inner">
      <div class="v-table">
        <a class="logo-link" href="/" aria-label="${site.name} — início">
          <img src="${img("URSO_GEOMETRICO_PURPLE.png")}" alt="" width="42" height="42">
          <span>BEAR FINANCE<small>Soluções contábeis</small></span>
        </a>
        <div style="display:flex;align-items:center;gap:10px">
          <nav id="site-navigation" class="main-navigation" aria-label="Menu principal">
            <ul id="primary-menu" class="menu">
              <li class="menu-item menu-item-has-children${cur("sobre")}"><a href="/sobre/">Sobre</a>
                <ul class="sub-menu"><li><a href="/sobre/">A Bear</a></li><li><a href="/esg/">ESG</a></li><li><a href="/carreira/">Carreira</a></li><li><a href="/cases/">Cases de Sucesso</a></li></ul></li>
              <li class="menu-item menu-item-has-children${cur("atuacao")}"><a href="/atuacao/">Atuação</a>
                <ul class="sub-menu">${D.services.map((s) => `<li><a href="/atuacao/${s.slug}/">${s.name}</a></li>`).join("")}</ul></li>
              <li class="menu-item menu-item-has-children${cur("verticais")}"><a href="/verticais/">Verticais</a>
                <ul class="sub-menu">${D.verticals.map((v) => `<li><a href="/verticais/${v.slug}/">${v.name}</a></li>`).join("")}</ul></li>
              <li class="menu-item menu-item-has-children${cur("parcerias")}"><a href="/parcerias/">Parcerias</a>
                <ul class="sub-menu"><li><a href="/parcerias/">Programas de parceria</a></li>${D.partnerPrograms.map((p) => `<li><a href="/parcerias/${p.slug}/">${p.name}<small class="sub-note">${p.short}</small></a></li>`).join("")}</ul></li>
              <li class="menu-item${cur("plataforma")}"><a href="/plataforma/">Plataforma</a></li>
              <li class="menu-item${cur("cases")}"><a href="/cases/">Cases <span class="hmd">de Sucesso</span></a></li>
              <li class="menu-item${cur("conteudo")}"><a href="/conteudo/">Conteúdo</a></li>
              <li class="menu-item hmd${cur("contato")}"><a href="/contato/">Contato</a></li>
              <li class="btn hsm hxs menu-item"><a href="/contato/">Solicitar proposta</a></li>
            </ul>
          </nav>
          <div class="lang hxs" aria-label="Idioma"><a class="active" href="/" hreflang="pt-BR">PT</a><a href="/" hreflang="en" title="Em breve">EN</a><a href="/" hreflang="es" title="Em breve">ES</a></div>
          <button id="open-menu" class="open-menu hmd" type="button" aria-label="Abrir menu" aria-controls="site-navigation"><i></i></button>
        </div>
      </div>
    </div>
  </div>
</header>`;
}

function footer(waHref = site.whatsapp) {
  return `
<footer id="colophon" class="site-footer bg" ${bg("ph-12.svg")}>
  <div id="newsletter" class="pt60 pb40">
    <div class="inner relative">
      <div class="nl-card inspect in">
        <div class="nl-intro text-white">
          <span class="nl-eyebrow">Newsletter</span>
          <h2 class="nl-title">Assine a nossa <span>Newsletter</span></h2>
          <p>Cadastre-se e receba novidades exclusivas, artigos e materiais da Bear Finance no seu e-mail.</p>
        </div>
        <form id="form-newsletter" class="nl-form" data-api="/api/newsletter" novalidate>
          <div class="nl-fields">
            <label class="nl-field"><span>Nome</span><input type="text" name="nome" placeholder="Seu nome" autocomplete="name"></label>
            <label class="nl-field"><span>E-mail <em>*</em></span><input type="email" name="email" placeholder="voce@empresa.com.br" autocomplete="email" required></label>
            <label class="nl-field"><span>Telefone</span><input type="tel" name="telefone" placeholder="(00) 00000-0000" autocomplete="tel"></label>
            <label class="nl-field"><span>Empresa</span><input type="text" name="empresa" placeholder="Nome da empresa" autocomplete="organization"></label>
          </div>
          <div class="nl-actions">
            <p class="nl-note">Sem spam. Você pode cancelar quando quiser.</p>
            <button class="btn" type="submit">Assinar</button>
          </div>
          <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p class="message text-white" role="status"></p>
        </form>
      </div>
    </div>
  </div>
  <div class="inner">
    <div class="row v-center pb30 pt15">
      <div class="colmd2 colsm3 colxs5"><a class="logo-link" href="/"><img src="${img("URSO_GEOMETRICO_PURPLE.png")}" alt="${site.name}" width="42" height="42"><span>BEAR<small>FINANCE</small></span></a></div>
      <div class="colmd8 colsm6"></div>
      <div class="colmd2 colsm3 colxs7 pb5 text-right">
        <ul class="social">
          <li><a href="${site.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a></li>
          <li><a href="${site.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a></li>
          <li><a href="${site.youtube}" target="_blank" rel="noopener" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a></li>
          <li><a href="${site.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a></li>
        </ul>
      </div>
    </div>
    <div id="unidades">
      <div class="unidades-title">UNIDADES</div>
      <div class="g sm2 md4 v-top mt15">
        ${D.presence.offices.map(([c, a, t]) => `<div class="unidade pb15"><div class="fw7">${c}</div>${t ? `<a class="fz14 fw4" href="${site.phoneHref}">${t}</a>` : ""}<div class="fz14">${a}</div></div>`).join("")}
        <div class="unidade pb15"><div class="fw7">E-mail</div><a class="fz14" href="mailto:${site.email}">${site.email}</a></div>
        <div class="unidade pb15"><div class="fw7">Plataforma</div><a class="fz14" href="${site.platformUrl}">Acesso do cliente</a></div>
        <div class="unidade pb15"><div class="fw7">Parcerias</div>${D.partnerPrograms.map((p) => `<a class="fz14" style="display:block" href="/parcerias/${p.slug}/">${p.name}</a>`).join("")}</div>
      </div>
    </div>
    <div class="copy">
      <p>© <span id="year"></span> ${site.name}. Todos os direitos reservados.</p>
      <nav><a href="/privacidade/">Política de Privacidade</a><a href="/privacidade/#cookies">Política de Cookies</a></nav>
    </div>
  </div>
</footer>
<a class="scroll-top" href="#top" aria-label="Voltar ao topo"><i class="fa-solid fa-chevron-up"></i></a>
<a class="whatsapp-action" href="${waHref}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
<div class="cookieConsentContainer hidden">
  <span class="cookieTitle">Cookies</span>
  <div class="cookieDesc"><p>Usamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com a nossa <a href="/privacidade/">Política de Privacidade</a>.</p></div>
  <div class="cookieButton"><a href="#">Aceitar</a></div>
</div>`;
}

function page({ title, description, active = "", bodyClass = "", body, path = "/", jsonld = [], waHref }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${site.url}${path}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${site.url}${img("URSO_GEOMETRICO_PURPLE.png")}">
<meta name="theme-color" content="#150f24">
<link rel="icon" href="${img("URSO_GEOMETRICO_PURPLE.png")}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;600;700;800&family=Dancing+Script:wght@600&display=swap">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/site.css">
${jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
</head>
<body class="${bodyClass}${site.placeholderLabels === false ? " hide-ph" : ""}">
<a id="top"></a>
${header(active)}
<div id="content" class="site-content">
${body}
</div>
${footer(waHref)}
<script src="/assets/js/site.js" defer></script>
</body>
</html>`;
}

/* =====================================================================
   BLOCOS REUTILIZÁVEIS
   ===================================================================== */
const breadcrumbs = (items) => `
<div class="g md8 sm8"><div class="breadcrumbs-inner"><div id="breadcrumbs" class="breadcrumbs fz16 mb10"><div class="breadcrumbs pb5">
  <a href="/">Home</a>${items.map(([t, h]) => `<span class="sep">»</span>${h ? `<a href="${h}">${t}</a>` : `<span>${t}</span>`}`).join("")}
</div></div></div></div>`;

// Topo das páginas internas
const headline = ({ crumbs, h1, h2, p, actions = "", image, video = "", cls = "", list = [] }) => `
<div id="site-headline" class="${cls}">
  <div id="bg" class="bg ph" ${image ? bg(image) : ""}>${video ? `<div id="video-home" data-video="${video}"></div>` : site.headlineFx ? `<canvas class="fx-waves fx-waves--soft" aria-hidden="true"></canvas>` : ""}</div>
  <div class="inner relative">
    ${breadcrumbs(crumbs)}
    <div class="row v-center">
      <div id="content_before" class="colmd8 pb10 colsm10">
        <h1>${h1}</h1>
        ${h2 ? `<h2>${h2}</h2>` : ""}
        ${p ? `<p>${p}</p>` : ""}
        ${list.length ? `<ul>${list.map((l) => `<li>${l}</li>`).join("")}</ul>` : ""}
        ${actions}
      </div>
      <div class="colmd4 colsm2"></div>
    </div>
  </div>
</div>`;

// Curva escura descendo sobre o branco, com a seta "scroll" no centro
const scrollBand = (target) => `
<div class="hero-curve" aria-hidden="false">
  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0,0 H1440 V0 C1260,0 1160,6 1040,36 C930,64 860,120 720,120 C580,120 510,64 400,36 C280,6 180,0 0,0 Z"/></svg>
  <a id="scroll" href="${target}" aria-label="Rolar para o conteúdo"><i class="fa-solid fa-chevron-down"></i></a>
</div>`;

// Bloco de vídeo (presente em todas as páginas)
const videoBox = ({ id = "", title = "Vídeo", sub = "", poster = "ph-10.svg" }) => `
<div class="video-container">
  <div class="poster ph" ${id ? `data-embed="${id}"` : ""} data-title="${esc(title)}" style="--poster:url('${img(poster)}')" role="button" tabindex="0" aria-label="Reproduzir: ${esc(title)}">
    <span class="play"><i class="fa-solid fa-play"></i></span>
    <div class="label">${title}<small>${id ? sub : "Espaço reservado para vídeo · informe o ID em src/data.js"}</small></div>
  </div>
</div>`;

// Seção de vídeo institucional (home / sobre / etc.)
const videoSection = ({ id, title, sub }, h2, p, { dark = true, poster = "ph-10.svg", sid = "video-institucional" } = {}) => `
<section id="${sid}" class="${dark ? "dark" : ""} relative">
  <div class="inner"><div class="row v-center">
    <div class="colmd5 colsm12 pb40 inspect"><h2>${h2}</h2><p>${p}</p></div>
    <div class="colmd7 colsm12 inspect">${videoBox({ id, title, sub, poster })}</div>
  </div></div>
</section>`;

// Seção "meu vídeo" (páginas internas: serviço / vertical)
const videoInline = (v, h2, poster) => `
<section id="meu-video" class="pt40 pb60"><div class="inner"><div class="row v-center">
  <div class="colmd4 colsm12 inspect"><h2>${h2}</h2><p class="fz18">${v.sub || ""}</p></div>
  <div class="colmd8 colsm12 inspect">${videoBox({ ...v, poster })}</div>
</div></div></section>`;

const callDestaque = (html) => `
<section id="call-destaque" class="fz22 mt60 pb50 pt50 text-black"><div class="inner"><div class="row v-center"><div class="colmd9 colsm9 text-center inspect"><p>${html}</p></div></div></div></section>`;

const callService = (text = "Uma conversa de 15 minutos é o que separa você de mais resultados nos negócios!", btn = "Fale com um especialista") => `
<section id="call-service" class="bg-gray text-black pt50 pb50">
  <div class="bg ph" ${bg("ph-11.svg")}></div>
  <div class="inner"><div class="row v-center">
    <div class="colmd8 colsm8 text-white inspect"><p>${text}</p></div>
    <div class="colmd1 hsm hxs"></div>
    <div class="colmd3 colsm4 inspect"><a class="btn btn-block" href="/contato/">${btn}</a></div>
  </div></div>
</section>`;

const faqBlock = (items) => `
<section id="faq" class="pt80 pb80 bg-gray"><div class="inner">
  <h2 class="text-center fw7 mb50">Perguntas Frequentes</h2>
  ${items.map(([q, a]) => `<div class="faq-item"><h3 class="faq-title">${q}<span class="icon-plus"></span></h3><div class="faq-content"><p>${a}</p></div></div>`).join("")}
</div></section>`;
const faqLd = (items) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: strip(q), acceptedAnswer: { "@type": "Answer", text: strip(a) } })) });

const itemService = (s) => `
<div class="item-service inspect">
  <div class="ico"><i class="fa-solid ${s.icon}"></i></div>
  <h3 class="service-title">${s.name}</h3>
  <div class="excerpt">${s.excerpt}</div>
  <div class="pt10"><a class="btn" href="/atuacao/${s.slug}/">Saiba mais</a></div>
</div>`;

const erpGrid = () => `<div class="g md4 sm3 xs2 pt20">${D.erps.map((e) => `<div class="text-center p15"><span class="erp-mark"><i class="fa-solid fa-cube"></i>${e}</span></div>`).join("")}</div>`;

const verticalSlide = (v, i) => `
<div class="swiper-slide">
  <div class="bg ph" ${bg(v.img)}>
    <div class="flex-segmento">
      <span class="i text-border">${i + 1}</span>
      <div class="row v-center" style="width:100%">
        <div class="colmd8 colsm10"><div class="vertical-info"><h3 class="mb0 text-white">${v.name}</h3><p>${v.short}</p></div></div>
        <div class="colmd4 colsm10"><a class="btn-link" href="/verticais/${v.slug}/">Conheça mais <span>→</span></a></div>
      </div>
      <a class="absolute" href="/verticais/${v.slug}/" aria-label="${v.name}"></a>
    </div>
  </div>
</div>`;

const verticalCard = (v, i) => `
<div class="vertical-card inspect" data-category="${esc(v.name)}">
  <div class="bg ph" ${bg(v.img)}>
    <div class="flex-segmento">
      <span class="i text-border">${i + 1}</span>
      <div class="vertical-info"><h3 class="mb0 text-white">${v.name}</h3><p>${v.short}</p><a class="btn-link" href="/verticais/${v.slug}/">Conheça mais <span>→</span></a></div>
      <a class="absolute" href="/verticais/${v.slug}/" aria-label="${v.name}"></a>
    </div>
  </div>
</div>`;

const postCard = (p, cls = "colmd4 colsm4") => `
<div class="${cls}" data-category="${esc(p.cat)}">
  <article class="pb40 inspect">
    <div class="relative relative-thumb mb20"><div class="post-img radius10 bg ph" ${bg(p.img)}><a class="absolute" href="/conteudo/${p.slug}/" aria-label="${esc(p.title)}"></a></div></div>
    <div class="mt10 mb10 cats-first"><a href="/conteudo/#${encodeURIComponent(p.cat)}">${p.cat}</a><span class="text-right">${fmtDate(p.date)}</span></div>
    <a class="post-link" href="/conteudo/${p.slug}/">${p.title}</a>
    <p class="mt15"><a class="btn-more" href="/conteudo/${p.slug}/">Continue lendo</a></p>
  </article>
</div>`;

// Mapa do Brasil por UF (malha IBGE em src/brazil-geo.js): contornos, capitais e conexões a partir da sede
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
  return `<svg class="br-map" viewBox="0 0 ${w + 210} ${h}" role="img" aria-label="Mapa do Brasil: sede em São Paulo e atendimento digital nos 27 estados">
  <defs><radialGradient id="br-glow"><stop offset="0" stop-color="#8b5cf6" stop-opacity=".55"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient></defs>
  <g class="br-ufs">${ufs}</g>
  <g class="br-arcs">${arcs}</g>
  <g class="br-caps">${dots}</g>
  <circle cx="${sp.x}" cy="${sp.y}" r="70" fill="url(#br-glow)"/>
  <circle class="br-pulse" cx="${sp.x}" cy="${sp.y}" r="10"/>
  <circle cx="${sp.x}" cy="${sp.y}" r="9" fill="#fff"/>
  <polyline class="br-callout" points="${sp.x + 12},${sp.y + 8} ${sp.x + 60},${ly} ${lx - 10},${ly}"/>
  <text class="br-label" x="${lx}" y="${ly + 8}">São Paulo</text>
  <text class="br-sub" x="${lx}" y="${ly + 36}">Sede</text>
  <g class="br-legend" transform="translate(${lx} ${h - 70})"><circle cx="8" cy="0" r="8" fill="#fff"/><text x="26" y="7">Sede</text><circle cx="8" cy="34" r="5"/><text x="26" y="41">Atendimento digital</text></g>
</svg>`;
}

const contactForm = () => `
<form id="contatoForm" class="aside pt40 pb40 bg-gray pl25 pr25 mb40 text-dark" data-api="/api/contato" novalidate>
  <h3 class="fz28 fw7 text-dark">Fale conosco</h3>
  <div class="row">
    <div class="colmd4 colsm4"><input type="text" name="nome" placeholder="Nome *" required aria-label="Nome"></div>
    <div class="colmd4 colsm4"><input type="text" name="empresa" placeholder="Empresa *" required aria-label="Empresa"></div>
    <div class="colmd4 colsm4"><input type="text" name="cargo" placeholder="Seu cargo *" required aria-label="Cargo"></div>
    <div class="colmd6 colsm6"><input type="tel" name="telefone" placeholder="Celular *" required aria-label="Celular"></div>
    <div class="colmd6 colsm6"><input type="email" name="email" placeholder="E-mail corporativo *" required aria-label="E-mail"></div>
    <div class="colmd6 colsm6"><select name="erp" aria-label="ERP"><option value="">Sua empresa utiliza um ERP? *</option>${D.erpOptions.map((o) => `<option>${o}</option>`).join("")}</select></div>
    <div class="colmd6 colsm6"><select name="faturamento" aria-label="Faturamento anual"><option value="">Faturamento anual *</option>${D.revenueOptions.map((o) => `<option>${o}</option>`).join("")}</select></div>
    <div class="colmd12"><textarea name="mensagem" placeholder="Mensagem" aria-label="Mensagem"></textarea></div>
    <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="colmd12"><label class="consent"><input type="checkbox" name="lgpd" value="sim" required> Autorizo a Bear Finance a entrar em contato e tratar meus dados conforme a <a href="/privacidade/">Política de Privacidade</a>.</label></div>
    <div class="colmd12"><div id="statusMessage" class="message" role="status"></div></div>
    <div class="colmd4 colsm6 colxs8"><button id="submitBtn" class="btn btn-block" type="submit">Enviar</button></div>
  </div>
</form>`;

/* =====================================================================
   PÁGINAS
   ===================================================================== */
function home() {
  const body = `
<div id="bg" class="slideHome bg ph" ${bg(site.heroImage)}>
  <div id="video-home" ${site.heroVideo ? `data-video="${site.heroVideo}"` : ""}></div>
  ${site.heroVideo ? "" : `<canvas class="fx-waves" aria-hidden="true"></canvas>`}
  <div class="slide-text"><div class="inner"><div class="row">
    <div class="colmd7 colsm7 inner-content">
      <div class="fz26 text-lilas"><strong class="item_Writer">Soluções <span class="typed-text" data-words='${JSON.stringify(D.hero.typedWords)}'></span><span class="cursor"></span></strong></div>
      <h1>${D.hero.title}</h1>
      <p><a class="btn mr20" href="${D.hero.ctaHref}">${D.hero.cta}</a><a class="btn btn--outline" href="#video-institucional"><i class="fa-solid fa-play" style="margin-right:8px"></i>Assista ao vídeo</a></p>
    </div>
  </div></div></div>
  <section id="logos" aria-label="Clientes"><div class="inner">
    <div class="swiper swiper-clientes"><div class="swiper-wrapper">
      ${D.clients.map((c, i) => `<div class="swiper-slide"><div class="logo-cliente"><span class="logo-placeholder"><i>${String(i + 1).padStart(2, "0")}</i>${c}</span></div></div>`).join("")}
    </div></div>
  </div></section>
</div>
${scrollBand("#servicos")}

<main id="main" class="site-main">

  <section id="servicos" class="pt0 pb80"><div class="inner pt40">
    <div class="row v-center">
      <div class="colmd5 colsm5 line-title"><h2 class="inspect down">Áreas <span>de atuação</span></h2></div>
      <div class="colmd1 hsm hxs"></div>
      <div class="colmd6 colsm6 inspect"><p class="fz18">Contabilidade, finanças, pessoas e tributos integrados em um só parceiro, com tecnologia própria e um time que conhece o seu setor.</p></div>
      <div class="colmd1 hsm hxs"></div>
    </div>
    <div class="g md5 sm2 mt60">${D.services.map(itemService).join("")}</div>
  </div></section>

  ${videoSection(D.videos.home, "Conheça a <strong>Bear Finance</strong>", "Em dois minutos, veja como unimos contabilidade, finanças e tecnologia para transformar a gestão de empresas em todo o Brasil.", { poster: "ph-09.svg" })}

  <section id="color-boxes" class="pt80 pb80">
    <div class="inner"><div class="row"><div class="colmd5 colsm5 line-title"><h2 class="inspect down">Por que a <span>Bear?</span></h2></div></div></div>
    <div id="inner-boxes" class="mt40"><div class="g md3 sm3">
      ${D.why.map((w, i) => `<div class="item-box inspect${w.bg ? " has-bg ph" : ""}" id="box-${i + 1}" style="${w.bg ? `--bg:url('${img(w.bg)}');` : ""}transition-delay:${i * 90}ms"><div class="relative">${w.html}</div></div>`).join("")}
    </div></div>
  </section>

  <section id="verticais" class="pt0 pb0"><div class="inner">
    <div class="row v-center">
      <div class="colmd4 colsm4 line-title"><h2 class="inspect down">Verticais <span>de negócio</span></h2></div>
      <div class="colmd1 hsm hxs"></div>
      <div class="colmd6 colsm6 inspect down"><p class="fz28"><strong>Eficiência tributária</strong> para todos os setores e negócios</p><p>Temos um time atualizado e comprometido com soluções alinhadas ao planejamento estratégico de cada vertical.</p></div>
      <div class="colmd1 hsm hxs"></div>
    </div>
  </div>
  <div class="vertical-inner mt60">
    <div class="swiper swiper-vertical"><div class="swiper-wrapper">${D.verticals.map(verticalSlide).join("")}</div>
      <div class="swiper-pagination vertical-pagination"></div>
      <div class="swiper-button-next vertical-button-next"></div><div class="swiper-button-prev vertical-button-prev"></div>
    </div>
  </div></section>

  <section id="erps" class="pt80 pb80"><div class="inner">
    <div class="row v-center">
      <div class="colmd4 colsm4 line-title"><h2 class="inspect down">Gestão <span>contábil</span></h2></div>
      <div class="colmd1 hsm hxs"></div>
      <div class="colmd6 colsm6 inspect down"><p class="fz28">Somos <strong>especialistas</strong> em gestão contábil nos <strong>principais ERPs</strong> do mercado</p></div>
      <div class="colmd1 hsm hxs"></div>
    </div>
    ${erpGrid()}
  </div></section>

  <section id="locais" class="pt80 pb60">
    <div class="pattern"></div>
    <div class="inner"><div class="row v-center">
      <div class="colmd4 colsm4 pl0">
        <div class="relative line-title pl15 inspect down">
          <h2 class="text-white">Presença <span>nacional</span></h2>
          <div class="text-white fz20"><p>${D.presence.p}</p></div>
        </div>
        <div class="sob-gestao pl15 mt40 inspect down">
          <div id="nossos-numeros" class="g md2">
            ${D.presence.numbers.map(([n, l, pre, suf]) => `<div><strong data-number="${n}" data-prefix="${pre}" data-suffix="${suf}">${pre}${n}${suf}</strong><span>${l}</span></div>`).join("")}
          </div>
        </div>
      </div>
      <div class="colmd8 colsm8 circle-map inspect">${brazilMap()}</div>
    </div></div>
  </section>

  <section id="blog" class="pt80 pb80"><div class="inner">
    <div class="row v-center mb60"><div class="colmd8 colsm8 colmdoffset2 text-center">
      <h2 class="fz22 inspect down">Materiais ricos | Blog | Webinar e podcasts | Eventos</h2>
      <div class="inspect"><h2><strong>Últimas Publicações</strong></h2></div>
    </div></div>
    <div class="row">${D.posts.slice(0, 3).map((p) => postCard(p)).join("")}</div>
    <p class="mt10 text-center"><a class="btn" href="/conteudo/">Mais publicações</a></p>
  </div></section>

  ${faqBlock(D.faq)}
</main>`;
  return page({
    title: "Bear Finance | Soluções Contábeis, Financeiras e Tributárias", description: "Contabilidade empresarial, BPO financeiro, folha de pagamento, auditoria e estruturações corporativas com tecnologia própria e IA. Atendimento em todo o Brasil.",
    active: "home", bodyClass: "home", body, path: "/",
    jsonld: [faqLd(D.faq), { "@context": "https://schema.org", "@type": "AccountingService", name: site.name, url: site.url, email: site.email, telephone: site.phone, image: site.url + img("URSO_GEOMETRICO_PURPLE.png"), address: { "@type": "PostalAddress", streetAddress: "Rua Riachuelo, 231 – 4º andar", addressLocality: "São Paulo", addressRegion: "SP", postalCode: "01007-000", addressCountry: "BR" } }],
  });
}

function servicePage(s) {
  const body = `
${headline({ crumbs: [["Áreas de atuação", "/atuacao/"], [s.name]], h1: s.name, h2: s.headline.h2, p: s.headline.p, image: s.img })}
${scrollBand("#conteudo")}
<div id="primary" class="content-area"><main id="main" class="site-main">
  <div id="conteudo"><div class="inner pt50">
    <div class="row v-center">
      <div class="colmd7 colsm7 fz18 h2-before inspect">
        <h2>${s.intro.h2}</h2>
        <p>${s.intro.p}</p>
        ${s.intro.arrows.map((a) => `<p class="arrow">${a}</p>`).join("")}
        <p>${s.intro.close}</p>
      </div>
      <div class="colmd5 colsm5 v-top inspect"><div class="hxs pt40"></div><div class="thumb-box bg ph" ${bg(s.img)}></div></div>
    </div>
  </div></div>

  ${videoInline(s.video, `Veja <strong>como funciona</strong>`, s.img2)}

  <section id="erps" class="pt80 pb80"><div class="inner">
    <div class="row"><div class="colmd8 colsm8 line-title"><h2 class="inspect down">Nossas soluções são <span>personalizadas para o seu ERP</span></h2></div></div>
    ${erpGrid()}
  </div></section>

  <section id="content4" class="pt0 pb60"><div class="inner"><div class="row v-center">
    <div class="colmd5 colsm5 v-top inspect"><div class="thumb-box landscape bg ph" ${bg(s.img2)}></div></div>
    <div class="colmd7 colsm7 fz18 h2-before inspect">
      <h2>${s.method.h2}</h2>
      ${s.method.items.map(([t, p]) => `<p class="arrow"><strong>${t}</strong><br>${p}</p>`).join("")}
    </div>
  </div></div></section>
</main></div>

${callDestaque(s.quote)}
${callService()}

<section id="PrimeGlobal" class="text-white pt40 pb80">
  <div class="bg-layer"></div>
  <div class="inner">
    <div class="row v-center">
      <div class="colmd3 colsm3 colxs7 pt40"><a class="logo-link" href="/"><img src="${img("URSO_GEOMETRICO_PURPLE.png")}" alt="${site.name}" width="42" height="42"><span>BEAR<small>FINANCE</small></span></a></div>
      <div class="colmd3 colsm3 colxs7 pt40"><span class="badge"><i class="fa-solid fa-robot"></i>Plataforma Bear · IA</span></div>
      <div class="colmd6 colsm6 hxs"></div>
    </div>
    <div class="row"><div class="colmd8 colsm8 pt40">
      <p>Todo serviço de ${s.name} é entregue dentro da <a href="/plataforma/"><strong>Plataforma Bear</strong></a>: dashboards em tempo real, integração com bancos e ERPs e inteligência artificial que automatiza lançamentos, conciliações e alertas de compliance.</p>
      <div class="pt40"><a class="btn" href="/plataforma/">Conhecer a plataforma</a></div>
    </div></div>
  </div>
</section>
${faqBlock(s.faq)}`;
  return page({ title: `${s.name} | Bear Finance`, description: strip(s.headline.p), active: "atuacao", bodyClass: "single-servico", body, path: `/atuacao/${s.slug}/`, jsonld: [faqLd(s.faq)] });
}

function servicesIndex() {
  const body = `
${headline({ crumbs: [["Áreas de atuação"]], h1: "Áreas de atuação", h2: "Soluções completas<br>para cada <strong>desafio</strong> do seu negócio", p: "Escolha uma área para conhecer como podemos ajudar.", image: "ph-02.svg" })}
<main id="main" class="site-main">
  <section id="servicos" class="pt80 pb40"><div class="inner"><div class="g md5 sm2">${D.services.map(itemService).join("")}</div></div></section>
  ${videoSection(D.videos.home, "Veja a Bear <strong>em ação</strong>", "Como entregamos contabilidade, finanças e tributos em uma única operação integrada.", { poster: "ph-09.svg" })}
  ${callService()}
  ${faqBlock(D.faq)}
</main>`;
  return page({ title: "Áreas de atuação | Bear Finance", description: "Contabilidade, BPO Financeiro, Folha de Pagamento, Auditoria e Estruturações Corporativas.", active: "atuacao", body, path: "/atuacao/" });
}

function verticalPage(v) {
  const body = `
${headline({ crumbs: [["Verticais de Negócio", "/verticais/"], [v.name]], h1: v.name, p: v.headline, image: v.img, cls: "headline--big", actions: `<p><a class="btn mt20" href="/contato/">Fale com um especialista</a></p>` })}
<div id="primary" class="content-area"><main id="main" class="site-main">
  <div class="bg-bluedark pt0 text-white pb60"><div class="inner"><div class="g g-verticais pt40">${v.g.map((p) => `<p class="inspect">${p}</p>`).join("")}</div></div></div>

  <div class="inner pb100 pt80">
    <div class="row v-center">
      <div class="colmd7 colsm7 fz18 h2-before inspect"><p class="eyebrow">${v.block1.eyebrow}</p><h2>${v.block1.h2}</h2>${v.block1.p.map((p) => `<p>${p}</p>`).join("")}</div>
      <div class="colmd5 colsm5 v-top inspect"><div class="thumb-box filter-gray bg ph" ${bg(v.img)}></div></div>
    </div>
    <div class="row v-center pt50">
      <div class="colmd5 colsm5 v-top inspect"><div class="thumb-box filter-gray bg ph" ${bg(D.verticals[(D.verticals.indexOf(v) + 3) % D.verticals.length].img)}></div></div>
      <div class="colmd7 colsm7 fz18 h2-before pt40 pb40 inspect"><p class="eyebrow">${v.block2.eyebrow}</p><h2>${v.block2.h2}</h2>${v.block2.p.map((p) => `<p>${p}</p>`).join("")}</div>
    </div>

    ${videoInline({ id: "", title: `Contabilidade para ${v.name}`, sub: "Veja como atendemos o setor" }, `Veja como atendemos<br><strong>${v.name}</strong>`, v.img).replace('class="pt40 pb60"', 'class="pt60 pb20"')}

    <div id="atuacao1" class="pt40"><div class="row">
      <div class="colmd5 colsm4 pt80 inspect"><p class="eyebrow fw7 text-roxo" style="letter-spacing:.14em;text-transform:uppercase;font-size:14px">${v.atuacao.eyebrow}</p><h2 class="fz36 fw3" style="line-height:1.1">${v.atuacao.h2}</h2><p class="fz18">${v.atuacao.p}</p></div>
      <div class="colmd7 colsm8 pt40 inspect">
        <div id="atua" class="swiper swiper-atua"><div class="swiper-wrapper">
          ${v.atuacao.items.map((it, i) => `<div class="swiper-slide"><div class="item-atua"><div class="circle bg ph" ${bg(D.verticals[(i + D.verticals.indexOf(v)) % D.verticals.length].img)}></div><div class="atuacao-text">${it}</div></div></div>`).join("")}
        </div><div class="swiper-pagination atua-pagination mt10"></div></div>
      </div>
    </div></div>
  </div>

  <section id="get-logos" class="bg-bluedark pb0 pt60 text-white"><div class="inner pb60"><div class="row v-center">
    <div class="colmd8 colsm8 fz20 inspect">
      <h3 class="mb0 text-white" style="font-size:30px;font-weight:300">${v.partner.h3.replace("<strong>", '<strong class="text-lilas">')}</h3>
      <p class="fw7 mt20" style="letter-spacing:.14em;font-size:13px">PARCERIA DE SUCESSO</p>
      <p><span class="partner-badge"><i class="fa-solid fa-handshake"></i>Logo do parceiro · substituir</span></p>
      <p style="opacity:.85;font-size:17px">${v.partner.p}</p>
    </div>
    <div class="colmd4 colsm4 v-top text-right inspect"><span class="partner-badge" style="padding:40px 30px"><i class="fa-solid fa-certificate" style="font-size:28px;color:var(--roxo-claro)"></i>Selo / parceiro</span></div>
  </div></div>
  <section id="list-services" class="bg-gray pt80 pb60 text-black">
    <div class="deco-circle"></div>
    <div class="inner">
      <div class="row v-center"><div class="colmd10 colsm12"><div id="title-tabs" class="g md4 sm4 xs2">${v.tabs.map(([t], i) => `<div class="title-tab" data-tab="t${i}" role="button" tabindex="0">${t}</div>`).join("")}</div></div></div>
      <div class="row v-center"><div class="colmd10 colsm12">
        ${v.tabs.map(([t, items], i) => `<div class="item-tab" data-tab="t${i}"><div class="row pt60"><div class="colmd3 colsm4 colmdoffset1 pt25"><div class="tab-title">${t}</div></div><div class="colmd8 colsm8 entry"><ul>${items.map((li) => `<li>${li}</li>`).join("")}</ul></div></div></div>`).join("")}
      </div></div>
    </div>
  </section>
  </section>
  ${faqBlock(v.faq)}
</main></div>`;
  return page({ title: `Contabilidade para ${v.name} | Bear Finance`, description: strip(v.headline), active: "verticais", bodyClass: "single-segmento", body, path: `/verticais/${v.slug}/`, jsonld: [faqLd(v.faq)] });
}

function verticalsIndex() {
  const body = `
${headline({ crumbs: [["Verticais de Negócio"]], h1: "Verticais de negócio", h2: "<strong>Eficiência tributária</strong><br>para todos os setores e negócios", p: "Cada setor tem regras, incentivos e riscos próprios. Nosso time é organizado para entender as particularidades do seu.", image: "ph-04.svg" })}
<main id="main" class="site-main">
  <div class="inner pt60 pb60"><div class="g md3 sm2 row-gap" style="gap:30px">${D.verticals.map(verticalCard).join("")}</div></div>
  ${videoSection(D.videos.home, "Conhecimento <strong>setorial</strong>", "Veja como nossos times se especializam por vertical para entregar mais do que conformidade.", { poster: "ph-06.svg" })}
  ${callService()}
</main>`;
  return page({ title: "Verticais de negócio | Bear Finance", description: "Contabilidade especializada por setor: indústria, agro, saúde, construção, logística, varejo, energia, serviços.", active: "verticais", body, path: "/verticais/" });
}

function about() {
  const body = `
${headline({ crumbs: [["Sobre"]], h1: "Sobre", h2: D.about.headline, image: "URSO_CARA.jpg" })}
<div id="primary" class="content-area"><main id="main" class="site-main">
  <section id="numbers-about" class="pt0 pb40"><div class="inner"><div class="g md3 sm3 text-black">
    ${D.about.numbers.map(([n, l], i) => `<div class="item-n${i === 1 ? " border-divider" : ""}"><p><strong>${n}</strong>${l}</p></div>`).join("")}
  </div></div></section>
  <div class="inner"><div class="row v-center">
    <div class="colmd6 colsm6 pb60 inspect"><div class="thumb-about filter-gray bg ph" ${bg(D.about.img)}></div></div>
    <div class="colmd6 colsm7 entry inspect"><h2 class="fw3 fz60" style="margin-bottom:20px">${D.about.h2.replace("<strong>", '<strong class="text-roxo" style="display:block">')}</h2>${D.about.p.map((p) => `<p>${p}</p>`).join("")}</div>
  </div></div>

  ${videoSection(D.videos.sobre, "Nossa <strong>história</strong>", "De um escritório de contabilidade a uma plataforma de gestão financeira com inteligência artificial.", { poster: "ph-03.svg" })}

  <section id="socios" class="bg-gray pb20 pt80 mt40">
    <div class="inner"><div class="line-title"><h2 class="inspect down"><span style="display:inline">Sócios</span></h2></div></div>
    <div class="inner--fluid inspect"><div id="list-team"><div class="swiper swiper-team"><div class="swiper-wrapper pt25 pb25">
      ${D.about.team.map(([n, r, b]) => `<div class="swiper-slide"><div class="row"><div class="colmd8 colsm8"><div class="circle"><div class="avatar-placeholder ph"><i class="fa-solid fa-user"></i></div></div></div></div><h3>${n}</h3><div class="fz14"><p class="mb5 fw6">${r}</p><p class="mb5">nome@bearfinance.com.br</p></div><div class="fz13"><p>${b}</p></div></div>`).join("")}
    </div></div></div></div>
  </section>

  <section class="pt80 pb60"><div class="inner">
    <div class="line-title"><h2 class="inspect down">Nossos <span>valores</span></h2></div>
    <div class="g md4 sm2 mt40" style="gap:20px">${D.about.values.map(([i, t, p], k) => `<div class="step-item inspect"><span class="text-border">${k + 1}</span><i class="fa-solid ${i} text-roxo" style="font-size:26px;margin-bottom:12px"></i><h4>${t}</h4><p>${p}</p></div>`).join("")}</div>
  </div></section>
  ${callService("Quer conhecer a Bear de perto? Agende uma conversa com o nosso time.", "Agendar conversa")}
  ${faqBlock(D.faq)}
</main></div>`;
  return page({ title: "Sobre a Bear Finance", description: "Contabilidade empresarial que une tecnologia, expertise e proximidade.", active: "sobre", bodyClass: "page-sobre", body, path: "/sobre/" });
}

function esgPage() {
  const body = `
${headline({ crumbs: [["Sobre", "/sobre/"], ["ESG"]], h1: "ESG", h2: D.esg.headline, image: "ph-05.svg" })}
<main id="main" class="site-main">
  <div class="inner pt80 pb40"><div class="row v-center">
    <div class="colmd7 colsm7 fz18 h2-before inspect"><h2>Compromisso que<br><strong>começa em casa</strong></h2>${D.esg.p.map((p) => `<p>${p}</p>`).join("")}</div>
    <div class="colmd5 colsm5 v-top inspect"><div class="thumb-box filter-gray bg ph" ${bg("ph-07.svg")}></div></div>
  </div>
  <div class="g md3 sm3 mt40" style="gap:20px">${D.esg.pillars.map(([i, t, p], k) => `<div class="step-item inspect"><span class="text-border">${k + 1}</span><i class="fa-solid ${i} text-roxo" style="font-size:26px;margin-bottom:12px"></i><h4>${t}</h4><p>${p}</p></div>`).join("")}</div>
  </div>
  ${videoSection(D.videos.esg, "Nosso compromisso <strong>ESG</strong>", "Práticas, metas e resultados do nosso programa.", { poster: "ph-08.svg" })}
  ${callService()}
</main>`;
  return page({ title: "ESG | Bear Finance", description: "Práticas ambientais, sociais e de governança da Bear Finance.", active: "sobre", body, path: "/esg/" });
}

function careers() {
  const c = D.career;
  const body = `
${headline({ crumbs: [["Carreira"]], h1: "Carreira", h2: c.headline, image: "ph-06.svg", actions: `<p class="fw3 fz34 text-lilas"><strong>${c.sub}</strong></p>` })}
<div id="primary" class="content-area"><main id="main" class="site-main">
  <section id="jeito" class="bg-bluedark text-white pb80 pt60"><div class="inner">
    <div class="row"><div class="colmd8 colsm8"><h2 class="inspect"><strong>Culture</strong> Code</h2><h3 class="inspect">O nosso jeito de fazer as coisas</h3></div></div>
    <div class="g sm2 md3 mt40">${c.culture.map(([a, k, b]) => `<div class="list-item-carreira mt25 inspect"><div class="text">${a}<span class="font-cursive">${k}</span>${b}</div></div>`).join("")}</div>
  </div></section>

  <section id="vagas" class="pt60 pb60"><div class="inner">
    <div class="row v-center">
      <div class="colmd6 colsm6 cta-vagas entry pt20 pb20 inspect">
        <h5>Um ambiente <strong>inspirador</strong>, com oportunidades de desenvolvimento profissional e <strong>reconhecimento</strong></h5>
        <h5>Na Bear, você pode <strong>perseguir o extraordinário</strong> em todas as nossas áreas!</h5>
        <ul>${c.areas.map((a) => `<li>${a}</li>`).join("")}</ul>
        <p class="mt10"><a class="btn" href="#vagas-list">Ver nossas vagas →</a></p>
      </div>
      <div class="colmd3 colsm3 inspect"><div class="thumb-box bg ph" ${bg("ph-05.svg")}></div></div>
      <div class="colmd3 colsm3 inspect"><div class="thumb-box bg ph" ${bg("ph-08.svg")}></div></div>
    </div>
    <div class="row v-center pt40">
      <div class="colmd6 colsm6 inspect">${videoBox({ ...D.videos.carreira, poster: "ph-07.svg" })}</div>
      <div class="colmd6 colsm6 pt40 inspect">
        <h5 class="fw3" style="font-size:20px;line-height:1.3">Criamos as melhores oportunidades de carreira para <strong class="text-roxo fw9">o nosso time</strong>, sempre respeitando a individualidade, oferecendo recursos e treinamentos, e criando programas de desenvolvimento.</h5>
        <h5 class="fw3" style="font-size:20px;line-height:1.3">Apenas com uma cultura aberta e compatível com os anseios das novas gerações é que conseguimos crescer juntos.</h5>
        <p class="text-roxo">━━━━━━━━━━━━━━━━</p>
      </div>
    </div>
  </div></section>

  <section id="diversidade" class="bg-gray pt60 pb60"><div class="inner">
    <div class="row">
      <div class="colmd7 colsm7 fz18 pb40 inspect"><h2><strong class="text-roxo">Diversidade</strong></h2>${c.diversity.map((p, i) => `<p${i === 0 ? ' class="fw7"' : ""}>${p}</p>`).join("")}</div>
      <div class="colmd5 colsm5 pb40 inspect"><div class="thumb-box landscape bg ph" ${bg("ph-04.svg")}></div></div>
    </div>
    <div class="g md4 sm2" style="gap:15px">${c.people.map(([t, im]) => `<div class="thumb-box relative bg ph inspect" ${bg(im)}><div class="caption-box">${t}</div></div>`).join("")}</div>
  </div></section>

  <section id="novos-talentos" class="bg-white pt60 pb60"><div class="inner"><div class="row v-center">
    <div class="colmd6 colsm6 inspect">
      <h2>Programa de<br><strong class="text-roxo">Novos Talentos</strong></h2>
      <p class="fw7">O Jeito Bear de traçar o futuro de quem quer fazer acontecer!</p>
      <h6 class="text-roxo">━━━━━━━━━━━━━━━━</h6>
      ${c.talents.map((p) => `<p>${p}</p>`).join("")}
    </div>
    <div class="colmd6 colsm6 inspect">
      <ul id="vagas-list" class="jobs">${c.jobs.map(([t, l]) => `<li><div><h3>${t}</h3><span><i class="fa-solid fa-location-dot"></i> ${l}</span></div><a class="btn" href="#candidatura" data-job="${esc(t)}">Candidatar-se</a></li>`).join("")}</ul>
    </div>
  </div></div></section>

  <section id="candidatura" class="bg-gray pt60 pb60"><div class="inner"><div class="row"><div class="colmd8 colsm10 colmdoffset2">
    <form class="aside pt40 pb40 bg-white pl25 pr25 text-dark" data-api="/api/carreira" novalidate style="border:2px solid var(--cinza)">
      <h3 class="fz28 fw7">Envie sua candidatura</h3>
      <div class="row">
        <div class="colmd6"><input type="text" name="nome" placeholder="Nome *" required aria-label="Nome"></div>
        <div class="colmd6"><input type="email" name="email" placeholder="E-mail *" required aria-label="E-mail"></div>
        <div class="colmd6"><input type="tel" name="telefone" placeholder="Telefone *" required aria-label="Telefone"></div>
        <div class="colmd6"><select id="c-vaga" name="vaga" aria-label="Vaga"><option>Banco de talentos</option>${c.jobs.map(([t]) => `<option>${t}</option>`).join("")}</select></div>
        <div class="colmd12"><input type="url" name="curriculo" placeholder="LinkedIn ou link do currículo *" required aria-label="Currículo"></div>
        <div class="colmd12"><textarea name="mensagem" placeholder="Sobre você" aria-label="Sobre você"></textarea></div>
        <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="colmd12"><label class="consent"><input type="checkbox" name="lgpd" value="sim" required> Autorizo o tratamento dos meus dados para fins de recrutamento.</label></div>
        <div class="colmd12"><div class="message" role="status"></div></div>
        <div class="colmd4 colsm6 colxs8"><button class="btn btn-block" type="submit">Enviar</button></div>
      </div>
    </form>
  </div></div></div></section>
</main></div>`;
  return page({ title: "Carreira | Bear Finance", description: "Vagas, cultura e programa de novos talentos da Bear Finance.", active: "sobre", body, path: "/carreira/" });
}

function casesPage() {
  const body = `
${headline({ crumbs: [["Cases de Sucesso"]], h1: "Cases de Sucesso", h2: "Resultados que<br><strong>falam por nós</strong>", p: "Histórias de empresas que transformaram sua gestão contábil e financeira com a Bear.", image: "ph-03.svg" })}
<main id="main" class="site-main">
  ${videoSection(D.videos.cases, "Resultados <strong>reais</strong>", "Clientes contam, em primeira pessoa, o que mudou depois da Bear.", { poster: "ph-02.svg" })}
  <div class="inner pt80 pb60"><div class="g md3 sm2" style="gap:30px">
    ${D.cases.map(([t, seg, ex, im], i) => `<div class="case-item inspect"><div class="bg ph" ${bg(im)}><div class="flex-segmento"><span class="i text-border">${i + 1}</span><div style="position:relative;z-index:1"><p class="fz14 fw7 text-lilas mb10" style="letter-spacing:.1em;text-transform:uppercase">${seg}</p><h4>${t}</h4><div class="excerpt">${ex}</div><a class="btn" href="/contato/">Quero um resultado assim</a></div></div></div></div>`).join("")}
  </div></div>
  ${callService()}
</main>`;
  return page({ title: "Cases de Sucesso | Bear Finance", description: "Resultados de clientes da Bear Finance.", active: "cases", body, path: "/cases/" });
}

function platformPage() {
  const p = D.platform;
  const body = `
${headline({ crumbs: [["Plataforma"]], h1: "Plataforma Bear", h2: p.headline, p: p.p, image: "SISTEMA.jpg", actions: `<p><a class="btn mr20" href="${site.platformUrl}">Acessar plataforma</a><a class="btn btn--outline" href="/contato/">Ver demonstração</a></p>` })}
<div id="primary" class="content-area"><main id="main" class="site-main">
  <section id="numbers-about" class="pt0 pb40"><div class="inner"><div class="g md3 sm3 text-black">
    <div class="item-n"><p><strong>IA</strong>integrada</p></div><div class="item-n border-divider"><p><strong>100%</strong>seguro</p></div><div class="item-n"><p><strong>+300%</strong>eficiência</p></div>
  </div></div></section>
  <div class="inner"><div class="row v-center">
    <div class="colmd5 colsm5 inspect"><img src="${img("SISTEMA.jpg")}" alt="Tela da Plataforma Bear" style="border-radius:10px;box-shadow:0 30px 80px -30px rgba(0,0,0,.5)"></div>
    <div class="colmd7 colsm7 fz18 h2-before inspect" style="padding-left:40px"><h2>Nova geração de<br><strong>gestão financeira</strong></h2><p>Nossa plataforma revoluciona a forma como empresas gerenciam suas finanças. Com tecnologia de ponta, simplificamos processos contábeis complexos.</p>${["Automação de lançamentos e conciliação bancária", "Integração com bancos e sistemas ERP", "Relatórios e dashboards financeiros em tempo real", "Suporte 24/7 e atualizações contínuas"].map((a) => `<p class="arrow">${a}</p>`).join("")}</div>
  </div></div>

  <div class="inner pt80 pb40"><div class="g md3 sm2" style="gap:20px">${p.features.map(([i, t, d], k) => `<div class="step-item inspect"><span class="text-border">${k + 1}</span><i class="fa-solid ${i} text-roxo" style="font-size:26px;margin-bottom:12px"></i><h4>${t}</h4><p>${d}</p></div>`).join("")}</div></div>

  ${videoSection(D.videos.plataforma, "Tour pela <strong>Plataforma Bear</strong>", "Dashboards, conciliação automática e alertas de compliance em um só lugar.", { poster: "ph-02.svg" })}

  <div class="inner pt80 pb80">
    <div class="line-title"><h2 class="inspect down">Como <span>funciona</span></h2></div>
    <div class="g md4 sm2 mt40" style="gap:20px">${p.steps.map(([t, d], k) => `<div class="step-item inspect"><span class="text-border">${k + 1}</span><h4>${t}</h4><p>${d}</p></div>`).join("")}</div>
  </div>
  <section id="erps" class="pt0 pb80"><div class="inner"><div class="row"><div class="colmd8 line-title"><h2 class="inspect down">Integrada aos <span>principais ERPs</span></h2></div></div>${erpGrid()}</div></section>
  ${callService("Quer ver a plataforma funcionando com os dados da sua empresa?", "Agendar demonstração")}
</main></div>`;
  return page({ title: "Plataforma Bear | Gestão financeira com IA", description: "Plataforma de gestão financeira com IA: conciliação automática, integração bancária e dashboards em tempo real.", active: "plataforma", body, path: "/plataforma/" });
}

function contact() {
  const body = `
${headline({ crumbs: [["Contato"]], h1: "Contato", h2: "Fale com a <strong>Bear</strong>", p: "Estamos à disposição para tirar suas dúvidas e encontrar o melhor caminho contábil e tributário para a sua empresa.", image: "ph-09.svg" })}
<div id="primary" class="content-area pt60 bg-bluedark text-white"><main id="main" class="site-main">
  <div class="inner">
    <div class="row"><div class="colmd10 colsm12 pb30 entry text-white"><h4 class="text-white fw3" style="font-size:26px">Entre em contato com a nossa equipe e entenda como <strong class="text-lilas">melhorar a eficiência e os resultados</strong> do seu negócio.</h4></div></div>
    <div class="row v-top">
      <div class="colmd9 colsm10 pb50 inspect">${contactForm()}</div>
      <div class="colmd3 colsm2 inspect">
        <ul class="fz16" style="line-height:1.4">
          <li class="mb20"><i class="fa-brands fa-whatsapp text-lilas" style="width:24px"></i><a class="text-white" href="${site.whatsapp}" target="_blank" rel="noopener">${site.phone}</a></li>
          <li class="mb20"><i class="fa-solid fa-envelope text-lilas" style="width:24px"></i><a class="text-white" href="mailto:${site.email}">${site.email}</a></li>
          <li class="mb20"><i class="fa-solid fa-location-dot text-lilas" style="width:24px"></i>${site.address}<br><span style="padding-left:24px">${site.city}</span></li>
          <li class="mb20"><i class="fa-brands fa-instagram text-lilas" style="width:24px"></i><a class="text-white" href="${site.instagram}" target="_blank" rel="noopener">@bearfinance</a></li>
        </ul>
      </div>
    </div>
  </div>
  <section id="unidades" class="bg-gray pb80 pt50 text-black"><div class="inner"><div class="row v-top">
    <div class="colmd6 colsm12 pt40 inspect"><div id="unidades-about">
      <div class="fw3 fz26 mb15">NOSSAS<br><strong>UNIDADES</strong></div>
      <div class="g sm2 md2 v-top mt15">${D.presence.offices.map(([c, a]) => `<div class="unidade pt15 pb15"><div class="fw7 fz22">${c}</div><div class="fz14">${a}</div></div>`).join("")}</div>
    </div></div>
    <div class="colmd6 colsm12 pt40 inspect"><iframe title="Mapa — Bear Finance" src="https://www.google.com/maps?q=Rua+Riachuelo+231+S%C3%A3o+Paulo&output=embed" loading="lazy" style="width:100%;height:320px;border:0;border-radius:10px;filter:grayscale(1) contrast(1.1)"></iframe></div>
  </div></div></section>
  ${videoSection(D.videos.contato, "Como funciona o <strong>primeiro contato</strong>", "Em 15 minutos entendemos sua operação e indicamos os próximos passos.", { poster: "ph-01.svg" })}
  ${faqBlock(D.faq)}
</main></div>`;
  return page({ title: "Contato | Bear Finance", description: "Fale com a Bear Finance: WhatsApp, e-mail e formulário.", active: "contato", body, path: "/contato/", jsonld: [faqLd(D.faq)] });
}

function blog() {
  const cats = [...new Set(D.posts.map((p) => p.cat))];
  const body = `
<div id="site-headline">
  <div id="bg" class="bg ph" ${bg("ph-11.svg")}></div>
  <div class="inner relative">
    ${breadcrumbs([["Conteúdo"]])}
    <div class="row v-center"><div id="content_before" class="colmd8 pb10 colsm10"><h1>Conteúdo</h1></div><div class="colmd4 colsm2"></div></div>
    <div class="row"><div class="colmd8 colsm8 fz18 mb15"><p>O Brasil atravessa a maior reforma tributária de sua história. Entre 2026 e 2033, ICMS, ISS, PIS, COFINS e IPI dão lugar ao IBS e à CBS. Acompanhe e esteja à frente das mudanças.</p></div></div>
    <div class="row v-center">
      <div class="colmd6 colsm4"><div class="row"><div class="colmd8 colsm12"><form class="e-search mb10" action="/conteudo/" method="get" role="search"><input name="s" type="text" placeholder="Buscar" aria-label="Buscar"><button class="btn mb0" type="submit" aria-label="Buscar"><i class="fa-solid fa-magnifying-glass"></i></button></form></div></div></div>
      <div class="colmd6 colsm8">${D.verticals.slice(0, 6).map((v) => `<a class="h6" href="/verticais/${v.slug}/">${v.name.split(" ")[0]}</a>`).join("")}</div>
    </div>
    <div class="lins-atuacao g md5 sm3 xs2">${D.blogTabs.map((t, i) => `<div><a class="block${i === 0 ? " active" : ""}" href="/conteudo/#${encodeURIComponent(t)}">${t}</a></div>`).join("")}</div>
  </div>
</div>
<div class="inner"><div id="primary" class="content-area pb80 pt60"><main id="main" class="site-main">
  <div class="row">
    <div class="colmd8 colsm12">
      <div class="row">${D.posts.map((p) => postCard(p, "colmd6 colsm6")).join("")}</div>
    </div>
    <div class="colmd4 colsm12">
      <div class="sidebar-box"><h4>Categorias</h4><ul><li><a href="#" data-filter="all" class="active">Todas</a></li>${cats.map((c) => `<li><a href="#" data-filter="${esc(c)}">${c}</a></li>`).join("")}</ul></div>
      <div class="sidebar-box" style="padding:0;overflow:hidden">${videoBox({ ...D.videos.conteudo, poster: "ph-12.svg" })}</div>
      <div class="sidebar-box dark"><h4>Receba os conteúdos</h4><p class="fz14">Assine a newsletter no rodapé e receba artigos, webinars e materiais ricos.</p><a class="btn" href="#newsletter">Assinar</a></div>
    </div>
  </div>
</main></div></div>`;
  return page({ title: "Conteúdo | Bear Finance", description: "Artigos, materiais ricos, webinars e eventos sobre contabilidade, finanças e Reforma Tributária.", active: "conteudo", body, path: "/conteudo/" });
}

function post(p) {
  const html = p.body.map(([t, c]) => (t === "ul" ? `<ul>${c.map((li) => `<li>${li}</li>`).join("")}</ul>` : `<${t}>${c}</${t}>`)).join("\n");
  const body = `
<div id="site-headline" class="headline--post">
  <div id="bg" class="bg ph" ${bg(p.img)}></div>
  <div class="inner relative">
    ${breadcrumbs([["Conteúdo", "/conteudo/"], [p.cat]])}
    <div class="row v-center"><div id="content_before" class="colmd8 pb10 colsm10">
      <span class="categories"><a href="/conteudo/">${p.cat}</a></span>
      <h1>${p.title}</h1>
      <p class="fz16">${fmtDateLong(p.date)} · Bear Finance</p>
      <div class="share-btns"><button class="social_share" type="button" aria-label="Compartilhar no LinkedIn"><i class="fa-brands fa-linkedin-in"></i></button><button class="social_share" type="button" aria-label="Compartilhar no WhatsApp"><i class="fa-brands fa-whatsapp"></i></button><button class="social_share" type="button" aria-label="Copiar link"><i class="fa-solid fa-link"></i></button></div>
    </div><div class="colmd4 colsm2"></div></div>
  </div>
</div>
<div class="inner"><div id="primary" class="content-area pb80 pt60"><main id="main" class="site-main"><div class="row">
  <div class="colmd8 colsm12"><article class="entry"><p class="fz20 fw3">${p.excerpt}</p>${html}<p class="mt40"><a class="btn" href="/conteudo/">← Voltar para conteúdos</a></p></article></div>
  <div class="colmd4 colsm12">
    <div class="sidebar-box" style="padding:0;overflow:hidden">${videoBox({ ...D.videos.conteudo, title: "Vídeo sobre este tema", poster: p.img })}</div>
    <div class="sidebar-box"><h4>Leia também</h4><ul>${D.posts.filter((o) => o !== p).slice(0, 4).map((o) => `<li><a href="/conteudo/${o.slug}/">${o.title}</a></li>`).join("")}</ul></div>
    <div class="sidebar-box dark"><h4>Fale com um especialista</h4><p class="fz14">Tire dúvidas sobre o tema deste artigo com o nosso time.</p><a class="btn" href="/contato/">Solicitar contato</a></div>
  </div>
</div></main></div></div>`;
  return page({ title: `${p.title} | Bear Finance`, description: p.excerpt, active: "conteudo", bodyClass: "single-post", body, path: `/conteudo/${p.slug}/`, jsonld: [{ "@context": "https://schema.org", "@type": "Article", headline: p.title, datePublished: p.date, author: { "@type": "Organization", name: site.name } }] });
}

/* ---------- Parcerias ---------- */
const waLink = (text = "") => `https://wa.me/${D.partnerWhatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

// Formulário em 2 etapas que termina em uma conversa no WhatsApp
function partnerForm(pr) {
  const fl = (name, label, type = "text", attrs = "") => `
    <div class="fl"><input id="pf-${pr.key}-${name}" name="${name}" type="${type}" placeholder=" " data-label="${label}" ${attrs}><label for="pf-${pr.key}-${name}">${label}</label></div>`;
  const field = (f) => {
    const id = `pf-${pr.key}-${f.name}`;
    const req = f.required ? " required" : "";
    if (f.type === "select") return `<div class="fl fl--select"><select id="${id}" name="${f.name}" data-label="${f.label}"${req}><option value="" selected disabled hidden></option>${f.options.map((o) => `<option>${o}</option>`).join("")}</select><label for="${id}">${f.label}${f.required ? "" : " (opcional)"}</label><i class="fa-solid fa-chevron-down"></i></div>`;
    if (f.type === "chips" || f.type === "radio") {
      const t = f.type === "chips" ? "checkbox" : "radio";
      return `<fieldset class="chips${f.type === "radio" ? " chips--radio" : ""} full"><legend>${f.label}${f.type === "chips" ? " <small>(marque quantos quiser)</small>" : ""}</legend>${f.options.map((o, i) => `<label class="chip"><input type="${t}" name="${f.name}" value="${o}" data-label="${f.label}"${f.required && i === 0 ? " required" : ""}><span>${o}</span></label>`).join("")}</fieldset>`;
    }
    return `<div class="full">${fl(f.name, f.label, f.type, req)}</div>`;
  };
  return `
<div class="pform" id="form-parceria">
  <div class="pform-head">
    <span class="pform-tag"><i class="fa-brands fa-whatsapp"></i> Resposta rápida pelo WhatsApp</span>
    <h3>${pr.form.title}</h3>
    <div class="pform-progress" aria-hidden="true"><span></span></div>
    <ol class="pform-steps"><li class="on"><b>1</b>Seus dados</li><li><b>2</b>${pr.form.step2}</li></ol>
  </div>
  <form data-wa-form data-wa="${D.partnerWhatsapp.number}" data-api="/api/parceria" novalidate>
    <input type="hidden" name="programa" value="${pr.name}">
    <fieldset class="pform-step" data-step="1">
      <legend class="sr-only">Seus dados</legend>
      <div class="pgrid">
        <div class="full">${fl("nome", "Seu nome completo", "text", 'required autocomplete="name"')}</div>
        <div>${fl("telefone", "WhatsApp", "tel", 'required inputmode="tel" autocomplete="tel" data-mask="phone" pattern="\\(\\d{2}\\) \\d{4,5}-\\d{4}"')}</div>
        <div>${fl("email", "E-mail", "email", 'required autocomplete="email"')}</div>
        <div class="full">${fl("cidade", "Cidade / UF", "text", 'required autocomplete="address-level2"')}</div>
      </div>
      <button type="button" class="btn btn-block pform-next" data-next>Continuar <i class="fa-solid fa-arrow-right"></i></button>
    </fieldset>
    <fieldset class="pform-step" data-step="2" hidden>
      <legend class="sr-only">${pr.form.step2}</legend>
      <div class="pgrid">
        ${pr.form.fields.map(field).join("")}
        <div class="full"><div class="fl fl--area"><textarea id="pf-${pr.key}-mensagem" name="mensagem" placeholder=" " data-label="Mensagem"></textarea><label for="pf-${pr.key}-mensagem">Quer contar algo mais? (opcional)</label></div></div>
      </div>
      <label class="consent"><input type="checkbox" name="lgpd" value="sim" required> Autorizo a Bear Finance a entrar em contato e tratar meus dados conforme a <a href="/privacidade/" target="_blank">Política de Privacidade</a>.</label>
      <div class="pform-actions">
        <button type="button" class="pform-back" data-prev><i class="fa-solid fa-arrow-left"></i> Voltar</button>
        <button type="submit" class="btn btn-wa"><i class="fa-brands fa-whatsapp"></i> Continuar no WhatsApp</button>
      </div>
    </fieldset>
    <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="pform-done" hidden>
      <i class="fa-brands fa-whatsapp"></i>
      <h4>Tudo certo!</h4>
      <p>Abrimos o WhatsApp com a sua mensagem pronta. É só tocar em <strong>enviar</strong>.</p>
      <a class="btn btn-wa" data-wa-open href="${waLink()}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Abrir WhatsApp novamente</a>
    </div>
    <p class="message" role="status" aria-live="polite"></p>
  </form>
  <p class="pform-foot">Prefere ir direto? <a href="${waLink(`Olá! Quero saber mais sobre o programa ${pr.name} da Bear Finance.`)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> ${D.partnerWhatsapp.display}</a></p>
  <noscript><p class="pform-foot">Seu navegador está sem JavaScript. Fale com a gente em <a href="${waLink()}">${D.partnerWhatsapp.display}</a>.</p></noscript>
</div>`;
}

function partnerHubPage() {
  const H = D.partnerHub;
  const body = `
${headline({ crumbs: [["Parcerias"]], h1: "Parcerias Bear", h2: H.h2, p: H.p, image: "ph-04.svg",
    actions: `<p class="hub-actions">${D.partnerPrograms.map((p, i) => `<a class="btn${i ? " btn--outline" : ""} mt20 mr20" href="/parcerias/${p.slug}/">${p.name}</a>`).join("")}</p>` })}
${scrollBand("#programas")}
<main id="main" class="site-main">
  <section id="programas" class="pt40 pb60"><div class="inner">
    <div class="row v-center mb40">
      <div class="colmd5 colsm5 line-title"><h2 class="inspect down">Escolha o seu <span>programa</span></h2></div>
      <div class="colmd1 hsm hxs"></div>
      <div class="colmd6 colsm6 inspect"><p class="fz18">Dois caminhos independentes. Você pode começar por um e evoluir para o outro, ou participar dos dois.</p></div>
    </div>
    <div class="g md2 sm2 programs">
      ${D.partnerPrograms.map((pr, i) => `
      <article class="program-card inspect" id="${pr.key}">
        <span class="i text-border">${i + 1}</span>
        <span class="program-tag">${pr.tag}</span>
        <div class="program-ico"><i class="fa-solid ${pr.icon}"></i></div>
        <h3>${pr.name}</h3>
        <p class="program-sub">${pr.short}</p>
        <p class="lead">${pr.lead}</p>
        <h4>Como funciona</h4>
        <ul class="entry-list">${pr.how.map((h) => `<li>${h}</li>`).join("")}</ul>
        <h4>Para quem é</h4>
        <ul class="tags">${pr.who.map((f) => `<li>${f}</li>`).join("")}</ul>
        <a class="btn" href="/parcerias/${pr.slug}/">Conhecer o ${pr.name} <i class="fa-solid fa-arrow-right" style="margin-left:6px"></i></a>
      </article>`).join("")}
    </div>
  </div></section>

  <section id="comparativo" class="bg-gray pt80 pb80"><div class="inner">
    <div class="line-title mb40"><h2 class="inspect down">Lado a <span>lado</span></h2></div>
    <div class="compare inspect" role="table" aria-label="Comparação entre os programas">
      <div class="compare-row compare-head" role="row"><div role="columnheader"></div>${D.partnerPrograms.map((p) => `<div role="columnheader"><i class="fa-solid ${p.icon}"></i>${p.name}<small>${p.short}</small></div>`).join("")}</div>
      ${H.compare.map(([k, a, b]) => `<div class="compare-row" role="row"><div role="rowheader">${k}</div><div role="cell" data-th="${D.partnerPrograms[0].name}">${a}</div><div role="cell" data-th="${D.partnerPrograms[1].name}">${b}</div></div>`).join("")}
    </div>
  </div></section>

  ${videoSection(H.video, "Parcerias <strong>Bear</strong>", "Veja em poucos minutos como funcionam os dois programas e qual combina mais com você.", { poster: "ph-06.svg" })}

  <section id="call-to-acc" class="bg-bluedark text-white pt60 pb60 relative"><div class="bg ph call0-bg" ${bg("ph-12.svg")}></div><div class="inner relative"><div class="row v-center">
    <div class="colmd7 colsm8 fz26 inspect"><p>Ficou com dúvida sobre qual programa escolher? <strong>Fale com o time de parcerias</strong> pelo WhatsApp.</p></div>
    <div class="colmd1 hsm hxs"></div>
    <div class="colmd4 colsm4 inspect"><a class="btn btn-wa btn-block" href="${waLink("Olá! Quero conhecer os programas de parceria da Bear Finance.")}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> ${D.partnerWhatsapp.display}</a></div>
  </div></div></section>
  ${faqBlock(H.faq)}
</main>`;
  return page({ title: "Parcerias | Business Partner Outsourcing e Business Partner | Bear Finance", description: "Programas de parceria da Bear Finance: Business Partner Outsourcing para contadores e Business Partner para agentes prospectores de negócios.", active: "parcerias", bodyClass: "page-parcerias", body, path: "/parcerias/", jsonld: [faqLd(H.faq)], waHref: waLink("Olá! Quero conhecer os programas de parceria da Bear Finance.") });
}

function partnerProgramPage(pr) {
  const other = D.partnerPrograms.find((o) => o !== pr);
  const gridItem = ([t, d]) => `<div class="item-grid inspect"><strong>${t}</strong><span>${d}</span></div>`;
  const body = `
<div id="site-headline" class="headline--partner">
  <div id="bg" class="bg ph" ${bg(pr.img)}>${site.headlineFx ? `<canvas class="fx-waves fx-waves--soft" aria-hidden="true"></canvas>` : ""}</div>
  <div class="inner relative">
    ${breadcrumbs([["Parcerias", "/parcerias/"], [pr.name]])}
    <div class="row v-top">
      <div id="content_before" class="colmd6 colsm12">
        <span class="program-tag program-tag--light">${pr.tag}</span>
        <h1>${pr.name}</h1>
        <p class="headline-sub">${pr.short}</p>
        <h2>${pr.headline.h2}</h2>
        <p>${pr.headline.p}</p>
        <ul class="headline-checks">${pr.how.slice(0, 3).map((h) => `<li>${h}</li>`).join("")}</ul>
      </div>
      <div class="colmd1 hsm hxs"></div>
      <div class="colmd5 colsm12">${partnerForm(pr)}</div>
    </div>
  </div>
</div>
<div id="primary" class="content-area"><main id="main" class="site-main">
  <section id="numbers-about" class="numbers-partner pt50 pb0 bg-bluedark"><div class="inner"><div class="g md4 sm2 text-black">
    ${pr.numbers.map(([n, l], i) => `<div class="item-n${i > 0 && i < 3 ? " border-divider" : ""}"><p><strong>${n}</strong>${l}</p></div>`).join("")}
  </div></div></section>

  <section id="about-service" class="bg-bluedark text-white pb40"><div class="inner"><div class="row v-center pt60">
    <div class="colmd7 colsm8 fz26 inspect"><p>${pr.about}</p></div>
    <div class="colmd1 hsm hxs"></div>
    <div class="colmd4 colsm4 inspect"><a class="btn btn-block" href="#form-parceria">Quero participar</a></div>
  </div></div></section>

  <section id="diagrama" class="text-black"><div class="inner pt80 pb40">
    <div class="text-center mb60 inspect"><h3>${pr.diagram.h3}</h3><h6>${pr.diagram.h6}</h6></div>
    <div class="grid-infos">
      <div class="col-infos">${pr.diagram.left.map(gridItem).join("")}</div>
      <div class="hub inspect"><div class="hub-ring"></div><img src="${img("URSO_GEOMETRICO_PURPLE.png")}" alt="Bear Finance" width="140" height="140"><span>${pr.key === "bpo" ? "Seu escritório" : "Você"}</span></div>
      <div class="col-infos">${pr.diagram.right.map(gridItem).join("")}</div>
    </div>
    <div class="hub-bottom inspect"><div class="item-grid"><strong>${pr.diagram.bottom[0]}</strong><span>${pr.diagram.bottom[1]}</span></div></div>
  </div></section>

  <div id="call0" class="relative"><div class="bg ph call0-bg" ${bg("ph-09.svg")}></div><div class="inner pt70 pb70 relative"><div class="row v-center">
    <div class="colmd8 colsm8 text-white inspect"><h2>${pr.call}</h2></div>
    <div class="colmd4 colsm4 inspect"><a class="btn btn-block" href="#form-parceria">Quero participar</a></div>
  </div></div></div>

  <section id="como-funciona" class="pt80 pb60"><div class="inner"><div class="row v-top">
    <div class="colmd6 colsm6 h2-before inspect">
      <h2>Como <strong>funciona</strong></h2>
      <ul class="entry-list fz18">${pr.how.map((h) => `<li>${h}</li>`).join("")}</ul>
    </div>
    <div class="colmd6 colsm6 inspect">
      <div class="who-box">
        <h4>Para quem é</h4>
        <ul class="tags">${pr.who.map((f) => `<li>${f}</li>`).join("")}</ul>
        <p class="fz16">${pr.lead}</p>
        <a class="btn" href="#form-parceria">Quero ser ${pr.name}</a>
      </div>
    </div>
  </div></div></section>

  <section id="beneficios" class="bg-gray pt80 pb80"><div class="inner"><div class="row v-center">
    <div class="colmd6 colsm6 h2-before fz24 inspect">
      <h2>${pr.benefits.h2}</h2>
      <p class="fz18">${pr.benefits.p}</p>
      <ul class="benefits-list">${pr.benefits.items.map((b) => `<li>${b}</li>`).join("")}</ul>
    </div>
    <div class="colmd6 colsm6 inspect"><div class="hsm hmd pt40"></div>${videoBox({ ...pr.video, poster: "ph-06.svg" })}</div>
  </div></div></section>

  <div id="etapas-franquia" class="pt80 pb80"><div class="inner">
    <div class="row"><div class="colmd8 colsm8 mb30 h2-before fz24 inspect"><h2>Simplicidade<br><strong>e transparência</strong></h2><p class="fz18">A entrada no programa foi desenhada para você começar rápido, com regras claras desde o primeiro dia.</p></div></div>
    <div class="g md3 sm3" style="gap:20px">${pr.steps.map(([t, d], k) => `<div class="step-item inspect" style="transition-delay:${k * 80}ms"><span class="text-border">${k + 1}</span><h4>${t}</h4><p>${d}</p></div>`).join("")}</div>
  </div></div>

  <section id="call-to-acc" class="bg-bluedark text-white pt60 pb60 relative"><div class="bg ph call0-bg" ${bg("ph-12.svg")}></div><div class="inner relative"><div class="row v-center">
    <div class="colmd7 colsm8 fz26 inspect"><p>${pr.cta}</p></div>
    <div class="colmd1 hsm hxs"></div>
    <div class="colmd4 colsm4 inspect"><a class="btn btn-wa btn-block" href="${waLink(`Olá! Quero saber mais sobre o programa ${pr.name} da Bear Finance.`)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> ${D.partnerWhatsapp.display}</a></div>
  </div></div></section>

  <section id="segmentos-servicos" class="bg-gray pt80 pb20"><div class="inner relative">
    <div class="g md2 sm2 v-center fz20 mb20">
      <h2 class="inspect fw3">Oportunidades nos <strong>principais setores</strong> do Brasil</h2>
      <div class="inspect"><p>Nossa atuação por verticais abre portas em indústria, agro, saúde, construção, logística, varejo, energia e serviços.</p><p><a class="btn" href="#form-parceria">Faça parte</a></p></div>
    </div>
  </div></section>
  <section class="bg-gray pt20 pb60"><div class="inner"><div class="g md4 sm2 row-gap" style="gap:20px">${D.verticals.map(verticalCard).join("")}</div></div></section>

  <section class="other-program pt60 pb60"><div class="inner"><div class="row v-center">
    <div class="colmd8 colsm8 inspect"><p class="fz14 fw7 text-roxo" style="letter-spacing:.14em;text-transform:uppercase">Conheça também</p><h3 class="fz36 fw3" style="margin:0">${other.name} <span class="text-roxo fw7">· ${other.short}</span></h3><p class="fz18 mt10">${other.lead}</p></div>
    <div class="colmd4 colsm4 text-right inspect"><a class="btn" href="/parcerias/${other.slug}/">Ver programa <i class="fa-solid fa-arrow-right" style="margin-left:6px"></i></a></div>
  </div></div></section>

  ${faqBlock(pr.faq)}
</main></div>`;
  return page({ title: `${pr.name} (${pr.short}) | Parcerias Bear Finance`, description: strip(pr.lead), active: "parcerias", bodyClass: "page-parcerias page-partner-program", body, path: `/parcerias/${pr.slug}/`, jsonld: [faqLd(pr.faq)], waHref: waLink(`Olá! Quero saber mais sobre o programa ${pr.name} da Bear Finance.`) });
}

function privacy() {
  const body = `
${headline({ crumbs: [["Política de Privacidade"]], h1: "Política de Privacidade", h2: "Como tratamos<br>os seus <strong>dados</strong>", p: "Conforme a Lei 13.709/2018 (LGPD).", image: "ph-12.svg" })}
<main id="main" class="site-main"><div class="inner pt60 pb80"><div class="row"><div class="colmd8 entry">
  <h2>Dados coletados</h2><p>Coletamos os dados que você informa em formulários (nome, e-mail, telefone, empresa, cargo e mensagem) e dados de navegação por meio de cookies.</p>
  <h2>Finalidade</h2><p>Utilizamos seus dados para responder solicitações, enviar propostas, conteúdos que você assinou e conduzir processos seletivos.</p>
  <h2>Compartilhamento</h2><p>Não vendemos dados pessoais. Podemos compartilhá-los com fornecedores que operam serviços em nosso nome, sob contrato de confidencialidade.</p>
  <h2>Seus direitos</h2><p>Você pode solicitar acesso, correção ou exclusão dos seus dados pelo e-mail <a href="mailto:${site.email}">${site.email}</a>.</p>
  <h2 id="cookies">Política de Cookies</h2><p>Usamos cookies essenciais e de desempenho. Você pode desativá-los nas configurações do navegador.</p>
</div></div></div></main>`;
  return page({ title: "Política de Privacidade | Bear Finance", description: "Política de privacidade e cookies da Bear Finance.", body, path: "/privacidade/" });
}

function notFound() {
  const body = `${headline({ crumbs: [["Página não encontrada"]], h1: "Erro 404", h2: "Página <strong>não encontrada</strong>", p: "O endereço acessado não existe ou foi movido.", image: "ph-10.svg", actions: `<p><a class="btn" href="/">Voltar ao início</a></p>` })}<main id="main" class="site-main">${callService()}</main>`;
  return page({ title: "404 | Bear Finance", description: "Página não encontrada.", body, path: "/404" });
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
await cp(join(ROOT, "src/assets"), join(OUT, "assets"), { recursive: true });

const pages = [
  ["/", home()], ["sobre", about()], ["esg", esgPage()], ["carreira", careers()], ["cases", casesPage()], ["plataforma", platformPage()], ["parcerias", partnerHubPage()], ...D.partnerPrograms.map((p) => [`parcerias/${p.slug}`, partnerProgramPage(p)]),
  ["contato", contact()], ["conteudo", blog()], ["atuacao", servicesIndex()], ["verticais", verticalsIndex()], ["privacidade", privacy()], ["404.html", notFound()],
  ...D.services.map((s) => [`atuacao/${s.slug}`, servicePage(s)]),
  ...D.verticals.map((v) => [`verticais/${v.slug}`, verticalPage(v)]),
  ...D.posts.map((p) => [`conteudo/${p.slug}`, post(p)]),
];
for (const [p, html] of pages) await out(p, html);

const urls = pages.filter(([p]) => !p.endsWith(".html")).map(([p]) => (p === "/" ? "/" : `/${p}/`));
await writeFile(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${site.url}${u}</loc></url>`).join("\n")}\n</urlset>\n`);
await writeFile(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
console.log(`✓ ${pages.length} páginas geradas em /public`);
