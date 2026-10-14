// Demo de la fase 5: cuantización. Menos bits por peso = modelo más pequeño y algo menos preciso (simulación).
const LEVELS = [
  { bits: 32, name: "32 bits, FP32", levels: "4.294.967.296", size: "28 GB", fit: "Servidor con GPU grande", bar: 100 },
  { bits: 16, name: "16 bits, FP16", levels: "65.536", size: "14 GB", fit: "GPU de 24 GB", bar: 50 },
  { bits: 8, name: "8 bits, INT8", levels: "256", size: "7 GB", fit: "Portátil con 16 GB de RAM", bar: 25 },
  { bits: 4, name: "4 bits, INT4", levels: "16", size: "3,5 GB", fit: "Portátil con 8 GB de RAM", bar: 12.5 },
];

export default function quant(root) {
  const range = root.querySelector("[data-qt-range]");
  const orig = root.querySelector("[data-qt-orig]");
  const quantPath = root.querySelector("[data-qt-quant]");
  const levels = root.querySelector("[data-qt-levels]");
  const size = root.querySelector("[data-qt-size]");
  const fit = root.querySelector("[data-qt-fit]");
  const sizebar = root.querySelector("[data-qt-sizebar]");
  const W = 320, H = 120, PAD = 10, N = 96;

  // Una señal cualquiera con valores entre 0 y 1
  const signal = (x) => 0.5 + 0.34 * Math.sin(2 * Math.PI * 1.5 * x + 0.4) + 0.1 * Math.sin(2 * Math.PI * 4 * x);
  const px = (x) => (x * W).toFixed(1);
  const py = (y) => (PAD + (1 - y) * (H - PAD * 2)).toFixed(1);

  const drawOriginal = () => {
    let d = "";
    for (let i = 0; i <= N; i++) d += `${i ? "L" : "M"}${px(i / N)} ${py(signal(i / N))} `;
    orig.setAttribute("d", d);
  };

  const draw = () => {
    const lv = LEVELS[Number(range.value)];
    const L = Math.min(2 ** lv.bits, 4096);
    let d = "";
    // Con pocos niveles se ve la escalera; con muchos, la línea cuantizada casi se confunde con la real
    const stairs = lv.bits <= 4;
    for (let i = 0; i <= N; i++) {
      const y = Math.round(signal(i / N) * (L - 1)) / (L - 1);
      d += i === 0 ? `M${px(0)} ${py(y)} ` : stairs ? `H${px(i / N)} V${py(y)} ` : `L${px(i / N)} ${py(y)} `;
    }
    quantPath.setAttribute("d", d);
    levels.textContent = lv.levels;
    size.textContent = lv.size;
    fit.textContent = lv.fit;
    sizebar.style.width = `${lv.bar}%`;
    range.setAttribute("aria-valuetext", lv.name);
  };

  drawOriginal();
  range.addEventListener("input", draw);
  draw();
}
