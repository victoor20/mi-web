// Capturas de las habitaciones del Jarvis Control Center (/proyectos/jarvis/), desde material/jarvis/.
// Solo las revisadas y sin datos sensibles (rutas, usuarios, IP, puertos, nombres de equipo, cuentas u horarios de copia).
// Uso: node scripts/jarvis-images.mjs  (los resultados se versionan en src/assets/img)
import sharp from "sharp";

const ROOMS = {
  "sala-central": "material/jarvis/sala-central3.png",
  terminal: "material/jarvis/cuarto-terminal.png",
  biblioteca: "material/jarvis/biblioteca-skills1.png",
  tablon: "material/jarvis/tablon-avisos1.png",
};
for (const [id, src] of Object.entries(ROOMS)) {
  const meta = await sharp(src).metadata();
  for (const width of [480, meta.width]) {
    const base = sharp(src).resize({ width });
    const out = `src/assets/img/jarvis-${id}-${width}`;
    await base.clone().avif({ quality: 55, effort: 6 }).toFile(`${out}.avif`);
    await base.clone().webp({ quality: 80 }).toFile(`${out}.webp`);
    await base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`${out}.jpg`);
  }
  console.log(id, meta.width, meta.height);
}
