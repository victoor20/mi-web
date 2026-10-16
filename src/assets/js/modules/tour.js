// Recorrido por el Control Center (/proyectos/jarvis/): pestañas por habitación (accesibles con flechas) y, en cada una,
// un carrusel de capturas con flechas, puntos, teclado y deslizamiento en móvil. Sin JavaScript se ven todas seguidas.
export default function tour(root, { reduceMotion }) {
  const tablist = root.querySelector("[data-tabs]");
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll("[data-panel]")];
  root.classList.add("is-ready");
  tablist.hidden = false;

  // scroll: solo cuando el usuario lo provoca (pulsar una zona del plano). Al cargar, la página no se mueve.
  const select = (i, focus = false, scroll = false) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
    });
    if (focus) tabs[i].focus({ preventScroll: true });
    // Mantiene visible la pestaña activa dentro de la fila desplazable, sin mover la página
    const bar = tablist;
    if (bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: tabs[i].offsetLeft - 16, behavior: reduceMotion ? "auto" : "smooth" });
    if (scroll) root.querySelector(".tour__tabs").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };
  // Plano de la portada: cada habitación es una zona pulsable que activa su pestaña y baja al visor
  document.querySelectorAll("[data-spot]").forEach((spot) => {
    spot.hidden = false;
    spot.addEventListener("click", () => {
      const i = tabs.findIndex((t) => t.id === `tab-${spot.dataset.spot}`);
      if (i >= 0) select(i, true, true);
    });
  });
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(i));
    t.addEventListener("keydown", (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); select((i + k + tabs.length) % tabs.length, true); }
      if (e.key === "Home") { e.preventDefault(); select(0, true); }
      if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
    });
  });

  // Carruseles
  root.querySelectorAll("[data-car]").forEach((car) => {
    const track = car.querySelector("[data-track]");
    const slides = [...track.children];
    const nav = car.querySelector("[data-nav]");
    if (slides.length < 2 || !nav) return;
    const dots = [...car.querySelectorAll("[data-dot]")];
    let i = 0;
    car.classList.add("is-car");
    nav.hidden = false;
    car.tabIndex = 0;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(${-100 * i}%)`;
      slides.forEach((s, j) => s.setAttribute("aria-hidden", String(j !== i)));
      dots.forEach((d, j) => d.setAttribute("aria-current", String(j === i)));
    };
    car.querySelector("[data-prev]").addEventListener("click", () => go(i - 1));
    car.querySelector("[data-next]").addEventListener("click", () => go(i + 1));
    dots.forEach((d, j) => d.addEventListener("click", () => go(j)));
    car.addEventListener("keydown", (e) => {
      if (e.target.closest("[data-dot]")) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
    });
    // Deslizar con el dedo
    let x0 = null;
    track.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") x0 = e.clientX; });
    track.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    });
    track.addEventListener("pointercancel", () => { x0 = null; });
    go(0);
  });

  select(0);
}
