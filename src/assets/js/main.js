// Comportamiento común a todas las páginas. Sin dependencias.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

/* ---------- Cabecera: fondo al hacer scroll ---------- */
const header = document.querySelector("[data-header]");
if (header) {
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Menú móvil ---------- */
const toggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
if (toggle && menu) {
  const label = toggle.querySelector("[data-menu-label]");
  const main = document.querySelector("main");
  const footer = document.querySelector(".site-footer");
  const desktop = window.matchMedia("(min-width: 901px)");
  let lastFocus = null;

  menu.querySelectorAll("li").forEach((li, i) => li.style.setProperty("--i", i));
  menu.querySelector(".mobile-menu__foot")?.style.setProperty("--i", menu.querySelectorAll("li").length);

  const focusables = () => [toggle, ...menu.querySelectorAll("a, button")];

  const open = () => {
    lastFocus = document.activeElement;
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add("is-open"));
    document.documentElement.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    label.textContent = "Cerrar menú";
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    menu.querySelector("a")?.focus({ preventScroll: true });
  };

  const close = ({ restoreFocus = true } = {}) => {
    menu.classList.remove("is-open");
    document.documentElement.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    label.textContent = "Abrir menú";
    main?.removeAttribute("inert");
    footer?.removeAttribute("inert");
    const hide = () => { if (!menu.classList.contains("is-open")) menu.hidden = true; };
    if (reduceMotion.matches) hide();
    else setTimeout(hide, 350);
    if (restoreFocus) (lastFocus || toggle).focus({ preventScroll: true });
  };

  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

  toggle.addEventListener("click", () => (isOpen() ? close() : open()));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) close({ restoreFocus: false }); });

  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    // Mantener el foco dentro del menú
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  desktop.addEventListener("change", (e) => { if (e.matches && isOpen()) close({ restoreFocus: false }); });
}

/* ---------- Entrada de elementos al hacer scroll ---------- */
const revealables = document.querySelectorAll("[data-reveal]");
if (revealables.length && "IntersectionObserver" in window && !reduceMotion.matches) {
  // Escalonado entre hermanos que entran a la vez
  revealables.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute("data-reveal"));
    el.style.setProperty("--reveal-i", Math.min(siblings.indexOf(el), 6));
  });
  const io = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    }),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
  );
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add("is-in"));
}

