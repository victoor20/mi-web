// 404: las piezas del logo están sueltas y se arrastran (ratón o dedo) hasta su hueco.
// En cada visita aparecen en posiciones y giros aleatorios por la zona de juego (sin tapar el texto ni los botones).
// Encajan al soltarlas cerca de su hueco y entonces se corrige su giro. "Recomponer el logo" es la alternativa
// sin arrastrar, también para teclado. Sin JavaScript se ve el logo desmontado con sus huecos.
const SNAP = 34; // distancia (unidades del SVG) a la que una pieza encaja al soltarla
const NEAR = 80; // distancia a la que su hueco se ilumina
const MUTE_KEY = "vr-404-silencio";

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
  const soundBtn = root.querySelector("[data-sound]");
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

  // --- Sonido: Web Audio, sin archivos. Sin movimiento reducido no hay sonido ni botón.
  let ctx = null;
  let muted = false;
  try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch { /* sin almacenamiento: no se recuerda */ }
  const audioOk = !reduceMotion && (window.AudioContext || window.webkitAudioContext);

  const paintSound = () => {
    soundBtn.setAttribute("aria-pressed", String(muted));
    soundBtn.querySelector("[data-sound-label]").textContent = muted ? "Sonido silenciado" : "Sonido activado";
  };
  if (audioOk) {
    soundBtn.hidden = false;
    paintSound();
    soundBtn.addEventListener("click", () => {
      muted = !muted;
      try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch { /* ignorar */ }
      paintSound();
    });
  }
  const audio = () => {
    if (!audioOk || muted) return null;
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

  // --- Dispersión: posiciones y giros aleatorios por la zona de juego
  const scatter = () => {
    const s = svg.getBoundingClientRect();
    const k = s.width / 1170;
    const pr = play.getBoundingClientRect();
    const header = document.querySelector("[data-header]")?.getBoundingClientRect().bottom ?? 72;
    const sec = root.getBoundingClientRect();
    const wide = window.matchMedia("(min-width: 861px)").matches;
    // Zona: la columna de juego; en escritorio, a todo lo alto de la sección
    const zone = {
      l: pr.left + 8,
      r: pr.right - 8,
      t: Math.max(wide ? sec.top : pr.top - 50, header + 8),
      b: wide ? Math.min(sec.bottom, window.innerHeight) - 16 : pr.bottom,
    };
    const st = status.getBoundingClientRect();
    const keepOut = { l: st.left - 12, r: st.right + 12, t: st.top - 12, b: st.bottom + 12 }; // texto de ayuda, contador y sonido
    const lb = svg.querySelector(".lost__holes").getBBox();
    const logo = { l: s.left + (lb.x + lb.width * 0.15) * k, r: s.left + (lb.x + lb.width * 0.85) * k, t: s.top + (lb.y + lb.height * 0.15) * k, b: s.top + (lb.y + lb.height * 0.85) * k };
    const hits = (c, rad, box) => c.x + rad > box.l && c.x - rad < box.r && c.y + rad > box.t && c.y - rad < box.b;

    const placed = [];
    pieces.forEach((p) => {
      const rad = p.radius * k;
      let best = null;
      for (let n = 0; n < 80; n++) {
        const c = { x: rand(zone.l + rad, zone.r - rad), y: rand(zone.t + rad, Math.max(zone.t + rad, zone.b - rad)) };
        if (hits(c, rad, keepOut)) continue; // radio completo: la pieza girada nunca tapa el texto
        best = c;
        // Mejor candidato: fuera del logo y sin pisar a otras piezas
        const apart = placed.every((o) => Math.hypot(o.x - c.x, o.y - c.y) > (o.rad + rad) * 0.6);
        if (n < 50 && (hits(c, rad * 0.6, logo) || !apart)) continue;
        break;
      }
      best = best || { x: (zone.l + zone.r) / 2, y: zone.t + rad };
      placed.push({ ...best, rad });
      p.x = (best.x - s.left) / k - p.cx;
      p.y = (best.y - s.top) / k - p.cy;
      p.r0 = (Math.random() < 0.5 ? -1 : 1) * rand(30, 180);
      p.r = p.r0;
      p.placed = false;
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

  scatter();
  update();
}
