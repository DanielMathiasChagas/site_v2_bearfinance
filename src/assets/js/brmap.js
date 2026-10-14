/* Bear Finance — mapa neural do Brasil (Canvas 2D, sem dependências).
   Lê window.BR_GEO (gerado no build a partir de src/brazil-geo.js, malha IBGE).
   Desktop com ponteiro fino: animação a ~30 fps com parallax e brilho ao redor do cursor.
   Reduced motion / toque / telas pequenas: um quadro estático. Sem BR_GEO ou erro: fica o SVG de fallback. */
(() => {
  "use strict";

  const init = () => {
    const els = document.querySelectorAll("[data-brmap]");
    if (!els.length) return;
    const GEO = window.BR_GEO;
    if (!GEO || !Array.isArray(GEO.states) || !Array.isArray(GEO.capitals)) { console.warn("[brmap] BR_GEO indisponível; mapa estático mantido."); return; }
    els.forEach((el) => { try { mount(el, GEO); } catch (err) { console.warn("[brmap] falha ao iniciar; mapa estático mantido.", err && err.message); } });
  };
  /* ---------- utilitários ---------- */
  function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function parsePath(d) { // "M x,y x,y … Z" (vários subpaths), coordenadas absolutas
    const polys = []; let cur = null;
    const tokens = String(d).replace(/([MLZmlz])/g, " $1 ").trim().split(/\s+/);
    for (const t of tokens) {
      if (t === "M" || t === "m") { cur = []; polys.push(cur); continue; }
      if (t === "L" || t === "l") continue;
      if (t === "Z" || t === "z") { cur = null; continue; }
      const c = t.split(","); if (c.length !== 2) continue;
      if (!cur) { cur = []; polys.push(cur); }
      cur.push(+c[0], +c[1]);
    }
    return polys.filter((p) => p.length >= 6);
  }
  function inPoly(x, y, p) {
    let inside = false;
    for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2) {
      const xi = p[i], yi = p[i + 1], xj = p[j], yj = p[j + 1];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  const rgba = (hex, a) => { const n = parseInt(hex.replace("#", ""), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };

  /* ---------- montagem ---------- */
  function mount(el, GEO) {
    const canvas = el.querySelector("canvas");
    const ctx = canvas && canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const label = el.querySelector(".br-neural__label");
    const debug = el.hasAttribute("data-brmap-debug");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = matchMedia("(hover: none), (pointer: coarse)").matches || innerWidth < 768;
    const live = !reduce && !coarse;
    const DPR = Math.min(devicePixelRatio || 1, live ? 2 : 1.5);
    const cs = getComputedStyle(document.documentElement);
    const tok = (v, fb) => { const s = (cs.getPropertyValue(v) || "").trim(); return /^#[0-9a-f]{6}$/i.test(s) ? s : fb; };
    const V300 = tok("--violet-300", "#c4b5fd"), V400 = tok("--violet-400", "#a78bfa"), V500 = tok("--violet-500", "#8b5cf6"), V700 = tok("--violet-700", "#5b21b6");

    // --- malha e nós (pré-calculados uma vez) ---
    const W = GEO.w, H = GEO.h, cx = W / 2, cy = H / 2;
    const hubUf = el.dataset.focus || "SP";
    const caps = GEO.capitals;
    const hub = caps.find((c) => c.uf === hubUf) || caps[0];
    const polys = [];
    GEO.states.forEach((s) => parsePath(s.d).forEach((pts) => polys.push({ uf: s.uf, pts, bb: bbox(pts) })));
    function bbox(p) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let i = 0; i < p.length; i += 2) { if (p[i] < x0) x0 = p[i]; if (p[i] > x1) x1 = p[i]; if (p[i + 1] < y0) y0 = p[i + 1]; if (p[i + 1] > y1) y1 = p[i + 1]; } return [x0, y0, x1, y1]; }
    const inside = (x, y) => polys.some((p) => x >= p.bb[0] && x <= p.bb[2] && y >= p.bb[1] && y <= p.bb[3] && inPoly(x, y, p.pts));
    const rnd = mulberry32(20261014);
    const nodes = caps.map((c) => ({ x: c.x, y: c.y, cap: true, uf: c.uf, city: c.city, phase: rnd() * 6.283, r: c === hub ? 5.5 : 3 }));
    const hubIdx = caps.indexOf(hub);
    for (let tries = 0; nodes.length < caps.length + 72 && tries < 6000; tries++) {
      const x = rnd() * W, y = rnd() * H;
      if (!inside(x, y)) continue;
      let ok = true;
      for (const n of nodes) if ((n.x - x) * (n.x - x) + (n.y - y) * (n.y - y) < 30 * 30) { ok = false; break; }
      if (ok) nodes.push({ x, y, cap: false, phase: rnd() * 6.283, r: 1 + rnd() * 1.1 });
    }
    const N = nodes.length;
    // ligações: 2–3 vizinhos mais próximos até 115 unidades
    const links = [], seen = new Set();
    nodes.forEach((n, i) => {
      const near = [];
      for (let j = 0; j < N; j++) { if (j === i) continue; const d = (nodes[j].x - n.x) ** 2 + (nodes[j].y - n.y) ** 2; if (d < 115 * 115) near.push([j, d]); }
      near.sort((a, b) => a[1] - b[1]).slice(0, 2 + (i % 2)).forEach(([j]) => { const k = i < j ? i * N + j : j * N + i; if (!seen.has(k)) { seen.add(k); links.push(i, j); } });
    });
    // arcos hub → capitais (quadrático com elevação; amostrados)
    const SEG = 26;
    const arcs = [];
    for (let i = 0; i < caps.length; i++) {
      if (i === hubIdx) continue;
      const dx = nodes[i].x - hub.x, dy = nodes[i].y - hub.y, dist = Math.hypot(dx, dy);
      const lift = 30 + dist * 0.38;
      const pts = new Float32Array(SEG * 3);
      for (let k = 0; k < SEG; k++) { const t = k / (SEG - 1); pts[k * 3] = hub.x + dx * t; pts[k * 3 + 1] = hub.y + dy * t; pts[k * 3 + 2] = 4 * (1 - t) * t * lift; }
      arcs.push({ to: i, pts });
    }
    const pulses = [];
    for (let k = 0; k < 12; k++) pulses.push({ arc: Math.floor(rnd() * arcs.length), t: rnd(), v: 0.0022 + rnd() * 0.0028 });

    // --- buffers (sem alocação no loop) ---
    let totalPts = 0; polys.forEach((p) => { totalPts += p.pts.length / 2; });
    const polyBuf = new Float32Array(totalPts * 2);
    const px = new Float32Array(N), py = new Float32Array(N), ps = new Float32Array(N), boost = new Float32Array(N);
    const arcBuf = new Float32Array(SEG * 2);

    // --- câmera ---
    const TILT0 = 0.94, YAW0 = -0.16;
    let tilt = TILT0, yaw = YAW0, tTilt = TILT0, tYaw = YAW0;
    let vw = 1, vh = 1, scale = 1, ox = 0, oy = 0, f = 1000;
    let cosY = 1, sinY = 0, cosT = 1, sinT = 0;
    const setTrig = () => { cosY = Math.cos(yaw); sinY = Math.sin(yaw); cosT = Math.cos(tilt); sinT = Math.sin(tilt); };
    // projeta (x,y da malha; h = elevação) → out[o], out[o+1] = tela; retorna o fator de perspectiva
    const project = (x, y, h, out, o) => {
      const x0 = x - cx, z0 = y - cy;
      const x1 = x0 * cosY - z0 * sinY, z1 = x0 * sinY + z0 * cosY;
      const sy = z1 * cosT - h * sinT;
      const depth = (z1 * sinT + h * cosT) * scale;
      const s = f / (f - depth);
      out[o] = ox + x1 * scale * s; out[o + 1] = oy + sy * scale * s;
      return s;
    };

    // --- interação ---
    let mx = -1e5, my = -1e5, hovered = -1;
    const setLabel = (i) => {
      if (!label) return;
      if (i >= 0 && nodes[i].cap && i !== hubIdx) label.innerHTML = `<strong>${nodes[i].city}</strong><span>${nodes[i].uf} · atendimento digital</span>`;
      else label.innerHTML = `<strong>${hub.city}</strong><span>Sede</span>`;
    };
    if (live) {
      el.addEventListener("pointermove", (e) => {
        const r = canvas.getBoundingClientRect();
        mx = e.clientX - r.left; my = e.clientY - r.top;
        tYaw = YAW0 + (mx / vw - 0.5) * 0.1; tTilt = TILT0 + (my / vh - 0.5) * 0.09;
      });
      el.addEventListener("pointerleave", () => { mx = my = -1e5; tYaw = YAW0; tTilt = TILT0; });
    }

    // --- desenho ---
    const C_FILL = rgba(V500, 0.05), C_FILL_HUB = rgba(V500, 0.22), C_STROKE = rgba(V400, 0.32);
    function render(now) {
      tilt += (tTilt - tilt) * 0.06; yaw += (tYaw - yaw) * 0.06; setTrig();
      ctx.clearRect(0, 0, vw, vh);
      ctx.globalCompositeOperation = "source-over";

      // sombra de flutuação
      const shY = oy + H * cosT * scale * 0.52;
      const g = ctx.createRadialGradient(ox, shY, 0, ox, shY, W * scale * 0.55);
      g.addColorStop(0, rgba(V700, 0.28)); g.addColorStop(1, rgba(V700, 0));
      ctx.save(); ctx.translate(ox, shY); ctx.scale(1, 0.32); ctx.translate(-ox, -shY);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ox, shY, W * scale * 0.55, 0, 6.283); ctx.fill(); ctx.restore();

      // estados
      ctx.lineJoin = "round"; ctx.lineWidth = 1;
      let o = 0;
      for (const p of polys) {
        const pts = p.pts, start = o;
        for (let i = 0; i < pts.length; i += 2, o += 2) project(pts[i], pts[i + 1], 0, polyBuf, o);
        ctx.beginPath(); ctx.moveTo(polyBuf[start], polyBuf[start + 1]);
        for (let i = start + 2; i < o; i += 2) ctx.lineTo(polyBuf[i], polyBuf[i + 1]);
        ctx.closePath();
        const isHub = p.uf === hub.uf;
        ctx.fillStyle = isHub ? C_FILL_HUB : C_FILL; ctx.fill();
        ctx.strokeStyle = isHub ? V300 : C_STROKE; ctx.lineWidth = isHub ? 1.4 : 1; ctx.stroke();
      }

      // nós projetados + brilho pelo cursor
      let bestD = 18 * 18, best = -1;
      for (let i = 0; i < N; i++) {
        const x0 = nodes[i].x - cx, z0 = nodes[i].y - cy;
        const x1 = x0 * cosY - z0 * sinY, z1 = x0 * sinY + z0 * cosY;
        const depth = z1 * sinT * scale, s = f / (f - depth);
        px[i] = ox + x1 * scale * s; py[i] = oy + z1 * cosT * scale * s; ps[i] = s;
        const dx = px[i] - mx, dy = py[i] - my, d2 = dx * dx + dy * dy;
        boost[i] = d2 < 120 * 120 ? 1 - Math.sqrt(d2) / 120 : 0;
        if (nodes[i].cap && d2 < bestD) { bestD = d2; best = i; }
      }
      if (best !== hovered) { hovered = best; setLabel(best); }

      // malha neural
      ctx.lineWidth = 1;
      for (let k = 0; k < links.length; k += 2) {
        const i = links[k], j = links[k + 1];
        const b = Math.max(boost[i], boost[j]);
        ctx.strokeStyle = rgba(V300, 0.1 + b * 0.5);
        ctx.beginPath(); ctx.moveTo(px[i], py[i]); ctx.lineTo(px[j], py[j]); ctx.stroke();
      }

      // arcos + pulsos
      const hubB = boost[hubIdx];
      for (let a = 0; a < arcs.length; a++) {
        const arc = arcs[a], pts = arc.pts;
        for (let k = 0; k < SEG; k++) project(pts[k * 3], pts[k * 3 + 1], pts[k * 3 + 2], arcBuf, k * 2);
        const alpha = 0.16 + boost[arc.to] * 0.55 + hubB * 0.15;
        ctx.strokeStyle = rgba(V300, alpha); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(arcBuf[0], arcBuf[1]);
        for (let k = 1; k < SEG; k++) ctx.lineTo(arcBuf[k * 2], arcBuf[k * 2 + 1]);
        ctx.stroke();
        if (alpha > 0.3) { ctx.strokeStyle = rgba(V400, (alpha - 0.3) * 0.5); ctx.lineWidth = 3; ctx.stroke(); }
        // pulsos deste arco
        ctx.globalCompositeOperation = "lighter";
        for (const pu of pulses) {
          if (pu.arc !== a) continue;
          for (let tr = 0; tr < 4; tr++) {
            const t = pu.t - tr * 0.025; if (t < 0) continue;
            const fi = t * (SEG - 1), k = Math.floor(fi), fr = fi - k, k2 = Math.min(k + 1, SEG - 1);
            const x = arcBuf[k * 2] + (arcBuf[k2 * 2] - arcBuf[k * 2]) * fr, y = arcBuf[k * 2 + 1] + (arcBuf[k2 * 2 + 1] - arcBuf[k * 2 + 1]) * fr;
            ctx.fillStyle = rgba(tr ? V400 : "#ffffff", (0.9 - tr * 0.22) * (0.6 + boost[arc.to] * 0.4));
            ctx.beginPath(); ctx.arc(x, y, tr ? 1.4 : 2.2, 0, 6.283); ctx.fill();
          }
        }
        ctx.globalCompositeOperation = "source-over";
      }

      // nós
      ctx.globalCompositeOperation = "lighter";
      const tw = now / 1000;
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        if (i === hubIdx) continue;
        const twk = 0.55 + 0.45 * Math.sin(tw * 1.3 + n.phase);
        const b = boost[i];
        const r = n.r * ps[i] * (1 + b * 0.7);
        ctx.fillStyle = rgba(V400, (n.cap ? 0.22 : 0.12) + b * 0.3);
        ctx.beginPath(); ctx.arc(px[i], py[i], r * 3.2, 0, 6.283); ctx.fill();
        ctx.fillStyle = rgba(n.cap ? V300 : V400, (n.cap ? 0.95 : 0.7) * twk + b * 0.3);
        ctx.beginPath(); ctx.arc(px[i], py[i], r, 0, 6.283); ctx.fill();
        if (n.cap) { ctx.fillStyle = rgba("#ffffff", 0.6 * twk + b * 0.4); ctx.beginPath(); ctx.arc(px[i], py[i], r * 0.45, 0, 6.283); ctx.fill(); }
      }
      // hub
      const hx = px[hubIdx], hy = py[hubIdx], hs = ps[hubIdx];
      const breathe = 1 + 0.08 * Math.sin(tw * 1.1);
      ctx.fillStyle = rgba(V500, 0.18); ctx.beginPath(); ctx.arc(hx, hy, 34 * hs * breathe, 0, 6.283); ctx.fill();
      ctx.fillStyle = rgba(V400, 0.35); ctx.beginPath(); ctx.arc(hx, hy, 16 * hs * breathe, 0, 6.283); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = rgba("#ffffff", 0.55); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(hx, hy, (13 + 3 * Math.sin(tw * 1.1)) * hs, 0, 6.283); ctx.stroke();
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(hx, hy, 5.5 * hs, 0, 6.283); ctx.fill();

      // avanço dos pulsos
      if (live) for (const pu of pulses) { pu.t += pu.v; if (pu.t > 1.05) { pu.t = -0.02; pu.arc = Math.floor(rnd() * arcs.length); } }
    }

    // --- tamanho e laço ---
    function resize() {
      const r = el.getBoundingClientRect();
      vw = Math.max(1, Math.round(r.width)); vh = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(vw * DPR); canvas.height = Math.round(vh * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      scale = Math.min((vw * 0.88) / W, (vh * 0.8) / (H * Math.cos(TILT0) + 80));
      ox = vw / 2; oy = vh * 0.55; f = Math.max(vw, vh) * 1.6;
      if (!live) { tilt = tTilt; yaw = tYaw; render(0); }
    }
    resize();
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(el); else addEventListener("resize", resize);
    el.classList.add("is-live");
    setLabel(-1);
    if (!live) return;

    let running = false, inView = true, last = 0, frames = 0, acc = 0, lastLog = 0;
    const loop = (now) => {
      if (!running) return;
      if (now - last >= 33) {
        const t0 = debug ? performance.now() : 0;
        render(now); last = now;
        if (debug) { acc += performance.now() - t0; frames++; if (now - lastLog > 5000) { console.info(`[brmap] ${(acc / frames).toFixed(2)} ms/quadro (${frames} quadros)`); frames = 0; acc = 0; lastLog = now; } }
      }
      requestAnimationFrame(loop);
    };
    const setRun = () => { const want = inView && !document.hidden; if (want && !running) { running = true; requestAnimationFrame(loop); } else if (!want) running = false; };
    if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { inView = e.isIntersecting; setRun(); }, { rootMargin: "120px" }).observe(el);
    document.addEventListener("visibilitychange", setRun);
    render(performance.now());
    setRun();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
