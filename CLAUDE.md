# Bear Finance — site institucional (v2 redesign)

Gerador estático Node sem dependências: `src/data.js` → `src/build.js` → `public/` (gerado; nunca editar à mão). Servidor `server.js`. Comandos: `npm run build`, `PORT=3100 npm start`, `npm test`.

## Decisões (14/10/2026)
- Arquitetura de informação do clone estrutural (ordem/proporções da referência) permanece; a camada visual, o conteúdo e a engenharia são elevados ao design system de `docs/design/design-system.md`.
- Sem números inventados (clientes, NPS, anos, resultados). Itens não confirmados ficam `[A CONFIRMAR]` em comentário e fora do site.
- Ícones inline via `src/icons.js` (sem Font Awesome). Ilustrações em SVG (não há gerador raster no ambiente).
- WhatsApp: `wa.me/5511983148774?text=` com mensagem por serviço (`waText`). Parcerias: `5511915267749`.
- Mapa neural: Canvas 2D em `src/assets/js/brmap.js` lendo `window.BR_GEO` (gerado em `public/assets/js/brazil-geo.js` a partir de `src/brazil-geo.js`).
- Chrome extension não conecta nesta máquina: verificar com Chrome headless (`--headless=new --screenshot`).

## Propriedade de arquivos (evitar conflito)
build.js / site.css / site.js → orquestrador · brmap.js/css → frontend-architect · server.js + tests/server.test.js → backend-engineer · data.js → accounting-marketing · img/art + icons.js → creative-director · tests/e2e → qa-tester.

## Checkpoint
Ver `docs/project/backlog.md` (status por item) e `docs/project/final-delivery.md` (quando existir).
