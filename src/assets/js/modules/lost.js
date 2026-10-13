// 404: las piezas del logo están sueltas y se arrastran (ratón o dedo) hasta su hueco.
// Encajan solas cuando están cerca. El botón "Recomponer el logo" es la alternativa sin arrastrar,
// también para teclado. Sin JavaScript se ve el logo desmontado con sus huecos.
const SNAP = 70; // distancia (unidades del SVG) a la que una pieza encaja sola
const NEAR = 130; // distancia a la que su hueco se ilumina

export default function lost(root, { reduceMotion }) {
  const fix = root.querySelector("[data-fix]");
  const svg = root.querySelector("[data-svg]");
  const layer = root.querySelector("[data-pieces]");
  const burst = root.querySelector("[data-burst]");
  const holes = [...root.querySelectorAll(".lost__hole")];
  const hint = root.querySelector("[data-hint]");
  const count = root.querySelector("[data-count]");
  const win = root.querySelector("[data-win]");
  const total = Number(count.dataset.total);

  // El orden del DOM puede cambiar al arrastrar (la pieza sube al frente): el estado va por pieza
  const pieces = [...layer.children].map((el, i) => ({
    el,
    hole: holes[i],
    home: { x: Number(el.dataset.tx), y: Number(el.dataset.ty), r: Number(el.dataset.r) },
    x: Number(el.dataset.tx),
    y: Number(el.dataset.ty),
    r: Number(el.dataset.r),
    placed: false,
  }));
  const byEl = new Map(pieces.map((p) => [p.el, p]));

  fix.hidden = false;
  hint.hidden = false;
  count.hidden = false;

  const apply = (p) => {
    p.el.style.setProperty("--tx", `${p.x}px`);
    p.el.style.setProperty("--ty", `${p.y}px`);
    p.el.style.setProperty("--r", `${p.r}deg`);
  };

  const placedCount = () => pieces.filter((p) => p.placed).length;

  const update = () => {
    const n = placedCount();
    count.textContent = `${n}/${total} piezas`;
    const done = n === total;
    root.classList.toggle("is-complete", done);
    fix.textContent = done ? "Volver a desmontarlo" : "Recomponer el logo";
    return done;
  };

  const place = (p) => {
    p.x = 0; p.y = 0; p.r = 0;
    p.placed = true;
    apply(p);
    p.el.classList.remove("is-dragging");
    p.el.classList.add("is-placed");
    p.hole.classList.remove("is-near");
    p.hole.classList.add("is-filled");
  };

  const scatter = (p) => {
    p.x = p.home.x; p.y = p.home.y; p.r = p.home.r;
    p.placed = false;
    apply(p);
    p.el.classList.remove("is-placed");
    p.hole.classList.remove("is-filled");
  };

  // Estallido de destellos desde el centro del logo
  const celebrate = () => {
    win.hidden = false;
    if (reduceMotion) return;
    const cx = 585, cy = 420;
    for (let i = 0; i < 22; i++) {
      const star = document.createElementNS("http://www.w3.org/2000/svg", "path");
      star.setAttribute("class", "lost__spark");
      star.setAttribute("d", "M0 -22 L5 -5 L22 0 L5 5 L0 22 L-5 5 L-22 0 L-5 -5 Z");
      burst.append(star);
      const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 260 + Math.random() * 300;
      const scale = 0.6 + Math.random() * 0.9;
      const anim = star.animate([
        { transform: `translate(${cx}px, ${cy}px) scale(0.1) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${cx + Math.cos(angle) * dist}px, ${cy + Math.sin(angle) * dist}px) scale(${scale}) rotate(${Math.random() * 180}deg)`, opacity: 0 },
      ], { duration: 900 + Math.random() * 600, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" });
      anim.onfinish = () => star.remove();
    }
  };

  const finish = () => { if (update()) celebrate(); };

  // --- Arrastrar (puntero: ratón, dedo o lápiz)
  const toSvg = (e) => {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };

  // En SVG, touch-action no frena el desplazamiento de la página: se cancela el gesto al tocar una pieza suelta
  layer.addEventListener("touchstart", (e) => {
    const p = byEl.get(e.target.closest(".lost__piece"));
    if (p && !p.placed) e.preventDefault();
  }, { passive: false });

  let drag = null;
  layer.addEventListener("pointerdown", (e) => {
    const p = byEl.get(e.target.closest(".lost__piece"));
    if (!p || p.placed || e.button > 0) return;
    e.preventDefault();
    win.hidden = true;
    layer.append(p.el); // al frente (antes de capturar el puntero: mover el nodo lo suelta)
    p.el.setPointerCapture(e.pointerId);
    const pos = toSvg(e);
    drag = { p, id: e.pointerId, dx: p.x - pos.x, dy: p.y - pos.y };
    p.el.classList.add("is-dragging");
    p.el.style.transitionDelay = "";
    p.r = 0; // se endereza al cogerla para ver mejor dónde encaja
    apply(p);
  });

  layer.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const pos = toSvg(e);
    drag.p.x = pos.x + drag.dx;
    drag.p.y = pos.y + drag.dy;
    apply(drag.p);
    drag.p.hole.classList.toggle("is-near", Math.hypot(drag.p.x, drag.p.y) < NEAR);
  });

  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { p } = drag;
    drag = null;
    p.el.classList.remove("is-dragging");
    p.hole.classList.remove("is-near");
    if (Math.hypot(p.x, p.y) < SNAP) { place(p); finish(); }
  };
  layer.addEventListener("pointerup", release);
  layer.addEventListener("pointercancel", release);

  // --- Alternativa sin arrastrar: recomponer / volver a desmontar
  fix.addEventListener("click", () => {
    win.hidden = true;
    if (placedCount() === total) {
      pieces.forEach((p, i) => { p.el.style.transitionDelay = `${i * 40}ms`; scatter(p); });
      update();
    } else {
      pieces.forEach((p, i) => { p.el.style.transitionDelay = `${i * 40}ms`; place(p); });
      update();
      // La celebración llega cuando la última pieza ya ha encajado
      setTimeout(celebrate, reduceMotion ? 0 : 700);
    }
    setTimeout(() => pieces.forEach((p) => { p.el.style.transitionDelay = ""; }), 900);
  });

  update();
}
