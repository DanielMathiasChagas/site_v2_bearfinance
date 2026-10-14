# Backlog priorizado — Bear Finance v2

Legenda: **P0** bloqueia publicação · **P1** necessário para o nível premium · **P2** melhoria. Status: ☐ a fazer · ◐ em andamento · ☑ feito · ✖ bloqueado.

## Fase 1 — Diagnóstico e fundação
| ID | P | Item | Responsável | Depende de | Status |
|---|---|---|---|---|---|
| F1-01 | P0 | Inventário, git, baseline, screenshots "antes" | orquestrador | — | ☑ |
| F1-02 | P0 | Agentes em `.claude/agents/` (7) | orquestrador | — | ☑ |
| F1-03 | P0 | `docs/audit/diagnostico-inicial.md` | orquestrador | F1-01 | ☑ |
| F1-04 | P0 | Design system (`docs/design/design-system.md`) | orquestrador + creative | F1-03 | ☑ |
| F1-05 | P1 | Tooling de teste (playwright-core, lighthouse, axe) | orquestrador | — | ☑ |

## Fase 2 — Conteúdo e ativos (paralelo)
| ID | P | Item | Responsável | Depende de | Status |
|---|---|---|---|---|---|
| F2-01 | P0 | Reescrever `src/data.js`: hero original, proposta de valor, diferenciais sem números inventados, metodologia, conversão, SEO por página, `waText` por serviço/vertical, cases sem resultados fabricados | accounting-marketing | schema (abaixo) | ☑ |
| F2-02 | P0 | Ícones SVG (`src/icons.js`) para substituir Font Awesome (84 ícones) | creative-director | — | ☑ |
| F2-03 | P1 | Ilustrações SVG: hero, 5 serviços, 8 verticais, tecnologia, presença, CTA, OG image, favicon (`src/make-art.mjs`; agente caiu por limite de sessão, feito pelo orquestrador) | orquestrador | design system | ☑ |
| F2-04 | P1 | WebP dos JPG/PNG existentes + apple-touch-icon | creative-director | — | ☑ |

## Fase 3 — Frontend
| ID | P | Item | Responsável | Depende de | Status |
|---|---|---|---|---|---|
| F3-01 | P0 | Novo `site.css` com tokens, componentes, foco visível, reduced-motion, sem overflow em 320–1920 | orquestrador | F1-04 | ☑ |
| F3-02 | P0 | `build.js`: componentes reutilizáveis, home com 10 seções, head completo (OG, Twitter, favicon, BreadcrumbList, versionamento `?v=`), ícones inline, remoção do FA | orquestrador | F2-02 | ☑ |
| F3-03 | P0 | Formulário de diagnóstico (home + contato + CTA nos serviços com pré-seleção) e WhatsApp `wa.me` contextual | orquestrador | F2-01, F4-01 | ☑ |
| F3-04 | P0 | Mapa neural 3D do Brasil (`brmap.js`) com fallback estático, reduced-motion, mobile (agente caiu por limite de sessão, feito pelo orquestrador) | orquestrador | geo existente | ☑ |
| F3-05 | P1 | Páginas internas no novo padrão (serviço, vertical, sobre, ESG, carreira, cases, plataforma, parcerias, conteúdo, post, privacidade, 404) | orquestrador | F3-01/02 | ☑ |
| F3-06 | P1 | Menu acessível (aria, teclado, Esc), FAQ/abas com `button` | orquestrador | F3-02 | ☑ |
| F3-07 | P1 | Substituir iframe do Google Maps por cartão de endereço + link | orquestrador | — | ☑ |
| F3-08 | P2 | Cookie banner com "Recusar" e preferência persistida; eventos de analytics só se houver ferramenta configurada | orquestrador | — | ☑ |

