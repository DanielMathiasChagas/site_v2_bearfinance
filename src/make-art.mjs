// =====================================================================
// Gera as ilustrações originais do site (SVG) em src/assets/img/art/.
// Uso: node src/make-art.mjs   (determinístico: seed fixa)
// Linguagem: malhas low-poly + nós luminosos + linhas finas, paleta roxa Bear.
// =====================================================================
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { BR } from "./brazil-geo.js";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "assets/img/art");
const P = { bg0: "#07050d", bg1: "#0d0a17", bg2: "#150f24", bg3: "#1d1630", v700: "#5b21b6", v600: "#7c3aed", v500: "#8b5cf6", v400: "#a78bfa", v300: "#c4b5fd", v200: "#e4dcff", silver: "#c6c2d8", white: "#ffffff" };
const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const r1 = (n) => Math.round(n);
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * Math.min(1, Math.max(0, t)))).join(",")})`; };
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-hidden="true">${body}</svg>`;

/* ---------- geometria ---------- */
function delaunay(pts) {
  const n = pts.length;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of pts) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
  const dmax = Math.max(maxX - minX, maxY - minY) * 20, mx = (minX + maxX) / 2, my = (minY + maxY) / 2;
  const Pt = pts.concat([[mx - dmax, my - dmax], [mx, my + dmax], [mx + dmax, my - dmax]]);
  const circ = (t) => { const [a, b, c] = t.map((i) => Pt[i]); const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])); if (Math.abs(d) < 1e-9) return [0, 0, -1]; const A = a[0] ** 2 + a[1] ** 2, B = b[0] ** 2 + b[1] ** 2, C = c[0] ** 2 + c[1] ** 2; const ux = (A * (b[1] - c[1]) + B * (c[1] - a[1]) + C * (a[1] - b[1])) / d, uy = (A * (c[0] - b[0]) + B * (a[0] - c[0]) + C * (b[0] - a[0])) / d; return [ux, uy, (a[0] - ux) ** 2 + (a[1] - uy) ** 2]; };
  let tris = [{ t: [n, n + 1, n + 2], c: null }];
  tris[0].c = circ(tris[0].t);
  for (let i = 0; i < n; i++) {
    const [x, y] = Pt[i]; const bad = [], keep = [];
    for (const tr of tris) ((x - tr.c[0]) ** 2 + (y - tr.c[1]) ** 2 < tr.c[2] ? bad : keep).push(tr);
    const edges = new Map();
    for (const { t } of bad) for (let e = 0; e < 3; e++) { const a = t[e], b = t[(e + 1) % 3]; const k = a < b ? a + "-" + b : b + "-" + a; edges.set(k, (edges.get(k) || 0) + 1); }
    tris = keep;
    for (const { t } of bad) for (let e = 0; e < 3; e++) { const a = t[e], b = t[(e + 1) % 3]; const k = a < b ? a + "-" + b : b + "-" + a; if (edges.get(k) === 1) { const nt = [a, b, i]; tris.push({ t: nt, c: circ(nt) }); } }
  }
  return tris.map((x) => x.t).filter((t) => t.every((i) => i < n));
}
function sample({ n, inside, box: [x0, y0, x1, y1], minD, rnd }) {
  const pts = []; let tries = 0;
  while (pts.length < n && tries++ < n * 80) {
    const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0);
    if (inside && !inside(x, y)) continue;
    let ok = true; for (const [px, py] of pts) if ((px - x) ** 2 + (py - y) ** 2 < minD * minD) { ok = false; break; }
    if (ok) pts.push([x, y]);
  }
  return pts;
}
// malha low-poly: triângulos sombreados + arestas + nós luminosos
function mesh(pts, tris, { light = [-0.6, -0.8], from = P.v700, to = P.v300, op = 0.9, stroke = P.v300, strokeOp = 0.35, nodes = 0.15, rnd, center, radius, noise = 0.14 }) {
  const polys = tris.map((t) => {
    const [a, b, c] = t.map((i) => pts[i]);
    const cx = (a[0] + b[0] + c[0]) / 3, cy = (a[1] + b[1] + c[1]) / 3;
    const nx = center ? (cx - center[0]) / radius : 0, ny = center ? (cy - center[1]) / radius : 0;
    const shade = 0.45 + 0.4 * (nx * light[0] + ny * light[1]) + (rnd() - 0.5) * noise * 2;
    return `<polygon points="${r1(a[0])},${r1(a[1])} ${r1(b[0])},${r1(b[1])} ${r1(c[0])},${r1(c[1])}" fill="${mix(from, to, shade)}"/>`;
  }).join("");
  const dots = pts.filter(() => rnd() < nodes).map(([x, y]) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="7" fill="${P.v400}" fill-opacity=".3"/><circle cx="${r1(x)}" cy="${r1(y)}" r="2.4" fill="#fff" fill-opacity=".92"/>`).join("");
  return `<g fill-opacity="${op}" stroke="${stroke}" stroke-opacity="${strokeOp}" stroke-width="1" stroke-linejoin="round">${polys}</g>${dots}`;
}
// rede esparsa: pontos ligados aos 2 vizinhos mais próximos
function network(pts, { maxD = 190, op = 0.14, nodeOp = 0.55, glow = 0.12, rnd }) {
  const lines = [], seen = new Set();
  pts.forEach((p, i) => {
    const near = pts.map((q, j) => [j, (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2]).filter(([j, d]) => j !== i && d < maxD * maxD).sort((a, b) => a[1] - b[1]).slice(0, 2 + (i % 2));
    near.forEach(([j]) => { const k = i < j ? i + "-" + j : j + "-" + i; if (!seen.has(k)) { seen.add(k); lines.push(`<line x1="${r1(p[0])}" y1="${r1(p[1])}" x2="${r1(pts[j][0])}" y2="${r1(pts[j][1])}"/>`); } });
  });
  const dots = pts.map(([x, y]) => (rnd() < glow ? `<circle cx="${r1(x)}" cy="${r1(y)}" r="6" fill="${P.v400}" fill-opacity=".28"/><circle cx="${r1(x)}" cy="${r1(y)}" r="2" fill="#fff" fill-opacity=".9"/>` : `<circle cx="${r1(x)}" cy="${r1(y)}" r="1.6" fill="${P.v300}" fill-opacity="${nodeOp}"/>`)).join("");
  return `<g stroke="${P.v300}" stroke-opacity="${op}" stroke-width="1">${lines.join("")}</g>${dots}`;
}
// cabeça de urso low-poly (frontal), centro c, raio r
function bearHead(c, r, rnd, { density = 1 } = {}) {
  const [cx, cy] = c;
  const shapes = [[cx, cy + 0.05 * r, r, r], [cx - 0.72 * r, cy - 0.72 * r, 0.36 * r, 0.36 * r], [cx + 0.72 * r, cy - 0.72 * r, 0.36 * r, 0.36 * r], [cx, cy + 0.52 * r, 0.5 * r, 0.38 * r]];
  const inside = (x, y) => shapes.some(([sx, sy, rx, ry]) => ((x - sx) / rx) ** 2 + ((y - sy) / ry) ** 2 <= 1);
  const pts = [];
  const per = Math.round(36 * Math.min(1, density + 0.15));
  for (const [sx, sy, rx, ry] of shapes) for (let i = 0; i < per; i++) { const a = (i / per) * Math.PI * 2; const x = sx + Math.cos(a) * rx, y = sy + Math.sin(a) * ry; if (!shapes.some(([ox, oy, orx, ory]) => (ox !== sx || oy !== sy) && ((x - ox) / orx) ** 2 + ((y - oy) / ory) ** 2 < 0.98)) pts.push([x, y]); }
  pts.push(...sample({ n: Math.round(125 * density), inside, box: [cx - 1.1 * r, cy - 1.1 * r, cx + 1.1 * r, cy + 1.0 * r], minD: 0.11 * r, rnd }));
  const tris = delaunay(pts).filter((t) => { const [a, b, c2] = t.map((i) => pts[i]); return inside((a[0] + b[0] + c2[0]) / 3, (a[1] + b[1] + c2[1]) / 3); });
  const body = mesh(pts, tris, { rnd, center: [cx, cy], radius: r, from: P.v700, to: P.v300, op: 0.92, nodes: 0.12 });
  const eye = (x) => `<circle cx="${r1(x)}" cy="${r1(cy - 0.1 * r)}" r="${r1(0.085 * r)}" fill="${P.bg0}"/><circle cx="${r1(x + 0.03 * r)}" cy="${r1(cy - 0.13 * r)}" r="${r1(0.025 * r)}" fill="#fff" fill-opacity=".9"/>`;
  const face = `${eye(cx - 0.36 * r)}${eye(cx + 0.36 * r)}<path d="M${r1(cx - 0.16 * r)},${r1(cy + 0.4 * r)} h${r1(0.32 * r)} l${r1(-0.16 * r)},${r1(0.16 * r)} z" fill="${P.bg0}" stroke="${P.bg0}" stroke-width="${r1(0.04 * r)}" stroke-linejoin="round"/><path d="M${r1(cx)},${r1(cy + 0.56 * r)} v${r1(0.1 * r)} m${r1(-0.14 * r)},${r1(0.02 * r)} q${r1(0.14 * r)},${r1(0.12 * r)} ${r1(0.28 * r)},0" fill="none" stroke="${P.bg0}" stroke-width="${r1(0.035 * r)}" stroke-linecap="round"/><circle cx="${r1(cx - 0.72 * r)}" cy="${r1(cy - 0.7 * r)}" r="${r1(0.17 * r)}" fill="${P.bg2}" fill-opacity=".55"/><circle cx="${r1(cx + 0.72 * r)}" cy="${r1(cy - 0.7 * r)}" r="${r1(0.17 * r)}" fill="${P.bg2}" fill-opacity=".55"/>`;
  const glow = `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(1.5 * r)}" fill="url(#gl)" />`;
  return { svg: glow + body + face, inside };
}
const defs = (id = "gl") => `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${P.v500}" stop-opacity=".38"/><stop offset=".55" stop-color="${P.v700}" stop-opacity=".12"/><stop offset="1" stop-color="${P.v700}" stop-opacity="0"/></radialGradient><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.bg1}"/><stop offset="1" stop-color="${P.bg2}"/></linearGradient><linearGradient id="face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.v400}" stop-opacity=".9"/><stop offset="1" stop-color="${P.v700}" stop-opacity=".9"/></linearGradient><filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter></defs>`;

/* ---------- cenas (1200×800 com fundo) ---------- */
const ISO = { cos: Math.cos(Math.PI / 6), sin: Math.sin(Math.PI / 6) };
const iso = (x, y, z, o, s) => [r1(o[0] + (x - y) * ISO.cos * s), r1(o[1] + (x + y) * ISO.sin * s - z * s)];
const isoFace = (pts, fill, op = 0.9, stroke = P.v300, sop = 0.5) => `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="${fill}" fill-opacity="${op}" stroke="${stroke}" stroke-opacity="${sop}" stroke-width="1.2" stroke-linejoin="round"/>`;
function isoBox(x, y, z, w, d, h, o, s, { top = P.v400, left = P.v700, right = P.v600, op = 0.85 } = {}) {
  const t = [iso(x, y, z + h, o, s), iso(x + w, y, z + h, o, s), iso(x + w, y + d, z + h, o, s), iso(x, y + d, z + h, o, s)];
  const l = [iso(x, y + d, z, o, s), iso(x + w, y + d, z, o, s), iso(x + w, y + d, z + h, o, s), iso(x, y + d, z + h, o, s)];
  const rgt = [iso(x + w, y, z, o, s), iso(x + w, y + d, z, o, s), iso(x + w, y + d, z + h, o, s), iso(x + w, y, z + h, o, s)];
  return isoFace(l, left, op) + isoFace(rgt, right, op) + isoFace(t, top, op);
}
const isoPanel = (x, y, z, w, d, o, s, fill = P.bg3, op = 0.9) => isoFace([iso(x, y, z, o, s), iso(x + w, y, z, o, s), iso(x + w, y + d, z, o, s), iso(x, y + d, z, o, s)], fill, op, P.v300, 0.55);
const glowDot = (x, y, r = 3) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r * 2.6)}" fill="${P.v400}" fill-opacity=".3"/><circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="#fff" fill-opacity=".95"/>`;
const floor = (W, H) => { let s = ""; const vp = [W * 0.5, H * 0.38]; for (let i = -3; i <= 14; i++) { const x = i * (W / 11) - W * 0.05; s += `<line x1="${r1(x)}" y1="${H}" x2="${r1(vp[0])}" y2="${r1(vp[1])}"/>`; } for (let k = 0; k < 7; k++) { const y = H * 0.5 + (k * k) * (H * 0.5 / 49) * 1.0 + k * 6; s += `<line x1="0" y1="${r1(y)}" x2="${W}" y2="${r1(y)}"/>`; } return `<g stroke="${P.v300}" stroke-opacity=".07" stroke-width="1" clip-path="url(#fl)">${s}</g>`; };
function scene(name, seed, motif, { W = 1200, H = 800 } = {}) {
  const rnd = mulberry32(seed);
  const pts = sample({ n: 70, box: [40, 40, W - 40, H - 40], minD: 70, rnd, inside: (x, y) => !((x - W * 0.6) ** 2 / (W * 0.33) ** 2 + (y - H * 0.5) ** 2 / (H * 0.4) ** 2 < 1) });
  const body = `${defs()}<clipPath id="fl"><rect x="0" y="${H * 0.46}" width="${W}" height="${H}"/></clipPath><rect width="${W}" height="${H}" fill="url(#bg)"/><circle cx="${W * 0.62}" cy="${H * 0.48}" r="${H * 0.62}" fill="url(#gl)"/>${floor(W, H)}${network(pts, { rnd, op: 0.12 })}${motif(rnd, W, H)}<rect width="${W}" height="${H}" fill="url(#vig)"/><defs><radialGradient id="vig" cx=".55" cy=".5" r=".8"><stop offset=".6" stop-color="${P.bg0}" stop-opacity="0"/><stop offset="1" stop-color="${P.bg0}" stop-opacity=".55"/></radialGradient></defs>`;
  return [name, svg(W, H, body)];
}
const chart = (o, s, pts) => `<polyline points="${pts.map(([x, y, z]) => iso(x, y, z, o, s).join(",")).join(" ")}" fill="none" stroke="${P.v300}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>` + pts.map(([x, y, z]) => glowDot(...iso(x, y, z, o, s), 2.6)).join("");

