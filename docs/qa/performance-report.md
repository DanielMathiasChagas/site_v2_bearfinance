# Relatório de SEO, performance e acessibilidade — Bear Finance v2

**Data:** 14/10/2026 · **Branch:** `redesign/v2` · **Responsável:** seo-performance
**Ferramentas:** Lighthouse 12.8.2 (Chrome 155, `--headless=new`; mobile = preset padrão com throttling simulado; desktop = `--preset=desktop`), axe-core 4.10.3 via Playwright (Chrome do sistema, viewports 390×844 e 1440×900, `bypassCSP` porque a CSP do servidor bloqueia a injeção, `reducedMotion: reduce` para avaliar os elementos `.reveal` já revelados).
**Isolamento:** cada rodada mediu uma **cópia congelada** do build (`/tmp/bf-audit`) servida por `scripts/serve-audit.mjs` na porta 3500 (API/dados em `/tmp/bf-audit-data`), sem interferência dos rebuilds do orquestrador.

## 1. Resumo

| | Antes (mobile) | Depois (mobile) |
|---|---|---|
| Performance | 93–94 | **100** nas 4 páginas internas; home ver §4 |
| FCP | 2,4–2,6 s | **0,90–1,07 s** |
| LCP | 2,43–2,58 s (no limite de 2,5 s) | **1,35–1,43 s** (home 1,73 s com o patch do carrossel) |
| CLS (desktop) | home 0,093 · vertical **0,262** | **0** em todas |
| Accessibility | 95–100 (desktop 91–100) | 97–100 — restam só itens estruturais fora do meu escopo (§6) |
| Best Practices / SEO | 100 / 100 | 100 / 100 |
| axe `color-contrast` | 3–6 nós reprovados por página (contato, parcerias, serviço) | **0** |

O ganho vem de um único gargalo: o CSS do Google Fonts (origem externa, bloqueante) custava ~0,9 s no caminho crítico e, chegando tarde, provocava o *swap* que deslocava o `hero__art`/`phead` (CLS). A fonte passou a ser **self-hosted e pré-carregada** (um só woff2 variável de 27 KB), declarada inline no `<head>`.

**Alerta P0 (fora do meu escopo, patch comprovado):** o carrossel nativo que substituiu o Swiper faz um *scroll-snap* de 2 px no layout inicial da home; o Chrome encerra a medição de LCP nesse scroll **antes do primeiro paint**, e a home deixa de ter LCP (laboratório e campo/CrUX). Detalhes e correção em §4.

## 2. Scores por página e modo

### Antes (`docs/qa/lighthouse/antes/`)

| Página | Modo | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | SI |
|---|---|---|---|---|---|---|---|---|---|---|
| home `/` | mobile | 93 | 100 | 100 | 100 | 2,58 s | 0,000 | 0 ms | 2,58 s | 2,58 s |
| home `/` | desktop | 96 | 100 | 100 | 100 | 0,82 s | 0,093 | 0 ms | 0,82 s | 0,88 s |
| serviço `/atuacao/contabilidade/` | mobile | 94 | 100 | 100 | 100 | 2,51 s | 0,002 | 0 ms | 2,51 s | 2,51 s |
| serviço | desktop | 99 | 100 | 100 | 100 | 0,80 s | 0,006 | 0 ms | 0,80 s | 0,80 s |
| vertical `/verticais/contabilidade-agronegocio/` | mobile | 94 | 100 | 100 | 100 | 2,44 s | 0,023 | 0 ms | 2,44 s | 2,44 s |
| vertical | desktop | **86** | 100 | 100 | 100 | 0,77 s | **0,262** | 0 ms | 0,77 s | 0,77 s |
| contato `/contato/` | mobile | 94 | 95 | 100 | 100 | 2,44 s | 0,002 | 0 ms | 2,44 s | 2,44 s |
| contato | desktop | 99 | **91** | 100 | 100 | 0,79 s | 0,001 | 0 ms | 0,79 s | 0,79 s |
| parceria `/parcerias/business-partner/` | mobile | 94 | 95 | 100 | 100 | 2,43 s | 0,000 | 0 ms | 2,43 s | 2,76 s |
| parceria | desktop | 99 | **91** | 100 | 100 | 0,78 s | 0,012 | 0 ms | 0,78 s | 0,78 s |