/* ---------- Separadores de facetas: un destello recorre la línea, lento y solo mientras están en pantalla ---------- */
const dividers = [...document.querySelectorAll(".facet-divider")];
if (dividers.length && "IntersectionObserver" in window && !reduceMotion.matches) {
  const SPEED = 55; // px por segundo
  const PAUSE = 2600; // ms entre pasadas
  const runners = new Map(); // separador -> estado
  const active = new Set();
  let frame = 0;

  const route = (d) => {
    const box = d.getBoundingClientRect();
    const shape = d.querySelector(".facet-divider__shape");
    const svg = shape.getBoundingClientRect();
    const path = d.querySelector(".facet-divider__route"); // el recorrido completo: base y facetas, sin dibujarse
    const k = svg.width / (shape.viewBox.baseVal.width || 240);
    return {
      path, k,
      x1: 0, w1: svg.left - box.left,
      sx: svg.left - box.left, sy: svg.top - box.top, plen: path.getTotalLength() * k,
      x2: svg.right - box.left, w2: box.right - svg.right,
      y: box.height - 8, // el eje de la línea
    };
  };
  const pointAt = (r, s) => {
    if (s < r.w1) return [r.x1 + s, r.y];
    if (s < r.w1 + r.plen) {
      const p = r.path.getPointAtLength((s - r.w1) / r.k);
      return [r.sx + p.x * r.k, r.sy + p.y * r.k];
    }
    return [r.x2 + (s - r.w1 - r.plen), r.y];
  };

  const tick = (t) => {
    frame = 0;
    active.forEach((d) => {
      const st = runners.get(d);
      if (!st.route) {
        // Espera entre pasadas; solo arranca cuando el separador ya se ha dibujado
        if (t < st.next || !d.classList.contains("is-in")) return;
        st.route = route(d);
        st.total = st.route.w1 + st.route.plen + st.route.w2;
        st.start = t;
      }
      const s = ((t - st.start) / 1000) * SPEED;
      if (s >= st.total) {
        st.glint.style.opacity = "0";
        st.route = null;
        st.next = t + PAUSE + Math.random() * 1500;
        return;
      }
      const [x, y] = pointAt(st.route, s);
      st.glint.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      st.glint.style.opacity = String(Math.min(1, s / 50, (st.total - s) / 50));
    });
    if (active.size) frame = requestAnimationFrame(tick);
  };

  const dividerIo = new IntersectionObserver((entries) => {
    entries.forEach(({ target: d, isIntersecting }) => {
      if (!runners.has(d)) {
        const glint = document.createElement("span");
        glint.className = "facet-divider__glint";
        glint.setAttribute("aria-hidden", "true");
        d.append(glint);
        runners.set(d, { glint, route: null, next: 0 });
      }
      d.classList.toggle("is-live", isIntersecting);
      if (isIntersecting) active.add(d);
      else {
        active.delete(d);
        const st = runners.get(d);
        st.route = null; st.next = 0; st.glint.style.opacity = "0";
      }
    });
    if (active.size && !frame) frame = requestAnimationFrame(tick);
  }, { rootMargin: "50px 0px" });
  dividers.forEach((d) => dividerIo.observe(d));
}

/* ---------- Buscador por síntoma: al elegir uno, la lista y la ilustración se iluminan a la vez, en orden ---------- */
const finderBox = document.querySelector(".finder__box");
if (finderBox && !reduceMotion.matches) {
  let timers = [];
  const run = () => {
    timers.forEach(clearTimeout);
    timers = [];
    const radio = finderBox.querySelector("input[name=sintoma]:checked");
    const panel = radio && finderBox.querySelector(`.finder__panel[data-panel="${radio.value}"]`);
    if (!panel) return;
    const items = [...panel.querySelectorAll(".finder__checks li")];
    const parts = [...panel.querySelectorAll(".chk")];
    panel.classList.add("is-seq");
    items.forEach((li) => li.classList.remove("on"));
    parts.forEach((p) => p.classList.remove("on"));
    items.forEach((li, i) => timers.push(setTimeout(() => {
      li.classList.add("on");
      parts.filter((p) => +p.dataset.c === i).forEach((p) => p.classList.add("on"));
    }, 450 + i * 800)));
  };
  finderBox.addEventListener("change", run);
  if ("IntersectionObserver" in window) {
    const once = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      once.disconnect();
      run();
    }, { threshold: 0.5 });
    once.observe(finderBox);
  }
}

/* ---------- Tres pasos (/lo-que-se-hacer/): el destello de las líneas corre solo mientras se ve ---------- */
const steps3 = document.querySelector("[data-steps3]");
if (steps3 && "IntersectionObserver" in window) {
  new IntersectionObserver((entries) => steps3.classList.toggle("is-live", entries[0].isIntersecting)).observe(steps3);
}