const MOTIFS = {
  "svc-contabilidade": (rnd, W, H) => { const o = [W * 0.62, H * 0.6], s = 1; let g = ""; for (let i = 0; i < 3; i++) { const z = i * 52; g += isoPanel(-150, -110, z, 300, 220, o, s, i === 2 ? P.bg2 : P.bg3, 0.92); for (let r = 0; r < 5; r++) { const y = -80 + r * 42; const a = iso(-120, y, z, o, s), b = iso(60 + rnd() * 60, y, z, o, s); g += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${P.v400}" stroke-opacity="${i === 2 ? 0.8 : 0.35}" stroke-width="${i === 2 ? 3 : 2}" stroke-linecap="round"/>`; } } const c = iso(110, 80, 104, o, s); g += `<circle cx="${c[0]}" cy="${c[1]}" r="28" fill="${P.v500}" fill-opacity=".9"/><path d="M${c[0] - 12},${c[1]} l8,8 l16,-16" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`; return g; },
  "svc-bpo-financeiro": (rnd, W, H) => { const o = [W * 0.62, H * 0.62], s = 1; let g = isoPanel(-180, -130, 0, 360, 260, o, s); const bars = [60, 110, 80, 150, 120, 190]; bars.forEach((h, i) => { g += isoBox(-150 + i * 50, 70, 0, 30, 30, h, o, s, { top: i === 5 ? P.v300 : P.v400, op: 0.85 }); }); g += chart(o, s, [[-160, -90, 40], [-100, -90, 90], [-40, -90, 70], [20, -90, 130], [80, -90, 110], [140, -90, 180]]); return g; },
  "svc-folha": (rnd, W, H) => { const o = [W * 0.62, H * 0.6], s = 1; let g = isoPanel(-190, -140, 0, 380, 280, o, s); for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const hl = (i + j) % 3 === 0; g += isoBox(-160 + i * 85, -110 + j * 85, 0, 60, 60, hl ? 34 : 14, o, s, { top: hl ? P.v300 : P.v500, op: 0.85 }); const c = iso(-130 + i * 85, -80 + j * 85, hl ? 34 : 14, o, s); g += `<circle cx="${c[0]}" cy="${c[1] - 14}" r="6" fill="#fff" fill-opacity=".85"/><path d="M${c[0] - 12},${c[1] + 6} a12,12 0 0 1 24,0" fill="#fff" fill-opacity=".85"/>`; } return g; },
  "svc-auditoria": (rnd, W, H) => { const cx = W * 0.6, cy = H * 0.47, R = 190; const pts = sample({ n: 90, inside: (x, y) => (x - cx) ** 2 + (y - cy) ** 2 < (R - 10) ** 2, box: [cx - R, cy - R, cx + R, cy + R], minD: 34, rnd }); const tris = delaunay(pts); let g = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${P.bg2}" fill-opacity=".9"/>` + mesh(pts, tris, { rnd, center: [cx, cy], radius: R, from: P.v700, to: P.v400, op: 0.8, nodes: 0.2, strokeOp: 0.45 }); g += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${P.v300}" stroke-width="10" stroke-opacity=".9"/><circle cx="${cx}" cy="${cy}" r="${R + 14}" fill="none" stroke="${P.v400}" stroke-width="2" stroke-opacity=".4"/><line x1="${cx + R * 0.72}" y1="${cy + R * 0.72}" x2="${cx + R * 1.45}" y2="${cy + R * 1.45}" stroke="${P.v300}" stroke-width="22" stroke-linecap="round"/><line x1="${cx + R * 0.72}" y1="${cy + R * 0.72}" x2="${cx + R * 1.45}" y2="${cy + R * 1.45}" stroke="${P.v700}" stroke-width="10" stroke-linecap="round"/>`; return g; },
  "svc-estruturacoes": (rnd, W, H) => { const cx = W * 0.62, top = H * 0.2; const node = (x, y, r, main) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r + 10}" fill="${P.v500}" fill-opacity=".18"/><circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" fill="${main ? P.v400 : P.bg3}" stroke="${P.v300}" stroke-width="2"/>`; let g = ""; const lvl2 = [-240, 0, 240], lvl3 = [-80, 80]; const line = (x1, y1, x2, y2, w = 2) => `<path d="M${r1(x1)},${r1(y1)} V${r1((y1 + y2) / 2)} H${r1(x2)} V${r1(y2)}" fill="none" stroke="${P.v400}" stroke-opacity=".7" stroke-width="${w}"/>`; lvl2.forEach((dx) => { g += line(cx, top, cx + dx, top + 180); lvl3.forEach((d2) => { g += line(cx + dx, top + 180, cx + dx + d2, top + 360, 1.5); }); }); lvl2.forEach((dx) => { g += node(cx + dx, top + 180, 26, false); lvl3.forEach((d2) => { g += node(cx + dx + d2, top + 360, 16, false); }); }); g += node(cx, top, 40, true) + `<path d="M${cx - 14},${top - 2} l10,10 l18,-18" fill="none" stroke="${P.bg0}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`; return g; },
  "seg-industria": (rnd, W, H) => { const cx = W * 0.62, cy = H * 0.5, R = 150; let g = ""; const teeth = 12; let d = ""; for (let i = 0; i < teeth * 2; i++) { const a0 = (i / (teeth * 2)) * Math.PI * 2, a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2, rr = i % 2 ? R : R * 1.22; d += `${i ? "L" : "M"}${r1(cx + Math.cos(a0) * rr)},${r1(cy + Math.sin(a0) * rr)} L${r1(cx + Math.cos(a1) * rr)},${r1(cy + Math.sin(a1) * rr)} `; } g += `<path d="${d}Z" fill="${P.bg3}" fill-opacity=".9" stroke="${P.v300}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${cx}" cy="${cy}" r="${R * 0.55}" fill="${P.bg1}" stroke="${P.v400}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${R * 0.2}" fill="${P.v400}"/>`; for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; g += `<line x1="${r1(cx + Math.cos(a) * R * 0.25)}" y1="${r1(cy + Math.sin(a) * R * 0.25)}" x2="${r1(cx + Math.cos(a) * R * 0.5)}" y2="${r1(cy + Math.sin(a) * R * 0.5)}" stroke="${P.v300}" stroke-width="3" stroke-linecap="round"/>`; } const bx = W * 0.2; g += `<path d="M${bx},${H * 0.72} v-130 l70,-50 v50 l70,-50 v50 l70,-50 v180 z" fill="${P.bg3}" fill-opacity=".85" stroke="${P.v400}" stroke-width="2" stroke-linejoin="round"/><rect x="${bx + 30}" y="${H * 0.72 - 210}" width="26" height="90" fill="${P.v700}" stroke="${P.v400}" stroke-width="1.5"/>`; return g; },
  "seg-agronegocio": (rnd, W, H) => { let g = ""; const vp = [W * 0.6, H * 0.42]; for (let i = -2; i <= 8; i++) { const x = W * 0.1 + i * (W * 0.13); g += `<path d="M${r1(x)},${H} L${vp[0]},${vp[1]}" stroke="${P.v400}" stroke-opacity=".45" stroke-width="2" fill="none"/>`; } g += `<circle cx="${W * 0.78}" cy="${H * 0.22}" r="54" fill="${P.v400}" fill-opacity=".9"/><circle cx="${W * 0.78}" cy="${H * 0.22}" r="90" fill="${P.v400}" fill-opacity=".15"/>`; const sx = W * 0.52, sy = H * 0.62; g += `<path d="M${sx},${sy + 120} V${sy}" stroke="${P.v300}" stroke-width="6" stroke-linecap="round"/><path d="M${sx},${sy + 40} q-90,-20 -100,-110 q90,0 100,110z" fill="${P.v500}" stroke="${P.v300}" stroke-width="2"/><path d="M${sx},${sy + 10} q90,-20 100,-110 q-90,0 -100,110z" fill="${P.v600}" stroke="${P.v300}" stroke-width="2"/>`; return g; },
  "seg-saude": (rnd, W, H) => { const cx = W * 0.64, cy = H * 0.46; let g = `<path d="M${cx - 40},${cy - 130} h80 v90 h90 v80 h-90 v90 h-80 v-90 h-90 v-80 h90 z" fill="${P.v500}" fill-opacity=".9" stroke="${P.v300}" stroke-width="3" stroke-linejoin="round"/>`; const px = W * 0.08, py = H * 0.78; g += `<polyline points="${px},${py} ${px + 160},${py} ${px + 190},${py - 70} ${px + 225},${py + 90} ${px + 260},${py - 40} ${px + 290},${py} ${W * 0.62},${py}" fill="none" stroke="${P.v300}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>` + glowDot(px + 225, py + 90, 4); return g; },
  "seg-construcao": (rnd, W, H) => { const o = [W * 0.6, H * 0.74], s = 1; let g = ""; g += isoBox(-60, -60, 0, 120, 120, 260, o, s, { op: 0.5, top: P.v400, left: P.bg3, right: P.bg2 }); for (let f = 1; f < 6; f++) { const a = iso(-60, 60, f * 46, o, s), b = iso(60, 60, f * 46, o, s), c = iso(60, -60, f * 46, o, s); g += `<polyline points="${a.join(",")} ${b.join(",")} ${c.join(",")}" fill="none" stroke="${P.v300}" stroke-opacity=".7" stroke-width="1.5"/>`; } g += isoBox(90, -20, 0, 70, 70, 120, o, s, { op: 0.55, top: P.v500, left: P.bg3, right: P.bg2 }); const cr = iso(-160, 80, 0, o, s), top = iso(-160, 80, 400, o, s), arm = iso(120, 80, 400, o, s); g += `<line x1="${cr[0]}" y1="${cr[1]}" x2="${top[0]}" y2="${top[1]}" stroke="${P.v300}" stroke-width="5"/><line x1="${top[0]}" y1="${top[1]}" x2="${arm[0]}" y2="${arm[1]}" stroke="${P.v300}" stroke-width="4"/><line x1="${arm[0] - 60}" y1="${arm[1] + 10}" x2="${arm[0] - 60}" y2="${arm[1] + 120}" stroke="${P.v400}" stroke-width="2"/>` + glowDot(arm[0] - 60, arm[1] + 124, 4); return g; },
  "seg-logistica": (rnd, W, H) => { let g = `<path d="M${W * 0.08},${H * 0.75} C${W * 0.3},${H * 0.75} ${W * 0.3},${H * 0.35} ${W * 0.5},${H * 0.4} S${W * 0.78},${H * 0.6} ${W * 0.92},${H * 0.3}" fill="none" stroke="${P.v400}" stroke-width="3" stroke-dasharray="10 12" stroke-linecap="round"/>`; [[W * 0.08, H * 0.75], [W * 0.5, H * 0.4], [W * 0.92, H * 0.3]].forEach(([x, y]) => { g += glowDot(x, y, 5); }); const o = [W * 0.62, H * 0.62], s = 1; g += isoBox(-120, -40, 0, 170, 80, 90, o, s, { op: 0.9 }) + isoBox(50, -40, 0, 60, 80, 70, o, s, { op: 0.9, top: P.v300 }); [[-90, 50], [10, 50], [80, 50]].forEach(([x, y]) => { const c = iso(x, y, -6, o, s); g += `<ellipse cx="${c[0]}" cy="${c[1]}" rx="18" ry="11" fill="${P.bg0}" stroke="${P.v300}" stroke-width="2"/>`; }); return g; },
  "seg-varejo": (rnd, W, H) => { const o = [W * 0.62, H * 0.62], s = 1; let g = isoPanel(-170, -170, 0, 340, 340, o, s); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const hl = i === 1 && j === 1; g += isoBox(-150 + i * 110, -150 + j * 110, 0, 80, 80, hl ? 90 : 40 + ((i + j) % 2) * 25, o, s, { top: hl ? P.v300 : P.v400, op: 0.85 }); } const t = iso(-40, -40, 150, o, s); g += `<path d="M${t[0]},${t[1]} l-26,-26 v-44 h52 v44 z" fill="${P.v500}" stroke="${P.v300}" stroke-width="2" stroke-linejoin="round"/><circle cx="${t[0]}" cy="${t[1] - 52}" r="6" fill="${P.bg0}"/>`; return g; },
  "seg-energia": (rnd, W, H) => { const cx = W * 0.62, cy = H * 0.46; let g = `<circle cx="${cx}" cy="${cy}" r="170" fill="${P.v500}" fill-opacity=".12"/>`; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; g += `<line x1="${r1(cx + Math.cos(a) * 185)}" y1="${r1(cy + Math.sin(a) * 185)}" x2="${r1(cx + Math.cos(a) * (215 + (i % 2) * 30))}" y2="${r1(cy + Math.sin(a) * (215 + (i % 2) * 30))}" stroke="${P.v400}" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>`; } g += `<path d="M${cx + 30},${cy - 150} L${cx - 70},${cy + 20} h70 l-30,130 L${cx + 80},${cy - 30} h-70 z" fill="${P.v300}" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linejoin="round"/>`; const o = [W * 0.2, H * 0.74], s = 1; for (let i = 0; i < 3; i++) g += isoPanel(-60 + i * 70, -30, 60 + i * 0, 60, 90, o, s, P.v700, 0.85); return g; },
  "seg-servicos": (rnd, W, H) => { const cx = W * 0.62, cy = H * 0.47; let g = `<path d="M${cx - 120},${cy - 90} l-90,90 l90,90" fill="none" stroke="${P.v300}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M${cx + 120},${cy - 90} l90,90 l-90,90" fill="none" stroke="${P.v300}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><line x1="${cx + 40}" y1="${cy - 120}" x2="${cx - 40}" y2="${cy + 120}" stroke="${P.v400}" stroke-width="8" stroke-linecap="round"/>`; const pts = sample({ n: 26, box: [cx - 320, cy - 240, cx + 320, cy + 240], minD: 60, rnd, inside: (x, y) => (x - cx) ** 2 + (y - cy) ** 2 > 170 ** 2 }); g += network(pts, { rnd, op: 0.3, maxD: 160, glow: 0.3 }); return g; },
};

