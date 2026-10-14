# Fontes self-hosted

- **Plus Jakarta Sans** (fonte variável, eixo de peso 200–800), subconjuntos `latin` e `latin-ext`, obtidos em 14/10/2026 dos arquivos servidos pelo Google Fonts (`fonts.gstatic.com/s/plusjakartasans/v12/…`).
- Licença: SIL Open Font License 1.1 (OFL) — permite redistribuição e self-hosting; autor: Tokotype (Gumpita Rahayu).
- Declaradas inline no `<head>` por `src/build.js` (`page()`), com `font-display: swap`, `unicode-range` por subconjunto e `preload` do arquivo `latin`.
- Se estes arquivos forem removidos, o build volta automaticamente a carregar o CSS do Google Fonts.
