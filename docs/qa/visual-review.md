# Revisão visual — antes × depois

Capturas reais (Chrome via Playwright, DPR 1). "Antes" = v1 (clone estrutural, placeholders roxos) em `docs/qa/screenshots/antes/`; "Depois" = v2 em `docs/qa/screenshots/orquestrador/` (varredura do orquestrador) e `docs/qa/screenshots/depois/` (QA). Folha de contato das ilustrações em `docs/design/contact-sheet.png`.

## Método
`node scripts/shots.mjs <pasta>`: 17 rotas × 7 larguras (320, 375, 390, 768, 1024, 1440, 1920). Para cada uma: status HTTP, contagem de `h1`, tamanho do `<title>`, largura de rolagem vs. viewport (overflow horizontal) com lista de elementos culpados, erros de console/página/requisição. Screenshots de página inteira em 1440 e 390 após rolagem programática (para disparar as revelações), mais capturas do mapa neural com o ponteiro sobre uma capital, do hero e do menu mobile aberto.

## Resultado da última varredura (14/10/2026)
- 119 combinações rota × largura: **0 overflow horizontal, 1 `h1` em todas, 0 erros de console** (exceto o 404 esperado na rota inexistente). O carrossel de segmentos é nativo (scroll-snap), sem CDN.
- Mapa neural: `.br-neural.is-live` = true, canvas 658×658 em 1440 px, rótulo muda ao pairar sobre uma capital (ex.: "Goiânia · GO · atendimento digital").

## Comparativo por página

| Página | Antes (v1) | Depois (v2) | Evidência |
|---|---|---|---|
| Home — hero | Headline parafraseada da referência, faixa "Cliente 01…08" fictícia, imagem placeholder | Headline própria, pílula com texto digitado, CTA de diagnóstico + WhatsApp, selos de capacidade verificáveis, arte neural do urso, ondas WebGL discretas | `antes/home-1440.png` × `orquestrador/hero-1440.png` |
| Home — "Por que" | 6 caixas com números inventados (+500, +15 anos, NPS, +300 %) | Proposta de valor (3 pilares) + 6 diferenciais verificáveis em cards de vidro | `orquestrador/home-1440.png` |
| Home — segmentos | Carrossel 140 vw (cortava em mobile) | Carrossel contido (sem overflow), cards com arte própria, número e ícone | idem |
| Home — presença | Mapa SVG plano | Mapa neural 3D (Canvas) com arcos, pulsos, parallax e rótulo; fallback SVG acessível | `orquestrador/map-1440.png` |
| Home — conversão | Sem formulário na home | Seção de diagnóstico com formulário de 7 campos + WhatsApp contextual | `orquestrador/home-1440.png` |
| Serviço | h1 pequeno ("Contabilidade") sob h2 grande; FA icons; "PrimeGlobal" | Topo com promessa como h1, entregas concretas, método numerado, citação, teaser da plataforma com arte, FAQ e diagnóstico pré-selecionado | `antes/servico-1440.png` × `orquestrador/atuacao_contabilidade-1440.png` |
| Segmento | "Parceiros homologados" e selos placeholder | Destaques, blocos com arte, atividades em chips, abas acessíveis, declaração honesta de atualização setorial | `antes/vertical-1440.png` × `orquestrador/verticais_contabilidade-agronegocio-1440.png` |
| Contato | Formulário com cargo/ERP/faturamento; iframe do Google Maps quebrado | Diagnóstico em card, canais diretos, "depois do envio", cartões de unidade com link para o Maps | `antes/contato-1440.png` × `orquestrador/contato-1440.png` |
| Parcerias (programa) | Números inventados | Fatos de capacidade, formulário em 2 etapas → WhatsApp preservado e restilizado | `orquestrador/parcerias_business-partner-1440.png` |
| Sobre | "+500 / +15 anos / NPS 90+" | Fatos SP / IA / DMC, história, sócios como placeholders honestos, valores | `orquestrador/sobre-1440.png` |
| Cases | Resultados fabricados (% de economia) | Cenários típicos sem clientes nem números | `orquestrador/cases-1440.png` |
| Mobile | Texto cortado em 390 px (overflow) | Sem overflow em 320–1920; drawer de tela cheia com acordeões | `antes/home-390.png` × `orquestrador/home-390.png`, `orquestrador/menu-mobile-390.png` |

## Problemas encontrados e corrigidos durante a revisão
| # | Problema | Causa | Correção |
|---|---|---|---|
| V1 | Seções em branco em capturas de página inteira | `.reveal` com opacidade 0 até entrar na viewport; ferramenta de captura não rola | Revelação só com `html.js` (sem JS tudo visível) e varredura rola a página antes de capturar |
| V2 | Overflow horizontal em /carreira/ (320–768) | `max-width:860px` inline sobrescrevia `max-width:100%` | Classe `.inner--narrow` |
| V3 | Overflow em 320 px na página de programa de parceria | Botões pílula com `white-space:nowrap` e rótulo longo | Botões quebram linha abaixo de 480 px; `min-width:0` nos filhos de grids |
| V4 | Drawer mobile aparecia como faixa de 72 px | `backdrop-filter` no header virava bloco de contenção do `position:fixed` | Header sem backdrop-filter no mobile |
| V5 | Mapa neural caía no fallback | `const rgba` usado antes da inicialização (ordem no IIFE) | `init()` movido para o fim do módulo |
| V6 | Mesma arte do urso repetida em vários pôsteres | pôster padrão único | Mapa de pôsteres por página |
| V7 | Foto azul do urso destoava da paleta | ativo original azul | Filtro de matiz (`.media--brand`) |

## Observação sobre capturas longas
Páginas mobile com mais de 16.384 px de altura (home em 390 px: ~18.100 px) excedem o limite de textura do Chrome; a captura de página inteira repete o topo no rodapé. É artefato de captura: o DOM tem um único hero/h1 e as seções na ordem esperada (verificado pelo revisor independente). Para evidência do fim dessas páginas, capturar por segmentos (`clip`).

## Pendências visuais (dependem do cliente)
- Fotos reais de sócios e equipe (hoje avatares com etiqueta "Substituir").
- Vídeos (IDs do YouTube) para os blocos "em breve".
- Logos de clientes/parceiros, se houver autorização (a faixa foi removida para não exibir nomes fictícios).
