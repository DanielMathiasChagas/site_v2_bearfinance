# Bear Finance — site institucional

Site estático gerado por Node (sem dependências de build) + servidor com API de formulários.
Estrutura, seções, proporções e movimento seguem o modelo de referência (planning.com.br);
paleta, textos, imagens e vídeos são da Bear Finance.

```bash
npm run dev      # gera /public e sobe em http://localhost:3000
npm run build    # só gera /public
npm start        # só sobe o servidor (PORT=3000 por padrão)
```

## Onde editar

| O quê | Arquivo |
|---|---|
| Textos, serviços, verticais, FAQ, artigos, vagas, cases, sócios | `src/data.js` |
| Vídeos (ID do YouTube por página) | `src/data.js` → `videos` e `services[].video` |
| Vídeo de fundo do topo (.mp4) | `src/data.js` → `site.heroVideo` |
| Layout e páginas | `src/build.js` |
| Estilos (paleta no `:root`) | `src/assets/css/site.css` |
| Comportamentos (menu, carrosséis, FAQ, vídeos, formulários) | `src/assets/js/site.js` |
| Imagens | `src/assets/img/` |

`public/` é gerado; não edite à mão.

## Imagens e vídeos provisórios

- As imagens `ph-01.svg` … `ph-12.svg`, `hero.svg` e `avatar.svg` são **placeholders** gerados por
  `python3 -I src/make-placeholders.py`. Troque pelos arquivos reais mantendo o nome, ou aponte novos
  nomes em `src/data.js`.
- Cada foto provisória exibe a etiqueta "FOTO · substituir". Para escondê-la sem trocar as imagens,
  defina `placeholderLabels: false` em `src/data.js`.
- Todo bloco de vídeo mostra um botão de play; com o ID do YouTube preenchido, o vídeo carrega ao clicar
  (`youtube-nocookie`). Sem ID, fica o espaço reservado.

## Páginas geradas

Home · Sobre · ESG · Carreira · Cases · Plataforma · Contato · Conteúdo (+ 6 artigos) ·
Áreas de atuação (índice + 5 páginas) · Verticais (índice + 8 páginas) · Privacidade · 404 ·
sitemap.xml · robots.txt

## Movimento

- **Topo da home**: ondas roxas animadas geradas por código (WebGL, `canvas.fx-waves`), no estilo de água
  vista de cima. Para usar um vídeo próprio, coloque a URL do .mp4 em `site.heroVideo`: o vídeo substitui as ondas.
- **Topo das páginas internas**: as mesmas ondas, mais suaves, sobre a foto (`site.headlineFx: false` desliga).
- **Todas as fotos**: zoom lento contínuo com direção aleatória (Ken Burns) e parallax ao rolar.
  Funciona com qualquer imagem trocada pelo marketing, sem configuração.
- Quem ativa "reduzir movimento" no sistema vê tudo estático. As animações pausam fora da tela.

## Formulários (back-end)

`server.js` serve os arquivos e recebe `POST /api/contato`, `/api/newsletter` e `/api/carreira`.
Valida campos, bloqueia robôs (honeypot), limita envios por IP e grava em `data/*.jsonl`.
Defina `LEADS_WEBHOOK_URL=https://...` para encaminhar cada lead a um CRM, n8n ou Zapier.

## Dependências externas (CDN)

Google Fonts (Plus Jakarta Sans, Dancing Script), Font Awesome 6.5.2 e Swiper 11.1.4 (carregado só
quando há carrossel na tela).
