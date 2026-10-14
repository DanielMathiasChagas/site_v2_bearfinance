/* Bear Finance — comportamentos do site (sem dependências externas) */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const body = document.body;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CHECK = '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 5-5"/></svg>';

  /* ---------- mensuração (só envia se houver dataLayer/GTM configurado) ---------- */
  const track = (event, props = {}) => { try { if (window.dataLayer) window.dataLayer.push({ event, ...props }); } catch (_) { /* noop */ } };
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-track]");
    if (t) track(t.dataset.track, { label: t.dataset.label || t.textContent.trim().slice(0, 60), href: t.getAttribute("href") || "" });
  });

  /* ---------- estado de rolagem ---------- */
  let scrolled = null;
  const onScroll = () => { const s = scrollY > 60; if (s !== scrolled) { scrolled = s; body.classList.toggle("is-scrolled", s); } };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- navegação (desktop: hover/foco; mobile: drawer; teclado: botões) ---------- */
  const burger = $(".burger"), nav = $("#site-navigation");
  const closeSubs = (except) => $$(".nav__item.is-open").forEach((li) => { if (li !== except) { li.classList.remove("is-open"); const b = $("button[aria-expanded]", li); if (b) b.setAttribute("aria-expanded", "false"); } });
  const setNav = (open) => { body.classList.toggle("nav-open", open); if (burger) burger.setAttribute("aria-expanded", String(open)); if (!open) closeSubs(); };
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = !body.classList.contains("nav-open");
      setNav(open);
      if (open) requestAnimationFrame(() => requestAnimationFrame(() => { const f = $("a, button", nav); if (f) f.focus({ preventScroll: true }); }));
    });
    nav.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || !body.classList.contains("nav-open")) return;
      const f = $$("a, button", nav).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); burger.focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); burger.focus(); }
    });
    const mq = matchMedia("(min-width: 992px)");
    (mq.addEventListener ? mq.addEventListener("change", (e) => { if (e.matches) setNav(false); }) : mq.addListener((e) => { if (e.matches) setNav(false); }));
  }
  $$(".nav__item.has-sub > button").forEach((b) => b.addEventListener("click", () => {
    const li = b.parentElement, open = !li.classList.contains("is-open");
    closeSubs(li); li.classList.toggle("is-open", open); b.setAttribute("aria-expanded", String(open));
  }));
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (body.classList.contains("nav-open")) { setNav(false); if (burger) burger.focus(); }
    else closeSubs();
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".nav__item")) closeSubs(); });

  /* ---------- texto digitado do hero ---------- */
  const typed = $(".typed");
  if (typed) {
    let words = [];
    try { words = JSON.parse(typed.dataset.words || "[]"); } catch (_) { /* noop */ }
    if (words.length > 1 && !reduceMotion) {
      let wi = 0, ci = words[0].length, erasing = true;
      const tick = () => {
        const w = words[wi];
        if (erasing) { ci--; typed.textContent = w.slice(0, ci); if (ci <= 0) { erasing = false; wi = (wi + 1) % words.length; } setTimeout(tick, 70); }
        else { ci++; typed.textContent = words[wi].slice(0, ci); if (ci >= words[wi].length) { erasing = true; setTimeout(tick, 2200); } else setTimeout(tick, 110); }
      };
      setTimeout(tick, 2400);
    }
  }

  /* ---------- vídeo de fundo (quando houver .mp4) ---------- */
  const vdHome = $("#video-home");
  if (vdHome && vdHome.dataset.video && !reduceMotion) {
    vdHome.insertAdjacentHTML("beforeend", `<video preload="auto" autoplay muted playsinline loop src="${vdHome.dataset.video}"></video>`);
    vdHome.classList.add("active");
  }

  /* ---------- revelação ao rolar ---------- */
  $$(".reveal-group").forEach((g) => [...g.children].forEach((c, i) => { if (!c.style.getPropertyValue("--i")) c.style.setProperty("--i", i); }));
  const targets = $$(".reveal, .reveal-group");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    targets.forEach((el) => io.observe(el));
  } else targets.forEach((el) => el.classList.add("in"));

  /* ---------- FAQ (botões acessíveis) ---------- */
  $$(".faq__q").forEach((btn) => btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", String(!open));
    if (panel) panel.hidden = open;
  }));

  /* ---------- abas (ARIA) ---------- */
  $$('[role="tablist"]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    const activate = (tab) => tabs.forEach((t) => { const on = t === tab; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; const p = document.getElementById(t.getAttribute("aria-controls")); if (p) p.hidden = !on; });
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => activate(t));
      t.addEventListener("keydown", (e) => {
        const map = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 };
        if (e.key in map) { e.preventDefault(); tabs[map[e.key]].focus(); activate(tabs[map[e.key]]); }
      });
    });
  });

  /* ---------- vídeos (carregam só ao clicar) ---------- */
  $$(".video__poster").forEach((poster) => poster.addEventListener("click", () => {
    const box = poster.parentElement;
    if (poster.dataset.embed) {
      const f = document.createElement("iframe");
      f.src = `https://www.youtube-nocookie.com/embed/${poster.dataset.embed}?autoplay=1&rel=0`;
      f.allow = "autoplay; encrypted-media; picture-in-picture"; f.allowFullscreen = true; f.title = poster.dataset.title || "Vídeo";
      box.appendChild(f); poster.remove();
    } else if (poster.dataset.src) {
      const v = document.createElement("video");
      v.src = poster.dataset.src; v.controls = true; v.autoplay = true; v.playsInline = true;
      box.appendChild(v); poster.remove();
    } else { poster.classList.add("shake"); setTimeout(() => poster.classList.remove("shake"), 600); }
  }));

  /* ---------- mapa neural: scripts só em desktop com ponteiro fino (mobile vê a imagem estática) ---------- */
  const mapEl = $("[data-brmap][data-src]");
  if (mapEl && !reduceMotion && matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)").matches) {
    const loadMap = () => {
      const g = document.createElement("script"); g.src = mapEl.dataset.geo;
      g.onload = () => { const s = document.createElement("script"); s.src = mapEl.dataset.src; document.head.appendChild(s); };
      g.onerror = () => console.warn("[brmap] malha indisponível; mapa estático mantido.");
      document.head.appendChild(g);
    };
    if ("IntersectionObserver" in window) { const io = new IntersectionObserver((en) => { if (en.some((e) => e.isIntersecting)) { io.disconnect(); loadMap(); } }, { rootMargin: "700px" }); io.observe(mapEl); } else loadMap();
  }

  /* ---------- carrossel (scroll-snap nativo, sem dependências) ---------- */
  $$("[data-carousel]").forEach((c) => {
    const track = $(".carousel__track", c), items = [...track.children], dots = $(".carousel__dots", c);
    const wrap = c.parentElement;
    const prev = $("[data-carousel-prev]", wrap), next = $("[data-carousel-next]", wrap);
    if (!items.length) return;
    const behavior = reduceMotion ? "auto" : "smooth";
    const left = (it) => it.offsetLeft - track.offsetLeft;
    const maxX = () => track.scrollWidth - track.clientWidth - 2;
    const current = () => { const x = track.scrollLeft; let idx = 0, best = Infinity; items.forEach((it, i) => { const d = Math.abs(left(it) - x); if (d < best) { best = d; idx = i; } }); return idx; };
    const goTo = (i) => track.scrollTo({ left: left(items[Math.max(0, Math.min(items.length - 1, i))]), behavior });
    if (prev) prev.addEventListener("click", () => goTo(current() - 1));
    if (next) next.addEventListener("click", () => goTo(current() + 1));
    if (dots) items.forEach((it, i) => { const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", `Ir para o segmento ${i + 1} de ${items.length}`); b.addEventListener("click", () => goTo(i)); dots.appendChild(b); });
    const update = () => {
      const idx = current(), x = track.scrollLeft;
      if (dots) [...dots.children].forEach((b, i) => b.setAttribute("aria-current", String(i === idx)));
      if (prev) prev.toggleAttribute("disabled", x <= 2);
      if (next) next.toggleAttribute("disabled", x >= maxX());
    };
    let raf = 0;
    track.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
    addEventListener("resize", update);
    track.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") { e.preventDefault(); goTo(current() + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current() - 1); } });
    update();
    if (!reduceMotion) {
      let paused = false, inView = false;
      const stop = () => { paused = true; };
      ["pointerenter", "focusin", "touchstart"].forEach((ev) => c.addEventListener(ev, stop, { passive: true }));
      if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { inView = e.isIntersecting; }).observe(c);
      setInterval(() => { if (paused || !inView || document.hidden) return; track.scrollLeft >= maxX() ? goTo(0) : goTo(current() + 1); }, 5000);
    }
  });

  /* ---------- filtro de conteúdo ---------- */
  $$(".filters button[data-filter]").forEach((btn) => btn.addEventListener("click", () => {
    const cat = btn.dataset.filter;
    $$(".filters button[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    $$("[data-category]").forEach((it) => { it.hidden = cat !== "all" && it.dataset.category !== cat; });
  }));
  if (location.hash && $(".filters")) {
    const want = decodeURIComponent(location.hash.slice(1));
    const b = $$(".filters button[data-filter]").find((x) => x.dataset.filter === want);
    if (b) b.click();
  }

  /* ---------- máscara de telefone (00) 00000-0000 ---------- */
  $$('[data-mask="phone"]').forEach((inp) => inp.addEventListener("input", () => {
    const d = inp.value.replace(/\D/g, "").slice(0, 11);
    let v = d;
    if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 6) v = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    inp.value = v;
  }));

  /* ---------- formulários → API ---------- */
  const params = new URLSearchParams(location.search);
  $$("form[data-api]:not([data-wa-form])").forEach((form) => {
    if (form.elements.ts) form.elements.ts.value = String(Date.now());
    if (form.elements.origem) form.elements.origem.value = location.pathname;
    ["servico", "segmento"].forEach((k) => { const v = params.get(k), el = form.elements[k]; if (v && el && [...el.options].some((o) => o.value === v)) el.value = v; });
    const msg = $(".form__msg, .message", form);
    const mark = (el, bad) => { const f = el.closest(".field"); if (f) f.classList.toggle("is-invalid", bad); if (bad) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid"); };
    $$("input, select, textarea", form).forEach((el) => el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true" && el.checkValidity()) mark(el, false); }));
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let first = null;
      $$("input, select, textarea", form).forEach((el) => { if (el.type === "hidden" || el.classList.contains("hp")) return; const bad = !el.checkValidity(); mark(el, bad); if (bad && !first) first = el; });
      if (first) { first.focus(); if (msg) { msg.className = "form__msg is-err"; msg.textContent = first.type === "checkbox" ? "Marque a autorização para continuar." : "Revise os campos destacados."; } return; }
      const btn = $('[type="submit"]', form);
      if (btn) btn.setAttribute("aria-busy", "true");
      if (msg) { msg.className = "form__msg"; msg.textContent = "Enviando…"; }
      try {
        const data = Object.fromEntries(new FormData(form));
        const res = await fetch(form.dataset.api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Não foi possível enviar.");
        track("form_submit_ok", { form: form.dataset.form || form.dataset.api });
        if (form.dataset.form === "diagnostico") {
          const waHref = form.dataset.wa;
          form.innerHTML = `<div class="form__done" role="status">${CHECK}<h3>Recebemos a sua solicitação</h3><p>${json.message || "Em breve um especialista entra em contato."}</p>${waHref ? `<a class="btn btn--wa" href="${waHref}" target="_blank" rel="noopener" data-track="whatsapp_click">Adiantar pelo WhatsApp</a>` : ""}</div>`;
          form.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
        } else {
          form.reset();
          if (form.elements.ts) form.elements.ts.value = String(Date.now());
          if (msg) { msg.className = "form__msg is-ok"; msg.textContent = json.message || "Recebido! Em breve entraremos em contato."; }
        }
      } catch (err) {
        if (msg) { msg.className = "form__msg is-err"; msg.textContent = `${err.message} Se preferir, fale conosco pelo WhatsApp.`; }
      } finally { if (btn) btn.removeAttribute("aria-busy"); }
    });
  });

  /* ---------- cookies ---------- */
  const cookie = $(".cookie");
  if (cookie) {
    let choice = null;
    try { choice = localStorage.getItem("bf-cookies"); } catch (_) { /* noop */ }
    if (!choice) cookie.hidden = false;
    $$("[data-cookie]", cookie).forEach((b) => b.addEventListener("click", () => {
      try { localStorage.setItem("bf-cookies", b.dataset.cookie); } catch (_) { /* noop */ }
      cookie.hidden = true;
      track("cookie_choice", { choice: b.dataset.cookie });
    }));
  }

  /* ---------- compartilhar ---------- */
  $$("[data-share]").forEach((b) => b.addEventListener("click", async () => {
    const url = location.href, title = document.title;
    const kind = b.dataset.share;
    if (kind === "linkedin") open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener");
    else if (kind === "whatsapp") open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, "_blank", "noopener");
    else if (kind === "copy") { try { await navigator.clipboard.writeText(url); b.setAttribute("aria-label", "Link copiado"); b.classList.add("is-ok"); setTimeout(() => { b.setAttribute("aria-label", "Copiar link"); b.classList.remove("is-ok"); }, 1800); } catch (_) { prompt("Copie o link:", url); } }
  }));

  /* ---------- diversos ---------- */
  $$(".totop").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); }));
  $$("[data-job]").forEach((a) => a.addEventListener("click", () => { const s = $("#c-vaga"); if (s) s.value = a.dataset.job; }));

  /* ---------- parcerias: formulário em 2 etapas → WhatsApp ---------- */
  $$("form[data-wa-form]").forEach((form) => {
    const box = form.closest(".pform");
    const steps = $$(".pform-step", form);
    const bar = $(".pform-progress span", box);
    const labels = $$(".pform-steps li", box);
    const status = $(".form__msg, .message", form);
    const done = $(".pform-done", form);
    if (form.elements.ts) form.elements.ts.value = String(Date.now());
    const go = (n) => {
      steps.forEach((st, i) => { st.hidden = i !== n; });
      labels.forEach((li, i) => { li.classList.toggle("on", i <= n); });
      if (bar) bar.style.width = `${((n + 1) / steps.length) * 100}%`;
      const first = $("input:not([type=hidden]), select, textarea", steps[n]);
      if (first) first.focus({ preventScroll: true });
    };
    const valid = (st) => {
      for (const el of $$("input, select, textarea", st)) {
        if (el.type === "radio" || el.type === "checkbox") continue;
        if (!el.checkValidity()) { el.reportValidity(); return false; }
      }
      for (const fs of $$(".chips", st)) {
        const req = $("input[required]", fs);
        if (req && !$("input:checked", fs)) { req.reportValidity(); return false; }
      }
      const lgpd = $('input[name="lgpd"]', st);
      if (lgpd && !lgpd.checked) { lgpd.reportValidity(); return false; }
      return true;
    };
    $$("[data-next]", form).forEach((b) => b.addEventListener("click", () => { if (valid(steps[0])) go(1); }));
    $$("[data-prev]", form).forEach((b) => b.addEventListener("click", () => go(0)));
    steps[0].addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.tagName === "INPUT") { e.preventDefault(); if (valid(steps[0])) go(1); } });
    const collect = () => {
      const data = {}, order = [], labelOf = {};
      $$("input, select, textarea", form).forEach((el) => {
        if (!el.name || el.name === "website" || el.disabled) return;
        if ((el.type === "checkbox" || el.type === "radio") && !el.checked) return;
        const v = (el.value || "").trim();
        if (!v) return;
        if (!(el.name in data)) { order.push(el.name); data[el.name] = v; } else data[el.name] += ", " + v;
        if (el.dataset.label) labelOf[el.name] = el.dataset.label;
      });
      return { data, order, labelOf };
    };
    const message = ({ data, order, labelOf }) => [`Olá! Quero ser *${data.programa}* da Bear Finance.`, "", ...order.filter((k) => labelOf[k] && k !== "lgpd").map((k) => `*${labelOf[k]}:* ${data[k]}`)].join("\n");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!valid(steps[0])) return go(0);
      if (!valid(steps[1])) return;
      if (form.elements.website && form.elements.website.value) return;
      const c = collect();
      const url = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(message(c))}`;
      const win = open(url, "_blank");
      if (win) { try { win.opener = null; } catch (_) { /* noop */ } }
      try { fetch(form.dataset.api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c.data), keepalive: true }).catch(() => {}); } catch (_) { /* noop */ }
      track("partner_form_submit", { programa: c.data.programa });
      steps.forEach((st) => { st.hidden = true; });
      if (bar) bar.style.width = "100%";
      labels.forEach((li) => li.classList.add("on"));
      const again = $("[data-wa-open]", done);
      if (again) again.href = url;
      done.hidden = false;
      if (status) status.textContent = "";
      if (!win) location.href = url;
    });
  });

  /* ---------- ondas animadas do hero (WebGL, só na home) ---------- */
  const FRAG = `
