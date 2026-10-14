/* Bear Finance — comportamentos do site (sem dependências além do Swiper, carregado sob demanda) */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- estado de rolagem (header, botões flutuantes) ---------- */
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    body.classList.toggle("active", y > 120);
    body.classList.toggle("end", window.innerHeight + y >= document.body.offsetHeight - 2);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("load", () => { body.classList.add("load"); onScroll(); });

  /* ---------- menu ---------- */
  $$(".open-menu").forEach((btn) =>
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      body.classList.toggle("active-menu");
    })
  );
  $$(".menu-item-has-children > a").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (window.matchMedia("(max-width: 991px)").matches) {
        const li = a.parentElement;
        if (!li.classList.contains("active")) { e.preventDefault(); li.classList.add("active"); }
      }
    })
  );

  /* ---------- texto digitado do topo ---------- */
  const typed = $(".typed-text");
  if (typed && !reduceMotion) {
    const words = JSON.parse(typed.dataset.words || "[]");
    const cursor = $(".cursor");
    let wi = 0, ci = 0;
    const type = () => {
      if (ci < words[wi].length) { typed.textContent += words[wi].charAt(ci++); setTimeout(type, 120); }
      else setTimeout(erase, 1000);
    };
    const erase = () => {
      if (ci > 0) { typed.textContent = words[wi].substring(0, --ci); setTimeout(erase, 100); }
      else { wi = (wi + 1) % words.length; setTimeout(type, 1220); }
    };
    if (words.length) setTimeout(type, 1250);
    void cursor;
  } else if (typed) {
    typed.textContent = JSON.parse(typed.dataset.words || '[""]')[0];
  }

  /* ---------- vídeo de fundo do topo ---------- */
  const vdHome = $("#video-home");
  if (vdHome && vdHome.dataset.video && !reduceMotion) {
    vdHome.insertAdjacentHTML("beforeend", `<video preload="auto" autoplay muted playsinline loop src="${vdHome.dataset.video}"></video>`);
    vdHome.classList.add("active");
  }

  /* ---------- revelação ao rolar (.inspect) ---------- */
  const inspect = $$(".inspect");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    inspect.forEach((el) => io.observe(el));
  } else inspect.forEach((el) => el.classList.add("in"));

  /* ---------- contadores ---------- */
  const animateValue = (el, end, duration = 1000) => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      el.textContent = (el.dataset.prefix || "") + Math.floor(p * end).toLocaleString("pt-BR") + (el.dataset.suffix || "");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const numbers = $$("[data-number]");
  if (numbers.length) {
    const run = () => numbers.forEach((n) => reduceMotion
      ? (n.textContent = (n.dataset.prefix || "") + Number(n.dataset.number).toLocaleString("pt-BR") + (n.dataset.suffix || ""))
      : animateValue(n, Number(n.dataset.number)));
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { run(); io.disconnect(); }
      }), { rootMargin: "10px" });
      io.observe(numbers[0].closest("section") || numbers[0]);
    } else run();
  }

  /* ---------- FAQ ---------- */
  $$("#faq .faq-item").forEach((item) => {
    const title = $(".faq-title", item), content = $(".faq-content", item);
    title.addEventListener("click", () => {
      const open = item.classList.toggle("active");
      content.style.maxHeight = open ? content.scrollHeight + 30 + "px" : "0px";
    });
  });

  /* ---------- abas (#title-tabs) ---------- */
  $$("#title-tabs .title-tab").forEach((tab, i, all) => {
    const panels = $$(".item-tab");
    const select = () => {
      all.forEach((t) => t.classList.toggle("active", t === tab));
      panels.forEach((p) => p.classList.toggle("active", p.dataset.tab === tab.dataset.tab));
    };
    tab.addEventListener("click", select);
    if (i === 0) select();
  });

  /* ---------- vídeos (carregam só ao clicar) ---------- */
  $$(".video-container .poster").forEach((poster) => {
    poster.addEventListener("click", () => {
      const box = poster.parentElement;
      if (poster.dataset.embed) {
        const f = document.createElement("iframe");
        f.src = `https://www.youtube-nocookie.com/embed/${poster.dataset.embed}?autoplay=1&rel=0`;
        f.allow = "autoplay; encrypted-media; picture-in-picture";
        f.allowFullscreen = true;
        f.title = poster.dataset.title || "Vídeo";
        box.appendChild(f); poster.remove();
      } else if (poster.dataset.src) {
        const v = document.createElement("video");
        v.src = poster.dataset.src; v.controls = true; v.autoplay = true; v.playsInline = true;
        box.appendChild(v); poster.remove();
      } else {
        poster.classList.add("shake");
        setTimeout(() => poster.classList.remove("shake"), 600);
      }
    });
  });

  /* ---------- Swiper (carrosséis) ---------- */
  const swipers = $$(".swiper");
  if (swipers.length) {
    const init = () => {
      const S = window.Swiper;
      if (!S) return;
      const auto = (delay) => (reduceMotion ? false : { delay, disableOnInteraction: false });
      if ($(".swiper-clientes")) new S(".swiper-clientes", { slidesPerView: 5, spaceBetween: 30, loop: true, speed: 1500, autoplay: auto(2500), breakpoints: { 0: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 5 } } });
      if ($(".swiper-vertical")) new S(".swiper-vertical", { slidesPerView: 4, spaceBetween: 40, speed: 1200, loop: true, centeredSlides: true, autoplay: auto(5000), pagination: { el: ".vertical-pagination", clickable: true }, navigation: { nextEl: ".vertical-button-next", prevEl: ".vertical-button-prev" }, breakpoints: { 0: { slidesPerView: 1, spaceBetween: 0 }, 768: { slidesPerView: 1, spaceBetween: 0 }, 1024: { slidesPerView: 3, spaceBetween: 30 }, 1400: { slidesPerView: 4, spaceBetween: 40 } } });
      if ($(".swiper-team")) new S(".swiper-team", { slidesPerView: 5, spaceBetween: 40, speed: 2000, loop: true, autoplay: auto(5500), breakpoints: { 0: { slidesPerView: 1, spaceBetween: 15 }, 480: { slidesPerView: 2, spaceBetween: 20 }, 768: { slidesPerView: 3, spaceBetween: 30 }, 1024: { slidesPerView: 5, spaceBetween: 40 } } });
      if ($(".swiper-atua")) new S(".swiper-atua", { slidesPerView: 4, spaceBetween: 20, loop: true, speed: 1200, autoplay: auto(3500), pagination: { el: ".atua-pagination", clickable: true }, breakpoints: { 0: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } } });
    };
    const load = () => {
      if (window.Swiper) return init();
      const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.1.4/swiper-bundle.min.css";
      const js = document.createElement("script"); js.src = "https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.1.4/swiper-bundle.min.js"; js.onload = init;
      document.head.append(css, js);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { io.disconnect(); load(); } }, { rootMargin: "400px" });
      swipers.forEach((s) => io.observe(s));
    } else load();
  }

  /* ---------- filtro do blog ---------- */
  $$("[data-filter]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = btn.dataset.filter;
      $$("[data-filter]").forEach((b) => b.classList.toggle("active", b === btn));
      $$("[data-category]").forEach((it) => { it.hidden = cat !== "all" && it.dataset.category !== cat; });
    })
  );

  /* ---------- formulários → API ---------- */
  $$("form[data-api]:not([data-wa-form])").forEach((form) => {
    const status = $(".message", form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const btn = $('[type="submit"]', form);
      btn.disabled = true;
      if (status) { status.className = "message"; status.textContent = "Enviando…"; }
      try {
        const res = await fetch(form.dataset.api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Não foi possível enviar.");
        form.reset();
        if (status) { status.className = "message ok"; status.textContent = json.message || "Recebido! Em breve entraremos em contato."; }
      } catch (err) {
        if (status) { status.className = "message err"; status.textContent = err.message + " Se preferir, fale conosco pelo WhatsApp."; }
      } finally { btn.disabled = false; }
    });
  });

  /* ---------- cookies ---------- */
  const cookie = $(".cookieConsentContainer");
  if (cookie) {
    let ok = false;
    try { ok = localStorage.getItem("bf-cookies") === "1"; } catch (_) {}
    cookie.classList.toggle("hidden", ok);
    $(".cookieButton a", cookie).addEventListener("click", (e) => {
      e.preventDefault();
      try { localStorage.setItem("bf-cookies", "1"); } catch (_) {}
      cookie.classList.add("hidden");
    });
  }

  /* ---------- diversos ---------- */
  $$(".scroll-top").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); }));
  $$("[data-job]").forEach((a) => a.addEventListener("click", () => { const s = $("#c-vaga"); if (s) s.value = a.dataset.job; }));
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- parcerias: formulário em 2 etapas → WhatsApp ---------- */
  $$("form[data-wa-form]").forEach((form) => {
    const box = form.closest(".pform");
    const steps = $$(".pform-step", form);
    const bar = $(".pform-progress span", box);
    const labels = $$(".pform-steps li", box);
    const status = $(".message", form);
    const done = $(".pform-done", form);

    // máscara (00) 00000-0000
    $$('[data-mask="phone"]', form).forEach((inp) => inp.addEventListener("input", () => {
      const d = inp.value.replace(/\D/g, "").slice(0, 11);
      let v = d;
      if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length > 6) v = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
      inp.value = v;
    }));

    const go = (n) => {
      steps.forEach((st, i) => { st.hidden = i !== n; });
      labels.forEach((li, i) => { li.classList.toggle("on", i <= n); });
      if (bar) bar.style.width = `${((n + 1) / steps.length) * 100}%`;
      const first = $("input:not([type=hidden]), select, textarea", steps[n]);
      if (first) first.focus({ preventScroll: true });
    };
    // valida só os campos da etapa visível; grupos de chips obrigatórios exigem 1 marcado
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
    // Enter na etapa 1 avança em vez de enviar
    steps[0].addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.tagName === "INPUT") { e.preventDefault(); if (valid(steps[0])) go(1); } });

    const collect = () => {
      const data = {}, order = [], labelOf = {};
      $$("input, select, textarea", form).forEach((el) => {
        if (!el.name || el.name === "website" || el.disabled) return;
        if ((el.type === "checkbox" || el.type === "radio") && !el.checked) return;
        const v = (el.value || "").trim();
        if (!v) return;
        if (!(el.name in data)) { order.push(el.name); data[el.name] = v; }
        else data[el.name] += ", " + v;
        if (el.dataset.label) labelOf[el.name] = el.dataset.label;
      });
      return { data, order, labelOf };
    };
    const message = ({ data, order, labelOf }) => {
      const lines = [`Olá! Quero ser *${data.programa}* da Bear Finance.`, ""];
      order.forEach((k) => { if (labelOf[k] && k !== "lgpd") lines.push(`*${labelOf[k]}:* ${data[k]}`); });
      return lines.join("\n");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!valid(steps[0])) return go(0);
      if (!valid(steps[1])) return;
      const c = collect();
      if (form.elements.website && form.elements.website.value) return; // robô
      const url = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(message(c))}`;
      // abre o WhatsApp ainda dentro do clique (evita bloqueio de pop-up)
      // (sem a flag "noopener": com ela, window.open sempre retorna null e não dá para detectar bloqueio)
      const win = window.open(url, "_blank");
      if (win) { try { win.opener = null; } catch (_) {} }
      // grava o lead sem bloquear a conversa
      try {
        fetch(form.dataset.api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c.data), keepalive: true }).catch(() => {});
      } catch (_) {}
      steps.forEach((st) => (st.hidden = true));
      if (bar) bar.style.width = "100%";
      labels.forEach((li) => li.classList.add("on"));
      const again = $("[data-wa-open]", done);
      if (again) again.href = url;
      done.hidden = false;
      if (status) status.textContent = "";
      if (!win) location.href = url; // pop-up bloqueado (ou app no celular): segue na mesma aba
    });
  });

  /* ---------- fotos em movimento: zoom lento (Ken Burns) + parallax ---------- */
  const rnd = (a, b) => a + Math.random() * (b - a);
  const kbLayers = [];
  $$(".bg, .post-img").forEach((el) => {
    if (el.closest(".site-footer") || el.classList.contains("kb")) return;
    const bi = el.style.backgroundImage;
    if (!bi || bi === "none") return;
    el.style.backgroundImage = "none";
    el.classList.add("kb");
    const layer = document.createElement("span");
    layer.className = "kb-layer";
    layer.style.backgroundImage = bi;
    layer.style.setProperty("--kb-dur", rnd(18, 30).toFixed(1) + "s");
    layer.style.setProperty("--kb-delay", -rnd(0, 20).toFixed(1) + "s");
    layer.style.setProperty("--kb-ox", rnd(15, 85).toFixed(0) + "%");
    layer.style.setProperty("--kb-oy", rnd(15, 85).toFixed(0) + "%");
    el.prepend(layer);
    kbLayers.push(layer);
  });
  if (!reduceMotion && kbLayers.length && "IntersectionObserver" in window) {
    const visible = new Set();
    const io = new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))), { rootMargin: "100px" });
    kbLayers.forEach((l) => io.observe(l.parentElement));
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      visible.forEach((el) => {
        const r = el.getBoundingClientRect();
        const off = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 aprox.
        const layer = el.firstElementChild;
        if (layer) layer.style.translate = `0 ${(off * -6).toFixed(2)}%`;
      });
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- ondas animadas (WebGL) ---------- */
  const FRAG = `
