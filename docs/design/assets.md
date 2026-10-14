# Ativos visuais — inventário

Todas as ilustrações são **originais, vetoriais (SVG) e geradas por código** (`src/make-art.mjs`, determinístico, seed fixa). Não há imagem gerada por IA raster nem material de terceiros. Fotos de pessoas e escritório continuam como placeholders até o marketing fornecer material licenciado.

| Arquivo (`src/assets/img/art/`) | Dimensões | KB | O que representa | Alt sugerido | Onde é usado |
|---|---|---|---|---|---|
| `hero-neural.svg` | 1600×900 | 91 | Cabeça de urso low-poly emergindo de uma rede neural | vazio (decorativa; o texto do hero já comunica) | Hero da home, topo de Sobre/Cases/Parcerias/Soluções, pôster do vídeo da home |
| `svc-contabilidade.svg` | 1200×800 | 15 | Painéis isométricos em camadas (livro-razão) com marca de conferência | "Ilustração: contabilidade" | Topo e bloco de introdução de /atuacao/contabilidade/ |
| `svc-bpo-financeiro.svg` | 1200×800 | 16 | Gráfico de barras e linha sobre painel isométrico (fluxo de caixa) | "Ilustração: BPO Financeiro" | /atuacao/bpo-financeiro/, pôster do vídeo de parcerias |
| `svc-folha.svg` | 1200×800 | 20 | Grade de cartões com pessoas (folha de pagamento) | "Ilustração: BPO de Folha de Pagamento" | /atuacao/bpo-de-folha-de-pagamento/ |
| `svc-auditoria.svg` | 1200×800 | 21 | Lupa sobre malha triangulada | "Ilustração: Auditoria e Consultoria Tributária" | /atuacao/auditoria-consultoria-tributaria/ |
| `svc-estruturacoes.svg` | 1200×800 | 15 | Organograma de holding com nós luminosos | "Ilustração: Estruturações Corporativas" | /atuacao/estruturacoes-corporativas/, pôster do vídeo de Sobre |
| `seg-industria.svg` | 1200×800 | 13 | Engrenagem e silhueta de fábrica | "Ilustração: Indústria" | Card e topo do segmento Indústria; pôster do vídeo de Cases |
| `seg-agronegocio.svg` | 1200×800 | 13 | Campo em perspectiva, broto e sol | "Ilustração: Agronegócio" | Segmento Agronegócio; pôster em /verticais/ |
| `seg-saude.svg` | 1200×800 | 13 | Cruz e linha de pulso | "Ilustração: Saúde" | Segmento Saúde |
| `seg-construcao.svg` | 1200×800 | 14 | Edifício em wireframe isométrico e grua | "Ilustração: Mercado Imobiliário e Construção Civil" | Segmento Construção |
| `seg-logistica.svg` | 1200×800 | 14 | Rota pontilhada e caminhão isométrico | "Ilustração: Transportes e Logística" | Segmento Logística |
| `seg-varejo.svg` | 1200×800 | 17 | Grade de caixas isométricas com etiqueta | "Ilustração: Varejo e Distribuição" | Segmento Varejo |
| `seg-energia.svg` | 1200×800 | 15 | Raio, sol e painéis | "Ilustração: Energia" | Segmento Energia; topo e pôster de ESG |
| `seg-servicos.svg` | 1200×800 | 16 | Colchetes de código e rede | "Ilustração: Serviços e Tecnologia" | Segmento Serviços |
| `tech-plataforma.svg` | 1200×900 | 11 | Painéis flutuantes com gráficos (dashboard isométrico) | "Ilustração da Plataforma Bear: painéis financeiros conectados" | Teaser da plataforma nas páginas de serviço; topo de /plataforma/; pôsteres de vídeo |
| `cta-banner.svg` | 1600×600 | 10 | Malha diagonal com brilho (fundo transparente) | vazio (decorativa) | Fundo da seção de conversão (diagnóstico) |
| `brasil-presenca.svg` | 900×900 | 49 | Mapa do Brasil por UF com arcos a partir de SP | "Mapa do Brasil com sede em São Paulo e conexões com todas as capitais" | Reserva para materiais/OG; na home o fallback é o SVG inline acessível |
| `og-image.svg` → `../og-image.jpg` | 1200×630 | 75 / 120 (JPG) | Cabeça de urso e malha sobre fundo escuro | n/a (Open Graph) | `og:image` e `twitter:image` de todas as páginas |
| `favicon.svg` | 64×64 | 1 | Urso geométrico simplificado | n/a | `<link rel="icon">` (SVG) |
| `noise.svg` | 256×256 | 0.3 | Grão sutil (feTurbulence) | n/a | Disponível para fundos (não aplicado por padrão) |

Rasters em `src/assets/img/`: `URSO_GEOMETRICO_PURPLE.png` (logo, 500², + `.webp`), `URSO_CARA.jpg`/`.webp`/`-800.webp` (arte original azul; exibida com filtro de matiz roxo na página Sobre), `SISTEMA.jpg`/`.webp`/`-800.webp` (ilustração isométrica da plataforma), `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `og-image.jpg`. Placeholders provisórios: `ph-01…12.svg`, `hero.svg`, `avatar.svg` (gerados por `src/make-placeholders.py`; etiqueta "Substituir").

Folha de contato: `docs/design/contact-sheet.png`.

## Direção de arte aplicada
- Fundo grafite (`#0d0a17`→`#150f24`) com brilho radial roxo, piso em perspectiva e rede esparsa de nós; motivo central em lilás/roxo com volumes isométricos.
- Cabeça de urso em malha triangulada (Delaunay) com iluminação do alto-esquerda, consistente com o ativo oficial `URSO_CARA.jpg`.
- Sem texto dentro das artes; sem rostos humanos; sem gradientes multicoloridos.
- Para regenerar com outro visual, altere seeds/parâmetros em `src/make-art.mjs` e rode `node src/make-art.mjs && node scripts/contact-sheet.mjs docs/design/contact-sheet.png`.
