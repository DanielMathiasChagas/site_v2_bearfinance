# Parecer técnico independente — Bear Finance v2

**Data:** 14/10/2026 (19:20–19:50) · **Branch:** `redesign/v2` · **Commit revisado:** `6bbf9e3` (HEAD; `e84fe67` reescreveu o fato do Business Partner em `src/data.js`) · **Revisor:** agente `technical-reviewer` (independente do orquestrador) · **Ambiente:** macOS, Node v24.13.0, npm 11.18.0, Chrome do sistema via `playwright-core` 1.56, Lighthouse 12.8.2.

**Método.** Nada foi aceito por declaração. Tudo abaixo foi reexecutado por mim: build a partir do `src/` de HEAD, `npm test`, `node tests/e2e/run.mjs` (porta 3300), varredura `scripts/shots.mjs` (17 rotas × 7 larguras) contra um servidor **novo** que eu subi na porta 3101 a partir do `server.js` commitado, Lighthouse mobile em duas páginas, sondas HTTP (cabeçalhos, traversal, API), varredura de conteúdo em `public/`, leitura integral de `src/build.js`, `src/data.js`, `src/assets/js/*.js`, `src/assets/css/site.css`, `server.js`, `tests/**`, `scripts/**` e de toda a documentação em `docs/`. Capturas inspecionadas visualmente em `/tmp/review-shots/`.

> Diferença relevante de ambiente: o servidor que já estava na porta 3100 (PID 11673) foi iniciado às **14:26:28**, antes da última alteração de `server.js` (**14:58:50**). Ele envia uma CSP diferente da commitada (ainda permite `cdnjs.cloudflare.com` e `google.com/maps`). O Lighthouse "final" e a varredura do orquestrador (18:22–18:29, URLs `localhost:3100`) rodaram contra esse processo. Por isso usei a porta 3101 com o código atual. Resultados de front-end coincidiram (ver §3).

---

## 1. Resumo executivo

**Veredito: NÃO PRONTO para publicação no estado atual (commit `6bbf9e3`).** Reclassificável para **PRONTO COM RESSALVAS** assim que as correções objetivas A1–A4 forem aplicadas e commitadas (todas pequenas; estimativa inferior a uma hora de trabalho), permanecendo como ressalvas as pendências do cliente já conhecidas (CNPJ/razão social, perfis sociais, vídeos, fotos dos sócios, vagas, credenciais SMTP/CRM, domínio) e o fato de a publicação em produção **não ter sido autorizada nem realizada**.

O que está bom e foi comprovado: build determinístico (34 páginas), 26/26 testes de servidor, 93/93 E2E, varredura 119 combinações sem overflow/console sujo/h1 duplicado, Lighthouse 100/100/100/100 mobile em home e contato reproduzido por mim, cabeçalhos de segurança e validação server-side corretos, nenhum segredo no repositório, nenhum número de clientes/NPS/prêmio inventado, nenhuma entrada de usuário injetada em HTML.

O que impede o "pronto" hoje (detalhe em §2):

- **A1 (alta)** — a Política de Privacidade publica literalmente o texto `${fmtDate(TODAY)}` no lugar da data (bug de template em `src/build.js:833`). Visível em `public/privacidade/` e na captura `privacidade-390.png`.
- **A2 (alta)** — `.gitignore` **não** contém `.env`, embora o runbook mande criar `.env` dentro do repositório; a verificação do orquestrador afirma o contrário.
- **A3 (alta)** — a regra do projeto ("itens não confirmados ficam `[A CONFIRMAR]` em comentário e **fora do site**") é violada em quatro pontos renderizados: lista de 11 marcas de ERP "integrados", tile "100% da carteira protegida em contrato", três perfis sociais não confirmados no rodapé de todas as páginas e botão "Acessar plataforma" que aponta para o próprio site.
- **A4 (média)** — o H1 da página ESG ("Cultura baseada em princípios de ESG") é frase **verbatim** do bloco "Por que a Planning?" de planning.com.br.

Além disso, `npm run test:e2e` (e o comando documentado `node --test tests/e2e/`) falha no Node 24 (A5) e há inconsistências factuais entre a documentação e o código (A6, A7).

---

## 2. Tabela de achados

