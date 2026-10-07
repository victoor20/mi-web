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

const meta = await sharp(SRC).metadata();
console.log(`Imágenes generadas desde ${SRC} (${meta.width}x${meta.height}) en ${OUT}`);
