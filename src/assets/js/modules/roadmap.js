// Hoja de ruta: camino con un marcador que avanza al hacer scroll hasta la posición real
// (fase y porcentaje en src/_data/roadmap.js) y fases que se despliegan al pulsarlas.
// Sin JavaScript todas las fases se ven desplegadas y el marcador no aparece.
export default function roadmap(root, { reduceMotion }) {
  const list = root.querySelector("[data-list]");
  const marker = root.querySelector("[data-marker]");
  const steps = [...root.querySelectorAll("[data-step]")];
  const phase = Number(root.dataset.phase) || 1;
  const percent = Number(root.dataset.percent) || 0;

  // --- Fases desplegables (todas cerradas al empezar)
  steps.forEach((step) => {
    const btn = step.querySelector(".roadmap__toggle");
    const panel = step.querySelector(".roadmap__panel");
    const setOpen = (open) => {
      btn.setAttribute("aria-expanded", String(open));
      panel.inert = !open;
    };
    setOpen(false);
    btn.addEventListener("click", () => setOpen(btn.getAttribute("aria-expanded") !== "true"));
  });
  root.classList.add("is-ready");

  // --- Marcador: la posición objetivo sale de "fase + porcentaje" sobre la altura real de los nodos
  const nodeY = () => steps.map((s) => {
    const n = s.querySelector("[data-node]");
    return s.offsetTop + n.offsetTop + n.offsetHeight / 2;
  });

  let ys = nodeY();
  let target = 0;
  let current = 0;
  let frame = 0;

  const compute = () => {
    ys = nodeY();
    // Fase 1 al 50 % = a medio camino entre el nodo de la fase 1 y el de la fase 2
    const pos = Math.min(Math.max(phase - 1 + percent / 100, 0), steps.length - 1);
    const k = Math.min(Math.floor(pos), steps.length - 2);
    target = ys[k] + (pos - k) * (ys[k + 1] - ys[k]);
    list.style.setProperty("--fill-top", `${ys[0]}px`);
  };

  const draw = (y) => {
    marker.style.transform = `translateY(${y.toFixed(1)}px)`;
    list.style.setProperty("--fill", `${Math.max(y - ys[0], 0).toFixed(1)}px`);
  };

  // El marcador sale de lo alto del camino y avanza con el scroll mientras la hoja de ruta sube por la pantalla;
  // al llegar a su posición real (fase y porcentaje) se queda ahí
  const update = () => {
    frame = 0;
    const top = list.getBoundingClientRect().top;
    const progress = Math.min(Math.max((window.innerHeight * 0.9 - top) / (window.innerHeight * 0.5), 0), 1);
    const want = reduceMotion ? target : progress * target;
    current = reduceMotion ? want : current + (want - current) * 0.2;
    draw(current);
    if (!reduceMotion && Math.abs(want - current) > 0.5) frame = requestAnimationFrame(update);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

  compute();
  current = reduceMotion ? target : 0;
  draw(current);

  if (reduceMotion || !("IntersectionObserver" in window)) {
    current = target;
    draw(target);
  } else {
    // Solo trabaja (y parpadea) mientras la hoja de ruta está en pantalla
    let live = false;
    const onScroll = () => schedule();
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === live) return;
      live = entry.isIntersecting;
      root.classList.toggle("is-live", live);
      if (live) {
        compute();
        schedule();
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onScroll);
        if (frame) { cancelAnimationFrame(frame); frame = 0; }
      }
    }, { rootMargin: "100px 0px" });
    io.observe(root);
  }

  // Al desplegar fases o cambiar el ancho, los nodos cambian de sitio
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => { compute(); schedule(); }).observe(list);
  }
}
