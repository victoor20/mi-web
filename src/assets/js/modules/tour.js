// Recorrido por el Control Center (/proyectos/jarvis/): la captura general funciona como mapa. Cada habitación tiene una zona
// pulsable (y con foco de teclado) que la resalta y abre a su lado su captura y su explicación. Sin JavaScript, todas en lista.
export default function tour(root) {
  const spots = [...root.querySelectorAll("[data-spot]")];
  const rooms = [...root.querySelectorAll("[data-room]")];
  root.classList.add("is-ready");
  const open = (id, focus = false) => {
    spots.forEach((s) => { const on = s.dataset.spot === id; s.setAttribute("aria-pressed", String(on)); s.classList.toggle("is-on", on); });
    rooms.forEach((r) => r.classList.toggle("is-on", r.dataset.room === id));
    if (focus && window.matchMedia("(max-width: 900px)").matches) root.querySelector(`[data-room="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
  spots.forEach((s) => { s.hidden = false; s.addEventListener("click", () => open(s.dataset.spot, true)); });
  open(spots[0]?.dataset.spot);
}
