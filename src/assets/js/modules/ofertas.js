// Tarjetas finales de /ia/: un brillo radial sigue al cursor por el borde y el fondo de cada tarjeta.
// Solo con puntero fino y sin movimiento reducido (el módulo recibe reduceMotion de main.js).
export default function ofertas(root, { reduceMotion }) {
  if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  root.querySelectorAll("[data-glow]").forEach((card) => {
    card.classList.add("has-glow");
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(0)}px`);
      card.style.setProperty("--my", `${(e.clientY - r.top).toFixed(0)}px`);
    });
  });
}