| ID | Sev. | Arquivo:linha | Achado | Evidência (comando → saída) | Recomendação |
|---|---|---|---|---|---|
| A1 | **alta** | `src/build.js:833` | A string do subtítulo da Política de Privacidade usa aspas duplas, não template literal; `${fmtDate(TODAY)}` vai literal para o HTML de uma página legal. | `sed -n 833p src/build.js` → `p: "Conforme a Lei 13.709/2018 (…). Última atualização: ${fmtDate(TODAY)}."` · `grep -o 'Última atualização: [^<]*' public/privacidade/index.html` → `Última atualização: ${fmtDate(TODAY)}.` · captura `/tmp/review-shots/privacidade-390.png` mostra o texto bruto. | Trocar as aspas por crase. Melhor: usar uma data fixa de revisão (`site.privacyUpdated`) em vez da data do build (ver A16). Adicionar um teste E2E que reprove `${` em qualquer HTML gerado. |
| A2 | **alta** | `.gitignore:1-3` · `docs/deployment/production-readiness.md:38` · `docs/qa/technical-review.md:71` | `.gitignore` = `public/`, `data/`, `node_modules/`. O runbook instrui `cp .env.example .env` na raiz do repositório; um `git add -A` futuro versiona credenciais SMTP. A verificação do orquestrador declara "`.gitignore` (`.env`, `data/`)", o que é falso. | `cat .gitignore` → 3 linhas, sem `.env` · `git check-ignore -v .env` → `NOT ignored` · `git ls-files \| grep -E '^\.env$'` → vazio (ainda não aconteceu). | Acrescentar `.env`, `.env.*` (exceto `.env.example`) ao `.gitignore`; corrigir a afirmação em `technical-review.md`. |
| A3 | **alta** | `src/data.js:444-445` + `src/build.js:275-276`; `src/data.js:571-577` + `src/build.js:806`; `src/data.js:22-25` + `src/build.js:83,143`; `src/data.js:34-35` + `src/build.js:650` | Conteúdo marcado `[A CONFIRMAR]` no comentário é renderizado como fato: (a) `erps` → seção "Operamos no ERP que a sua empresa já usa" com `aria-label="ERPs integrados"` listando TOTVS Protheus, SAP Business One, Omie, Conta Azul, Bling, Sankhya, Senior, Oracle NetSuite, Tiny, Domínio, TOTVS Winthor (comentário: "lista de ERPs efetivamente integrados"); (b) `partnerFacts` → tile "100% da carteira protegida em contrato" (comentário: "modelo contratual de proteção de carteira… a confirmar"); (c) `site.instagram/linkedin/youtube` → links clicáveis no rodapé e no drawer de 34 páginas (removidos só do JSON-LD); (d) `site.platformUrl = "https://www.bearfinance.com.br"` → botão "Acessar plataforma" em `/plataforma/` abre o próprio site. | `grep -n "A CONFIRMAR" src/data.js` → 16 ocorrências (linhas 22, 32, 34, 444, 571, …) · `grep -o 'aria-label="ERPs integrados">…' public/index.html` → lista de marcas · `grep -o '<ul class="facts…' public/parcerias/business-partner-outsourcing/index.html` → `… 8 verticais com especialistas 100% da carteira protegida em contrato` · `grep -o 'href="https://[^"]*(instagram\|linkedin\|youtube)…' public/index.html` → 3 URLs · `grep -o 'href="https://www.bearfinance.com.br"[^>]*>Acessar' public/plataforma/index.html` → 1 ocorrência. | Até a confirmação do cliente: reduzir a seção de ERPs a texto genérico sem marcas (ou obter a lista real), remover o tile "100% da carteira…", esvaziar `site.instagram/linkedin/youtube` (o build já omite ícones sem URL) e `site.platformUrl` (o build já omite o botão). Marcas de terceiros exibidas como "integrados" sem confirmação são risco de propaganda enganosa. |
| A4 | média | `src/data.js:546` | H1 de `/esg/` = "Cultura baseada em princípios de ESG", idêntico ao item do bloco "Por que a Planning?" da referência. O grep do orquestrador (`planning\|somos a ponte`) não detecta. Demais textos comparados (hero, FAQ, newsletter, presença) são originais; os rótulos de serviços/verticais coincidem com a taxonomia da referência por decisão de clone estrutural (aceito). | `WebFetch https://planning.com.br/` → "Por que a Planning?": … "Cultura baseada em princípios de ESG" … · `grep -n "Cultura baseada em" src/data.js` → `546: headline: "Cultura baseada em<br>princípios de <strong>ESG</strong>"`. | Reescrever o H1 (ex.: "Governança começa em casa: nossas práticas ESG"). |
| A5 | média | `package.json:12` · `README.md:13` · `docs/project/final-delivery.md:70` · `docs/deployment/production-readiness.md:76` | O comando documentado e o script `npm run test:e2e` usam `node --test tests/e2e/` (diretório). No Node 24 isso falha antes de executar qualquer suíte; só o runner (`tests/e2e/run.mjs`, que usa glob) funciona — o próprio runner comenta isso na linha 30. | `E2E_PORT=1 node --test tests/e2e/` → `✖ tests/e2e (42ms) 'test failed'` · `E2E_PORT=1 node --test "tests/e2e/*.test.mjs"` → executa (suítes puladas por falta de servidor). | `"test:e2e": "node tests/e2e/run.mjs"` e atualizar README, final-delivery §10 e checklist do runbook. |
| A6 | média | processo de QA · `docs/qa/performance-report.md` §"Medição final" · `docs/qa/technical-review.md` §3 | As medições "finais" (Lighthouse, varredura) foram feitas contra um processo `node server.js` iniciado às 14:26 (PID 11673), anterior ao `server.js` final (14:58). Cabeçalhos medidos (CSP com `cdnjs` e `google.com/maps`) não são os commitados. O HTML é lido do disco a cada requisição, então os resultados de front-end permanecem válidos — e eu os reproduzi em servidor novo (§3) — mas a evidência documentada não corresponde ao comando documentado (`PORT=3100 npm start` do código atual). | `ps -o lstart -p 11673` → `Wed Oct 14 14:26:28 2026` · `stat server.js` → `14:58:50` · `curl -sI localhost:3100 \| grep -i content-security-policy` → `script-src 'self' https://cdnjs.cloudflare.com; … frame-src … https://www.google.com/maps` · módulo atual: `node -e "import('./server.js').then(m=>console.log(m.CSP))"` → `script-src 'self'; … frame-src https://www.youtube-nocookie.com` · Lighthouse final: `finalDisplayedUrl = http://localhost:3100/…`. | Reiniciar o servidor de QA após cada alteração de `server.js` (ou usar `scripts/serve-audit.mjs`/porta efêmera) e registrar PID/commit nas medições. |
| A7 | média | `docs/qa/technical-review.md:23,45-48,71` · `docs/project/final-delivery.md:24` · `src/build.js:877` · `docs/project/backlog.md:47,54` · `CLAUDE.md:17` | Inconsistências entre documentação e código: (a) "Nenhum achado bloqueador ou de severidade alta em aberto" — contradito por A1–A3; (b) "sitemap com lastmod por página" — só os 6 posts têm data própria; 27 de 33 URLs recebem a data do build (`lm \|\| TODAY`), que muda a cada build sem alteração de conteúdo; (c) no momento da revisão `public/` (19:33:49) era anterior ao `data.js` de HEAD (19:33:52): o tile do Business Partner publicado ainda dizia "0 exigência de registro profissional" enquanto o commit `e84fe67` já o reescrevera — `CLAUDE.md` admite "rebuild… pendente"; (d) `final-delivery.md` declara entregue o que o backlog mantém em andamento (F5-04 ◐, F6-03 ◐). | `grep -o '<lastmod>[^<]*' public/sitemap.xml \| sort \| uniq -c` → `27 <lastmod>2026-10-14` + 6 datas de posts · `stat` → `public/index.html 19:33:49`, `src/data.js 19:33:52` · `grep -o '0</strong><span>[^<]*' public/parcerias/business-partner/index.html` (antes do meu rebuild) → `exigência de registro profissional…`. | Rebuild + commit após qualquer edição de `data.js`; corrigir as frases; usar data estável por página no sitemap (ou omitir `lastmod` quando não houver). |
| A8 | média | `server.js:108` · `src/build.js:670` · `src/data.js:134,556` | Compromissos comerciais sem marcação `[A CONFIRMAR]`: "Um especialista entrará em contato **em até 1 dia útil**" (mensagem de sucesso do formulário), "Diagnóstico **sem custo**" (H1-lead de `/contato/`), "conversa **sem custo**" (passos da plataforma), "**sem compromisso**" (bullets de conversão). São promessas de SLA/preço que a Bear precisa validar. | `grep -n "dia útil" server.js` → `108` · `grep -rhoE "sem custo\|sem compromisso" public/contato/index.html public/plataforma/index.html public/index.html \| sort \| uniq -c` → `2 sem custo`, `2 sem compromisso`. | Confirmar com o cliente ou neutralizar ("entraremos em contato em breve"; "diagnóstico inicial"). |
| A9 | média | `tests/e2e/_lib.mjs:26-28` · `02-links.test.mjs:93,110` · `07-console.test.mjs:14-20` · `10-images.test.mjs:39,56` | `PENDING_ASSETS = [/\/assets\/img\/art\//]`: qualquer 404 de ilustração em `/assets/img/art/` é apenas "REGISTRADO (não reprova)". As ilustrações já foram entregues; a exceção agora mascara regressões reais (uma arte apagada passaria nos testes 02, 07 e 10). | leitura do código; `[assets] 37 assets locais verificados` sem pendências na execução atual. | Remover a exceção (ou torná-la opt-in por variável de ambiente). |
| A10 | baixa | `src/build.js:279-280` (`ctaBand`) · `src/build.js:793,822` | Bandas de CTA cujo `href` é `wa.me` saem sem `target="_blank"`/`rel="noopener"` e com `data-track="cta_click"` em vez de `whatsapp_click` (métrica errada). O E2E 04 registra como "baixa" há duas execuções sem correção. | `grep -o '<a class="btn" href="https://wa.me[^>]*>' public/parcerias/business-partner/index.html` → `… data-track="cta_click">` (sem target/rel) · log E2E: `[wa] REGISTRADO (baixa): links de WhatsApp sem target=_blank` (5 links em 3 páginas). | Em `ctaBand`, detectar `href` externo e emitir `target/rel` + `data-track="whatsapp_click"`. |
| A11 | baixa | `src/data.js:454` | Tile "27 — estados e DF com atendimento digital" lê como 27 estados + DF (o Brasil tem 26 estados + DF = 27 UFs). | captura `map-1440.png`. | "27 — unidades da federação atendidas" ou "26 estados e o DF". |
| A12 | baixa | `src/assets/css/site.css` (linhas 19-20, 77-83, 90-110, 134-150, 416-430, 763) · `src/build.js:322-339,347` · `src/data.js:75,473,559-560` · `server.js:119-121` | Código morto: ~90 classes CSS nunca referenciadas no HTML gerado nem no JS (grade `.row/.colmd*/.colsm*`, utilitários `.fz*/.mt*/.fw*`, `.btn--ghost`, `.media--*`, `.tags--dark`, `.facts--light`, `.phead__cat`, `.list-cols`, todo o bloco `.br-map` do fallback SVG inline, `.fl--select.has-value` que o JS nunca define); `brazilMap()` inalcançável enquanto `brasil-presenca.svg` existir; `MAP_SCRIPTS = ""` e `VER.brcss` para um `brmap.css` inexistente; exports de `data.js` sem uso (`clients`, `blogTabs`, `erpOptions`, `revenueOptions`, `site.headlineFx`, `site.heroImage`); campos v1 `cargo/erp/faturamento` no contrato de `/api/contato` que nenhum formulário envia. 16 `!important`, 8 deles para forçar a cor dos `.btn` contra `.sec--dark a` (resolvível por especificidade). | script de cruzamento CSS×HTML → `101 selectors/classes never referenced` (≈10 falsos positivos de strings JS) · `grep -c '!important' src/assets/css/site.css` → `16` · `ls src/assets/css/` → só `site.css` · `grep -c brmap.css public/index.html` → `0`. | Limpeza em uma passada; reduz 79 KB de CSS e evita manutenção enganosa. Não afeta a publicação. |
| A13 | baixa | `README.md:56` · `src/assets/js/site.js:1` · `server.js:59` · `docs/qa/visual-review.md:9` · `docs/audit/diagnostico-inicial.md:88` · `.claude/agents/technical-reviewer.md:19` · `package.json:17` vs `docs/deployment/production-readiness.md:13` | Documentação/comentários desatualizados: README diz que a única CDN é Google Fonts (a fonte é self-hosted desde `576fdf9`); cabeçalho de `site.js` fala em "Swiper carregado sob demanda"; comentário da CSP cita Google Fonts; visual-review cita "aviso de Swiper"; dois documentos apontam o parecer para `docs/qa/technical-review.md` (agora é a verificação do orquestrador); `engines.node >= 18` enquanto o runbook exige ≥ 20 (`node --env-file` precisa de 20.6). | `grep -n "Google Fonts\|Swiper" README.md src/assets/js/site.js server.js docs/qa/visual-review.md` → 4 linhas · `grep -n '"node"' package.json` → `">=18"`. | Atualizar textos; `engines.node: ">=20.6"`. |
| A14 | baixa | `server.js:61-73` · `server.js:708-730` | CSP mantém origens supérfluas (`fonts.googleapis.com`, `fonts.gstatic.com`, `i.ytimg.com`) que o site não usa mais; `style-src 'unsafe-inline'` é necessário pelos `style="--i:…"` (aceito). `/index.html` e `/404.html` respondem 200 (URLs duplicadas; `canonical` mitiga). | `curl -sI localhost:3101/ \| grep -i content-security-policy` (ver A6) · `curl -o /dev/null -w '%{http_code}' localhost:3101/index.html` → `200`. | Estreitar a CSP ao que o HTML referencia; opcional: 301 de `/index.html` → `/`. |
| A15 | baixa | `server.js:274-294` | `TRUST_PROXY` em "auto" confia em `X-Forwarded-For` sempre que o par TCP é endereço privado/loopback. Em contêiner ou rede interna sem proxy, um cliente pode forjar o IP e contornar o limite por IP (o limite por e-mail continua). | leitura de `clientIp()`; runbook já pede `TRUST_PROXY=1` atrás de proxy. | Documentar `TRUST_PROXY=0` quando o Node for exposto diretamente; nunca deixar "auto" em produção. |
| A16 | baixa | `src/build.js:19,833` | Mesmo após A1, "Última atualização" da política será a data do build, não a da revisão do texto — informação enganosa em documento legal. | `TODAY = new Date().toISOString().slice(0,10)`. | `site.privacyUpdated = "2026-10-14"` em `data.js`, alterado só quando o texto mudar. |
| A17 | baixa | `src/assets/css/site.css:822-825` · layout mobile | A home em 390 px tem 18.140 px de altura (~21 telas); o botão flutuante `.wa-float` cobre a borda direita do texto corrido em páginas longas (visível em `privacidade-390.png`, seção "2. Dados que coletamos"). | `scripts/shots.mjs` → `390 / … h=18140` · captura. | Avaliar `padding-right` no `.article` em ≤ 480 px ou esconder o flutuante quando o `.hdr__wa` já está visível; considerar encurtar a home mobile (ex.: carrossel de conteúdo em vez de 3 cards completos). |
| A18 | info | `scripts/shots.mjs:33` · `tests/e2e/06-responsive.test.mjs` · `docs/qa/screenshots/*/home-390.png` | Capturas de página inteira acima de 16.384 px (limite de textura do Chrome) saem com o topo repetido no rodapé — é artefato de captura, não do site: o DOM tem 1 `.hero`, 1 `h1` e 14 seções na ordem esperada. As evidências visuais do fim das páginas mobile longas (inclusive as do orquestrador) não são confiáveis. | `node -e …playwright…` @390 → `{"hero":1,"h1":1,"sh":18140,"sections":"inicio,curve,proposta,servicos,video,diferenciais,segmentos,erps,presenca,metodologia,conteudo,faq,diagnostico,colophon"}`. | Capturar em segmentos (`clip`) quando `scrollHeight > 16000`. |
| A19 | info | `src/assets/js/site.js:214` | Única injeção em `innerHTML` com dado dinâmico: `json.message` (texto fixo do servidor, `FORMS[*].ok`) e `form.dataset.wa` (gerado no build). Mensagens de erro usam `textContent`; o formulário de parcerias monta apenas URL codificada. Nenhum valor digitado pelo usuário chega ao HTML. | leitura de `site.js:189-225, 253-318`; `brmap.js:123` usa só `BR_GEO`. | Manter; se a API passar a ecoar entradas, escapar `json.message`. |

