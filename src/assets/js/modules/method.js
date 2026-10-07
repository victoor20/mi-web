// Método: el informe se completa campo a campo mientras se recorren los pasos.
// Sin JavaScript el informe aparece completo (data-stage="3" en el HTML).
export default function method(root) {
  const sheet = root.querySelector("[data-sheet]");
  const steps = [...root.querySelectorAll("[data-step]")];
  if (!sheet || !steps.length || !("IntersectionObserver" in window)) return;

  let stage = 0;
  const set = (n) => {
    if (n === stage) return;
    stage = n;
    sheet.dataset.stage = String(n);
    steps.forEach((s) => s.classList.toggle("is-active", Number(s.dataset.step) === n));
  };
  sheet.dataset.stage = "0";
  root.classList.add("is-live");

  // Un paso está activo cuando cruza la franja central de la pantalla
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) set(Number(entry.target.dataset.step));
    });
  }, { rootMargin: "-42% 0px -42% 0px" });
  steps.forEach((s) => io.observe(s));

  // Por encima del primer paso, el informe vuelve a estar vacío
  const first = steps[0];
  window.addEventListener("scroll", () => {
    if (stage === 1 && first.getBoundingClientRect().top > window.innerHeight * 0.58) set(0);
  }, { passive: true });
}
