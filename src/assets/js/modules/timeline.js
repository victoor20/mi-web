// Línea de tiempo de "Sobre mí": el trazo se dibuja con el scroll y cada etapa se ilumina al llegar a ella.
// Sin JavaScript (o con movimiento reducido) la línea está dibujada entera y todas las etapas iluminadas.
export default function timeline(root, { reduceMotion }) {
  const stages = [...root.querySelectorAll("[data-stage]")];
  const all = () => { stages.forEach((s) => s.classList.add("is-lit")); root.style.setProperty("--p", "1"); };
  if (reduceMotion || !("IntersectionObserver" in window)) { all(); return; }

  root.style.setProperty("--p", "0");
  let frame = 0;
  const update = () => {
    frame = 0;
    const guide = window.innerHeight * 0.62; // lo que cruza esta línea se ilumina
    const r = root.getBoundingClientRect();
    stages.forEach((s) => {
      const sr = s.getBoundingClientRect();
      s.classList.toggle("is-lit", sr.top + Math.min(sr.height, 120) / 2 < guide);
    });
    root.style.setProperty("--p", Math.min(Math.max((guide - r.top) / r.height, 0), 1).toFixed(3));
  };
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };

  // Solo escucha el scroll mientras la línea de tiempo está cerca de la pantalla
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll); onScroll(); }
    else { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); }
  }, { rootMargin: "150px 0px" });
  io.observe(root);
  update();
}
