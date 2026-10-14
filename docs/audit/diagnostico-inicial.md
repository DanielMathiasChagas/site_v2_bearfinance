# Diagnóstico inicial — site Bear Finance

**Data:** 14/10/2026 · **Responsável:** orquestrador (Claude Fable 5.1) · **Branch:** `redesign/v2` (baseline em `main`, commit `0a03fc4`)

## 1. Método

1. Inventário completo do repositório (`src/`, `public/`, `server.js`, `README.md`, `package.json`).
2. Build local (`node src/build.js`) e servidor em `http://localhost:3100`.
3. Capturas reais com Chrome headless (1440 px e 390 px) de Home, Serviço, Vertical e Contato — `scratchpad/baseline/*.png` (replicadas em `docs/qa/screenshots/antes/`).
4. Leitura da referência https://planning.com.br/ (texto via fetch + captura 1440 px) para registrar padrões de experiência.
5. Verificação de ferramentas disponíveis no ambiente.

## 2. Stack e arquitetura encontradas

| Item | Estado |
|---|---|
| Gerador | Node 24, ESM, **sem dependências**: `src/data.js` (conteúdo) → `src/build.js` (templates em template-strings, 1.072 linhas) → `public/` |
| Estilos | `src/assets/css/site.css` (840 linhas, tokens em `:root`, grid de 12 colunas, utilitários `.pt80` etc.) |
| Comportamento | `src/assets/js/site.js` (menu, typed text, reveal, contadores, FAQ, abas, vídeos lazy, Swiper sob demanda, formulários → API, Ken Burns, ondas WebGL) |
| Servidor | `server.js` (`node:http`): estáticos + `POST /api/{contato,newsletter,parceria,carreira}`; honeypot, rate limit em memória, grava `data/*.jsonl`, webhook opcional |
| Páginas | 34 HTML: Home, Sobre, ESG, Carreira, Cases, Plataforma, Parcerias (+2), Contato, Conteúdo (+6 posts), Atuação (+5), Verticais (+8), Privacidade, 404 + `sitemap.xml`, `robots.txt` |
| Imagens | 3 ativos reais (`URSO_GEOMETRICO_PURPLE.png` 500², `URSO_CARA.jpg` 1536×1024, `SISTEMA.jpg` 1024×1536) + 14 SVG placeholders roxos "FOTO · substituir" |
| CDN | Google Fonts (Plus Jakarta Sans, Dancing Script), Font Awesome 6.5.2 (CSS + webfont), Swiper 11 (sob demanda) |
| Git | **Não existia.** Inicializado hoje; baseline em `main`, trabalho em `redesign/v2` |
| Testes | Nenhum |
| Ferramentas no ambiente | Chrome 1440/390 headless ✔ · `playwright-core` 1.56 + `lighthouse` 12.8 + `axe-core` 4.10 instalados hoje como devDependencies ✔ · `cwebp` ✔ · **Sem gerador de imagem raster** (sem MCP de imagem, PIL ou ImageMagick) · Extensão Claude-in-Chrome **não conectada** |

## 3. Identidade visual atual

- Paleta roxa (`#8b5cf6`, `#a78bfa`, `#c4b5fd`, fundos `#150f24`/`#0b0716`), Plus Jakarta Sans, botões pílula em caixa alta, bordas de 2 px, números vazados (`-webkit-text-stroke`).
- Estrutura é um **clone estrutural** da planning.com.br (ordem de seções, container 1240 px, seções 80 px, topo com vídeo/ondas, "Por que", carrossel de verticais 140 vw, mapa, FAQ, newsletter no rodapé). Textos, imagens e vídeos são próprios/placeholder.
- Símbolo: urso geométrico low-poly roxo; arte "urso neural" azul (`URSO_CARA.jpg`) ainda não integrada à paleta.

## 4. Problemas encontrados (por severidade)