/* ---------- arquivos ---------- */
async function main() {
  await mkdir(OUT, { recursive: true });
  const files = [];
  // hero
  {
    const rnd = mulberry32(7), W = 1600, H = 900;
    const head = bearHead([1130, 450], 300, rnd);
    const scatter = sample({ n: 110, box: [500, 40, W - 40, H - 40], minD: 70, rnd, inside: (x, y) => !head.inside(x, y) && ((x - 1130) ** 2 + (y - 450) ** 2) > 330 ** 2 });
    const stray = scatter.slice(0, 18).map(([x, y]) => { const a = Math.atan2(y - 450, x - 1130); return `<line x1="${r1(1130 + Math.cos(a) * 300)}" y1="${r1(450 + Math.sin(a) * 300)}" x2="${r1(x)}" y2="${r1(y)}" stroke="${P.v300}" stroke-opacity=".18" stroke-width="1"/>`; }).join("");
    files.push(["hero-neural.svg", svg(W, H, defs() + network(scatter, { rnd, op: 0.13, glow: 0.14 }) + stray + head.svg)]);
  }
  // serviços e segmentos
  let seed = 11;
  for (const name of Object.keys(MOTIFS)) files.push(scene(`${name}.svg`, seed++, MOTIFS[name]));
  // plataforma (transparente)
  {
    const rnd = mulberry32(99), W = 1200, H = 900, o = [W * 0.5, H * 0.62], s = 1;
    let g = defs() + `<circle cx="${W * 0.5}" cy="${H * 0.5}" r="${H * 0.55}" fill="url(#gl)"/>`;
    g += isoPanel(-230, -170, 0, 460, 340, o, s, P.bg2, 0.95);
    g += isoPanel(-200, -140, 120, 180, 120, o, s, P.bg3, 0.95) + chart(o, s, [[-190, -60, 120], [-160, -60, 160], [-130, -60, 140], [-100, -60, 190], [-70, -60, 170], [-40, -60, 210]]);
    g += isoPanel(10, -140, 200, 200, 130, o, s, P.bg3, 0.95);
    [40, 90, 60, 120, 100].forEach((h, i) => { g += isoBox(30 + i * 36, -40, 200, 22, 22, h * 0.6, o, s, { top: i === 3 ? P.v300 : P.v400 }); });
    g += isoPanel(-60, 40, 60, 260, 120, o, s, P.bg3, 0.95);
    for (let r = 0; r < 3; r++) { const a = iso(-40, 60 + r * 32, 60, o, s), b = iso(60 + r * 40, 60 + r * 32, 60, o, s); g += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${P.v400}" stroke-width="4" stroke-linecap="round" stroke-opacity=".8"/>`; }
    const pts = sample({ n: 40, box: [40, 40, W - 40, H - 40], minD: 80, rnd, inside: (x, y) => Math.abs(x - W * 0.5) > 330 || Math.abs(y - H * 0.55) > 300 });
    g += network(pts, { rnd, op: 0.16, glow: 0.2 });
    files.push(["tech-plataforma.svg", svg(W, H, g)]);
  }
  // banner de CTA (transparente, largo)
  {
    const rnd = mulberry32(5), W = 1600, H = 600;
    const pts = sample({ n: 90, box: [W * 0.35, 20, W - 20, H - 20], minD: 80, rnd });
    files.push(["cta-banner.svg", svg(W, H, defs() + `<circle cx="${W * 0.8}" cy="${H * 0.5}" r="${H * 0.9}" fill="url(#gl)"/>` + network(pts, { rnd, op: 0.16, glow: 0.16, maxD: 220 }))]);
  }
  // mapa estático de presença
  {
    const W = 900, H = 900, k = 0.98, ox = (W - BR.w * k) / 2 - 10, oy = (H - BR.h * k) / 2;
    const sp = BR.capitals.find((c) => c.uf === "SP");
    const X = (x) => r1(ox + x * k), Y = (y) => r1(oy + y * k);
    let g = defs() + `<circle cx="${X(sp.x)}" cy="${Y(sp.y)}" r="300" fill="url(#gl)"/>`;
    g += BR.states.map((s) => `<path d="${s.d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (m, x, y) => `${X(+x)},${Y(+y)}`)}" fill="${P.v500}" fill-opacity="${s.uf === "SP" ? 0.4 : 0.07}" stroke="${s.uf === "SP" ? P.v300 : P.v400}" stroke-opacity=".7" stroke-width="1.2" stroke-linejoin="round"/>`).join("");
    g += BR.capitals.filter((c) => c !== sp).map((c) => { const mx = (sp.x + c.x) / 2, my = (sp.y + c.y) / 2, dx = c.x - sp.x, dy = c.y - sp.y; return `<path d="M${X(sp.x)},${Y(sp.y)} Q${X(mx - dy * 0.18)},${Y(my + dx * 0.18)} ${X(c.x)},${Y(c.y)}" fill="none" stroke="${P.v300}" stroke-opacity=".35" stroke-width="1"/>` + glowDot(X(c.x), Y(c.y), 3); }).join("");
    g += `<circle cx="${X(sp.x)}" cy="${Y(sp.y)}" r="26" fill="${P.v400}" fill-opacity=".35"/><circle cx="${X(sp.x)}" cy="${Y(sp.y)}" r="9" fill="#fff"/>`;
    files.push(["brasil-presenca.svg", svg(W, H, g)]);
  }
  // OG image (com fundo)
  {
    const rnd = mulberry32(21), W = 1200, H = 630;
    const head = bearHead([900, 330], 210, rnd, { density: 0.8 });
    const pts = sample({ n: 80, box: [30, 30, 680, H - 30], minD: 70, rnd });
    files.push(["og-image.svg", svg(W, H, defs() + `<rect width="${W}" height="${H}" fill="${P.bg0}"/><circle cx="900" cy="330" r="420" fill="url(#gl)"/>` + network(pts, { rnd, op: 0.14, glow: 0.14 }) + head.svg)]);
  }
  // favicon: urso geométrico simplificado (legível a 16 px)
  files.push(["favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><defs><linearGradient id="h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.v400}"/><stop offset="1" stop-color="${P.v700}"/></linearGradient></defs><circle cx="16" cy="18" r="11" fill="${P.v500}"/><circle cx="48" cy="18" r="11" fill="${P.v500}"/><circle cx="16" cy="18" r="5" fill="${P.v700}"/><circle cx="48" cy="18" r="5" fill="${P.v700}"/><circle cx="32" cy="36" r="24" fill="url(#h)"/><polygon points="32,12 56,36 32,60" fill="#fff" fill-opacity=".08"/><polygon points="8,36 32,12 32,36" fill="#fff" fill-opacity=".14"/><ellipse cx="32" cy="45" rx="12" ry="9" fill="${P.v300}"/><circle cx="23" cy="31" r="3.2" fill="${P.bg0}"/><circle cx="41" cy="31" r="3.2" fill="${P.bg0}"/><path d="M27,42 h10 l-5,5 z" fill="${P.bg0}"/></svg>`]);
  // grão
  files.push(["noise.svg", `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .25 0"/></filter><rect width="256" height="256" filter="url(#n)"/></svg>`]);

  for (const [name, body] of files) await writeFile(join(OUT, name), body);
  console.log(files.map(([n, b]) => `${n.padEnd(24)} ${(Buffer.byteLength(b) / 1024).toFixed(1)} KB`).join("\n"));
}
main();
