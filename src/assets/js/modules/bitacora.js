// Bitácora (/ia/): la línea vertical se rellena en cian con el scroll y el rombo baja por ella; cada nodo y su entrada se
// iluminan al alcanzarlos (los anteriores quedan iluminados). En escritorio, la columna fija traza el dibujo de la entrada activa.
// Con movimiento reducido: todo iluminado y quieto. Solo trabaja mientras la sección está en pantalla.
export default function bitacora(root, { reduceMotion }) {
  const list = root.querySelector("[data-log]");
  const entries = [...list.querySelectorAll("[data-entry]")];
  const arts = [...root.querySelectorAll("[data-art]")];
  if (!entries.length) return;

  const setActive = (i) => arts.forEach((a) => a.classList.toggle("is-active", a.dataset.art === entries[i].dataset.art));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    root.classList.add("is-static");
    setActive(0);
    return;
  }
  root.classList.add("is-armed");

  let frame = 0;
  let active = -1;
  const update = () => {
    frame = 0;
    const r = list.getBoundingClientRect();
    // La punta de la línea va a un 60 % del alto de la pantalla
    const y = Math.min(Math.max(window.innerHeight * 0.6 - r.top, 0), r.height);
    list.style.setProperty("--fill", `${y.toFixed(1)}px`);
    let last = 0;
    entries.forEach((e, i) => {
      const lit = e.offsetTop + 10 <= y;
      e.classList.toggle("is-lit", lit);
      if (lit) last = i;
    });
    if (last !== active) { active = last; setActive(last); }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { window.addEventListener("scroll", schedule, { passive: true }); schedule(); }
    else window.removeEventListener("scroll", schedule);
  }, { rootMargin: "100px 0px" }).observe(root);
  window.addEventListener("resize", schedule);
  update();
}
