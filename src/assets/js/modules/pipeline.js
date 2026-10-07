// Anatomía de una automatización: pestañas accesibles que muestran cada flujo.
// Sin JavaScript se ven los tres ejemplos seguidos.
export default function pipeline(root) {
  const tablist = root.querySelector("[data-tabs]");
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll("[data-pipe]")];
  if (!tablist || !tabs.length) return;

  tablist.hidden = false;
  root.classList.add("is-tabs");

  const select = (i, focus = false) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
      if (on) {
        // Reinicia la animación del recorrido
        panels[j].classList.remove("is-running");
        void panels[j].offsetWidth;
        panels[j].classList.add("is-running");
      }
    });
    if (focus) tabs[i].focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));
    tab.addEventListener("keydown", (e) => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (e.key in keys) { e.preventDefault(); select((i + keys[e.key] + tabs.length) % tabs.length, true); }
      if (e.key === "Home") { e.preventDefault(); select(0, true); }
      if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
    });
  });

  // Arranca la animación cuando la sección entra en pantalla
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    select(tabs.findIndex((t) => t.getAttribute("aria-selected") === "true"));
    io.disconnect();
  }, { threshold: 0.3 });
  panels.forEach((p, j) => { p.hidden = j !== 0; });
  io.observe(root);
}
