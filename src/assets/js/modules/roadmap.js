// Hoja de ruta: camino con un marcador que avanza al hacer scroll hasta la posición real
// (fase y porcentaje en src/_data/roadmap.js) y una demostración simulada por fase, que se carga
// solo cuando su fase se acerca a la pantalla. Sin JavaScript se ve todo el texto y las demos estáticas.
import { tilt } from "../lib/tilt.js";

export default function roadmap(root, { reduceMotion }) {
  const list = root.querySelector("[data-list]");
  const marker = root.querySelector("[data-marker]");
  const steps = [...root.querySelectorAll("[data-step]")];
  const phase = Number(root.dataset.phase) || 1;
  const percent = Number(root.dataset.percent) || 0;

  root.classList.add("is-ready");

  // Barra de progreso de la fase actual: se rellena al entrar en pantalla
  const bar = document.querySelector("[data-bar]");
  if (bar && !reduceMotion && "IntersectionObserver" in window) {
    bar.classList.add("is-armed");
    const bio = new IntersectionObserver(([e]) => { if (e.isIntersecting) { bar.classList.add("is-in"); bio.disconnect(); } }, { threshold: 0.6 });
    bio.observe(bar);
  }
  // Inclinación leve de las demostraciones al pasar el ratón (puntero fino)
  root.querySelectorAll(".demo").forEach((d) => tilt(d, 4));

  // --- Demostraciones: un módulo por demo, carga diferida al entrar en pantalla
  const demos = [...root.querySelectorAll("[data-demo]")];
  if ("IntersectionObserver" in window) {
    const loader = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loader.unobserve(entry.target);
      import(`/assets/js/demos/${entry.target.dataset.demo}.js`)
        .then((m) => m.default(entry.target, { reduceMotion }))
        .catch((err) => console.warn(`Demo ${entry.target.dataset.demo} no disponible:`, err));
    }), { rootMargin: "250px 0px" });
    demos.forEach((d) => loader.observe(d));
  }

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

  // Al cambiar el ancho o la altura de las fases (por ejemplo al cargar una demo), los nodos cambian de sitio
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => { compute(); schedule(); }).observe(list);
  }
}