Nenhum achado **bloqueador** no sentido de perda de dados ou falha de segurança explorável; A1–A3 são "alta" porque publicam conteúdo errado/não confirmado e deixam credenciais a um `git add` de distância.

---

## 3. Verificações reproduzidas (saída real, resumida)

### 3.1 Build
```
$ node src/build.js
✓ 34 páginas geradas em /public
$ find public -name "*.html" | wc -l → 34 · grep -c "<loc>" public/sitemap.xml → 33
```
(reexecutado às 19:42 após `e84fe67`; `public/parcerias/business-partner/` passou a mostrar "2 — formas de atuar: só indicar ou prospectar ativamente".)

### 3.2 Testes do servidor
```
$ npm test
▶ API de formulários (14 ✔) ▶ Limites de envio (2 ✔) ▶ Estáticos e segurança (8 ✔) ▶ Entrega por SMTP (servidor falso) (2 ✔)
ℹ tests 26  ℹ pass 26  ℹ fail 0  ℹ duration_ms 192.3
```

### 3.3 E2E (porta 3300, servidor iniciado pelo runner, pid 53419)
```
$ lsof -ti:3300 | xargs kill; node tests/e2e/run.mjs
[rotas] 33 rotas no sitemap + /404.html · [links] 2156 links internos, 320 externos · [assets] 37 · [wa] 216 links (212 com texto)
[wa] REGISTRADO (baixa): links de WhatsApp sem target=_blank (5 em /parcerias/*)      ← A10
ℹ tests 93  ℹ suites 12  ℹ pass 93  ℹ fail 0  ℹ duration_ms 257689   E2E exit=0
```
Efeito colateral do runner: reescreveu 20+ PNGs em `docs/qa/screenshots/depois/` e gravou leads de teste em `data/*.jsonl` (ignorado pelo git). Restaurei os PNGs com `git checkout -- docs/qa/screenshots/depois/`.

