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

## Checkpoint (14/10/2026, final)
Entrega concluída na branch `redesign/v2`: build 34 páginas, `npm test` 26/26, `npm run test:e2e` 93/93, varredura limpa, Lighthouse 100/100/100/100 (5 páginas), parecer independente com achados corrigidos. Status: PRONTO COM RESSALVAS (pendências do cliente em `docs/project/final-delivery.md` §9). Publicação em produção NÃO autorizada/feita. Para retomar: `docs/project/backlog.md` e `docs/qa/technical-review.md` §5 (melhorias futuras: CSS morto, flutuante no mobile, capturas longas).

## Checkpoint (15/10/2026)
Feito hoje: texto do hero e dos cabeçalhos internos no centro-baixo da tela, selos no rodapé do hero (fd033f7); ícone do WhatsApp redesenhado dentro da grade 24px e link inline virou botão pill (3d2d41e). `npm test` 26/26.
Pendência para retomar: `tests/e2e/06-responsive.test.mjs` falha em home @768 e @1920 (blocos `.reveal` do fim da página sem `.in`). Rolagem manual a 300px/200ms revela tudo, então é ritmo de rolagem do `scrollThrough` em `tests/e2e/_lib.mjs` (passos de 40% da viewport a 150 ms), não defeito visível ao usuário. Ajustar o helper e rodar `npm run test:e2e` de novo (último resultado: 91/93).