### Depois (`docs/qa/lighthouse/depois/`)

| Página | Modo | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | SI |
|---|---|---|---|---|---|---|---|---|---|---|
| home `/` | mobile | — (NO_LCP, §4) | 97 | 100 | 100 | — | 0,000 | — | 1,07 s | — |
| home `/` | desktop | — (NO_LCP, §4) | 97 | 100 | 100 | — | 0,000 | — | 0,29 s | — |
| serviço | mobile | **100** | **100** | 100 | 100 | **1,43 s** | 0,000 | 4 ms | 0,91 s | 0,91 s |
| serviço | desktop | **100** | 100 | 100 | 100 | 0,34 s | 0,000 | 0 ms | 0,24 s | 0,24 s |
| vertical | mobile | **100** | 100 | 100 | 100 | **1,43 s** | 0,000 | 17 ms | 0,91 s | 0,91 s |
| vertical | desktop | **100** | 100 | 100 | 100 | 0,34 s | **0,000** | 0 ms | 0,24 s | 0,24 s |
| contato | mobile | **100** | 98 | 100 | 100 | **1,35 s** | 0,000 | 3 ms | 0,90 s | 0,90 s |
| contato | desktop | **100** | 98 | 100 | 100 | 0,34 s | 0,000 | 0 ms | 0,26 s | 0,26 s |
| parceria | mobile | **100** | 98 | 100 | 100 | **1,43 s** | 0,000 | 8 ms | 0,90 s | 0,90 s |
| parceria | desktop | **100** | 98 | 100 | 100 | 0,34 s | 0,000 | 0 ms | 0,24 s | 0,24 s |

### Home com o patch do carrossel aplicado só na cópia de auditoria (`docs/qa/lighthouse/depois-exp-carrossel/`)

| Página | Modo | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | SI |
|---|---|---|---|---|---|---|---|---|---|---|
| home `/` | mobile | **100** | 97 | 100 | 100 | **1,73 s** | 0,000 | 33 ms | 1,07 s | 1,07 s |
| home `/` | desktop | **100** | 97 | 100 | 100 | 0,40 s | 0,000 | 0 ms | 0,29 s | 0,48 s |

Cada linha é uma única execução (sem mediana de 3); variação típica de ±2 pontos entre execuções. O A11y 97/98 restante corresponde a `heading-order`, `label-content-name-mismatch` e `target-size` — todos estruturais, listados em §6 com patch.

## 3. Arquivos gerados

- Lighthouse antes: `docs/qa/lighthouse/antes/{home,servico-contabilidade,vertical-agronegocio,contato,parceria-business-partner}-{mobile,desktop}.report.{html,json}` (20 arquivos).
- Lighthouse depois: `docs/qa/lighthouse/depois/…` (mesma convenção, 20 arquivos).
- Experimento home com patch do carrossel: `docs/qa/lighthouse/depois-exp-carrossel/home-{mobile,desktop}.report.{html,json}`.
- axe: `docs/qa/lighthouse/axe-antes.json` e `docs/qa/lighthouse/axe-depois.json` (violações com seletor, HTML e mensagem; 5 páginas × 2 viewports).
- Scripts reutilizáveis: `scripts/serve-audit.mjs` (serve uma cópia na 3500) e `scripts/axe-audit.mjs` (`node scripts/axe-audit.mjs <saida.json> [base-url]`).

Para repetir: `node src/build.js && rm -rf /tmp/bf-audit && cp -R public /tmp/bf-audit && PORT=3500 node scripts/serve-audit.mjs /tmp/bf-audit &`, depois `CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npx lighthouse http://localhost:3500/ --chrome-flags="--headless=new" --output=json --output=html --output-path=docs/qa/lighthouse/depois/home-mobile` (acrescente `--preset=desktop` para desktop). Duas armadilhas encontradas: em zsh **não use a variável `path`** em loops (é o array ligado a `PATH` — zera o PATH do shell) e, se o chrome-launcher falhar em `mktemp`, exporte `TMPDIR` para uma pasta gravável.