precision mediump float;
uniform vec2 uRes; uniform float uTime;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes.y;
  float T = uTime * 0.035;
  vec2 p = uv * 2.0 + vec2(T * 0.7, T * 0.35);
  vec2 q = vec2(fbm(p + vec2(0.0, T)), fbm(p + vec2(5.2, 1.3) - T));
  vec2 w = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + T * 1.6), fbm(p + 3.0 * q + vec2(8.3, 2.8) - T * 1.2));
  float f = fbm(p + 3.5 * w);
  vec3 deep = vec3(0.03, 0.02, 0.06), mid = vec3(0.18, 0.08, 0.40), lil = vec3(0.55, 0.42, 0.90);
  vec3 col = mix(deep, mid, smoothstep(0.25, 0.75, f));
  col = mix(col, lil, smoothstep(0.58, 0.85, f) * 0.5);
  gl_FragColor = vec4(col, 1.0);
}`;
  const VERT = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";
  $$("canvas.fx-waves").forEach((cv) => {
    let gl = null;
    try { gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }); } catch (_) { gl = null; }
    if (!gl) return;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes"), uTime = gl.getUniformLocation(prog, "uTime");
    const SCALE = 0.4;
    const resize = () => {
      const w = Math.min(cv.clientWidth, 1600) * SCALE, h = Math.min(cv.clientHeight, 1000) * SCALE;
      cv.width = Math.max(1, Math.round(w)); cv.height = Math.max(1, Math.round(h));
      gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(uRes, cv.width, cv.height);
    };
    resize();
    addEventListener("resize", resize);
    const t0 = performance.now() - Math.random() * 60000;
    const draw = (now) => { gl.uniform1f(uTime, (now - t0) / 1000); gl.drawArrays(gl.TRIANGLES, 0, 3); };
    draw(performance.now());
    cv.classList.add("on");
    if (reduceMotion) return;
    let running = false, inView = true, last = 0;
    const loop = (now) => { if (!running) return; if (now - last > 40) { draw(now); last = now; } requestAnimationFrame(loop); };
    const setRun = () => { const want = inView && !document.hidden; if (want && !running) { running = true; requestAnimationFrame(loop); } else if (!want) running = false; };
    if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { inView = e.isIntersecting; setRun(); }).observe(cv);
    document.addEventListener("visibilitychange", setRun);
    setRun();
  });
})();
