// Demo de la fase 1: "ejecuta" un fragmento de Python línea a línea (simulación, no hay intérprete).
// Cada fragmento trae su propia función que devuelve los pasos: línea activa, variables y salida.
const fmt = (n) => (Number.isInteger(n) ? n.toFixed(1) : String(n));
const list = (a) => `[${a.join(", ")}]`;

const SNIPPETS = [
  {
    id: "funciones",
    label: "Funciones",
    lines: [
      ["def media(notas):"],
      ["    return sum(notas) / len(notas)"],
      [""],
      ["notas = [", { input: "7, 9, 8", size: 7, label: "Valores de la lista notas, separados por comas" }, "]"],
      ["print(media(notas))"],
    ],
    run([raw]) {
      const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
      const bad = parts.find((p) => Number.isNaN(Number(p)));
      const base = [["media", "función"]];
      if (bad) return [{ line: 1, vars: base }, { line: 4, vars: base, out: `NameError: name '${bad}' is not defined`, error: true }];
      const nums = parts.map(Number);
      const vars = [...base, ["notas", list(nums)]];
      if (!nums.length) return [{ line: 1, vars: base }, { line: 4, vars: vars }, { line: 5, vars }, { line: 2, vars, out: "ZeroDivisionError: division by zero", error: true }];
      const sum = nums.reduce((a, b) => a + b, 0);
      return [
        { line: 1, vars: base },
        { line: 4, vars },
        { line: 5, vars },
        { line: 2, vars: [...vars, ["sum(notas)", String(sum)], ["len(notas)", String(nums.length)]] },
        { line: 5, vars, out: fmt(sum / nums.length) },
      ];
    },
  },
  {
    id: "excepciones",
    label: "Excepciones",
    lines: [
      ['valor = "', { input: "42", size: 5, label: "Valor de la variable valor" }, '"'],
      ["try:"],
      ["    n = int(valor)"],
      ["except ValueError:"],
      ['    print("No es un número")'],
      ["else:"],
      ["    print(n * 2)"],
    ],
    run([raw]) {
      const v = [["valor", `'${raw}'`]];
      if (/^\s*[+-]?\d+\s*$/.test(raw)) {
        const n = parseInt(raw, 10);
        const vn = [...v, ["n", String(n)]];
        return [{ line: 1, vars: v }, { line: 2, vars: v }, { line: 3, vars: vn }, { line: 7, vars: vn, out: String(n * 2) }];
      }
      return [{ line: 1, vars: v }, { line: 2, vars: v }, { line: 3, vars: v, error: true }, { line: 4, vars: v }, { line: 5, vars: v, out: "No es un número" }];
    },
  },
  {
    id: "bucles",
    label: "Bucles",
    lines: [
      ['puntos = {"python": 3, "docker": 5}'],
      ["total = 0"],
      ["for tema, p in puntos.items():"],
      ["    total += p"],
      ["print(total)"],
    ],
    run() {
      const puntos = ["puntos", '{"python": 3, "docker": 5}'];
      return [
        { line: 1, vars: [puntos] },
        { line: 2, vars: [puntos, ["total", "0"]] },
        { line: 3, vars: [puntos, ["total", "0"], ["tema", "'python'"], ["p", "3"]] },
        { line: 4, vars: [puntos, ["total", "3"], ["tema", "'python'"], ["p", "3"]] },
        { line: 3, vars: [puntos, ["total", "3"], ["tema", "'docker'"], ["p", "5"]] },
        { line: 4, vars: [puntos, ["total", "8"], ["tema", "'docker'"], ["p", "5"]] },
        { line: 5, vars: [puntos, ["total", "8"]], out: "8" },
      ];
    },
  },
];

export default function python(root, { reduceMotion }) {
  const tabsEl = root.querySelector("[data-py-tabs]");
  const code = root.querySelector("[data-py-code] code");
  const runBtn = root.querySelector("[data-py-run]");
  const varsEl = root.querySelector("[data-py-vars]");
  const outEl = root.querySelector("[data-py-out]");
  let current = 0;
  let timer = 0;

  const renderCode = () => {
    const sn = SNIPPETS[current];
    code.replaceChildren(...sn.lines.flatMap((parts, i) => {
      const line = document.createElement("span");
      line.className = "py__line";
      line.dataset.n = String(i + 1);
      parts.forEach((p) => {
        if (typeof p === "string") { line.append(p); return; }
        const input = document.createElement("input");
        input.className = "py__input";
        input.value = p.input;
        input.size = p.size;
        input.setAttribute("aria-label", p.label);
        input.autocomplete = "off";
        input.dataset.pyInput = "";
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); run(); } });
        line.append(input);
      });
      return [line, "\n"];
    }).slice(0, -1));
  };

  const showVars = (vars) => {
    varsEl.replaceChildren(...vars.map(([k, v]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = v;
      row.append(dt, dd);
      return row;
    }));
  };

  const highlight = (n) => code.querySelectorAll(".py__line").forEach((l) => l.classList.toggle("is-active", Number(l.dataset.n) === n));

  const run = () => {
    clearTimeout(timer);
    const sn = SNIPPETS[current];
    const inputs = [...code.querySelectorAll("[data-py-input]")].map((i) => i.value);
    const steps = sn.run(inputs);
    outEl.textContent = "";
    outEl.classList.remove("is-error");
    const apply = (s) => {
      highlight(s.line);
      showVars(s.vars);
      if (s.out) { outEl.textContent = s.out; outEl.classList.toggle("is-error", Boolean(s.error && /Error/.test(s.out))); }
    };
    if (reduceMotion) { apply(steps[steps.length - 1]); return; }
    let i = 0;
    const next = () => {
      apply(steps[i]);
      if (++i < steps.length) timer = setTimeout(next, 520);
    };
    next();
  };

  const select = (i) => {
    clearTimeout(timer);
    current = i;
    tabs.forEach((t, j) => { t.setAttribute("aria-selected", String(i === j)); t.tabIndex = i === j ? 0 : -1; });
    renderCode();
    outEl.textContent = "";
    outEl.classList.remove("is-error");
    showVars([]);
  };

  // Pestañas de fragmentos (accesibles con flechas)
  const tabs = SNIPPETS.map((sn, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.role = "tab"; b.className = "demo__tab"; b.textContent = sn.label;
    b.addEventListener("click", () => select(i));
    b.addEventListener("keydown", (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (d) { e.preventDefault(); const n = (i + d + tabs.length) % tabs.length; select(n); tabs[n].focus(); }
    });
    return b;
  });
  tabsEl.replaceChildren(...tabs);
  tabsEl.hidden = false;
  runBtn.hidden = false;
  runBtn.addEventListener("click", run);
  root.querySelector(".demo__hint")?.removeAttribute("hidden");
  select(0);
  // Estado inicial: el primer fragmento ya ejecutado
  const first = SNIPPETS[0].run(["7, 9, 8"]);
  showVars(first[first.length - 1].vars);
  outEl.textContent = first[first.length - 1].out;
}