/* ---------- Preguntas frecuentes: apertura y cierre suaves (altura + fundido) y filtro por tema ---------- */
document.querySelectorAll(".faq details").forEach((d) => {
  const summary = d.querySelector("summary");
  const body = summary?.nextElementSibling;
  if (!body || reduceMotion.matches) return;
  let anim = null;
  const run = (opening) => {
    anim?.cancel();
    const cs = getComputedStyle(body);
    const full = { height: cs.height, paddingBottom: cs.paddingBottom };
    const none = { height: "0px", paddingBottom: "0px" };
    body.style.overflow = "hidden";
    anim = body.animate(
      opening ? [{ ...none, opacity: 0 }, { ...full, opacity: 1 }] : [{ ...full, opacity: 1 }, { ...none, opacity: 0 }],
      { duration: opening ? 320 : 240, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    const mine = anim;
    mine.onfinish = () => {
      body.style.overflow = "";
      anim = null;
      if (!opening) { d.open = false; d.classList.remove("is-closing"); }
    };
  };
  summary.addEventListener("click", (e) => {
    e.preventDefault();
    if (!d.open || d.classList.contains("is-closing")) { d.classList.remove("is-closing"); d.open = true; run(true); }
    else { d.classList.add("is-closing"); run(false); }
  });
});
const faqFilter = document.querySelector("[data-faq-filter]");
const faqList = document.querySelector("[data-faq]");
if (faqFilter && faqList) {
  faqFilter.hidden = false;
  faqFilter.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;
    faqFilter.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    faqList.querySelectorAll("details").forEach((d) => { d.hidden = btn.dataset.cat !== "todas" && d.dataset.cat !== btn.dataset.cat; });
  });
}

/* ---------- Flujo de Jarvis (home): un mensaje recorre las etapas; en bucle solo mientras está visible ---------- */
const jflow = document.querySelector("[data-jflow]");
if (jflow && "IntersectionObserver" in window && !reduceMotion.matches) {
  const stages = [...jflow.querySelectorAll(".flow-line > li")];
  const n = stages.length;
  let step = 0, timer = null;
  const show = () => {
    jflow.classList.add("is-anim");
    jflow.classList.toggle("has-msg", step >= 1);
    jflow.classList.toggle("has-ask", step >= n + 2);
    stages.forEach((li, i) => {
      li.classList.toggle("is-on", step >= i + 2);
      li.classList.toggle("is-now", step === i + 2);
    });
    const at = Math.min(Math.max(step - 1, 0.001), n);
    jflow.style.setProperty("--at", ((at - 0.5) / n).toFixed(3));
    jflow.classList.toggle("has-pulse", step >= 2 && step <= n + 1);
  };
  const tick = () => {
    step = step > n + 2 ? 0 : step + 1;
    show();
    // al final se mantiene la pregunta un buen rato antes de reiniciar
    timer = setTimeout(tick, step === 0 ? 1200 : step === n + 3 ? 4200 : step === 1 ? 1300 : 1500);
  };
  show();
  new IntersectionObserver((entries) => {
    const on = entries[0].isIntersecting;
    clearTimeout(timer);
    timer = null;
    if (on) timer = setTimeout(tick, 600);
  }, { threshold: 0.4 }).observe(jflow);
}

/* ---------- Ilustraciones: se animan una vez al aparecer y al pasar el ratón; el resto del tiempo, quietas ---------- */
const illos = [...document.querySelectorAll("[data-illo]")];
if (illos.length && !reduceMotion.matches) {
  const timers = new WeakMap();
  const play = (el) => {
    clearTimeout(timers.get(el));
    el.classList.remove("is-play");
    void el.getBoundingClientRect(); // reinicia las animaciones
    el.classList.add("is-play");
    timers.set(el, setTimeout(() => el.classList.remove("is-play"), 3400));
  };
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    play(e.target);
  }), { threshold: 0.6 }) : null;
  illos.forEach((el) => {
    io?.observe(el);
    const host = el.closest("a, article, li") || el;
    // Al pasar el ratón (o el foco) se repite, sin solaparse con una animación en marcha
    const again = () => { if (!el.classList.contains("is-play")) play(el); };
    host.addEventListener("pointerenter", again);
    host.addEventListener("focusin", again);
  });
}

