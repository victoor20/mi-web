// Resume los resultados de Lighthouse CI como anotaciones del run de GitHub (visibles sin descargar artefactos).
// Se ejecuta siempre tras "lhci autorun": cada URL con su peor puntuación y su CLS, y las aserciones que han fallado.
import fs from "node:fs";

const dir = ".lighthouseci";
if (!fs.existsSync(dir)) { console.log("::warning title=LHCI::No hay carpeta .lighthouseci"); process.exit(0); }

const rows = new Map();
for (const f of fs.readdirSync(dir).filter((n) => /^lhr-.*\.json$/.test(n))) {
  const r = JSON.parse(fs.readFileSync(`${dir}/${f}`, "utf8"));
  const path = new URL(r.finalUrl).pathname;
  const c = r.categories;
  const row = rows.get(path) || { perf: 1, a11y: 1, bp: 1, seo: 1, cls: 0, bad: new Set(), worst: null };
  row.perf = Math.min(row.perf, c.performance.score);
  row.a11y = Math.min(row.a11y, c.accessibility.score);
  row.bp = Math.min(row.bp, c["best-practices"].score);
  row.seo = Math.min(row.seo, c.seo.score);
  row.cls = Math.max(row.cls, r.audits["cumulative-layout-shift"].numericValue);
  for (const cat of ["accessibility", "best-practices", "seo"]) {
    for (const ref of c[cat].auditRefs) { const a = r.audits[ref.id]; if (ref.weight > 0 && a.score !== null && a.score < 1) row.bad.add(a.id); }
  }
  // Se guarda el run de rendimiento más bajo de los tres, para poder explicar por qué fue el peor
  if (!row.worst || c.performance.score < row.worst.score) row.worst = { score: c.performance.score, r };
  rows.set(path, row);
  // Qué elementos se desplazan (solo si el CLS es apreciable)
  const shifts = r.audits["layout-shifts"]?.details?.items || [];
  if (r.audits["cumulative-layout-shift"].numericValue > 0.01) {
    const top = shifts.slice(0, 4).map((i) => `${i.node?.selector || i.node?.nodeLabel || "?"} (${Number(i.score).toFixed(3)})`).join(" ; ");
    console.log(`::warning title=LHCI CLS ${path}::${r.audits["cumulative-layout-shift"].numericValue.toFixed(3)} → ${top}`);
  }
}
for (const [path, row] of rows) {
  console.log(`::notice title=LHCI ${path}::perf ${row.perf} · a11y ${row.a11y} · bp ${row.bp} · seo ${row.seo} · CLS ${row.cls.toFixed(3)}${row.bad.size ? ` · fallos: ${[...row.bad].join(", ")}` : ""}`);
  // Si el rendimiento varía o es bajo en alguna de las tres pasadas, se detalla esa pasada: métricas clave,
  // en qué se fue el hilo principal y las peticiones más lentas. Así se puede diagnosticar sin bajar el artefacto.
  if (row.worst && row.worst.score < 0.9) {
    const r = row.worst.r;
    const a = r.audits;
    const ms = (id) => Math.round(a[id]?.numericValue ?? NaN);
    const mtwb = (a["mainthread-work-breakdown"]?.details?.items || [])
      .slice().sort((x, y) => y.duration - x.duration).slice(0, 3)
      .map((i) => `${i.groupLabel} ${Math.round(i.duration)}ms`).join(", ");
    const nr = a["network-requests"]?.details?.items || [];
    const slowest = nr.slice().sort((x, y) => (y.networkEndTime - y.networkRequestTime) - (x.networkEndTime - x.networkRequestTime)).slice(0, 5)
      .map((i) => `${(i.url.split("/").pop() || i.url).slice(0, 40)} ${Math.round(i.networkEndTime - i.networkRequestTime)}ms@${Math.round(i.rendererStartTime)}ms`).join(", ");
    console.log(`::notice title=LHCI detalle ${path}::peor pasada perf ${row.worst.score} · FCP ${ms("first-contentful-paint")}ms · LCP ${ms("largest-contentful-paint")}ms · TBT ${ms("total-blocking-time")}ms · SI ${ms("speed-index")}ms · hilo principal: ${mtwb || "—"} · peticiones más lentas: ${slowest || "—"}`);
  }
}

const file = `${dir}/assertion-results.json`;
if (fs.existsSync(file)) {
  const fails = JSON.parse(fs.readFileSync(file, "utf8"));
  const seen = new Set();
  for (const a of fails) {
    const key = `${a.url}|${a.auditId || a.name}`;
    if (seen.has(key) || seen.size >= 9) continue;
    seen.add(key);
    console.log(`::error title=LHCI aserción::${new URL(a.url).pathname} · ${a.auditId || a.name} · esperado ${a.operator || ""} ${a.expected ?? ""} · real ${a.actual ?? ""} · ${a.level || ""}`);
  }
}