### 3.4 Varredura visual/técnica (servidor novo na 3101, código de HEAD)
```
$ PORT=3101 node server.js &  (CSP conferida = módulo commitado)
$ node scripts/shots.mjs /tmp/review-shots http://localhost:3101
 320 /  200 h1=1 title=56 h=19805 ok · 390 /  200 h1=1 h=18140 ok · 1440 / … ok   (17 rotas × 7 larguras: 0 OVERFLOW, 0 ERR exceto o 404 esperado em /nao-existe/)
map live: true canvas: 658x658 label: Goiânia / GO · ATENDIMENTO DIGITAL
map console: []
SEM PROBLEMAS   SHOTS exit=0   (35 capturas em /tmp/review-shots)
```

### 3.5 Lighthouse (independente, mobile, Chrome headless=new, servidor 3101)
```
home    perf=100 a11y=100 bp=100 seo=100  LCP=1.4 s CLS=0 TBT=30 ms FCP=0.9 s SI=0.9 s  (lh 12.8.2, 2026-10-14T22:46:57Z)
contato perf=100 a11y=100 bp=100 seo=100  LCP=1.4 s CLS=0 TBT=0 ms  FCP=0.9 s SI=0.9 s
```
Os JSON "finais" do orquestrador (`docs/qa/lighthouse/final/*.json`) conferem com o relatório: 100/100/100/100 nas 5 páginas, exceto **home desktop a11y 97** e home mobile a11y 97 (com reauditoria a11y-only = 100), como a nota de rodapé admite. A frase "Lighthouse A11y 100 nas 5 páginas" em `final-delivery.md:22` é, portanto, levemente superestimada para a medição registrada; na minha medição pós-correção a home mobile deu 100.