| # | Sev. | Área | Problema | Evidência |
|---|---|---|---|---|
| 1 | **Bloqueador** | Conteúdo | Números inventados apresentados como fatos: "+500 empresas", "+15 anos", "NPS 98 %", "+300 % de eficiência", resultados de cases ("Redução de 18 %…"), `partnerNumbers`, `about.numbers` | `src/data.js` → `why`, `presence.numbers`, `about.numbers`, `cases`, `partnerNumbers`; screenshot home-1440 |
| 2 | **Bloqueador** | Conteúdo | Headline do hero parafraseia a da referência ("Somos a ponte entre … hoje e … amanhã. Somos a Bear Finance.") | `data.js` → `hero.title` vs. planning.com.br |
| 3 | **Bloqueador** | Conteúdo | Faixa de "Cliente 01…08" fictícios no hero | `data.js` → `clients` |
| 4 | **Alta** | Visual | 100 % das fotos são placeholders com etiqueta "FOTO · substituir"; nenhuma ilustração própria | screenshots |
| 5 | **Alta** | Acessibilidade | `outline: 0` global remove o foco visível de todo o site; FAQ e abas sem `button`/`aria-expanded`; submenus sem `aria-haspopup`/teclado; números decorativos sem `aria-hidden` | `site.css` linha 25; `build.js` `faqBlock`, `#title-tabs` |
| 6 | **Alta** | Responsivo | Em 390 px há conteúdo cortado à direita no hero e nos cards (indício de largura > viewport mascarada por `overflow-x:hidden`) | `baseline/home-390.png`; suspeitos: `.vertical-inner{width:140vw}`, `#nossos-numeros{width:180%}`, `.inner--fluid{110vw}` |
| 7 | **Alta** | Conversão | Contato pede cargo, ERP e faturamento (fricção alta); não há formulário de diagnóstico na home; CTAs do hero são "Saiba mais" (baixa intenção) | `build.js` `contactForm()`, `home()` |
| 8 | **Alta** | Conversão | WhatsApp via link curto `w.app/bcalgz` não permite mensagem pré-formatada por serviço | `data.js` → `site.whatsapp` |
| 9 | **Alta** | Backend | Sem CSP/cabeçalhos de segurança além de `nosniff`; validação server-side mínima (sem enum, sem telefone); sem testes; sem entrega por e-mail (apenas JSONL + webhook opcional) | `server.js` |
| 10 | **Média** | Performance | Font Awesome (CSS ~ 100 KB + webfont) usado só para ~40 ícones; `backdrop-filter`/`filter` em áreas grandes; WebGL de ondas em todas as páginas; sem `width/height` em imagens; sem versionamento de assets (cache de 7 dias pode servir CSS antigo) | `build.js` `page()`, `site.css` |
| 11 | **Média** | SEO | `og:image` = PNG 500×500 do urso (precisa 1200×630); sem `og:type/url/locale`, Twitter card, `BreadcrumbList`; sitemap sem `lastmod`; sem favicon SVG/apple-touch-icon | `build.js` `page()` |
| 12 | **Média** | Contato | iframe do Google Maps não renderiza (caixa cinza) e injeta cookies de terceiro | `baseline/contato-1440.png` |
| 13 | **Média** | Navegação | Links de idioma EN/ES apontam para `/` ("em breve") — links falsos | `build.js` `header()` |
| 14 | **Média** | Visual | Estilo "template": botões em caixa alta, bordas 2 px, `style=""` inline espalhados no `build.js`, hierarquia tipográfica irregular (h1 26 px abaixo de h2 44 px nos topos internos) | `site.css`, `build.js` |
| 15 | **Média** | Conteúdo | Vídeos sem ID (todos placeholders); sócios placeholders; vagas inventadas; logos de parceiros placeholders | `data.js` → `videos`, `about.team`, `career.jobs` |
| 16 | **Baixa** | Código | Sem CLAUDE.md/docs; `make-placeholders.py` gera arte provisória; cookie banner só "Aceitar" (sem recusar) | repo |

