// Campo de destellos ambiental: el mismo ADN que el logo (destellos de cuatro puntas cian/azul).
// Aparecen y se desvanecen solos, y reaccionan al ratón. Se pausa cuando la pestaña no se ve.

const COLORS = ["0, 233, 254", "0, 208, 248", "12, 140, 247", "120, 200, 255"];
const SPRITE_R = 8; // tamaño de referencia del sprite: el mayor destello posible, para escalar siempre hacia abajo

// Destello de cuatro puntas con su brillo, en el sistema de coordenadas actual de ctx
function drawStar(ctx, r) {
  ctx.beginPath();
  ctx.moveTo(0, -r * 2.2);
  ctx.lineTo(r * 0.35, -r * 0.35);
  ctx.lineTo(r * 2.2, 0);
  ctx.lineTo(r * 0.35, r * 0.35);
  ctx.lineTo(0, r * 2.2);
  ctx.lineTo(-r * 0.35, r * 0.35);
  ctx.lineTo(-r * 2.2, 0);
  ctx.lineTo(-r * 0.35, -r * 0.35);
  ctx.closePath();
  ctx.fill();
}

// Sprites por color dibujados una sola vez, en píxeles de dispositivo como el original: la forma escala
// con dpr y el desenfoque no (shadowBlur ignora la transformación). Escalar por r / SPRITE_R reproduce
// cualquier tamaño. Van por separado el brillo (solo la sombra) y la forma, para componerlos igual que
// canvas compone una sombra: brillo con alfa² (alfa del color de sombra × alfa del relleno) y forma encima.
function makeSprites(dpr) {
  const blur = SPRITE_R * 3;
  const half = Math.ceil(SPRITE_R * 2.2 * dpr + blur * 1.6);
  const layer = (paint) => {
    const c = document.createElement("canvas");
    c.width = c.height = half * 2;
    paint(c.getContext("2d"));
    return c;
  };
  return COLORS.map((color) => ({
    half,
    // La forma se dibuja fuera del lienzo y solo cae dentro su sombra desplazada
    glow: layer((g) => {
      const off = half * 4;
      g.translate(half - off, half);
      g.fillStyle = g.shadowColor = `rgb(${color})`;
      g.shadowBlur = blur;
      g.shadowOffsetX = off;
      drawStar(g, SPRITE_R * dpr);
    }),
    core: layer((g) => {
      g.translate(half, half);
      g.fillStyle = `rgb(${color})`;
      drawStar(g, SPRITE_R * dpr);
    }),
  }));
}

export function initAmbient() {
  const canvas = document.createElement("canvas");
  canvas.className = "ambient";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const MAX = coarse ? 10 : 30;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const sprites = makeSprites(dpr);
  let w = 0, h = 0;
  const sparks = [];
  const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, last: 0 };

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.imageSmoothingQuality = "medium"; // reescalado del sprite más fiel a la forma vectorial
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const spawn = (x, y, boost = 0) => {
    sparks.push({
      x: x ?? Math.random() * w,
      y: y ?? Math.random() * h,
      size: 2 + Math.random() * 4 + boost * 2,
      life: 0,
      ttl: 2.4 + Math.random() * 3.2 - boost,
      drift: (Math.random() - 0.5) * 6,
      rise: -4 - Math.random() * 6,
      rot: Math.random() * Math.PI,
      sprite: sprites[(Math.random() * sprites.length) | 0],
      peak: 0.25 + Math.random() * 0.45 + boost * 0.3,
    });
  };

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const now = performance.now();
    mouse.vx = e.clientX - mouse.x;
    mouse.vy = e.clientY - mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    // Al mover el ratón con cierta velocidad deja algún destello cerca
    const speed = Math.hypot(mouse.vx, mouse.vy);
    if (speed > 18 && now - mouse.last > 140 && sparks.length < MAX + 8) {
      mouse.last = now;
      spawn(e.clientX + (Math.random() - 0.5) * 60, e.clientY + (Math.random() - 0.5) * 60, 0.6);
    }
  }, { passive: true });
  document.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });

  // Sprite girado y escalado con una sola matriz (en píxeles de dispositivo), sin save/restore
  const star = (s, alpha) => {
    const k = s.size / SPRITE_R;
    const cos = Math.cos(s.rot) * k, sin = Math.sin(s.rot) * k;
    const { glow, core, half } = s.sprite;
    ctx.setTransform(cos, sin, -sin, cos, s.x * dpr, s.y * dpr);
    ctx.globalAlpha = alpha * alpha;
    ctx.drawImage(glow, -half, -half);
    ctx.globalAlpha = alpha;
    ctx.drawImage(core, -half, -half);
  };

  let running = false;
  let raf = 0;
  let prev = 0;
  let acc = 0;

  const tick = (now) => {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    const dt = Math.min((now - prev) / 1000, 0.1);
    prev = now;
    acc += dt;
    if (acc < 1 / 30) return; // 30 fps bastan para algo tan sutil
    const step = acc;
    acc = 0;

    if (sparks.length < MAX && Math.random() < step * 3) spawn();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life += step;
      const t = s.life / s.ttl;
      if (t >= 1) { sparks.splice(i, 1); continue; }
      s.x += s.drift * step;
      s.y += s.rise * step;
      s.rot += step * 0.4;
      // El ratón aparta suavemente los destellos cercanos y los aviva
      const dx = s.x - mouse.x, dy = s.y - mouse.y;
      const d = Math.hypot(dx, dy);
      let glow = 1;
      if (d < 140) {
        const f = (1 - d / 140);
        s.x += (dx / (d || 1)) * f * 40 * step;
        s.y += (dy / (d || 1)) * f * 40 * step;
        glow += f * 0.8;
      }
      const alpha = Math.sin(Math.PI * t) ** 1.6 * s.peak * glow;
      star(s, Math.min(alpha, 0.95));
    }
  };

  const schedule = () => {
    const should = !document.hidden;
    if (should && !running) { running = true; prev = performance.now(); raf = requestAnimationFrame(tick); }
    if (!should && running) { running = false; cancelAnimationFrame(raf); }
  };
  document.addEventListener("visibilitychange", schedule);
  for (let i = 0; i < MAX / 2; i++) { spawn(); sparks[i].life = Math.random() * sparks[i].ttl; }
  schedule();
  requestAnimationFrame(() => canvas.classList.add("is-on"));
}