## 4. Diagnóstico da home sem LCP (P0 para o orquestrador)

No build "depois", a home falha com `LanternError: NO_LCP` em mobile e desktop (3 execuções), embora FCP (1,07 s) e CLS (0) existam. O trace (`--save-assets`) mostra, em ordem: evento `scroll` aos **99 ms** + `scrollsnapchange` + `PaintTiming::NotifyScroll`, e só depois `firstContentfulPaint` aos **123 ms**. O Chrome para de considerar candidatos a LCP depois de um scroll de usuário/compositor; como o scroll ocorreu antes do primeiro paint, **nenhum candidato é emitido** — isso vale também para usuários reais (CrUX ficaria sem LCP para a home).

Origem: `.carousel__track { scroll-snap-type: x mandatory; scroll-behavior: smooth; padding: 8px 2px 16px }` (`src/assets/css/site.css`, bloco `.carousel`). Com `scroll-snap-align: start` nos itens e 2 px de *padding* à esquerda, a posição inicial (0) não é um ponto de snap; o navegador faz um snap animado de 2 px no primeiro layout. O baseline não sofria disso porque o Swiper da cdnjs (11.1.4) retornava **404** e o fallback não tinha *padding* lateral.

Patch comprovado (aplicado apenas na cópia de auditoria; resultado na tabela de §2):

```css
/* src/assets/css/site.css — .carousel__track */
.carousel__track { … scroll-snap-type: x mandatory; scroll-padding-inline: 2px; scroll-behavior: smooth; padding: 8px 2px 16px; … }
```

Alternativa equivalente: `padding: 8px 0 16px` no track (o `outline-offset: 6px` do foco já evita corte). Recomendo também `scroll-behavior: auto` até o `load` ou manter `smooth` só após interação, para que nenhum snap futuro de layout (ex.: `resize`) vire scroll de compositor.

## 5. Correções aplicadas (dentro do escopo autorizado)

### 5.1 `src/build.js` — `function page()` (`<head>`)
1. **Fonte self-hosted**: removidos os dois `preconnect` e o `<link>` do Google Fonts; adicionados `<link rel="preload" as="font" crossorigin>` do subconjunto latin e um `<style>` com dois `@font-face` (`font-weight: 300 800`, `font-display: swap`, `unicode-range` latin / latin-ext). Arquivos novos: `src/assets/fonts/plus-jakarta-sans-latin.woff2` (27,3 KB), `…-latin-ext.woff2` (21,7 KB) e `README.md` (origem: Google Fonts v12; licença SIL OFL 1.1). Se os arquivos forem removidos, o build volta ao Google Fonts automaticamente. Efeito medido: requisição da fonte começa aos 15 ms (antes: 583 ms, depois do CSS externo); `render-blocking-resources` cai de 1.600–1.820 ms estimados para 130–280 ms (só `site.css`); FCP 2,4–2,6 s → 0,9 s; CLS do swap zerado. A CSP (`font-src 'self'`, `style-src 'unsafe-inline'`) já permitia.
2. **Favicon PNG** de 52 KB (`URSO_GEOMETRICO_PURPLE.png`, 500×500) trocado por `icon-192.png` (13 KB) com `sizes="192x192"`; SVG continua primeiro.
3. `og:image:type` (derivado da extensão — o orquestrador trocou o OG para `og-image.jpg` 1200×630 durante a auditoria), `og:image:alt` e `twitter:image:alt`.

### 5.2 `src/build.js` — `vcard()`
Removido o `aria-label="<nome>: <resumo>"` do `<a class="vcard">`: o rótulo visível ("Conheça mais") não estava contido no nome acessível (`label-content-name-mismatch`, Lighthouse/axe). O conteúdo do link (h3 + p + "Conheça mais"; número decorativo já `aria-hidden`) nomeia o link.

### 5.3 `src/assets/css/site.css` — contraste e foco (razões calculadas; verificadas por axe/Lighthouse)

