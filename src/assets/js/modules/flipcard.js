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
