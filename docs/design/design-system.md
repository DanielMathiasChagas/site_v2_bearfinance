# Design System — Bear Finance v2

Direção: **solidez institucional + inteligência contábil + tecnologia**. Fundo grafite/preto com roxo usado como *luz* (brilhos, linhas, acentos), prata/lavanda como acento metálico discreto, e seções claras para leitura longa. Nada de arco-íris, nada de brilho excessivo, nada de "template".

## 1. Cores (tokens CSS em `src/assets/css/site.css` → `:root`)

| Token | Valor | Uso |
|---|---|---|
| `--bg-0` | `#07050d` | fundo mais profundo (hero, mapa) |
| `--bg-1` | `#0d0a17` | seções escuras |
| `--bg-2` | `#150f24` | superfícies escuras elevadas / rodapé |
| `--bg-3` | `#1d1630` | cards sobre escuro |
| `--ink-900` | `#0b0716` | títulos sobre claro |
| `--ink-700` | `#2a2440` | subtítulos |
| `--ink-500` | `#514a6b` | texto corrido sobre claro (contraste 7:1) |
| `--ink-300` | `#9a94b3` | texto secundário sobre escuro |
| `--surface-0` | `#ffffff` | seções claras |
| `--surface-1` | `#f7f5fc` | fundo alternado claro |
| `--surface-2` | `#efebf9` | chips, inputs sobre claro |
| `--line` | `#e4dff2` | bordas sobre claro (1 px) |
| `--line-dark` | `rgba(255,255,255,.08)` | bordas sobre escuro |
| `--violet-700` | `#5b21b6` | profundidade, sombras coloridas |
| `--violet-600` | `#7c3aed` | hover de links sobre claro |
| `--violet-500` | `#8b5cf6` | **primária** (ícones, links, destaques) |
| `--violet-400` | `#a78bfa` | botões primários sobre escuro, títulos destacados |
| `--violet-300` | `#c4b5fd` | hover, eyebrows sobre escuro |
| `--violet-200` | `#e4dcff` | texto de apoio sobre roxo |
| `--metal` | `linear-gradient(135deg,#f3f1fa 0%,#c6c2d8 40%,#faf9fe 55%,#aaa5c0 100%)` | texto/linhas "metálicas" (uso raro) |
| `--glow` | `0 0 60px rgba(139,92,246,.35)` | brilho de nós/CTAs |
| `--ok` `#22c55e` · `--wa` `#25d366` · `--err` `#ef4444` | semânticas |

Regras de contraste: texto corrido sobre escuro usa `#e9e6f3` (não branco puro) ou `--ink-300` para secundário; texto sobre `--violet-400` usa `--ink-900`; nunca lilás sobre roxo médio para texto menor que 20 px.

## 2. Tipografia

Fonte única: **Plus Jakarta Sans** (300/400/600/700/800), `font-display: swap`, preconnect. Dancing Script removida.

| Papel | Desktop | Mobile | Peso | Tracking |
|---|---|---|---|---|
| Display (hero) | 64/1.05 | 38/1.1 | 300 + `strong` 700 | -0.02em |
| H1 interno | 52/1.08 | 34/1.12 | 700 | -0.015em |
| H2 seção | 44/1.1 | 30/1.15 | 300 + `strong` 700 | -0.01em |
| H3 card | 24/1.25 | 20 | 700 | 0 |
| H4 | 19/1.3 | 18 | 700 | 0 |
| Lead | 20/1.55 | 18 | 400 | 0 |
| Body | 17/1.6 | 16 | 400 | 0 |
| Small | 14/1.5 | 14 | 400/600 | 0 |
| Eyebrow | 12/1 | 12 | 700 | .14em, caixa alta |

`strong` dentro de títulos recebe `--violet-500` (sobre claro) ou `--violet-300` (sobre escuro).

## 3. Espaçamento, raios, sombras

