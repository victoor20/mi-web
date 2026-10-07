// Hero 3D: el logo VR reconstruido por facetas.
// - Al cargar, las piezas llegan dispersas y encajan.
// - Con el ratón, el logo se inclina y una luz cian sigue al cursor.
// - Con el scroll, se abre en "despiece" y se disuelve en partículas.
// Solo se carga desde main.js si el dispositivo lo soporta; si algo falla, queda la imagen estática.

// Coordenadas trazadas sobre logo-vr-source.jpg (1280x1021). Se centran y escalan abajo.
const SRC = { cx: 585, cy: 418, scale: 100 };
const T = ([x, y]) => [(x - SRC.cx) / SRC.scale, -(y - SRC.cy) / SRC.scale];

const FACETS = [
  { pts: [[35, 5], [300, 108], [120, 143]], color: "#00d8fa" },
  { pts: [[120, 143], [300, 108], [487, 425], [385, 598]], color: "#1a94f8" },
  { pts: [[385, 598], [487, 425], [590, 598], [487, 780]], color: "#0a40f6" },
  { pts: [[487, 425], [670, 108], [766, 290], [590, 598]], color: "#0c8cf7" },
  { pts: [[670, 108], [870, 108], [766, 290]], color: "#00d0f8" },
  { bowl: true, color: "#0b7ef5" },
  { pts: [[800, 357], [935, 470], [735, 480]], color: "#22b6f8", lift: 0.012 },
  { pts: [[735, 480], [940, 480], [875, 712]], color: "#0757f3" },
  { pts: [[940, 480], [1135, 830], [875, 712]], color: "#1ca2f8" },
];
const LOGO_W = 11; // ancho aproximado del logo en unidades de escena
const LOGO_H = 8.25;

