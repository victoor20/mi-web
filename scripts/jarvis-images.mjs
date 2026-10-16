// Capturas del Jarvis Control Center (/proyectos/jarvis/), desde material/jarvis/ (no se versiona).
// Antes de publicar se pixela en cada una lo sensible: rutas, usuarios, IP, nombres de equipo, tokens o claves, cuentas,
// horarios de copia, puertos y números de versión exactos. Las que no se pueden limpiar bien no se usan.
// Uso: node scripts/jarvis-images.mjs [carpeta-de-revisión]  (los resultados se versionan en src/assets/img/jarvis)
import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";

sharp.cache(false);

const BLOCK = 9; // tamaño del pixelado
// [x, y, ancho, alto] en píxeles de la captura original, con margen
export const REDACT = {
  "sala-central1": [[262, 252, 204, 28], [34, 348, 210, 36], [486, 348, 212, 36], [376, 626, 154, 40]],
  "sala-central2": [[381, 224, 154, 44]],
  "sala-central3": [[498, 566, 224, 34], [598, 622, 124, 32]],
  "cuarto-terminal": [],
  "biblioteca-skills1": [],
  "biblioteca-skills2": [],
  "cuarto-seguridad1": [[452, 172, 260, 30], [24, 226, 86, 32], [352, 450, 360, 68]],
  "cuarto-seguridad2": [[30, 292, 58, 26], [267, 292, 50, 26], [505, 292, 58, 26]],
  "tablon-avisos1": [[393, 270, 110, 30]],
  "comunicaciones": [[34, 492, 70, 24], [276, 492, 126, 24]],
  "cuarto-servidor1": [[50, 310, 300, 32], [390, 310, 300, 32], [50, 376, 144, 30], [390, 376, 144, 30]],
  "cuarto-servidor2": [[38, 86, 304, 102], [378, 86, 324, 102]],
};
// La portada (captura general) ya estaba optimizada en src/assets/img: se pixela la versión del panel
const COVER = { src: "src/assets/img/jarvis-control-center-1229.jpg", rects: [[28, 24, 266, 28]] };

async function redact(input, rects) {
  const img = sharp(input);
  const layers = [];
  for (const [x, y, w, h] of rects) {
    const small = await sharp(input).extract({ left: x, top: y, width: w, height: h })
      .resize({ width: Math.max(1, Math.round(w / BLOCK)), height: Math.max(1, Math.round(h / BLOCK)) }).toBuffer();
    const big = await sharp(small).resize({ width: w, height: h, kernel: "nearest" }).toBuffer();
    layers.push({ input: big, left: x, top: y });
  }
  return layers.length ? img.composite(layers).png().toBuffer() : img.png().toBuffer();
}

const review = process.argv[2];
await mkdir("src/assets/img/jarvis", { recursive: true });
if (review) await mkdir(review, { recursive: true });
for (const [name, rects] of Object.entries(REDACT)) {
  const buf = await redact(`material/jarvis/${name}.png`, rects);
  if (review) await sharp(buf).toFile(`${review}/${name}.png`);
  const { width, height } = await sharp(buf).metadata();
  for (const w of [480, width]) {
    const base = sharp(buf).resize({ width: w });
    const out = `src/assets/img/jarvis/${name}-${w}`;
    await base.clone().avif({ quality: 55, effort: 6 }).toFile(`${out}.avif`);
    await base.clone().webp({ quality: 80 }).toFile(`${out}.webp`);
    await base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`${out}.jpg`);
  }
  console.log(name, width, height);
}
// Portada
// se lee a memoria primero: se escribe sobre el mismo archivo
const cover = await redact(await readFile(COVER.src), COVER.rects);
if (review) await sharp(cover).toFile(`${review}/portada.png`);
for (const w of [640, 1229]) {
  const base = sharp(cover).resize({ width: w });
  const out = `src/assets/img/jarvis-control-center-${w}`;
  await base.clone().avif({ quality: 55, effort: 6 }).toFile(`${out}.avif`);
  await base.clone().webp({ quality: 80 }).toFile(`${out}.webp`);
  await base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`${out}.jpg`);
}
console.log("portada ok");
