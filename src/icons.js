// Ícones SVG inline (24×24, traço 1.75, currentColor). Mantido pelo creative-director.
// Uso no build: ico("nome") → <svg class="i" ...>…</svg>. Nomes ausentes caem em "dot".
// Grade: 24 px, margem 2–3 px, cantos/caps arredondados. Marcas (whatsapp, linkedin, instagram,
// youtube, play) usam fill="currentColor". Aliases FontAwesome (fa-*) resolvidos em ICON_ALIASES.
export const ICONS = {
  dot: '<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>',

  // ── Navegação / UI ──────────────────────────────────────────────
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  "chevron-up": '<path d="m18 15-6-6-6 6"/>',
  "chevron-right": '<path d="m9 6 6 6-6 6"/>',
  "chevron-left": '<path d="m15 6-6 6 6 6"/>',
  "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
  "arrow-left": '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  "arrow-down": '<path d="M12 5v14M6 13l6 6 6-6"/>',
  "arrow-up": '<path d="M12 19V5M6 11l6-6 6 6"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  play: '<path d="M7 5v14l12-7z" fill="currentColor" stroke="none"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M19 13v6H5V5h6"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m21 21-5.2-5.2"/>',
  refresh: '<path d="M11.5 5a7.5 7.5 0 1 0 7.5 7.5"/><path d="m16 15.5 3-3 3 3"/>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  settings: '<path d="M10.19 4.62L10.51 2.11L13.49 2.11L13.81 4.62L15.94 5.5L17.93 3.95L20.05 6.07L18.5 8.06L19.38 10.19L21.89 10.51L21.89 13.49L19.38 13.81L18.5 15.94L20.05 17.93L17.93 20.05L15.94 18.5L13.81 19.38L13.49 21.89L10.51 21.89L10.19 19.38L8.06 18.5L6.07 20.05L3.95 17.93L5.5 15.94L4.62 13.81L2.11 13.49L2.11 10.51L4.62 10.19L5.5 8.06L3.95 6.07L6.07 3.95L8.06 5.5z"/><circle cx="12" cy="12" r="3"/>',

  // ── Contato / social ────────────────────────────────────────────
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  whatsapp: '<path d="M3 21l1.5-4.2A9 9 0 1 1 8 20.1L3 21z"/><path d="M9.3 8.3c.2-.4.4-.5.7-.5h.6c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .4-.1.5l-.5.6c-.1.1-.1.3 0 .4a6.4 6.4 0 0 0 3.1 2.8c.2.1.3 0 .4-.1l.6-.7c.2-.2.4-.2.6-.1l1.7.8c.2.1.3.3.3.5-.1 1-.8 1.8-1.8 1.9C13.2 16.8 7.3 13 9.3 8.3z" fill="currentColor" stroke="none"/>',
  linkedin: '<rect x="3" y="9" width="4" height="12"/><circle cx="5" cy="5" r="2"/><path d="M11 9h4v2a4 4 0 0 1 6 3v7h-4v-6a2 2 0 0 0-4 0v6h-4z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
  youtube: '<path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8z"/><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none"/>',
  headset: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M19 19v1a2 2 0 0 1-2 2h-3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',

  // ── Pessoas ─────────────────────────────────────────────────────
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-5-6.3"/>',
  people: '<circle cx="12" cy="7" r="3"/><path d="M6.5 20a5.5 5.5 0 0 1 11 0"/><circle cx="4.5" cy="9.5" r="2"/><path d="M1.5 18a3.5 3.5 0 0 1 3.5-3.5"/><circle cx="19.5" cy="9.5" r="2"/><path d="M22.5 18a3.5 3.5 0 0 0-3.5-3.5"/>',
  "users-gear": '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 10-5.5"/><path d="M16.37 14.01L16.36 12.54L18.64 12.54L18.63 14.01L19.53 14.53L20.79 13.79L21.93 15.76L20.66 16.48L20.66 17.52L21.93 18.24L20.79 20.21L19.53 19.47L18.63 19.99L18.64 21.46L16.36 21.46L16.37 19.99L15.47 19.47L14.21 20.21L13.07 18.24L14.34 17.52L14.34 16.48L13.07 15.76L14.21 13.79L15.47 14.53z"/><circle cx="17.5" cy="17" r="1.2" fill="currentColor" stroke="none"/>',
  handshake: '<path d="M2 5h7M2 5v8l6 6a1.5 1.5 0 0 0 2.1-2.1"/><path d="m10.5 16.5 1.5 1.5a1.5 1.5 0 0 0 2.1-2.1"/><path d="m13 14 1.5 1.5a1.5 1.5 0 0 0 2.1-2.1"/><path d="M22 5h-7l-4 4a1.5 1.5 0 0 0 2.1 2.1L14.5 9.7a2.4 2.4 0 0 1 3.4 0l2.1 2.1"/><path d="M22 5v8h-2"/>',
  graduation: '<path d="m2 9 10-4 10 4-10 4z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v5"/>',

  // ── Serviços ────────────────────────────────────────────────────
  calculator: '<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M8 6.5h8v3.5H8z"/><path d="M8.5 14h.01M12 14h.01M15.5 14h.01M8.5 17.5h.01M12 17.5h.01M15.5 17.5h.01"/>',
  "chart-line": '<path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 6-7"/>',
  "chart-bar": '<path d="M3 21h18"/><path d="M5 21v-8h4v8M10 21V7h4v14M15 21v-11h4v11"/>',
  "search-chart": '<circle cx="10.5" cy="10.5" r="7"/><path d="m21 21-5.2-5.2"/><path d="M8 13v-2M10.5 13V8M13 13v-3"/>',
  sitemap: '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="2.5" y="16" width="5" height="5" rx="1"/><rect x="9.5" y="16" width="5" height="5" rx="1"/><rect x="16.5" y="16" width="5" height="5" rx="1"/><path d="M12 8v4M5 16v-4h14v4M12 12v4"/>',
  bank: '<path d="M3 10 12 4l9 6z"/><path d="M5 10v7M9.5 10v7M14.5 10v7M19 10v7"/><path d="M3 20h18"/>',
  scale: '<path d="M12 3v18M7 21h10M4 7h16"/><path d="m3 14 3.5-7 3.5 7a3.5 3.5 0 0 1-7 0z"/><path d="m14 14 3.5-7 3.5 7a3.5 3.5 0 0 1-7 0z"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12.5h18"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  receipt: '<path d="M5 3h14v18l-2.3-1.5-2.3 1.5-2.4-1.5L9.6 21l-2.3-1.5L5 21z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M15 11h6v4h-6a2 2 0 0 1 0-4z"/>',
  coins: '<circle cx="15" cy="15" r="6"/><circle cx="15" cy="15" r="2.8"/><path d="M15 9A6 6 0 1 0 9 15"/>',
  percent: '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
  "trending-up": '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  book: '<path d="M12 7c-2-1.5-5-2-9-2v13c4 0 7 .5 9 2 2-1.5 5-2 9-2V5c-4 0-7 .5-9 2z"/><path d="M12 7v13"/>',
  building: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
  badge: '<circle cx="12" cy="9" r="6"/><path d="m9.5 9 1.8 1.8L15 7.5"/><path d="M8.5 13.8 7 22l5-2.5 5 2.5-1.5-8.2"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 20 3M17 6l3 3M14 9l2.5 2.5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
  gauge: '<path d="M5 17a8 8 0 1 1 14 0"/><path d="m12 13 4.2-4.2"/><circle cx="12" cy="13" r="1.1" fill="currentColor"/>',
  trophy: '<path d="M7 3h10v6a5 5 0 0 1-10 0z"/><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3"/><path d="M12 14v4M9 21v-3h6v3M7 21h10"/>',
  lightbulb: '<path d="M9 15c0-1.2-.5-2-1.3-2.8A6 6 0 1 1 16.3 12.2C15.5 13 15 13.8 15 15"/><path d="M9 15h6M9.5 18h5M10.5 21h3"/>',
  sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  star: '<path d="m12 3 2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.3l-5.6 3 1.2-6.3L3 9.6l6.3-.8z"/>',
  quote: '<path d="M8 15H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6a3 3 0 0 1-3 3"/><path d="M18 15h-3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6a3 3 0 0 1-3 3"/>',
  puzzle: '<path d="M10 5a2 2 0 0 1 4 0v1h3a1 1 0 0 1 1 1v3h-1a2 2 0 0 0 0 4h1v3a1 1 0 0 1-1 1h-3v-1a2 2 0 0 0-4 0v1H7a1 1 0 0 1-1-1v-3h-1a2 2 0 0 1 0-4h1V7a1 1 0 0 1 1-1h3z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  rocket: '<path d="M12 2c3.5 2.5 5 6.5 5 11l-5 4-5-4c0-4.5 1.5-8.5 5-11z"/><circle cx="12" cy="9" r="2"/><path d="m7 12-3 3.5h3.5M17 12l3 3.5h-3.5M12 17v4"/>',
  leaf: '<path d="M20 4C10 4 4 10 5 19c9 1 15-5 15-15z"/><path d="M5 19 13 11"/>',

  // ── Segmentos ───────────────────────────────────────────────────
  factory: '<path d="M3 21h18"/><path d="M4 21V10l5 3v-3l5 3v-3l5 3v8"/><path d="M16 11.2V5h3v7.5"/>',
  wheat: '<path d="M12 22V8"/><path d="M12 8c-2-1.5-2-4.5 0-6 2 1.5 2 4.5 0 6z"/><path d="M12 13c-2.5 0-4.5-2-4.5-4.5 2.5 0 4.5 2 4.5 4.5zM12 13c2.5 0 4.5-2 4.5-4.5-2.5 0-4.5 2-4.5 4.5z"/><path d="M12 17.5c-2.5 0-4.5-2-4.5-4.5 2.5 0 4.5 2 4.5 4.5zM12 17.5c2.5 0 4.5-2 4.5-4.5-2.5 0-4.5 2-4.5 4.5z"/>',
  stethoscope: '<path d="M5 3v6a5 5 0 0 0 10 0V3"/><path d="M10 14v2.5a4 4 0 0 0 8 0V13"/><circle cx="18" cy="10.5" r="2.5"/><path d="M3.5 3H6M14 3h2.5"/>',
  "hard-hat": '<path d="M3 18h18"/><path d="M4 18v-4a8 8 0 0 1 16 0v4"/><path d="M10 11V7h4v4"/>',
  truck: '<path d="M3 17V6h11v11"/><path d="M14 9h4l3 4v4h-2"/><path d="M9 17h6M3 17h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  store: '<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v9h14v-9"/><path d="M10 21v-5h4v5"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx=".5"/><path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
  robot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9.5 4h5M2 13v3M22 13v3"/><circle cx="9" cy="13.5" r="1.2" fill="currentColor"/><circle cx="15" cy="13.5" r="1.2" fill="currentColor"/><path d="M9 17h6"/>',
  database: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  cloud: '<path d="M6.5 19h11a4.5 4.5 0 0 0 0-9 7 7 0 0 0-13.4 2A3.8 3.8 0 0 0 6.5 19z"/>',
  cube: '<path d="M12 2 21 7v10l-9 5-9-5V7z"/><path d="m3 7 9 5 9-5M12 12v10"/>',
};