- Escala 4 px: `--s-1` 4 · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-5` 24 · `--s-6` 32 · `--s-7` 48 · `--s-8` 64 · `--s-9` 96 · `--s-10` 128.
- Seção: `padding: 96px 0` (desktop) / 64 (tablet) / 48 (mobile). Container 1240 px com gutter 24 px (grid interno mantém 15 px).
- Raios: `--r-1` 8 · `--r-2` 14 · `--r-3` 22 · `--r-pill` 999.
- Sombras: `--sh-1: 0 1px 2px rgba(11,7,22,.06), 0 8px 24px -12px rgba(11,7,22,.18)` · `--sh-2: 0 24px 60px -24px rgba(11,7,22,.45)` · colorida: `0 30px 80px -30px rgba(91,33,182,.55)`.
- Bordas sempre 1 px.

## 4. Componentes

**Botões** (altura 52 px, raio pílula, peso 700, caixa normal, 16 px): `.btn` primário = `--violet-400` + `--ink-900`, hover eleva 2 px e ganha `--glow`; `.btn--outline` = borda 1 px `rgba(255,255,255,.35)` sobre escuro ou `--line` sobre claro; `.btn--ghost` = link com seta; `.btn--wa` = `--wa`. Foco: anel 3 px `rgba(139,92,246,.45)` + offset 2 px. Loading: `[aria-busy=true]` mostra spinner e desabilita.

**Cards**: sobre claro = `--surface-0`, borda `--line`, raio `--r-2`, hover borda `--violet-500` + `--sh-2` + ícone colorido; sobre escuro = `rgba(255,255,255,.035)` + borda `--line-dark` + highlight interno (`inset 0 1px 0 rgba(255,255,255,.06)`), hover `rgba(255,255,255,.06)`.

**Section head**: eyebrow (ponto roxo + texto) → H2 → lead, alinhado à esquerda; em 2 colunas (título | lead) quando houver espaço.

**Navegação**: header transparente → vidro escuro (`rgba(7,5,13,.82)` + blur 14 px) após 80 px; dropdowns com painel escuro, item com título + descrição curta; mobile: drawer de tela cheia, submenus em acordeão, foco preso, Esc fecha. CTA "Solicitar diagnóstico" sempre visível.

**Formulários**: input 54 px, fundo `--surface-0` (claro) ou `rgba(255,255,255,.05)` (escuro), borda 1 px, raio `--r-1`, rótulo visível acima (não só placeholder), erro em `--err` com texto, sucesso em bloco verde com ícone. Honeypot `website` oculto; campo `ts` com timestamp.

**FAQ**: `button[aria-expanded]` + painel com `hidden`; ícone +/− rotaciona.

**Abas**: `role=tablist`/`tab`/`tabpanel`, setas do teclado.

**Rodapé**: 4 colunas (marca + propósito, navegação, serviços, contato/unidades), newsletter acima, linha legal com CNPJ `[A CONFIRMAR]`, políticas e "Parte do ecossistema Complexo DMC".

**Vídeo**: poster com play (ring pulse), carregamento sob clique (`youtube-nocookie`).

## 5. Movimento

- Reveal: `opacity 0→1` + `translateY(18px→0)`, 700 ms, `cubic-bezier(.2,.7,.2,1)`, stagger 70 ms por irmão.
- Hover: 200 ms. Nada de parallax em `prefers-reduced-motion: reduce` (todas as animações viram estáticas).
- Hero: ondas WebGL existentes, mais escuras e lentas; mapa neural (Canvas 2D) só com `(hover:hover)` e desktop; demais aparelhos recebem quadro estático.
- Contadores só para valores verificáveis (não há no momento).

## 6. Ícones

Sprite inline via `src/icons.js` → `ico("nome")` no build (24 × 24, traço 1.75, `currentColor`). Nomes: `calculator, chart-line, users, search-chart, sitemap, factory, wheat, stethoscope, hard-hat, truck, store, bolt, code, handshake, shield, lightbulb, trophy, leaf, people, scale, chart-bar, bank, users-gear, gauge, cpu, lock, cube, play, chevron-down, chevron-up, chevron-right, arrow-right, arrow-left, arrow-down, check, plus, minus, x, menu, pin, mail, phone, whatsapp, linkedin, instagram, youtube, link, user, badge, file, clock, globe, sparkles, layers, target, briefcase, building, quote, calendar, external, star, refresh, eye, bell, wallet, receipt, coins, percent, trending-up, map, headset, book, graduation, rocket, puzzle, key, database, cloud, settings`.

## 7. Imagens e ilustrações

- Sem gerador raster no ambiente → ilustrações **originais em SVG** (low-poly coerente com o urso, malhas neurais, grades isométricas), fundos CSS (gradientes radiais, grain via `feTurbulence`), Canvas para o mapa.
- Fotos reais (quando o marketing entregar): tratamento duotone roxo via `mix-blend-mode`/`filter`, `object-fit: cover`, `aspect-ratio` fixo, WebP com `cwebp -q 82`, `loading=lazy` fora da dobra.
- OG image 1200 × 630 rasterizada do SVG; favicon SVG + apple-touch-icon 180 px.

## 8. Responsividade

Breakpoints: 480 · 768 · 992 · 1200 · 1440. Testar 320/375/390/768/1024/1440/1920. Nunca `width: >100vw` em elementos de fluxo; carrosséis em `overflow: hidden` dentro de wrapper `max-width: 100%`.