### 3.6 Segurança
```
$ grep -rniE "(api[_-]?key|secret|password|token)\s*[:=]" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=public --exclude-dir=docs .   → nenhum resultado
$ git ls-files | grep -E '^\.env$|^data/'                                                   → nenhum (mas ver A2)
$ curl -sI localhost:3101/  → CSP default-src 'self'; script-src 'self'; … frame-ancestors 'self' · X-Content-Type-Options: nosniff · X-Frame-Options: SAMEORIGIN · Referrer-Policy: strict-origin-when-cross-origin · Permissions-Policy: camera=(), microphone=(), geolocation=() · COOP: same-origin · Cache-Control: no-cache · sem HSTS
$ curl -sI -H "X-Forwarded-Proto: https" localhost:3101/ → Strict-Transport-Security: max-age=31536000; includeSubDomains
$ site.css?v=<hash> → Cache-Control: public, max-age=31536000, immutable · Content-Encoding: br (14991 B)
$ /..%2F..%2Fserver.js 404 · /assets/../../package.json 404 · /.git/HEAD 404 · /.env 404 · /%00 400 · /nada/ 404 (HTML) · /sobre → 301 /sobre/ · HEAD / 200 size=0
$ GET /api/contato → 405 · POST text/plain → 415 · POST '{bad' → 400 · POST campo fora do enum/<script> no nome → 422 {"field":"empresa"} (validação por campo) · newsletter com mailinator → 422 · honeypot preenchido → 200 (finge sucesso, não grava)
$ grep -c '<script>' public/index.html → 0 inline; nenhum atributo on*= no HTML gerado
```
Revisão de código: validação por campo/enum/telefone/e-mail/URL/consentimento, limite de corpo 20 KB com drenagem, limites por IP (10/10 min) e e-mail (5/h) em memória, honeypot + tempo mínimo 3 s, logs com e-mail e IP mascarados (`maskEmail`, `maskIp`), SMTP com STARTTLS obrigatório salvo `SMTP_STARTTLS=0`, `tls.connect` com verificação de certificado padrão, timeouts de cabeçalho/requisição configurados. Ressalvas: A2, A14, A15.

