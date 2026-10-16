// Captura de Telegram de /proyectos/jarvis/: se pixela la frase sobre la instalación global («root-owned») y el
// fragmento de texto que asoma bajo la cabecera, antes de optimizar. Origen: material/chat jarvis telegram.png (no se versiona).
// Uso: node scripts/telegram-image.mjs [archivo-de-revisión.png]
import sharp from "sharp";

const SRC = "material/chat jarvis telegram.png";
const BASE_W = 885; // las zonas están medidas sobre la versión publicada de 885 px de ancho
const RECTS = [[40, 420, 466, 24], [40, 0, 456, 14]];
const BLOCK = 9;
const CROP_H = 470; // solo se publica la parte superior de la captura (el mensaje de Jarvis)

const meta = await sharp(SRC).metadata();
const k = meta.width / BASE_W;
const layers = [];
for (const [x, y, w, h] of RECTS) {
  const r = [Math.round(x * k), Math.round(y * k), Math.round(w * k), Math.round(h * k)];
  const small = await sharp(SRC).extract({ left: r[0], top: r[1], width: r[2], height: r[3] })
    .resize({ width: Math.max(1, Math.round(r[2] / (BLOCK * k))), height: Math.max(1, Math.round(r[3] / (BLOCK * k))) }).toBuffer();
  layers.push({ input: await sharp(small).resize({ width: r[2], height: r[3], kernel: "nearest" }).toBuffer(), left: r[0], top: r[1] });
}
const full = await sharp(SRC).composite(layers).png().toBuffer();
const buf = await sharp(full).extract({ left: 0, top: 0, width: meta.width, height: CROP_H }).png().toBuffer();
if (process.argv[2]) await sharp(buf).toFile(process.argv[2]);
for (const w of [640, 885]) {
  const base = sharp(buf).resize({ width: w });
  const out = `src/assets/img/jarvis-telegram-${w}`;
  await base.clone().avif({ quality: 55, effort: 6 }).toFile(`${out}.avif`);
  await base.clone().webp({ quality: 80 }).toFile(`${out}.webp`);
  await base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`${out}.jpg`);
}
console.log("ok", meta.width, meta.height);
