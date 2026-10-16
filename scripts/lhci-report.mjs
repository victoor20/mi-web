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
  const row = rows.get(path) || { perf: 1, a11y: 1, bp: 1, seo: 1, cls: 0, bad: new Set() };
  row.perf = Math.min(row.perf, c.performance.score);
  row.a11y = Math.min(row.a11y, c.accessibility.score);
  row.bp = Math.min(row.bp, c["best-practices"].score);
  row.seo = Math.min(row.seo, c.seo.score);
  row.cls = Math.max(row.cls, r.audits["cumulative-layout-shift"].numericValue);
  for (const cat of ["accessibility", "best-practices", "seo"]) {
    for (const ref of c[cat].auditRefs) { const a = r.audits[ref.id]; if (ref.weight > 0 && a.score !== null && a.score < 1) row.bad.add(a.id); }
  }
  rows.set(path, row);
  // Qué elementos se desplazan (solo si el CLS es apreciable)
  const shifts = r.audits["layout-shifts"]?.details?.items || [];
  if (r.audits["cumulative-layout-shift"].numericValue > 0.01) {
    const top = shifts.slice(0, 4).map((i) => `${i.node?.selector || i.node?.nodeLabel || "?"} (${Number(i.score).toFixed(3)})`).join(" ; ");
    console.log(`::warning title=LHCI CLS ${path}::${r.audits["cumulative-layout-shift"].numericValue.toFixed(3)} → ${top}`);
  }
}
for (const [path, r] of rows) {
  console.log(`::notice title=LHCI ${path}::perf ${r.perf} · a11y ${r.a11y} · bp ${r.bp} · seo ${r.seo} · CLS ${r.cls.toFixed(3)}${r.bad.size ? ` · fallos: ${[...r.bad].join(", ")}` : ""}`);
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