### 3.7 Conteúdo
```
$ (scan de texto visível em public/*.html) padrões \+ ?\d{2,} | NPS | anos de mercado | clientes atendidos | prêmio/ranking/certificação | depoimento → 0 ocorrências
   ocorrências de "%": "100% operação digital e integrada" (home) e "100% da carteira protegida em contrato" (BPO)  ← a segunda é A3(b)
   "Mais de 100/300" aparecem só como opções de <select> do formulário de parceria (faixas), não como métricas
$ grep -rli planning public/ src/ → nenhum · grep -niE "somos a ponte|PrimeGlobal" src/data.js → nenhum
$ WebFetch planning.com.br → hero "Somos a ponte entre os desafios do seu negócio hoje, e o seu negócio do futuro."; "Por que": "+ 100 bilhões…", "Leaders League", "NPS em zona de excelência", "Cultura baseada em princípios de ESG" ← A4
$ grep -n "A CONFIRMAR" src/data.js → 16 marcações; cases sem clientes/resultados (lido linha a linha); sócios "nome a confirmar"; vídeos "em breve"; placeholders com etiqueta "Substituir"
```

### 3.8 Capturas inspecionadas (`/tmp/review-shots/`)
- `home-1440.png` (1440×10961): header com 6 itens + CTA; hero com pílula de texto digitado "Soluções financeiras|", H1 em duas cores, 2 CTAs, 4 selos; curva; 3 cards de proposta; 5 cards de soluções; vídeo "em breve" com pôster do urso; 6 cards de vidro; carrossel com 3 segmentos visíveis, pontos e setas; chips de ERP; presença com 4 tiles e mapa 3D; 5 passos; 3 posts (placeholders roxos "Substituir"); FAQ; conversão com formulário; newsletter; rodapé 4 colunas. Sem cortes nem sobreposições.
- `hero-1440.png`: nítido, contraste alto, botão flutuante de WhatsApp isolado no canto.
- `home-390.png` (390×18140): pilha única sem rolagem horizontal; hero, cards, carrossel em 1 coluna, mapa estático; **rodapé seguido de hero repetido = artefato de captura (A18)**, DOM verificado com 1 hero.
- `atuacao_contabilidade-1440.png`: topo com H1 "Contabilidade que orienta decisões", par de CTAs, arte isométrica; 4 entregas; vídeo "em breve"; método numerado 01–05; ERPs; faixa de citação; teaser da plataforma; FAQ com 3 perguntas; formulário com "Contabilidade" pré-selecionado em "Serviço de interesse".
- `parcerias_business-partner-1440.png`: formulário em 2 etapas sobreposto ao topo; 4 tiles (IA / 5 / 8 / "2 formas de atuar…") já com o texto de `e84fe67`; diagrama hub com urso; bandas de CTA; grade de 8 verticais; FAQ.
- `map-1440.png`: mapa em perspectiva com arcos, nós pulsantes, rótulo "Goiânia — GO · atendimento digital" ao pairar; tiles "SP / 27 / 100% / 1" (A11).
- `menu-mobile-390.png`: drawer de tela cheia, "Sobre" expandido com 4 subitens e descrições, demais itens, CTA full-width, botão fechar no canto.
- `privacidade-390.png`: **texto literal "Última atualização: ${fmtDate(TODAY)}."** sob o H1 (A1); botão flutuante sobre a borda direita do texto (A17).