export async function initHero3D(stage, threeUrl) {
  const THREE = await import(threeUrl);

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 200);

  // Luces: clave suave desde arriba-izquierda y una luz cian que sigue al cursor
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const key = new THREE.DirectionalLight(0xdff4ff, 2.1);
  key.position.set(-6, 8, 10);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x0206fd, 1.4);
  rim.position.set(6, -6, -4);
  scene.add(rim);
  const pointer = new THREE.PointLight(0x00e9fe, 30, 0, 1.4);
  pointer.position.set(0, 0, 6);
  scene.add(pointer);

  const logo = new THREE.Group();
  scene.add(logo);

  /* ---------- Facetas ---------- */
  const DEPTH = 0.34;
  const extrude = { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.025, bevelSegments: 2, curveSegments: 28 };
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x8cecff, transparent: true, opacity: 0.12, depthWrite: false });

  const shapes = [];
  const pieces = FACETS.map((f, i) => {
    const shape = f.bowl ? bowlShape(THREE) : polyShape(THREE, f.pts);
    shapes.push(shape);
    const geo = new THREE.ExtrudeGeometry(shape, extrude);
    geo.computeBoundingBox();
    const centre = new THREE.Vector3();
    geo.boundingBox.getCenter(centre);
    geo.translate(-centre.x, -centre.y, -centre.z);

    const color = new THREE.Color(f.color);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.36, metalness: 0.08, emissive: color, emissiveIntensity: 0.22 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), edgeMat));

    const home = new THREE.Vector3(centre.x, centre.y, (f.lift || 0) * 10);
    mesh.position.copy(home);
    logo.add(mesh);

    const rand = mulberry32(17 + i * 31);
    const outward = new THREE.Vector3(centre.x, centre.y, 0).normalize();
    return {
      mesh,
      home,
      start: new THREE.Vector3((rand() - 0.5) * 9, (rand() - 0.5) * 7, 4 + rand() * 4),
      startRot: new THREE.Euler((rand() - 0.5) * 2.4, (rand() - 0.5) * 2.4, (rand() - 0.5) * 1.6),
      explode: outward.multiplyScalar(1.1 + rand() * 0.6).add(new THREE.Vector3(0, 0, ((i % 3) - 1) * 1.3)),
      spin: new THREE.Vector3((rand() - 0.5) * 0.6, (rand() - 0.5) * 0.6, (rand() - 0.5) * 0.3),
      delay: i * 0.06,
    };
  });

  /* ---------- Partículas: superficie del logo + polvo ambiental ---------- */
  const surfaceCount = coarse ? 900 : 1800;
  const dustCount = coarse ? 160 : 320;
  const total = surfaceCount + dustCount;
  const aBase = new Float32Array(total * 3);
  const aDir = new Float32Array(total * 3);
  const aSeed = new Float32Array(total);
  const aDust = new Float32Array(total);
  const rand = mulberry32(2024);

  const tris = surfaceTriangles(THREE, shapes);
  const areaSum = tris.reduce((s, t) => s + t.area, 0);
  for (let i = 0; i < surfaceCount; i++) {
    let r = rand() * areaSum;
    let tri = tris[0];
    for (const t of tris) { r -= t.area; if (r <= 0) { tri = t; break; } }
    let u = rand(), v = rand();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const x = tri.a.x + u * (tri.b.x - tri.a.x) + v * (tri.c.x - tri.a.x);
    const y = tri.a.y + u * (tri.b.y - tri.a.y) + v * (tri.c.y - tri.a.y);
    aBase.set([x, y, DEPTH / 2 + 0.05], i * 3);
    const d = new THREE.Vector3(x + (rand() - 0.5) * 3, y + (rand() - 0.5) * 3, (rand() - 0.2) * 6).normalize().multiplyScalar(2 + rand() * 4);
    aDir.set([d.x, d.y, d.z], i * 3);
    aSeed[i] = rand();
  }
  for (let i = surfaceCount; i < total; i++) {
    aBase.set([(rand() - 0.5) * 22, (rand() - 0.5) * 15, (rand() - 0.5) * 10 - 2], i * 3);
    aDir.set([(rand() - 0.5) * 2, (rand() - 0.5) * 2, (rand() - 0.5) * 2], i * 3);
    aSeed[i] = rand();
    aDust[i] = 1;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(aBase, 3));
  pGeo.setAttribute("aDir", new THREE.BufferAttribute(aDir, 3));
  pGeo.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 1));
  pGeo.setAttribute("aDust", new THREE.BufferAttribute(aDust, 1));
  const pMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uIntro: { value: 0 },
      uPixel: { value: renderer.getPixelRatio() },
      uCyan: { value: new THREE.Color("#00e9fe") },
      uAzure: { value: new THREE.Color("#0c8cf7") },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aDir;
      attribute float aSeed;
      attribute float aDust;
      uniform float uTime, uScroll, uIntro, uPixel;
      varying float vAlpha;
      varying float vSeed;
      void main() {
        vec3 p = position;
        float t = uTime * (0.25 + aSeed * 0.35) + aSeed * 6.2831;
        if (aDust > 0.5) {
          p += aDir * 0.35 * vec3(sin(t), cos(t * 0.8), sin(t * 0.6));
          vAlpha = 0.22 * uIntro;
        } else {
          float s = smoothstep(0.0, 1.0, uScroll);
          p += aDir * s * (0.8 + aSeed * 0.6);
          p += 0.03 * vec3(sin(t * 2.0), cos(t * 1.7), 0.0);
          vAlpha = (0.05 + smoothstep(0.02, 0.35, uScroll) * 0.85) * (1.0 - s * 0.55) * uIntro;
        }
        vSeed = aSeed;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (aDust > 0.5 ? 2.2 : 2.6 + aSeed * 1.6) * uPixel * (12.0 / -mv.z);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uCyan, uAzure;
      varying float vAlpha;
      varying float vSeed;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(mix(uAzure, uCyan, vSeed), a * vAlpha);
      }`,
  });
  const points = new THREE.Points(pGeo, pMat);
  points.frustumCulled = false;
  logo.add(points);

  /* ---------- Tamaño ---------- */
  let baseDistance = 40;
  let shown = false;
  const resize = () => {
    const { width, height } = renderer.domElement.parentElement.getBoundingClientRect();
    const w = width * 1.24, h = height * 1.24; // el canvas sangra un 12 % por cada lado
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const tan = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const dW = LOGO_W / 0.68 / (tan * camera.aspect);
    const dH = LOGO_H / 0.7 / tan;
    baseDistance = Math.max(dW, dH);
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(stage);

  /* ---------- Entrada: ratón y scroll ---------- */
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let lastInput = performance.now();

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
    lastInput = performance.now();
  }, { passive: true });

  const hero = stage.closest(".hero") || stage;
  let scrollTarget = 0;
  let scroll = 0;
  const readScroll = () => {
    const r = hero.getBoundingClientRect();
    scrollTarget = Math.min(1, Math.max(0, -r.top / (r.height * 0.85)));
    lastInput = performance.now();
  };
  window.addEventListener("scroll", readScroll, { passive: true });
  readScroll();

  /* ---------- Bucle de render (solo visible) ---------- */
  let visible = true;
  let running = false;
  let raf = 0;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }).observe(stage);
  document.addEventListener("visibilitychange", schedule);

  const t0 = performance.now();
  let prev = t0;
  const INTRO = 1.9;
  let frame = 0;

  function schedule() {
    const should = visible && !document.hidden;
    if (should && !running) { running = true; prev = performance.now(); raf = requestAnimationFrame(tick); }
    if (!should && running) { running = false; cancelAnimationFrame(raf); }
  }

  function tick(now) {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    const dt = Math.min((now - prev) / 1000, 0.05);
    prev = now;
    const time = (now - t0) / 1000;
    const introT = Math.min(1, time / INTRO);
    const idle = introT >= 1 && now - lastInput > 2500;
    // En reposo basta con 30 fps
    frame++;
    if (idle && frame % 2) return;

    const ease = 1 - Math.pow(0.0012, dt);
    current.x += (target.x - current.x) * ease * 3.2;
    current.y += (target.y - current.y) * ease * 3.2;
    scroll += (scrollTarget - scroll) * Math.min(1, ease * 5);
    const s = smooth(scroll);

    pieces.forEach((p) => {
      const k = easeOutExpo(Math.min(1, Math.max(0, (introT * INTRO - p.delay) / (INTRO - 0.6))));
      const inv = 1 - k;
      p.mesh.position.set(
        p.home.x + p.start.x * inv + p.explode.x * s,
        p.home.y + p.start.y * inv + p.explode.y * s,
        p.home.z + p.start.z * inv + p.explode.z * s
      );
      p.mesh.rotation.set(
        p.startRot.x * inv + p.spin.x * s,
        p.startRot.y * inv + p.spin.y * s,
        p.startRot.z * inv + p.spin.z * s
      );
    });

    logo.rotation.y = current.x * 0.32 + s * 0.55 + Math.sin(time * 0.35) * 0.04;
    logo.rotation.x = current.y * 0.2 + s * 0.18;
    logo.position.y = Math.sin(time * 0.6) * 0.07 + s * 0.4;

    pointer.position.set(current.x * 7, -current.y * 5, 6);
    edgeMat.opacity = 0.1 + s * 0.55;

    camera.position.set(0, 0, baseDistance * (1 - s * 0.12));
    camera.lookAt(0, 0, 0);

    pMat.uniforms.uTime.value = time;
    pMat.uniforms.uScroll.value = s;
    pMat.uniforms.uIntro.value = easeOutExpo(introT);

    renderer.render(scene, camera);
    if (!shown) { stage.classList.add("is-3d"); shown = true; }
  }

  renderer.domElement.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    running = false;
    cancelAnimationFrame(raf);
    stage.classList.remove("is-3d");
  });

  resize();
  schedule();
}

/* ---------- Geometría ---------- */
function polyShape(THREE, pts) {
  const s = new THREE.Shape();
  pts.map(T).forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return s;
}

// Panza de la R: arco exterior, base, contrapunzón redondeado y diagonal superior
function bowlShape(THREE) {
  const s = new THREE.Shape();
  const [ox, oy] = T([870, 295]);
  const [ex, ey] = T([940, 468]);
  const R = 1.87;
  s.moveTo(...T([870, 108]));
  s.absarc(ox, oy, R, Math.PI / 2, Math.atan2(ey - oy, ex - ox), true);
  s.lineTo(...T([735, 480]));
  s.lineTo(...T([800, 357]));
  s.lineTo(...T([850, 357]));
  const [ix, iy] = T([850, 316]);
  s.absarc(ix, iy, 0.41, -Math.PI / 2, Math.PI / 2, false);
  s.lineTo(...T([780, 275]));
  s.closePath();
  return s;
}

function surfaceTriangles(THREE, shapes) {
  const out = [];
  shapes.forEach((shape) => {
    const { shape: contour, holes } = shape.extractPoints(16);
    const faces = THREE.ShapeUtils.triangulateShape(contour, holes);
    const all = contour.concat(...holes);
    faces.forEach(([i, j, k]) => {
      const a = all[i], b = all[j], c = all[k];
      const area = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
      out.push({ a, b, c, area });
    });
  });
  return out;
}

/* ---------- Utilidades ---------- */
function easeOutExpo(x) { return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x); }
function smooth(x) { return x * x * (3 - 2 * x); }
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