## Fase 4 — Backend e conversão
| ID | P | Item | Responsável | Depende de | Status |
|---|---|---|---|---|---|
| F4-01 | P0 | `server.js`: validação por campo/enum, honeypot + tempo mínimo, rate limit IP/e-mail, cabeçalhos + CSP, gzip/brotli, cache por versão, `createApp()` | backend-engineer | — | ☑ |
| F4-02 | P0 | Testes `node --test` do servidor (`npm test`, 26 testes) — agente caiu antes dos testes; escritos pelo orquestrador | orquestrador | F4-01 | ☑ |
| F4-03 | P1 | Entrega de leads por SMTP opcional via env (sem credenciais fictícias) + `.env.example` | backend-engineer | F4-01 | ☑ |

## Fase 5 — Qualidade
| ID | P | Item | Responsável | Depende de | Status |
|---|---|---|---|---|---|
| F5-01 | P0 | E2E Playwright: rotas, links, menus, formulários, WhatsApp, 7 larguras, console limpo, teclado, reduced-motion | qa-tester | F3-* | ◐ |
| F5-02 | P0 | Lighthouse mobile/desktop + axe; relatório | seo-performance | F3-* | ◐ |
| F5-03 | P0 | Correções de regressão | orquestrador | F5-01/02 | ☑ |
| F5-04 | P0 | Revisão independente (`docs/qa/technical-review.md`) | technical-reviewer | F5-03 | ☐ |

## Fase 6 — Entrega
| ID | P | Item | Responsável | Depende de | Status |
|---|---|---|---|---|---|
| F6-01 | P0 | `docs/deployment/production-readiness.md` (deploy, rollback, env) | orquestrador | F5-04 | ☑ |
| F6-02 | P0 | `docs/project/final-delivery.md` (tabela de evidências) | orquestrador | F5-04 | ☐ |
| F6-03 | P0 | Commit final na branch `redesign/v2` (sem publicar) | orquestrador | F6-02 | ☐ |

## Schema de dados combinado (contrato entre marketing e build)

Novos/alterados em `src/data.js` (o `build.js` tem fallback para cada um):

```js
site.whatsappNumber = "5511983148774";   // dígitos; build gera wa.me/<n>?text=
site.cnpj / site.razaoSocial / site.dmcUrl // "" + comentário [A CONFIRMAR]
hero = { eyebrow, typedWords, title, sub, cta, ctaHref, cta2, cta2Href, badges:[{icon,text}×4] }
valueProp = { eyebrow, h2, p, pillars:[{icon,title,text}×3] }
differentials = { eyebrow, h2, p, items:[{icon,title,text}×6] }       // substitui `why`
method = { eyebrow, h2, p, steps:[{title,text}×5] }
conversion = { eyebrow, h2, p, bullets:[×3], primary:{label,href}, whatsappText }
segmentsIntro = { eyebrow, h2, p }
platformTeaser = { eyebrow, h2, p, bullets:[×4] }
presence = { eyebrow, h2, p, facts:[{value,label}×4], offices }       // facts = capacidades verificáveis
about.facts (substitui about.numbers) · partnerFacts (substitui partnerNumbers)
cases = { intro:{eyebrow,h2,p}, items:[{segment,title,challenge,approach,deliverables:[…]}] } // sem números
services[i].waText / metaTitle / metaDescription · verticals[i].waText / metaTitle / metaDescription
seo = { home:{title,description}, atuacao, verticais, sobre, esg, carreira, cases, plataforma, parcerias, contato, conteudo, privacidade }
career.jobs pode ser [] (build mostra "banco de talentos")
```
Ícones disponíveis (nomes em `src/icons.js`): ver `docs/design/design-system.md` § Ícones.


## Registro de execução
- 14/10/2026 — Agentes backend-engineer, creative-director e frontend-architect foram interrompidos por limite de sessão da API (HTTP 429) após entregar parcialmente (server.js, .env.example, icons.js, WebP). O restante (testes, ilustrações, mapa) foi concluído pelo orquestrador. QA e SEO relançados após o reset do limite.
- Varredura visual/técnica (`scripts/shots.mjs`): 119 combinações sem overflow, 1 h1 por página, console limpo.
- Testes do servidor: 26/26.