---

## 4. Critérios de aceite (Prompt Master, 15 itens) — status verificado individualmente

| # | Critério | Status | Verificação própria |
|---|---|---|---|
| 1 | Rotas previstas implementadas e funcionando | ✔ | 33 URLs do sitemap + 404 → E2E 01 (7/7) e varredura 17 rotas: 200/404 corretos, 301 sem barra, `title`/`description`/1 `h1` |
| 2 | Nenhum link interno quebrado | ✔ | E2E 02: 2156 links internos + âncoras, 37 assets, `url()` do CSS — 0 quebrados |
| 3 | Sem erros críticos de console | ✔ | E2E 07 (34 rotas @1440 + 5 @390) e varredura (119 combinações): 0 `console.error`/`pageerror`; única entrada é o 404 esperado em `/nao-existe/` |
| 4 | Build de produção conclui | ✔ | `node src/build.js` → 34 páginas, determinístico, `public/` fora do git |
| 5 | Layout nas resoluções testadas | ✔ | 320/375/390/768/1024/1440/1920: 0 overflow (E2E 06 + varredura); capturas 1440 e 390 íntegras. Ressalva A17 (altura da home mobile, flutuante sobre texto) |
| 6 | Formulários validados | ✔ | Cliente: E2E 05 (obrigatórios, `aria-invalid`, foco, mensagens, 500 simulado); servidor: 26/26 + sondas manuais (422 por campo, 415, 400, 413, 405). Ressalva A8 (texto de sucesso promete "1 dia útil") |
| 7 | Integrações configuradas testadas | ◐ | SMTP coberto com servidor falso (AUTH, DATA, falha não derruba resposta); webhook por código. **Nenhuma credencial real** — depende do cliente. `LEADS_WEBHOOK_URL`/SMTP ausentes → leads só em `data/*.jsonl` |
| 8 | Elementos 3D com fallback | ✔ | E2E 09: canvas `.is-live` animado no desktop; fallback `<img>` com alt em reduced-motion, 390 px, sem script e sem `BR_GEO`; varredura: `map live: true`, console limpo |
| 9 | Imagens otimizadas | ✔ | SVG originais ≤ 94 KB (hero 93,5 KB, gzip ≈ 25 KB), WebP para rasters, `og-image.jpg` 1200×630 (83 KB), `width/height` + `loading="lazy"`/`fetchpriority` corretos; Lighthouse `image-delivery` só aponta o logo (0,5). CSS 79 KB (16 KB gzip) com ~90 classes mortas (A12) |
| 10 | Fluxos de conversão funcionais | ✔ | E2E 04/05: hero → `#diagnostico`, header → `/contato/#diagnostico`, 216 links `wa.me` com texto por contexto, parceria 2 etapas → WhatsApp + lead gravado. Ressalva A10 (bandas sem `target`, evento errado) |
| 11 | Auditoria de acessibilidade executada | ✔ | axe (E2E 12) sem critical/serious em 8 páginas × 2 larguras; Lighthouse a11y 100 (home e contato mobile, minha medição); teclado/foco (E2E 08); `aria-hidden focusable=false` nos ícones; 1 h1 por página |
| 12 | Testes automatizados críticos aprovados | ✔ | 26/26 + 93/93 reproduzidos. Ressalvas: A5 (script `test:e2e` quebrado no Node 24), A9 (exceção de assets pendentes mascara 404) |
| 13 | Performance documentada | ✔ | `docs/qa/performance-report.md` + 42 relatórios em `docs/qa/lighthouse/`; valores conferidos nos JSON; reproduzido 100/100/100/100 em servidor novo. Ressalva A6 (processo de servidor desatualizado na medição documentada) |
| 14 | Sem segredos expostos | ◐ | grep limpo, `.env` inexistente, `data/` ignorado, `.env.example` sem valores. **Mas `.env` não está no `.gitignore` (A2)** |
| 15 | Parecer do revisor | ✔ | este documento (`docs/qa/technical-review-independente.md`); verificação do orquestrador em `docs/qa/technical-review.md` (§5 abaixo) |

