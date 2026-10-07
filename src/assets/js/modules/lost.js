// 404: las piezas del logo están sueltas; se siguen al ratón un poco y se pueden recomponer.
export default function lost(root, { reduceMotion }) {
  const fix = root.querySelector("[data-fix]");
  const stage = root.querySelector(".lost__stage");
  fix.hidden = false;

  const toggle = () => {
    const fixed = root.classList.toggle("is-fixed");
    fix.textContent = fixed ? "Volver a desmontarlo" : "Recomponer el logo";
  };
  fix.addEventListener("click", toggle);

  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
  // Las piezas sueltas se desplazan ligeramente con el ratón
  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    stage.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    stage.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  });
  stage.addEventListener("pointerleave", () => { stage.style.setProperty("--mx", 0); stage.style.setProperty("--my", 0); });
}