## 5. Referência planning.com.br — padrões registrados (não copiar conteúdo)

**Arquitetura (home):** header fixo com idioma + CTA "Solicitar proposta" → hero de posicionamento → 5 áreas de atuação em cards → "Por que" com métricas → 9 verticais numeradas → logos de ERPs → presença nacional → 4 posts → FAQ → newsletter → rodapé extenso (13 unidades, menu repetido, CNPJ).

**Pontos fortes a preservar como padrão:** cards de serviço uniformes (ícone, título, benefício, link); verticais como vitrine grande; seção de ERPs como prova de capacidade técnica; FAQ com perguntas reais; newsletter integrada ao rodapé; menu em 3 grupos (Sobre, Atuação, Verticais).

**Fraquezas observadas (oportunidade de superar):** CTA do hero de baixa intenção; métricas sem fonte; presença nacional é uma imagem estática; FAQ sem acordeão; rodapé repetitivo; sem WhatsApp; numeração das verticais sem sentido.

**Não replicar:** textos, fotos, logotipo, verde institucional, nomes de programas, métricas.

## 6. Decisão de direção

A arquitetura de informação (ordem das seções e proporções) foi validada pelo cliente na v1 e **permanece**. A intervenção desta fase é elevar a camada visual, o conteúdo e a engenharia:

1. Design system próprio (tokens, componentes, estados) em preto/grafite + roxo como luz, com acentos metálicos discretos e áreas claras — documentado em `docs/design/design-system.md`.
2. Ilustrações originais em SVG/CSS/Canvas (não há gerador raster): hero, serviços, verticais, tecnologia, presença nacional, banners.
3. Mapa neural 3D do Brasil (Canvas 2D com projeção em perspectiva, malha IBGE já presente em `src/brazil-geo.js`), com fallback estático e respeito a `prefers-reduced-motion`.
4. Conteúdo reescrito por marketing B2B contábil, **sem números inventados**; itens não confirmáveis marcados `[A CONFIRMAR]`.
5. Conversão: formulário de diagnóstico (nome, empresa, e-mail corporativo, telefone, segmento, serviço, mensagem) na home e no contato; WhatsApp `wa.me` com mensagem por serviço; backend validado, protegido e testado.
6. Remoção do Font Awesome em favor de ícones SVG inline; versionamento de assets; metadados completos.
7. QA automatizado (Playwright + `node --test`), Lighthouse e revisão independente antes de declarar pronto.

## 7. Divisão de responsabilidades (evita conflito de edição)

| Agente | Arquivos |
|---|---|
| Orquestrador / Frontend Architect | `src/build.js`, `src/assets/css/site.css`, `src/assets/js/site.js`, docs |
| frontend-architect (mapa) | `src/assets/js/brmap.js`, `src/assets/css/brmap.css` |
| backend-engineer | `server.js`, `tests/server.test.js`, `.env.example`, script `test` no `package.json` |
| accounting-marketing | `src/data.js` |
| creative-director | `src/assets/img/art/**`, `src/icons.js`, `src/assets/img/*.webp`, `docs/design/assets.md` |
| qa-tester | `tests/e2e/**`, `docs/qa/test-report.md`, `docs/qa/screenshots/**` |
| seo-performance | `<head>` em `build.js`, `docs/qa/performance-report.md` |
| technical-reviewer | `docs/qa/technical-review.md` (somente leitura do resto) |

## 8. Dependências externas / informações pendentes do cliente

- Vídeos institucionais (IDs do YouTube) e vídeo de fundo do hero.
- Fotos reais (equipe, escritório) e logos de clientes/parceiros com autorização.
- Números verificáveis (anos de atuação, clientes, NPS) com fonte — até lá não serão exibidos.
- Razão social, CNPJ e URL do Complexo DMC para o rodapé.
- Credenciais SMTP/CRM para entrega de leads (sem elas, leads ficam em `data/*.jsonl`).
- Domínio e ambiente de hospedagem (produção).
