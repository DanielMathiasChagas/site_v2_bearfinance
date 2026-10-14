# Relatório de testes — Bear Finance v2

**Data:** 14/10/2026 · **Build:** `node src/build.js` (34 páginas) · **Servidor:** `node server.js` (porta 3300 para E2E, 3100 para varredura) · **Navegador:** Chrome do sistema via `playwright-core` 1.56 (headless) · **Runner:** `node --test`

> A suíte E2E (`tests/e2e/`, 12 arquivos + `_lib.mjs` + `run.mjs`) foi escrita pelo agente qa-tester, que foi interrompido pelo limite de sessão da API antes de emitir o relatório. A execução, a correção das falhas e este relatório foram feitos pelo orquestrador com a saída real abaixo (`docs/qa/e2e-run.log`).

## 1. Resultado final

| Suíte | Casos | Resultado |
|---|---|---|
| Servidor (`tests/server.test.js`) — API, validação, anti-spam, limites, estáticos, segurança, SMTP com servidor falso | 26 | **26 ✔ / 0 ✖** |
| E2E 01 Rotas (sitemap + 404) | 7 | 7 ✔ |
| E2E 02 Links internos/externos e assets | 4 | 4 ✔ |
| E2E 03 Menu desktop e mobile | 5 | 5 ✔ |
| E2E 04 CTAs e WhatsApp | 5 | 5 ✔ |
| E2E 05 Formulários (servidor real): diagnóstico, newsletter, carreira, parceria em 2 etapas | 9 | 9 ✔ |
| E2E 06 Responsividade 320/375/390/768/1024/1440/1920 (5 páginas) + cookies | 36 | 36 ✔ |
| E2E 07 Console e rede limpos (todas as rotas) | 2 | 2 ✔ |
| E2E 08 Teclado e foco visível (menu, FAQ, abas, formulário) | 4 | 4 ✔ |
| E2E 09 Mapa neural e WebGL (live, reduced-motion, mobile, sem script, sem malha) | 6 | 6 ✔ |
| E2E 10 Imagens (alt, carregamento) | 2 | 2 ✔ |
| E2E 11 prefers-reduced-motion | 11 | 11 ✔ |
| E2E 12 Acessibilidade (axe-core) — critical/serious em 5 páginas × 2 larguras | 2 | 2 ✔ |
| **Total E2E** | **93** | **93 ✔ / 0 ✖** (264 s) |

Saída real (`docs/qa/e2e-run.log`):
```
ℹ tests 93
ℹ suites 12
ℹ pass 93
ℹ fail 0
ℹ duration_ms 264759.304709
```
Servidor:
```
ℹ tests 26 · ℹ pass 26 · ℹ fail 0
```

Complementos: varredura `scripts/shots.mjs` (17 rotas × 7 larguras: 0 overflow, 1 h1, console limpo, mapa `.is-live`); Lighthouse final em `docs/qa/performance-report.md` (100/100/100/100 nas 5 páginas).

## 2. Falhas encontradas na primeira execução e correções

| ID | Página / largura | Descrição | Sev. | Evidência | Correção (responsável) |
|---|---|---|---|---|---|
| QA-01 | /sobre/, /parcerias/, /parcerias/* | Links `#diagnostico` sem destino em páginas sem a seção de diagnóstico (FAQ "Não encontrou? Fale com a gente") | média | `e2e-run1` 02-links: "âncoras sem destino" | `build.js` → `mainBody()` redireciona `#diagnostico` para `/contato/#diagnostico` quando a página não tem a seção (orquestrador) |
| QA-02 | home @390 | Ao abrir o drawer o foco ficava no botão hambúrguer (elemento ainda `visibility:hidden` durante a transição) | média | `e2e-run1` 03-menu | CSS: `visibility` imediata ao abrir (`transition: visibility 0s`), atraso só ao fechar; JS foca após dois `requestAnimationFrame` (orquestrador) |
| QA-03 | /conteudo/<post>/ @1440 | `.aside__box--dark h3` com contraste 1,06:1 (título rebaixado de h4→h3 pela correção de ordem de títulos perdeu a cor branca) | alta (axe serious) | `e2e-run1` 12-axe | CSS: `.aside__box--dark h3, .aside__box--dark h4 { color: #fff }` (orquestrador) |

Regressão após as correções: 93/93 (`e2e-run2` = `docs/qa/e2e-run.log`).

## 3. Cobertura dos 15 itens obrigatórios

| # | Item | Onde | Status |
|---|---|---|---|
| 1 | Todas as rotas públicas | 01 (sitemap = public/, 200, title/description/h1, HEAD, 404, 301 sem barra) | ✔ |
| 2 | Menus e submenus | 03 (hover, foco, aria-expanded, Esc, clique fora, drawer, foco preso) | ✔ |
| 3 | Links internos e externos | 02 (todos os href internos + âncoras; externos https + noopener; assets e url() do CSS) | ✔ |
| 4 | CTAs | 04 (hero → #diagnostico, header → /contato/#diagnostico, bandas, flutuante) | ✔ |
| 5 | Formulários e validações | 05 (obrigatórios, aria-invalid, sucesso 201, honeypot, ts, erro 500/422, newsletter, carreira, parceria) | ✔ |
| 6 | Redirecionamentos para WhatsApp | 04 + 05 (números do projeto, texto por serviço/segmento/programa, nova aba, `window.open` interceptado) | ✔ |
| 7 | Celulares | 06 (320/375/390) + 03/05/09/11 em 390 | ✔ |
| 8 | Tablets | 06 (768/1024) | ✔ |
| 9 | Compatibilidade entre navegadores | Apenas Chrome (único navegador disponível no ambiente); Safari/Firefox **não testados** | ◐ pendente |
| 10 | Imagens e vídeos | 10 (alt, carregamento); vídeos sem ID → botão "em breve" testado manualmente (shake) | ✔ / vídeos aguardam IDs |
| 11 | Animações e interações | 09 (mapa, ondas), 11 (reduced-motion), carrossel verificado pelo orquestrador (`scripts/_car` ad hoc: botões, setas, pontos) | ✔ |
| 12 | Navegação por teclado | 08 | ✔ |
| 13 | Mensagens de sucesso e erro | 05 | ✔ |
| 14 | Estados de carregamento | 05 (`aria-busy` no botão durante o envio — verificado no fluxo de sucesso) | ✔ |
| 15 | Ausência de erros JavaScript | 07 (todas as rotas @1440, chave @390) | ✔ |

## 4. Evidências visuais
`docs/qa/screenshots/depois/` (49 capturas: 5 páginas × 7 larguras, menu desktop/mobile, mapa 1440/390/reduced, formulários validação/erro/sucesso, parceria → WhatsApp, cookies, teclado) e `docs/qa/screenshots/orquestrador/` (varredura: página inteira 1440/390 de 16 rotas, hero, mapa, menu mobile). Antes: `docs/qa/screenshots/antes/`.

## 5. Como reexecutar
```bash
npm test                      # servidor
node tests/e2e/run.mjs --build   # sobe o servidor em 3300, roda tudo e derruba
node tests/e2e/run.mjs --only 05-forms.test.mjs
npm run sweep                 # varredura visual (servidor em 3100)
```

## 6. Limitações
- Só Chrome (sem Safari/Firefox no ambiente); recomenda-se um passe manual em Safari iOS antes da publicação.
- Vídeos sem ID real; fotos de pessoas são placeholders (não afetam testes).
- Limite de envios é por processo (memória): testes de 429 só no `tests/server.test.js` com instância dedicada.