| Regra | Antes | Depois |
|---|---|---|
| `:focus-visible` | anel `rgba(139,92,246,.55)` (2,1:1 sobre branco) | `var(--violet-600)` sólido (5,7:1 claro); em fundos escuros (`.hero .phead .hdr .foot .sec--dark .sec--deep .band--cta .teaser .is-dark .program--dark .who-box .aside__box--dark .vcard`) `var(--violet-300)` (10:1); `.fcard`/`.pform` (cartões brancos em seção escura) voltam ao violet-600 |
| `.field input:focus` / `.fl input:focus` / `.chip input:focus-visible + span` | borda violet-500 (4,2:1) + halo .14–.18 | borda violet-600 + halo .3; `.form--dark` usa violet-300; chips com `outline` 3 px |
| `.fcard p`, `.fcard .form__note`, `.fcard .consent` | `ink-300` sobre branco (2,89:1 — `.sec--dark p` vencia o cartão) | `ink-500` (8,3:1) |
| `.fcard a` (link da Política de Privacidade no consentimento) | `violet-300` sobre branco (1,84:1) | `violet-600` (5,7:1) |
| `.form__note` / placeholders `.field` | `ink-300` sobre branco (2,89:1) | `ink-500` / `#6f6890` (5,2:1); `.form--dark` mantém `ink-300` (6,5:1 sobre escuro) |
| `.field__err`, `.form__msg.is-err` / `.is-ok` | `#ef4444` (3,8:1), `#22c55e` (2,3:1) sobre branco | `#dc2626` (4,8:1), `#15803d` (5,0:1); `.form--dark`: `#f87171` (6,7:1), `#4ade80` (10,7:1) |
| `.fl label` (formulário de parcerias) | `#8c86a3` (3,46:1) | `#6f6890` (5,17:1) |
| `.pform-foot a` | `#128c4b` (4,3:1) | `#15803d` (5,0:1) |
| `.post__meta` (data/categoria dos posts) | `ink-300` sobre branco (2,89:1) | `ink-500` |
| `.sec--dark .mlist strong` (contato: "Depois do envio") | `ink-900` sobre `bg-2` (**1,06:1**, invisível) | `#fff`; numerador em `violet-300` |
| `.teaser .eyebrow` / `.teaser p, .lead` (página de serviço) | violet-600 (3,55:1) / `ink-500` (2,45:1) sobre `bg-0` | `violet-300` / `ink-300` |
| `.wa-float` (ícone) | branco sobre `#25d366` (1,98:1) | `#06351b` (6,9:1), como no `.btn--wa` |
| `.carousel__dots button` | `ink-700` a 40 % (2,2:1) | 60 % (4,1:1) |
| `.contact-list a`, `.cookie p a` | só cor (1,2–1,4:1 vs. texto ao redor) | sublinhado (`link-in-text-block`) |

Bloco `@media (prefers-reduced-motion)` já cobria animações, `reveal` e `scroll-behavior`; não precisou de mudança.

### 5.4 Infraestrutura de auditoria
`scripts/serve-audit.mjs` e `scripts/axe-audit.mjs` (novos). Build confirmado (`node src/build.js` → 34 páginas) e `npm test` → 26/26.

## 6. Pendências (fora do escopo autorizado) — com patch sugerido

