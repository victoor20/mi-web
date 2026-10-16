// Animación de espera de una demo: sutil y lenta, solo mientras se ve, y desaparece para siempre en cuanto el usuario
// interactúa con ella (puntero, teclado o foco). Con movimiento reducido no existe. El CSS cuelga de .is-idle.is-visible.
export function idle(root, reduceMotion) {
  if (reduceMotion || !("IntersectionObserver" in window)) return;
  root.classList.add("is-idle");
  const io = new IntersectionObserver(([e]) => root.classList.toggle("is-visible", e.isIntersecting));
  io.observe(root);
  const stop = () => {
    root.classList.remove("is-idle", "is-visible");
    io.disconnect();
    ["pointerdown", "keydown", "focusin", "input"].forEach((t) => root.removeEventListener(t, stop, true));
  };
  ["pointerdown", "keydown", "focusin", "input"].forEach((t) => root.addEventListener(t, stop, true));
}