/* ---------- Selector de idioma: desplegable accesible (Escape, clic fuera y salida del foco lo cierran) ---------- */
document.querySelectorAll("[data-lang]").forEach((box) => {
  const btn = box.querySelector("[data-lang-btn]");
  const list = box.querySelector("[data-lang-list]");
  const set = (open) => { btn.setAttribute("aria-expanded", String(open)); list.hidden = !open; };
  btn.addEventListener("click", () => set(list.hidden));
  box.addEventListener("keydown", (e) => { if (e.key === "Escape" && !list.hidden) { set(false); btn.focus(); } });
  box.addEventListener("focusout", (e) => { if (!box.contains(e.relatedTarget)) set(false); });
  document.addEventListener("click", (e) => { if (!list.hidden && !box.contains(e.target)) set(false); });
});

/* ---------- Botones magnéticos (solo ratón) ---------- */
if (finePointer.matches && !reduceMotion.matches) {
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = 0.18;
    el.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, background-color 0.25s";
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
}

/* ---------- CTA fija en móvil ---------- */
const mobileCta = document.querySelector("[data-mobile-cta]");
if (mobileCta && "IntersectionObserver" in window) {
  const hero = document.querySelector(".hero, .page-hero");
  const blockers = [...document.querySelectorAll("[data-hide-mobile-cta], .site-footer")];
  const links = mobileCta.querySelectorAll("a");
  let pastHero = !hero;
  const covered = new Set();

  const update = () => {
    const show = pastHero && covered.size === 0;
    mobileCta.classList.toggle("is-visible", show);
    mobileCta.setAttribute("aria-hidden", String(!show));
    links.forEach((a) => (show ? a.removeAttribute("tabindex") : a.setAttribute("tabindex", "-1")));
  };

  if (hero) {
    new IntersectionObserver(([entry]) => {
      pastHero = !entry.isIntersecting;
      update();
    }, { rootMargin: "-40% 0px 0px 0px" }).observe(hero);
  }
  const blockIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? covered.add(entry.target) : covered.delete(entry.target)));
    update();
  });
  blockers.forEach((el) => blockIo.observe(el));
  update();
}

/* ---------- Módulos por página: [data-module="nombre"] carga /assets/js/modules/nombre.js ---------- */
document.querySelectorAll("[data-module]").forEach((el) => {
  el.dataset.module.split(/\s+/).forEach((name) => {
    import(`/assets/js/modules/${name}.js`)
      .then((m) => m.default(el, { reduceMotion: reduceMotion.matches, capable: isCapable() }))
      .catch((err) => console.warn(`Módulo ${name} no disponible:`, err));
  });
});

/* ---------- Efectos pesados: solo con movimiento permitido y en equipos capaces ---------- */
function isCapable() {
  if (reduceMotion.matches) return false;
  const conn = navigator.connection;
  if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ""))) return false;
  if (navigator.deviceMemory && navigator.deviceMemory < 4) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return false;
  return true;
}

const whenIdle = (fn) => {
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 300));
  const go = () => idle(fn, { timeout: 2500 });
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
};

/* ---------- Hero 3D: carga diferida y solo en equipos capaces ---------- */
// Sin contexto de prueba: si WebGL2 falla, WebGLRenderer lanza un error antes de tocar el DOM
// y se queda la imagen estática. Así solo se crea un contexto WebGL.
const stage = document.querySelector("[data-hero-stage]");
let hero3d = Promise.resolve();
if (stage && isCapable() && "WebGL2RenderingContext" in window) {
  hero3d = new Promise((resolve) => whenIdle(() => {
    import("/assets/js/hero3d.js")
      .then((m) => m.initHero3D(stage, stage.dataset.three))
      .catch((err) => console.warn("Hero 3D desactivado:", err))
      .finally(resolve);
  }));
}

/* ---------- Campo de destellos ambiental ---------- */
// En pantallas táctiles arranca cuando el 3D ya está montado, para que no compitan por la CPU
if (isCapable()) {
  const startAmbient = () => whenIdle(() => import("/assets/js/ambient.js").then((m) => m.initAmbient()).catch(() => {}));
  if (window.matchMedia("(pointer: coarse)").matches) hero3d.then(startAmbient);
  else startAmbient();
}