| # | Prioridade | Item | Onde | Patch |
|---|---|---|---|---|
| 1 | **P0** | Home sem LCP (scroll-snap inicial do carrossel) | `src/assets/css/site.css` `.carousel__track` | ver §4: `scroll-padding-inline: 2px` (comprovado) |
| 2 | P1 | `target-size` (axe, serious; Lighthouse A11y home): 8 pontos do carrossel com 8×8 px (mín. 24×24) | `site.css` `.carousel__dots` | `.carousel__dots { gap: 0 } .carousel__dots button { width: 32px; height: 24px; background: none; position: relative } .carousel__dots button::before { content: ""; position: absolute; inset: 50% auto auto 50%; transform: translate(-50%,-50%); width: 8px; height: 8px; border-radius: 4px; background: var(--ink-700); opacity: .6; transition: all .3s var(--ease) } .carousel__dots button[aria-current="true"]::before { width: 26px; background: var(--violet-500); opacity: 1 }` |
| 3 | P1 | `label-content-name-mismatch` em `a.brand` (header e footer, todas as páginas): `aria-label="Bear Finance — página inicial"` não contém o texto visível "BEAR FINANCE Inteligência contábil" | `src/build.js` `brand()` (l. 79) | remover o `aria-label` (o texto visível já nomeia o link) ou usar `aria-label="Bear Finance – Inteligência contábil – página inicial"` |
| 4 | P1 | `heading-order`: `/contato/` h1 → `.fcard h3`; `/parcerias/*` h1 → `.pform-head h3` e h2 → `.who-box h4`; `/atuacao/`, `/verticais/`, `/cases/`, `/conteudo/` h1 → h3 dos cards; posts h2 → `.aside__box h4` | `diagForm()`, `partnerForm()`, `partnerProgramPage()`, índices, `post()` | parametrizar o nível (`diagForm({ tag: "h2" })` no contato); `.pform-head h3` → `h2`; `.who-box h4` → `h3`; nos índices, um `h2` visualmente oculto ("Nossas soluções"/"Segmentos") antes da grade ou cards com `h2`; `aside h4` → `h2` com estilo de h4 |
| 5 | P1 | Landmarks (axe moderate, todas as internas): `<header class="phead">` fora de `<main>` vira segundo `banner` (`landmark-no-duplicate-banner`/`landmark-unique`); `.hero`, `.curve__btn`, `.wa-float`, `.totop` fora de landmarks (`region`) | `phead()`, `home()`, `footer()` | `phead` → `<section class="phead" aria-labelledby="page-title">` (ou `<div>`); mover `.hero` e `.curve` para dentro de `<main>` (skip link pode apontar para `#proposta`); envolver `.totop` + `.wa-float` em `<nav aria-label="Atalhos">` |
| 6 | P2 | Logo `URSO_GEOMETRICO_PURPLE.png` 52 KB renderizado a 44 px (Lighthouse: `modern-image-formats`/`uses-responsive-images`, 41–51 KiB por página; concorre com o LCP no primeiro acesso) | `brand()` | usar `URSO_GEOMETRICO_PURPLE.webp` (15 KB, já existe) ou um 88×88 gerado pelo creative-director, e `fetchpriority="low"` nas duas ocorrências |
| 7 | P2 | `uses-long-cache-ttl`/`cache-insight` (66–74 KiB): assets versionados (`?v=hash`) servidos com `max-age=3600` | `server.js` | para `/assets/` com `?v=` e para `/assets/fonts/`: `Cache-Control: public, max-age=31536000, immutable`; HTML continua `no-cache` |
| 8 | P2 | `brazil-geo.js` (59 KB / 20 KB gz) + `brmap.js` carregados em todos os aparelhos, mas o mapa Canvas só roda com `(hover:hover)` e desktop; `dom-size` 1.121 na home (mapa SVG inline de 64 KB; HTML 133 KB / 37 KB gz) | `MAP_SCRIPTS` em `build.js` / `site.js` | injetar os dois scripts sob demanda (`matchMedia("(hover:hover) and (min-width:992px)").matches` + IntersectionObserver em `#presenca`); avaliar o mapa estático como `<img src="/assets/img/art/brasil-presenca.svg" loading="lazy">` em vez de SVG inline |
| 9 | P2 | SEO: `title` > 60 c nos 6 posts (61–77 c) e `description` fora de 140–160 em 4 posts (107–127 c) e em `/parcerias/business-partner/` (134 c); `Article` sem `image` (posts usam placeholders); `telephone` do JSON-LD em formato local; `sameAs` com perfis `[A CONFIRMAR]` (risco de apontar para perfis de terceiros) | `src/data.js` (posts `metaTitle`/`metaDescription`, `site`), `ORG_LD` | `metaTitle` ≤ 60 c e `metaDescription` 140–160 c por post; `telephone: "+55 11 98314-8774"`; remover `sameAs` até confirmar os perfis; `Article.image` quando houver capa real |
| 10 | P2 | `sitemap.xml` com `lastmod` = data do build em todas as URLs | bloco BUILD de `build.js` | usar `p.date` nos posts e uma data estável (ex.: do git) nas demais; `lastmod` que muda sem alteração de conteúdo é ignorado pelo Google |
| 11 | P2 | `unminified-css` (2 KiB) / `unused-css-rules` (10 KiB em `/contato/`) | build | minificação simples no `cp` dos assets (remover comentários/espaços) e, se desejado, `content-visibility: auto; contain-intrinsic-size: auto 600px` nas seções abaixo da dobra (testar com o IntersectionObserver do `reveal`) |
| 12 | P3 | Sem `site.webmanifest` apesar de `icon-192.png`/`icon-512.png` existirem (sem impacto de score no Lighthouse 12) | BUILD | gerar `manifest` com `name`, `theme_color: #07050d`, ícones 192/512 e `<link rel="manifest">` em `page()` |