// Aliases: nomes FontAwesome ainda usados em build.js/data.js → nomes do sprite.
export const ICON_ALIASES = {
  "location-dot": "pin", envelope: "mail", "linkedin-in": "linkedin", "magnifying-glass": "search",
  "magnifying-glass-chart": "search-chart", certificate: "badge", "shield-halved": "shield",
  "scale-balanced": "scale", "people-group": "people", "gauge-high": "gauge", "chart-column": "chart-bar",
  "building-columns": "bank", "helmet-safety": "hard-hat", "truck-fast": "truck", "wheat-awn": "wheat",
  "laptop-code": "code", industry: "factory", gear: "settings", cog: "settings", award: "badge",
  "circle-check": "check", xmark: "x", bars: "menu", "arrow-up-right-from-square": "external",
  "chart-simple": "chart-bar", "money-bill": "wallet", "sack-dollar": "coins", "file-invoice": "receipt",
  "user-group": "users", "graduation-cap": "graduation", "book-open": "book", "lightbulb-on": "lightbulb",
};

export const iconName = (name = "") => {
  const n = String(name).replace(/^fa-/, "");
  return ICONS[n] ? n : ICON_ALIASES[n] && ICONS[ICON_ALIASES[n]] ? ICON_ALIASES[n] : "dot";
};
export const ico = (name, cls = "") => `<svg class="i${cls ? " " + cls : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[iconName(name)]}</svg>`;
