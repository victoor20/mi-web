// Genera las variantes optimizadas del logo y los iconos.
// Uso: npm run images  (los resultados se versionan en src/assets/img)
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "src/assets/logo-vr-email.png"; // 840x650 con transparencia: la versión de más resolución
const OUT = "src/assets/img";
const BG = "#03060C";

await mkdir(OUT, { recursive: true });

// Logo en los anchos que usa la web (cabecera 1x/2x y hero)
for (const width of [112, 224, 480, 840]) {
  const base = sharp(SRC).resize({ width });
  await base.clone().avif({ quality: 60, effort: 6 }).toFile(`${OUT}/logo-vr-${width}.avif`);
  await base.clone().webp({ quality: 82, alphaQuality: 90 }).toFile(`${OUT}/logo-vr-${width}.webp`);
  await base.clone().png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/logo-vr-${width}.png`);
}

// Iconos cuadrados: el logo centrado con margen
async function icon(size, file, { background = null, pad = 0.12 } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const logo = await sharp(SRC).resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${file}`);
}

await icon(32, "icon-32.png", { pad: 0.02 });
await icon(192, "icon-192.png", { background: BG });
await icon(512, "icon-512.png", { background: BG });
await icon(180, "apple-touch-icon.png", { background: BG, pad: 0.16 });

// Imagen para redes sociales (Open Graph): 1200x630, logo a la izquierda y texto a la derecha.
// El texto es SVG renderizado con las fuentes del sistema; revisa el resultado si cambias de equipo.
async function ogImage(file, lines) {
  const W = 1200, H = 630;
  const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="glow" cx="22%" cy="50%" r="60%">
      <stop offset="0" stop-color="#0c8cf7" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#03060C" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="line" x1="0" x2="1">
      <stop offset="0" stop-color="#00e9fe"/><stop offset="1" stop-color="#044af6"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="${BG}"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <g font-family="Archivo, 'Segoe UI', Arial, sans-serif" fill="#e9f1ff">
    <text x="560" y="262" font-size="68" font-weight="700" letter-spacing="-1">Víctor Rocamora</text>
    <rect x="562" y="294" width="120" height="5" rx="2.5" fill="url(#line)"/>
    <text x="560" y="368" font-size="34" fill="#b9c8de">${lines[0]}</text>
    <text x="560" y="414" font-size="34" fill="#b9c8de">${lines[1]}</text>
  </g>
  <text x="560" y="520" font-family="'JetBrains Mono', Consolas, monospace" font-size="26" fill="#00d0f8">victorrocamora.com</text>
</svg>`;
  const logo = await sharp(SRC).resize({ width: 420 }).toBuffer();
  const { height: lh } = await sharp(logo).metadata();
  await sharp(Buffer.from(bg))
    .composite([{ input: logo, left: 90, top: Math.round((H - lh) / 2) }])
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${file}`);
}

// og-default: modo comercial. og-portfolio: modo portfolio (site.js elige cuál usar según site.mode)
await ogImage("og-default.png", ["Servicio técnico informático", "y laboratorio de IA"]);
await ogImage("og-portfolio.png", ["Técnico de sistemas, guías tech", "y laboratorio de IA"]);

// Fotos y capturas de la carpeta material/ (los originales no se suben al repositorio: está en .gitignore).
// Cada una sale en AVIF, WebP y JPG a los anchos indicados. Si material/ no existe, se omite.
import { existsSync } from "node:fs";
const MATERIAL = "material";
const photos = [
  // [archivo, nombre de salida, recorte {left, top, width, height} o null, anchos]
  ["Foto.png", "victor-retrato", { left: 50, top: 100, width: 920, height: 1150 }, [360, 720]],
  ["Control Center Jarvis.png", "jarvis-control-center", null, [640, 1229]],
  // Solo la respuesta de Jarvis: el mensaje inferior incluye rutas reales de la instalación
  ["chat jarvis telegram.png", "jarvis-telegram", { left: 0, top: 0, width: 885, height: 470 }, [640, 885]],
  ["JAM1.jpg", "aws-jam-equipo", null, [640, 1280]],
  ["JAM2.jpg", "aws-jam-retos", null, [640, 1280]],
];
if (existsSync(MATERIAL)) {
  for (const [file, name, crop, widths] of photos) {
    const base = crop ? sharp(`${MATERIAL}/${file}`).extract(crop) : sharp(`${MATERIAL}/${file}`);
    for (const width of widths) {
      const img = base.clone().resize({ width });
      await img.clone().avif({ quality: 55, effort: 6 }).toFile(`${OUT}/${name}-${width}.avif`);
      await img.clone().webp({ quality: 78 }).toFile(`${OUT}/${name}-${width}.webp`);
      const { info } = await img.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(`${OUT}/${name}-${width}.jpg`).then((info) => ({ info }));
      console.log(`${name}-${width}: ${info.width}x${info.height}`);
    }
  }
}

const meta = await sharp(SRC).metadata();
console.log(`Imágenes generadas desde ${SRC} (${meta.width}x${meta.height}) en ${OUT}`);
