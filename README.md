# Bear Finance — site institucional (v2)

Site estático gerado por Node (sem dependências de produção) + servidor com API de formulários.
Arquitetura de informação do modelo de referência mantida; identidade visual, conteúdo e engenharia
próprios (ver `docs/design/design-system.md`).

```bash
npm ci             # ferramentas de teste (playwright-core, lighthouse, axe-core)
npm run build      # gera /public
npm start          # sobe o servidor (PORT=3000 por padrão)
npm run dev        # build + servidor
npm test           # testes do servidor (node --test)
node --test tests/e2e/      # E2E com o Chrome instalado (precisa do servidor em PORT=3300)
node scripts/shots.mjs docs/qa/screenshots/depois   # varredura: overflow, console, screenshots (servidor em 3100)
node src/make-art.mjs       # regenera as ilustrações SVG (determinístico)
node scripts/contact-sheet.mjs saida.png             # folha de contato das ilustrações
```

## Onde editar

| O quê | Arquivo |
|---|---|
| Textos, serviços, segmentos, FAQ, artigos, cases, parcerias, SEO por página | `src/data.js` (itens a confirmar marcados `[A CONFIRMAR]`) |
| Vídeos (ID do YouTube por página) | `src/data.js` → `videos` e `services[].video` |
| Layout, páginas e componentes | `src/build.js` |
| Design system (tokens no `:root`) | `src/assets/css/site.css` |
| Comportamentos (menu, FAQ, abas, formulários, carrossel, ondas) | `src/assets/js/site.js` |
| Mapa neural do Brasil | `src/assets/js/brmap.js` (lê `window.BR_GEO` gerado de `src/brazil-geo.js`) |
| Ícones SVG inline | `src/icons.js` |
| Ilustrações | `src/make-art.mjs` → `src/assets/img/art/` |
| Servidor e API | `server.js` (+ `.env.example`) |

`public/` é gerado; não edite à mão.

## Conteúdo provisório

- Ilustrações em `src/assets/img/art/` são originais (SVG) e podem ficar; fotos de pessoas/escritório
  ainda são placeholders (`ph-XX.svg`, etiqueta "Substituir"; `placeholderLabels: false` esconde a etiqueta).
- Vídeos: preencha os IDs em `src/data.js`; até lá o bloco mostra "em breve".
- Números/clientes/prêmios: o site **não** exibe métricas não verificadas. Para incluir, confirme a fonte e edite `presence.facts`, `about.facts` etc.

## Formulários (back-end)

`server.js` serve os arquivos e recebe `POST /api/contato`, `/api/newsletter`, `/api/parceria` e `/api/carreira` (JSON).
Valida campos (enums de segmento/serviço, telefone BR, e-mail, LGPD), bloqueia robôs (honeypot + tempo mínimo de 3 s),
limita envios por IP e por e-mail, grava em `data/*.jsonl` e encaminha para `LEADS_WEBHOOK_URL` e/ou SMTP quando configurados
(variáveis em `.env.example`). Sem configuração, os leads ficam no JSONL e o log avisa.

## Qualidade

`docs/audit/` diagnóstico · `docs/design/` design system e assets · `docs/project/` backlog e entrega ·
`docs/qa/` testes, revisão visual, performance e revisão técnica · `docs/deployment/` implantação e rollback.

## Dependências externas (CDN)

Apenas Google Fonts (Plus Jakarta Sans). Font Awesome e Swiper foram removidos (ícones inline e carrossel nativo com scroll-snap).