Observação: o Swiper 11.1.4 da cdnjs retornava **404** no baseline (carrossel nunca inicializava; `onerror` apenas avisava). O orquestrador substituiu-o por um carrossel nativo durante a auditoria — por isso a home "antes" e "depois" diferem também nesse ponto.

## 7. Itens verificados sem pendência
`lang="pt-BR"`, `title`/`description` únicos nas 34 páginas (exceções em §6.9), um `h1` por página, canonical, `og:*` completos (imagem 1200×630), Twitter card, favicon SVG + PNG + `apple-touch-icon` 180 px, `theme-color`, `robots` (`index,follow,max-image-preview:large`; 404 com `noindex`), `sitemap.xml`/`robots.txt`, JSON-LD válido em todas as páginas (`AccountingService`+`Organization`, `BreadcrumbList`, `FAQPage`, `Service`, `Article`; sem `aggregateRating`/prêmios), imagens com `width/height`, `loading="lazy"` fora da dobra e `fetchpriority="high"` no LCP (arte do hero/phead), `decoding="async"`, scripts `defer`, Swiper/CDN eliminados, WebGL e mapa com `prefers-reduced-motion`, skip link, `aria-expanded` em menu/FAQ, abas ARIA, rótulos visíveis nos formulários, Best Practices 100 (CSP, sem erros de console).

## Medição final (orquestrador, build final — 14/10/2026)

Após aplicar as pendências P0/P1 deste relatório (padding do carrossel → LCP válido; alvos de 24 px nos pontos; `aria-label` do logo removido; ordem de títulos; `<main>` envolvendo hero/topo; flutuantes dentro do rodapé; logo em WebP; mapa neural carregado só em desktop com ponteiro fino, imagem estática no mobile; `telephone` E.164; `sameAs` só após confirmação; `Article.image`; `lastmod` por página; fontes com `?v=`), Lighthouse 12.8.2 em `docs/qa/lighthouse/final/` (JSON + HTML):

| Página | Mobile Perf / A11y / BP / SEO · LCP · CLS · TBT | Desktop Perf / A11y / BP / SEO · LCP · CLS |
|---|---|---|
| `/` | 100 / 100 / 100 / 100 · 1,4 s · 0 · 30 ms | 100 / 97→100* / 100 / 100 · 0,3 s · 0 |
| `/atuacao/contabilidade/` | 100 / 100 / 100 / 100 · 1,4 s · 0 · 0 ms | 100 / 100 / 100 / 100 · 0,3 s · 0 |
| `/verticais/contabilidade-agronegocio/` | 100 / 100 / 100 / 100 · 1,4 s · 0 · 0 ms | 100 / 100 / 100 / 100 · 0,3 s · 0 |
| `/contato/` | 100 / 100 / 100 / 100 · 1,4 s · 0 · 0 ms | 100 / 100 / 100 / 100 · 0,3 s · 0 |
| `/parcerias/business-partner/` | 100 / 100 / 100 / 100 · 1,8 s · 0 · 0 ms | 100 / 100 / 100 / 100 · 0,4 s · 0 |

\* A home desktop foi medida antes da correção dos pontos do carrossel (97, `target-size`); a reauditoria de acessibilidade mobile após a correção deu **100** (`home-mobile-a11y.report.json`). Metas do projeto (Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 95, LCP ≤ 2,5 s, CLS ≤ 0,1) atingidas em todas as páginas medidas. Medições em laboratório (Lighthouse, Moto G Power simulado / desktop); INP exige dados de campo e não foi medido.
