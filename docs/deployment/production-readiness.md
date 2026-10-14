# Prontidão para produção — Bear Finance v2

**Status:** homologado em ambiente local (build, testes de servidor, varredura E2E e auditorias). **Não publicado** — a publicação em produção exige autorização expressa.

## 1. O que é entregue

- `public/` — site estático gerado por `node src/build.js` (34 páginas, `sitemap.xml`, `robots.txt`, assets versionados por hash `?v=`).
- `server.js` — servidor Node sem dependências que serve `public/` com cabeçalhos de segurança (CSP, nosniff, frame-options, permissions-policy, COOP, HSTS atrás de HTTPS), gzip/brotli, ETag/304, cache imutável para assets versionados, e a API de formulários `POST /api/{contato,newsletter,parceria,carreira}` com validação, honeypot, tempo mínimo de preenchimento, limite por IP e por e-mail, gravação em `data/*.jsonl`, webhook e SMTP opcionais.
- `tests/` — `node --test` (servidor) e `tests/e2e/` (Playwright, Chrome do sistema).

## 2. Requisitos

- Node.js ≥ 20 (desenvolvido com 24). Sem dependências de produção (`npm ci` só instala ferramentas de teste).
- Uma instância do servidor (o limite por IP/e-mail é em memória; com várias instâncias, coloque o limite no proxy/WAF ou use um único processo).
- HTTPS no proxy reverso (nginx, Caddy, Cloudflare) encaminhando `X-Forwarded-Proto: https` e `X-Forwarded-For`; defina `TRUST_PROXY=1` (número de proxies confiáveis).

## 3. Variáveis de ambiente (ver `.env.example`)

| Variável | Obrigatória | Função |
|---|---|---|
| `PORT` | não (3000) | porta HTTP |
| `TRUST_PROXY` | sim atrás de proxy | nº de proxies para ler o IP real |
| `FORCE_HSTS` | não | `1` força HSTS mesmo sem `X-Forwarded-Proto` |
| `LEADS_WEBHOOK_URL` | não | encaminha cada lead (JSON) para CRM/n8n/Zapier |
| `SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, LEADS_TO, LEADS_FROM` | não (recomendado) | entrega dos leads por e-mail; só ativa com as seis definidas |
| `SMTP_SECURE`, `SMTP_STARTTLS` | não | ajustes de TLS |

Sem SMTP/webhook configurados, os leads **não são perdidos**: ficam em `data/<form>.jsonl` (fora do git) e o servidor avisa no log ao iniciar. **Pendência do cliente:** fornecer credenciais SMTP ou URL de CRM.

## 4. Passo a passo de implantação

```bash
git clone <repo> && cd V2_BearFinance_Site
git checkout redesign/v2            # ou a tag de release
npm ci                              # só ferramentas de teste
npm run build                       # gera public/
npm test                            # servidor (26 testes)
cp .env.example .env && $EDITOR .env
PORT=3000 TRUST_PROXY=1 node --env-file=.env server.js
# verificação
curl -fsS http://127.0.0.1:3000/health
```

Como serviço (systemd):
```ini
[Service]
WorkingDirectory=/srv/bearfinance
EnvironmentFile=/srv/bearfinance/.env
ExecStart=/usr/bin/node server.js
Restart=always
User=www-data
```

Proxy nginx (trecho):
```nginx
location / { proxy_pass http://127.0.0.1:3000; proxy_set_header X-Forwarded-Proto $scheme; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; proxy_set_header Host $host; }
```

**Alternativa estática:** `public/` pode ser hospedado em CDN/estático (Netlify, Vercel, S3+CloudFront) **desde que** `/api/*` seja roteado para o `server.js` (ou equivalente) e os cabeçalhos de segurança sejam replicados na plataforma.

## 5. Rollback

1. Cada release é um commit/tag; para voltar: `git checkout <tag-anterior> && npm run build && systemctl restart bearfinance`.
2. O build é determinístico a partir de `src/`; manter o `public/` da release anterior em `/srv/bearfinance/releases/<data>/` permite rollback por troca de symlink sem rebuild.
3. Leads em `data/*.jsonl` não são afetados pelo rollback (ficam fora de `public/`).

## 6. Checklist pré-publicação

- [ ] Domínio apontado e HTTPS ativo; `site.url` em `src/data.js` igual ao domínio final (afeta canonical, sitemap e OG).
- [ ] `.env` com SMTP ou webhook testado (`npm test` cobre o cliente SMTP; teste real com `node -e` ou um envio no formulário).
- [ ] Razão social e CNPJ em `src/data.js` (`site.razaoSocial`, `site.cnpj`) — hoje vazios `[A CONFIRMAR]`.
- [ ] URL do Complexo DMC (`site.dmcUrl`) e perfis sociais confirmados.
- [ ] IDs de vídeo do YouTube em `src/data.js` → `videos` e `services[].video` (hoje todos "em breve").
- [ ] Fotos reais de sócios/equipe (hoje placeholders honestos) e, se desejado, logos de clientes com autorização.
- [ ] Ferramenta de analytics (se houver): o site já publica eventos em `window.dataLayer` (`cta_click`, `whatsapp_click`, `form_submit_ok`, `cookie_choice`); basta incluir o GTM respeitando a escolha de cookies.
- [ ] Rodar `npm test`, `node --test tests/e2e/` e Lighthouse na homologação final.
- [ ] Registrar a release (tag) e o `public/` anterior para rollback.

## 7. Operação

- Saúde: `GET /health` → `{"ok":true}`.
- Logs: stdout (leads mascarados, spam, rate limit, falhas de entrega). Não contêm dados completos de contato.
- Retenção: `data/*.jsonl` — exportar para o CRM e limpar conforme a política de privacidade (candidaturas: até 12 meses).
- Atualização de conteúdo: editar `src/data.js` → `npm run build` → reiniciar/recopiar `public/`.