precision mediump float;
uniform vec2 uRes; uniform float uTime;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 6; i++) { v += a * noise(p); p = m * p; a *= 0.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes.y;
  float T = uTime * 0.045;
  vec2 p = uv * 2.2 + vec2(T * 0.7, T * 0.35);
  vec2 q = vec2(fbm(p + vec2(0.0, T)), fbm(p + vec2(5.2, 1.3) - T));
  vec2 w = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + T * 1.6), fbm(p + 3.0 * q + vec2(8.3, 2.8) - T * 1.2));
  float f = fbm(p + 3.5 * w);
  float foam = smoothstep(0.56, 0.86, f) * (0.55 + 0.45 * fbm(p * 6.0 + w * 4.0 + T * 3.0));
  vec3 deep = vec3(0.05, 0.03, 0.12), mid = vec3(0.24, 0.11, 0.50), lil = vec3(0.66, 0.55, 0.98), white = vec3(0.95, 0.92, 1.0);
  vec3 col = mix(deep, mid, smoothstep(0.18, 0.70, f));
  col = mix(col, lil, smoothstep(0.50, 0.80, f) * 0.55);
  col = mix(col, white, foam * 0.8);
  gl_FragColor = vec4(col, 1.0);
}`;
  const VERT = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";
  $$("canvas.fx-waves").forEach((cv) => {
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return; // sem WebGL: fica a foto com zoom lento
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

    const SCALE = 0.5; // renderiza em meia resolução: mais leve e com aspecto de névoa
    const resize = () => {
      const w = Math.min(cv.clientWidth, 1600) * SCALE, h = Math.min(cv.clientHeight, 1000) * SCALE;
      cv.width = Math.max(1, Math.round(w)); cv.height = Math.max(1, Math.round(h));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now() - rnd(0, 60000);
    const draw = (now) => { gl.uniform1f(uTime, (now - t0) / 1000); gl.drawArrays(gl.TRIANGLES, 0, 3); };
    draw(performance.now());
    cv.classList.add("on");
    if (reduceMotion) return; // um quadro estático

    let running = false, inView = true, last = 0;
    const loop = (now) => {
      if (!running) return;
      if (now - last > 33) { draw(now); last = now; } // ~30 fps
      requestAnimationFrame(loop);
    };
    const setRun = () => {
      const want = inView && !document.hidden;
      if (want && !running) { running = true; requestAnimationFrame(loop); }
      else if (!want) running = false;
    };
    if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { inView = e.isIntersecting; setRun(); }).observe(cv);
    document.addEventListener("visibilitychange", setRun);
    setRun();
  });
})();
