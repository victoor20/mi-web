// Demo de la fase 3: una pregunta viaja a los documentos, se recuperan fragmentos y la respuesta los cita.
// Todo está precalculado: es una simulación, no hay búsqueda ni modelo.
const QUESTIONS = [
  {
    hits: [["a1", 0.91], ["a3", 0.52]],
    answer: [
      ["Compensa sobre todo cuando el portátil aún usa disco mecánico", "a1"],
      ["; si además hay calor, ruido o apagones, conviene revisar antes el mantenimiento", "a3"],
    ],
  },
  {
    hits: [["b3", 0.88], ["c2", 0.47]],
    answer: [
      ["Mira que la fuente tenga los conectores que pide y que la gráfica quepa en la caja", "b3"],
      ["; una dedicada solo compensa si vas a jugar o editar vídeo", "c2"],
    ],
  },
  {
    hits: [["c1", 0.93], ["c3", 0.74]],
    answer: [
      ["Una base razonable es 16 GB de RAM y un SSD de 512 GB", "c1"],
      [", priorizando autonomía, peso y una pantalla cómoda", "c3"],
    ],
  },
];

import { idle } from "../lib/idle.js";

export default function rag(root, { reduceMotion }) {
  idle(root, reduceMotion);
  const sel = root.querySelector("[data-rag-q]");
  const run = root.querySelector("[data-rag-run]");
  const steps = [...root.querySelectorAll("[data-rag-steps] li")];
  const chunks = [...root.querySelectorAll("[data-chunk]")];
  const answer = root.querySelector("[data-rag-answer]");
  const idle = answer.textContent;
  let timers = [];
  const later = (fn, ms) => { timers.push(setTimeout(fn, ms)); };

  const reset = () => {
    timers.forEach(clearTimeout); timers = [];
    steps.forEach((s) => s.classList.remove("is-on"));
    chunks.forEach((c) => { c.classList.remove("is-scan", "is-hit", "is-dim", "is-cited"); c.querySelector(".rag__score")?.remove(); });
    answer.textContent = idle;
  };
  const setStep = (n) => steps.forEach((s, i) => s.classList.toggle("is-on", i <= n));

  const showHits = (q) => {
    const ids = new Map(q.hits);
    chunks.forEach((c) => {
      const score = ids.get(c.dataset.chunk);
      c.classList.remove("is-scan");
      c.classList.add(score ? "is-hit" : "is-dim");
      if (score) { const b = document.createElement("span"); b.className = "rag__score mono"; b.textContent = score.toFixed(2); c.append(b); }
    });
  };

  const compose = (q, animate) => {
    answer.replaceChildren();
    const order = q.hits.map(([id]) => id);
    q.answer.forEach(([text, id], i) => {
      const span = document.createElement("span");
      span.textContent = text;
      const cite = document.createElement("button");
      cite.type = "button"; cite.className = "rag__cite mono";
      cite.textContent = `[${order.indexOf(id) + 1}]`;
      cite.setAttribute("aria-label", `Fuente ${order.indexOf(id) + 1}: ver el fragmento`);
      const mark = (on) => root.querySelector(`[data-chunk="${id}"]`).classList.toggle("is-cited", on);
      cite.addEventListener("mouseenter", () => mark(true)); cite.addEventListener("mouseleave", () => mark(false));
      cite.addEventListener("focus", () => mark(true)); cite.addEventListener("blur", () => mark(false));
      answer.append(span, cite);
      if (!animate) return;
      span.hidden = true; cite.hidden = true;
      later(() => { span.hidden = false; cite.hidden = false; }, i * 700);
    });
    if (animate) later(() => answer.append("."), q.answer.length * 700); else answer.append(".");
  };

  const ask = () => {
    reset();
    const q = QUESTIONS[Number(sel.value)];
    if (reduceMotion) { setStep(3); showHits(q); compose(q, false); return; }
    setStep(0);
    answer.textContent = "Buscando en los documentos…";
    later(() => setStep(1), 450);
    chunks.forEach((c, i) => later(() => c.classList.add("is-scan"), 500 + i * 70));
    later(() => { setStep(2); showHits(q); }, 1300);
    later(() => { setStep(3); compose(q, true); }, 2100);
  };

  run.hidden = false;
  run.addEventListener("click", ask);
  sel.addEventListener("change", reset);
}
