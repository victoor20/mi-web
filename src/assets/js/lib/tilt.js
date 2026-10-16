// Inclinación leve al pasar el ratón (como el retrato de «Sobre mí»), solo con puntero fino y sin movimiento reducido.
// Escribe --rx y --ry en el elemento; el CSS aplica la perspectiva y la vuelta suave (clase .tilt).
export function tilt(el, max = 5) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let frame = 0, next = null;
  el.classList.add("tilt");
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    next = { ry: ((e.clientX - r.left) / r.width - 0.5) * 2 * max, rx: -((e.clientY - r.top) / r.height - 0.5) * 2 * max };
    el.classList.add("is-tilting");
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      if (!next) return;
      el.style.setProperty("--rx", `${next.rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${next.ry.toFixed(2)}deg`);
    });
  });
  el.addEventListener("pointerleave", () => {
    next = null;
    el.classList.remove("is-tilting");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  });
}
