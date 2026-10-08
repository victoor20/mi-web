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

/* ---------- Campo de destellos ambiental ---------- */
if (isCapable()) {
  whenIdle(() => import("/assets/js/ambient.js").then((m) => m.initAmbient()).catch(() => {}));
}

/* ---------- Hero 3D: carga diferida y solo en equipos capaces ---------- */
const stage = document.querySelector("[data-hero-stage]");

function canRun3D() {
  if (!isCapable()) return false;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return false;
  }
  return true;
}

// La prueba de WebGL2 crea un contexto y puede costar cientos de ms: también se hace en reposo
if (stage && isCapable()) {
  whenIdle(() => {
    if (!canRun3D()) return;
    import("/assets/js/hero3d.js")
      .then((m) => m.initHero3D(stage, stage.dataset.three))
      .catch((err) => console.warn("Hero 3D desactivado:", err));
  });
}
