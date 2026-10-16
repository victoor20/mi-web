// Taller «Hazlo conmigo» (guía modelo): el portátil del SVG cambia con cada paso.
// El contenido solo avanza cuando el usuario pulsa «Siguiente», «Anterior» o un paso de la lista.
export default function taller(root) {
  const svg = root.querySelector("[data-ws-svg]");
  const controls = root.querySelector("[data-controls]");
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  const count = root.querySelector("[data-count]");
  const steps = [...root.querySelectorAll("[data-n]")];
  const total = steps.length;
  let step = 0;

  const labels = [
    "Portátil visto por debajo, con su disco mecánico",
    "Portátil apagado y con el cargador desconectado",
    "Copia de seguridad hecha en un disco externo",
    "Tapa inferior retirada: se ven el disco, la memoria, el ventilador y la batería",
    "Disco mecánico fuera de su bahía",
    "SSD colocado en la bahía del disco",
    "Tapa cerrada y sistema clonándose o reinstalándose en el SSD",
    "Portátil encendido con el SSD: el arranque es rápido",
  ];

  const show = (n, focusStep = false) => {
    step = Math.max(0, Math.min(total, n));
    svg.dataset.step = String(step);
    svg.setAttribute("aria-label", labels[step]);
    steps.forEach((li) => {
      const k = Number(li.dataset.n);
      li.classList.toggle("is-current", k === step);
      li.classList.toggle("is-done", k < step);
    });
    count.textContent = step === 0 ? "Antes de empezar" : `Paso ${step} de ${total}: ${steps[step - 1].querySelector(".ws__t").textContent}`;
    prev.disabled = step === 0;
    next.textContent = step === 0 ? "Empezar" : step === total ? "Volver a empezar" : "Siguiente";
    root.classList.toggle("is-finished", step === total);
    if (focusStep && step > 0) steps[step - 1].querySelector(".ws__go").focus({ preventScroll: true });
  };

  controls.hidden = false;
  root.classList.add("is-ready");
  steps.forEach((li) => {
    const go = li.querySelector(".ws__go");
    go.tabIndex = 0;
    go.addEventListener("click", () => show(Number(go.dataset.go)));
  });
  prev.addEventListener("click", () => show(step - 1));
  next.addEventListener("click", () => show(step === total ? 0 : step + 1));
  show(0);
}
