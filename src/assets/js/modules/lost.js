// 404: las piezas del logo flotan despacio, como en el espacio, sin salir de la zona cercana al logo, y se arrastran (ratón o dedo) hasta su hueco.
// En cada visita aparecen en posiciones y giros aleatorios por la zona de juego (sin tapar el texto ni los botones).
// Encajan al soltarlas cerca de su hueco y entonces se corrige su giro. "Recomponer el logo" es la alternativa
// sin arrastrar, también para teclado. Sin JavaScript se ve el logo desmontado con sus huecos.
const SNAP = 52; // distancia (unidades del SVG) a la que una pieza encaja al soltarla (no encaja sola: hay que soltarla)
const NEAR = 120; // distancia a la que su hueco se ilumina

const rand = (a, b) => a + Math.random() * (b - a);

export default function lost(root, { reduceMotion }) {
  const fix = root.querySelector("[data-fix]");
  const svg = root.querySelector("[data-svg]");
  const layer = root.querySelector("[data-pieces]");
  const burst = root.querySelector("[data-burst]");
  const holes = [...root.querySelectorAll(".lost__hole")];
  const hint = root.querySelector("[data-hint]");
  const count = root.querySelector("[data-count]");
  const win = root.querySelector("[data-win]");
  const status = root.querySelector(".lost__status");
  const play = root.querySelector(".lost__play");
  const total = Number(count.dataset.total);

  // El orden del DOM cambia al arrastrar (la pieza sube al frente): el estado va por pieza
  const pieces = [...layer.children].map((el, i) => {
    const b = el.getBBox();
    return { el, hole: holes[i], cx: b.x + b.width / 2, cy: b.y + b.height / 2, radius: Math.hypot(b.width, b.height) / 2, x: 0, y: 0, r: 0, r0: 0, placed: false };
  });
  const byEl = new Map(pieces.map((p) => [p.el, p]));

  fix.hidden = false;
  hint.hidden = false;
  count.hidden = false;

  const apply = (p) => {
    p.el.style.setProperty("--tx", `${p.x.toFixed(1)}px`);
    p.el.style.setProperty("--ty", `${p.y.toFixed(1)}px`);
    p.el.style.setProperty("--r", `${p.r.toFixed(1)}deg`);
  };

  // --- Sonido: Web Audio, sin archivos. Activado por defecto; con movimiento reducido no suena.
  let ctx = null;
  const audioOk = !reduceMotion && (window.AudioContext || window.webkitAudioContext);
  const audio = () => {
    if (!audioOk) return null;
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  const tone = (freq, start, dur, gain, type = "sine") => {
    const a = audio();
    if (!a) return;
    const osc = a.createOscillator();
    const g = a.createGain();
    const t = a.currentTime + start;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + dur * 0.6);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(a.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  };
  const snapSound = () => { tone(520, 0, 0.16, 0.05); tone(1040, 0.02, 0.12, 0.02, "triangle"); };
  const winSound = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.28, 0.045));

  // --- Zona de juego: el logo ampliado un poco, sin salirse de su columna, ni subir bajo la cabecera, ni pisar el texto de ayuda
  const zoneInfo = () => {
    const s = svg.getBoundingClientRect();
    const k = s.width / 1170;
    const pr = play.getBoundingClientRect();
    const header = document.querySelector("[data-header]")?.getBoundingClientRect().bottom ?? 72;
    const st = status.getBoundingClientRect();
    const lb = svg.querySelector(".lost__holes").getBBox();
    const logo = { l: s.left + lb.x * k, r: s.left + (lb.x + lb.width) * k, t: s.top + lb.y * k, b: s.top + (lb.y + lb.height) * k };
    const margin = Math.max(logo.r - logo.l, logo.b - logo.t) * 0.16;
    const zone = {
      l: Math.max(logo.l - margin, pr.left + 4),
      r: Math.min(logo.r + margin, pr.right - 4),
      t: Math.max(logo.t - margin, header + 6),
      b: Math.min(logo.b + margin, st.top - 10),
    };
    return { s, k, zone };
  };
  const between = (a, b) => (b > a ? rand(a, b) : (a + b) / 2);

  // Límites del movimiento de cada pieza (desplazamiento en unidades del SVG): su centro nunca sale de la zona
  const setBounds = (p, { s, k, zone }) => {
    const rad = p.radius * k;
    p.bounds = {
      minX: (zone.l + rad - s.left) / k - p.cx, maxX: (zone.r - rad - s.left) / k - p.cx,
      minY: (zone.t + rad - s.top) / k - p.cy, maxY: (zone.b - rad - s.top) / k - p.cy,
    };
    if (p.bounds.maxX < p.bounds.minX) p.bounds.minX = p.bounds.maxX = (p.bounds.minX + p.bounds.maxX) / 2;
    if (p.bounds.maxY < p.bounds.minY) p.bounds.minY = p.bounds.maxY = (p.bounds.minY + p.bounds.maxY) / 2;
  };

  // --- Dispersión: posiciones, giros y rumbos aleatorios dentro de la zona
  const scatter = () => {
    const info = zoneInfo();
    const { s, k, zone } = info;

    const placed = [];
    pieces.forEach((p) => {
      const rad = p.radius * k; // radio completo: la pieza girada nunca se sale de la zona
      let c = null;
      for (let n = 0; n < 60; n++) {
        c = { x: between(zone.l + rad, zone.r - rad), y: between(zone.t + rad, zone.b - rad) };
        // Preferible no encimarse con otras piezas
        if (placed.every((o) => Math.hypot(o.x - c.x, o.y - c.y) > (o.rad + rad) * 0.9)) break;
      }
      placed.push({ ...c, rad });
      p.x = (c.x - s.left) / k - p.cx;
      p.y = (c.y - s.top) / k - p.cy;
      p.r0 = (Math.random() < 0.5 ? -1 : 1) * rand(30, 180);
      p.r = p.r0;
      p.placed = false;
      // Rumbo y giro propios, muy lentos (unidades del SVG y grados por segundo)
      const angle = rand(0, Math.PI * 2), speed = rand(5, 11);
      p.vx = Math.cos(angle) * speed; p.vy = Math.sin(angle) * speed;
      p.vr = (Math.random() < 0.5 ? -1 : 1) * rand(1.2, 3.5);
      setBounds(p, info);
      p.el.classList.toggle("is-floating", !reduceMotion);
      p.el.classList.remove("is-placed", "is-glow");
      p.hole.classList.remove("is-filled", "is-flash");
      apply(p);
    });
    root.classList.add("is-ready"); // hasta ahora las piezas estaban ocultas para evitar el salto
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

  // Al encajar: la pieza y su hueco destellan
  const place = (p, { sound = true } = {}) => {
    p.x = 0; p.y = 0; p.r = 0;
    p.placed = true;
    p.el.classList.remove("is-floating"); // deja de flotar para que el encaje se anime
    apply(p);
    p.el.classList.remove("is-dragging");
    p.el.classList.add("is-placed", "is-glow");
    p.hole.classList.remove("is-near");
    p.hole.classList.add("is-filled", "is-flash");
    p.el.addEventListener("animationend", () => p.el.classList.remove("is-glow"), { once: true });
    p.hole.addEventListener("animationend", () => p.hole.classList.remove("is-flash"), { once: true });
    if (sound) snapSound();
  };

  // Estallido de destellos desde el centro del logo
  const celebrate = () => {
    win.hidden = false;
    if (reduceMotion) return;
    winSound();
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
    audio(); // el primer gesto del usuario desbloquea el audio
    layer.append(p.el); // al frente (antes de capturar el puntero: mover el nodo lo suelta)
    p.el.setPointerCapture(e.pointerId);
    const pos = toSvg(e);
    drag = { p, id: e.pointerId, dx: p.x - pos.x, dy: p.y - pos.y };
    p.el.classList.add("is-dragging");
    p.el.style.transitionDelay = "";
  });

  layer.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { p } = drag;
    const pos = toSvg(e);
    p.x = pos.x + drag.dx;
    p.y = pos.y + drag.dy;
    const dist = Math.hypot(p.x, p.y);
    // El giro se corrige poco a poco al acercarse al hueco
    p.r = p.r0 * Math.min(Math.max((dist - SNAP) / (NEAR * 2.5), 0), 1);
    apply(p);
    p.hole.classList.toggle("is-near", dist < NEAR);
  });

  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { p } = drag;
    drag = null;
    p.el.classList.remove("is-dragging");
    p.hole.classList.remove("is-near");
    if (Math.hypot(p.x, p.y) < SNAP) { place(p); finish(); }
    else { p.r = p.r0; apply(p); } // si no encaja, vuelve a su giro suelto
  };
  layer.addEventListener("pointerup", release);
  layer.addEventListener("pointercancel", release);

  // --- Alternativa sin arrastrar: recomponer / volver a desmontar
  fix.addEventListener("click", () => {
    win.hidden = true;
    audio();
    if (placedCount() === total) {
      scatter();
      update();
    } else {
      pieces.forEach((p, i) => { p.el.style.transitionDelay = `${i * 40}ms`; place(p, { sound: false }); });
      update();
      setTimeout(celebrate, reduceMotion ? 0 : 700); // llega cuando la última pieza ya ha encajado
      setTimeout(() => pieces.forEach((p) => { p.el.style.transitionDelay = ""; }), 900);
    }
  });

  // --- Flotación continua: cada pieza deriva con su rumbo y rebota suavemente en los límites de la zona.
  // Se detiene al cogerla y al encajar; solo corre con la sección en pantalla; no existe con movimiento reducido.
  if (!reduceMotion) {
    let last = 0, frame = 0, visible = true;
    const step = (t) => {
      frame = 0;
      const dt = Math.min((t - last) / 1000, 0.1);
      last = t;
      pieces.forEach((p) => {
        if (p.placed || (drag && drag.p === p)) return;
        const b = p.bounds;
        p.x += p.vx * dt; p.y += p.vy * dt;
        // Fuera de los límites: se gira el rumbo hacia dentro, sin saltos
        if (p.x < b.minX) p.vx = Math.abs(p.vx); else if (p.x > b.maxX) p.vx = -Math.abs(p.vx);
        if (p.y < b.minY) p.vy = Math.abs(p.vy); else if (p.y > b.maxY) p.vy = -Math.abs(p.vy);
        p.r0 += p.vr * dt;
        p.r = p.r0;
        apply(p);
      });
      if (visible) frame = requestAnimationFrame(step);
    };
    const start = () => { if (!frame && visible) { last = performance.now(); frame = requestAnimationFrame(step); } };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(root);
    window.addEventListener("resize", () => { const info = zoneInfo(); pieces.forEach((p) => setBounds(p, info)); });
    start();
  }

  scatter();
  update();
}
