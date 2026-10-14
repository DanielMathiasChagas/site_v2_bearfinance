# Revisão técnica — verificação do orquestrador

> O parecer **independente** do agente `technical-reviewer` fica em `docs/qa/technical-review-independente.md`. Este documento é a verificação do orquestrador contra a mesma checklist, com saídas reais reproduzidas em 14/10/2026 (build final, commit `c94919f`). Dois agentes foram derrubados por limite de sessão da API durante o projeto; nada abaixo foi aceito por declaração — tudo foi reexecutado.

## 1. Resumo executivo

**PRONTO COM RESSALVAS** para publicação. O código, os testes e as auditorias estão aprovados; as ressalvas são externas ao código: (a) conteúdo a confirmar pelo cliente (CNPJ/razão social, perfis sociais, vídeos, sócios, vagas), (b) entrega de leads por e-mail/CRM depende de credenciais, (c) navegadores testados: só Chrome, (d) a publicação em produção **não foi autorizada** e não foi feita.

## 2. Achados

| ID | Sev. | Onde | Achado | Evidência | Recomendação / status |
|---|---|---|---|---|---|
| R1 | média | `server.js` (RateLimit em memória) | Limites por IP/e-mail valem por processo; com várias instâncias não há compartilhamento | código `class RateLimit` | Uma instância ou limitar no proxy/WAF (documentado no runbook) |
| R2 | média | `src/data.js` → `site.instagram/linkedin/youtube` | Perfis sociais marcados `[A CONFIRMAR]` continuam linkados no rodapé e no drawer | `grep -n "A CONFIRMAR" src/data.js` | Confirmar ou remover antes de publicar; já fora do JSON-LD (`sameAs` só com `socialConfirmed`) |
| R3 | baixa | `server.js` CSP `style-src 'unsafe-inline'` | Necessário porque os templates usam `style=""` (variáveis `--i`, `--ratio`) | `export const CSP` | Futuro: mover para classes/`data-*` + nonce; scripts já são só `'self'` |
| R4 | baixa | `src/data.js` → `posts[].title` | 6 títulos de artigo com mais de 60 caracteres (decisão editorial) | `docs/qa/performance-report.md` §6 | Encurtar se a equipe quiser SERP sem truncamento |
| R5 | baixa | Ambiente de teste | Apenas Chrome disponível; Safari/Firefox não exercitados | `docs/qa/test-report.md` §6 | Passe manual em Safari iOS/Firefox na homologação |
| R6 | média → corrigido | `src/data.js` → `partnerPrograms[1].facts` | Tile "0 — exigência de registro profissional" lia como métrica estranha | captura `parcerias_business-partner-1440.png` | Substituído por "2 — formas de atuar: só indicar ou prospectar ativamente" (verificável no texto do programa) |
| R7 | info | `data/*.jsonl` | Leads acumulam em disco sem rotação | runbook §7 | Exportar ao CRM e limpar conforme a política de privacidade |
| R8 | info | `src/assets/img/art/hero-neural.svg` 91 KB (gzip ≈ 25 KB) com `fetchpriority=high` | Peso aceitável: LCP mobile medido 1,4 s | Lighthouse final | — |
| R9 | info | Agentes | backend-engineer, creative-director, frontend-architect (mapa) e qa-tester caíram com HTTP 429; entregas parciais foram concluídas pelo orquestrador | `docs/project/backlog.md` registro | — |

Nenhum achado bloqueador ou de severidade alta em aberto.

## 3. Verificações reproduzidas (saída real)

```
$ node src/build.js
✓ 34 páginas geradas em /public

$ npm test
ℹ tests 26 · ℹ pass 26 · ℹ fail 0

$ node tests/e2e/run.mjs
ℹ tests 93 · ℹ suites 12 · ℹ pass 93 · ℹ fail 0 · ℹ duration_ms 264759

$ node scripts/shots.mjs <pasta>
17 rotas × 7 larguras … ok   (0 overflow, h1=1, console limpo)
map live: true canvas: 658x658 label: Goiânia / GO · ATENDIMENTO DIGITAL
SEM PROBLEMAS

$ npx lighthouse (docs/qa/lighthouse/final/*.report.json)
home 100/100/100/100 mobile (LCP 1,4 s, CLS 0) · servico, segmento, contato, parceria 100/100/100/100 mobile e desktop

$ grep -rniE "(api[_-]?key|secret|password|passwd|token)\s*[:=]\s*['\"][^'\"]{4,}" (sem node_modules/public) → nenhum resultado
$ git ls-files | grep -E "^\.env$|data/" → nenhum (segredos e leads fora do git)
$ grep -c "fa-" public/index.html → 0 (Font Awesome removido)
$ grep -nE "\+ ?[0-9]{2,}|NPS|[0-9]{2,3} ?%" src/data.js → só "100% operação digital" e "100% da carteira protegida em contrato" (capacidades, não métricas de clientes)
$ grep -niE "planning|somos a ponte" src/ → nenhum
```

Capturas inspecionadas pelo orquestrador: `docs/qa/screenshots/orquestrador/{home-1440,home-390,hero-1440,map-1440,menu-mobile-390,atuacao_contabilidade-1440,verticais_contabilidade-agronegocio-390,parcerias_business-partner-1440,sobre-1440,cases-1440,contato-1440}.png` — layout íntegro, seções reveladas, sem corte de texto, drawer de tela cheia, mapa 3D com arcos e rótulo.

## 4. Critérios de aceite (Prompt Master §9)

| Critério | Status | Evidência |
|---|---|---|
| Rotas previstas implementadas e funcionando | ✔ | E2E 01 (sitemap = public/, 200, 404, 301) |
| Nenhum link interno quebrado | ✔ | E2E 02 (links + âncoras + assets + url() do CSS) |
| Sem erros críticos de console | ✔ | E2E 07 + varredura |
| Build de produção conclui | ✔ | `node src/build.js` → 34 páginas |
| Layout funciona nas resoluções testadas | ✔ | E2E 06 (320–1920) + varredura |
| Formulários validados | ✔ | E2E 05 + `tests/server.test.js` |
| Integrações configuradas testadas | ✔/◐ | SMTP testado com servidor falso; webhook/SMTP reais dependem de credenciais do cliente |
| Elementos 3D com fallback | ✔ | E2E 09 (reduced-motion, mobile, sem script, sem malha) |
| Imagens otimizadas | ✔ | SVG ≤ 91 KB, WebP, dimensões, lazy; Lighthouse 100 |
| Fluxos de conversão funcionais | ✔ | E2E 04/05 (diagnóstico, WhatsApp contextual, parceria 2 etapas) |
| Auditoria de acessibilidade executada | ✔ | axe (E2E 12) + Lighthouse A11y 100 |
| Testes automatizados críticos aprovados | ✔ | 26/26 + 93/93 |
| Performance documentada | ✔ | `docs/qa/performance-report.md` + `docs/qa/lighthouse/` |
| Sem segredos expostos | ✔ | grep + `.gitignore` (`.env`, `data/`) |
| Parecer do revisor | ◐ | este documento (orquestrador) + `technical-review-independente.md` (agente) |