---

## 5. O que a verificação do orquestrador (`docs/qa/technical-review.md`) deixou passar

| Item do orquestrador | O que encontrei |
|---|---|
| §4 "Sem segredos expostos ✔ — grep + `.gitignore` (`.env`, `data/`)" | `.gitignore` não contém `.env` (A2). A afirmação é falsa. |
| §2 "Nenhum achado bloqueador ou de severidade alta em aberto" | A1 (página legal com `${fmtDate(TODAY)}`), A2, A3. O defeito A1 é visível em qualquer captura de `/privacidade/` e não foi notado por nenhum dos 93 casos E2E nem pela varredura (que só mede status/h1/overflow/console). |
| R2 (média): perfis sociais `[A CONFIRMAR]` linkados | Correto, mas incompleto: a mesma regra é violada pelos ERPs "integrados", pelo tile "100% da carteira protegida" e pelo `platformUrl` (A3). O próprio §3 reconhece "100% da carteira protegida em contrato" como "capacidade, não métrica" — mas o comentário de `data.js:571` a marca como contratualmente **a confirmar**. |
| §3 `grep -niE "planning\|somos a ponte" src/ → nenhum` | Grep insuficiente: o H1 de ESG é cópia literal de um item da referência (A4). |
| §3 saídas de Lighthouse/varredura em `localhost:3100` | Medidas contra processo iniciado antes do `server.js` final (A6). |
| §4 critério 12 "26/26 + 93/93" | Verdadeiro pelo runner; o script `npm run test:e2e` e o comando documentado não funcionam no Node 24 (A5). |
| `final-delivery.md:24` "sitemap com lastmod por página" | 27 de 33 URLs usam a data do build (A7b). |
| Estado do repositório no momento do parecer | `public/` estava desatualizado em relação ao `data.js` commitado (A7c); backlog e `final-delivery` divergem sobre o que está entregue (A7d). |

Pontos em que concordo com o orquestrador: R1 (limite por processo, documentado), R3 (`'unsafe-inline'` em `style-src`), R4 (títulos de posts > 60 c), R5 (só Chrome), R6 (fato do BP reescrito — confirmado após rebuild), R7/R8 informativos.

---

## 6. Condições para reclassificar como PRONTO COM RESSALVAS

1. **A1** — corrigir `src/build.js:833` (crase) e, de preferência, data fixa de revisão (A16); rebuild; conferir `grep -c '\${' public/privacidade/index.html → 0`.
2. **A2** — `.env` no `.gitignore`; corrigir `technical-review.md:71`.
3. **A3** — retirar do site (ou confirmar com o cliente) ERPs nomeados, "100% da carteira protegida", perfis sociais e `platformUrl`.
4. **A4** — reescrever o H1 de `/esg/`.
5. **A5** — `test:e2e` → `node tests/e2e/run.mjs` e docs.
6. Rebuild + `npm test` + `node tests/e2e/run.mjs` + commit (A7); reiniciar o servidor de QA da 3100 a partir do código atual (A6).

Ressalvas que permanecerão (dependem do cliente, já listadas em `final-delivery.md` §9 e no runbook): razão social/CNPJ no rodapé e na política; perfis sociais; IDs dos vídeos (8 blocos "em breve"); fotos/biografias dos sócios (6 placeholders); vagas; URL do Complexo DMC; credenciais SMTP ou webhook de CRM (sem elas os leads ficam só em `data/*.jsonl`); domínio/HTTPS/`TRUST_PROXY`; teste manual em Safari iOS/Firefox (ambiente só tem Chrome). **A publicação em produção não foi autorizada e não foi feita** — este parecer não altera isso.

---

## 7. Registro de efeitos colaterais desta revisão

- Rebuild de `public/` às 19:42 (gerado, ignorado pelo git).
- `node tests/e2e/run.mjs` reescreveu PNGs em `docs/qa/screenshots/depois/` → restaurados com `git checkout -- docs/qa/screenshots/depois/` (árvore limpa antes deste arquivo).
- Leads de teste anexados a `data/*.jsonl` (44 linhas no total; ignorado pelo git).
- Servidor que iniciei na porta 3101 foi encerrado. O processo pré-existente na 3100 (PID 11673, código de `server.js` anterior a 14:58) **não é meu e foi deixado em execução**; recomendo reiniciá-lo.
- Capturas desta revisão em `/tmp/review-shots/` (35 arquivos) e logs/Lighthouse no scratchpad da sessão.
- Único arquivo escrito no repositório: `docs/qa/technical-review-independente.md`.
