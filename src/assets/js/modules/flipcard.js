// Tarjeta que gira: la foto de "Sobre mí" tiene las curiosidades por detrás.
// Sin JavaScript se ven las dos caras una debajo de otra.
export default function flipcard(root, { reduceMotion }) {
  const toggle = root.querySelector("[data-flip]");
  const front = root.querySelector("[data-front]");
  const back = root.querySelector("[data-back]");
  const hint = root.querySelector("[data-hint]");
  const hintText = root.querySelector("[data-hint-text]");
  const inner = root.querySelector(".flipcard__inner");

  root.classList.add("is-ready");
  let turning = 0;
  // El destello del contorno solo se mueve mientras la tarjeta está en pantalla
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => root.classList.toggle("is-live", entry.isIntersecting)).observe(root);
  }
  toggle.hidden = false;
  hint.hidden = false;
  back.inert = true;

  const set = (flipped) => {
    root.classList.remove("is-peeking");
    // El contorno con destello no gira con la tarjeta: se apaga mientras da la vuelta
    root.classList.add("is-turning");
    clearTimeout(turning);
    turning = setTimeout(() => root.classList.remove("is-turning"), reduceMotion ? 0 : 850);
    root.classList.toggle("is-flipped", flipped);
    toggle.setAttribute("aria-pressed", String(flipped));
    front.inert = flipped;
    back.inert = !flipped;
    hintText.textContent = flipped ? "Volver a la foto" : "Dale la vuelta";
  };
  toggle.addEventListener("click", () => set(!root.classList.contains("is-flipped")));

  // Inclinación 3D (máx. 11°) con un reflejo que sigue al cursor; solo con puntero fino y sin movimiento reducido
  const box = root.querySelector(".flipcard__box");
  if (!reduceMotion && box && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const MAX = 11;
    let frame = 0;
    let next = null;
    root.classList.add("has-tilt");
    const apply = () => {
      frame = 0;
      if (!next) return;
      root.style.setProperty("--rx", `${next.rx.toFixed(2)}deg`);
      root.style.setProperty("--ry", `${next.ry.toFixed(2)}deg`);
      root.style.setProperty("--gx", `${next.gx.toFixed(1)}%`);
      root.style.setProperty("--gy", `${next.gy.toFixed(1)}%`);
    };
    box.addEventListener("pointermove", (e) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const r = box.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      next = { ry: (x - 0.5) * 2 * MAX, rx: -(y - 0.5) * 2 * MAX, gx: x * 100, gy: y * 100 };
      root.classList.add("is-tilting");
      if (!frame) frame = requestAnimationFrame(apply);
    });
    box.addEventListener("pointerleave", () => {
      next = null;
      cancelAnimationFrame(frame);
      frame = 0;
      root.classList.remove("is-tilting");
      root.style.setProperty("--rx", "0deg");
      root.style.setProperty("--ry", "0deg");
    });
  }

  // Un ligero balanceo la primera vez que la tarjeta entra en pantalla, para que se note que gira
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      setTimeout(() => {
        if (!root.classList.contains("is-flipped")) root.classList.add("is-peeking");
      }, 900);
    }, { threshold: 0.6 });
    io.observe(root);
    inner.addEventListener("animationend", () => root.classList.remove("is-peeking"));
  }
}
