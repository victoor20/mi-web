// Demo de la fase 2: así trocea un modelo una frase (simulación didáctica, sin tokenizador real).
export default function tokens(root) {
  const input = root.querySelector("[data-tok-input]");
  const out = root.querySelector("[data-tok-out]");
  const stats = root.querySelector("[data-tok-stats]");
  const bar = root.querySelector("[data-tok-bar]");
  const ctx = root.querySelector(".tk__ctx");
  const ids = root.querySelector("[data-tok-ids]");
  const WINDOW = 48;
  const LETTERS = "A-Za-zÁÉÍÓÚÜÑáéíóúüñ";
  const SUFFIXES = ["mente", "ciones", "ción", "iendo", "ando", "ado", "ido", "ar", "er", "ir", "es", "os", "as"];

  const tokenize = (text) => {
    const tokens = [];
    const re = new RegExp(`(\\s*)([${LETTERS}]+|\\d+|[^\\s${LETTERS}0-9])`, "g");
    let m;
    while ((m = re.exec(text))) {
      const lead = m[1] ? "·" : ""; // el espacio previo va pegado al token, como en los tokenizadores reales
      const word = m[2];
      if (!new RegExp(`^[${LETTERS}]+$`).test(word) || word.length <= 5) { tokens.push(lead + word); continue; }
      let rest = word, tail = "";
      const s = SUFFIXES.find((x) => rest.length > x.length + 3 && rest.toLowerCase().endsWith(x));
      if (s) { tail = rest.slice(-s.length); rest = rest.slice(0, -s.length); }
      const parts = [];
      while (rest.length > 5) { const n = rest.length > 8 ? 5 : Math.ceil(rest.length / 2); parts.push(rest.slice(0, n)); rest = rest.slice(n); }
      parts.push(rest);
      if (tail) parts.push(tail);
      parts.forEach((p, i) => tokens.push((i === 0 ? lead : "") + p));
    }
    return tokens;
  };
  const idOf = (t) => { let h = 7; for (const c of t) h = (h * 31 + c.charCodeAt(0)) % 49000; return h + 1000; };

  const render = () => {
    const text = input.value;
    const tokens = tokenize(text);
    out.replaceChildren(...tokens.map((t, i) => {
      const el = document.createElement("span");
      el.className = "tok";
      el.dataset.c = String(i % 5);
      el.style.setProperty("--i", String(i));
      el.textContent = t;
      if (ids.checked) { const s = document.createElement("small"); s.textContent = idOf(t); el.append(s); }
      return el;
    }));
    const words = (text.match(new RegExp(`[${LETTERS}0-9]+`, "g")) || []).length;
    stats.textContent = `${tokens.length} tokens · ${words} palabras · ${text.length} caracteres`;
    bar.style.width = `${Math.min(tokens.length / WINDOW, 1) * 100}%`;
    ctx.classList.toggle("is-over", tokens.length > WINDOW);
  };
  input.addEventListener("input", render);
  ids.addEventListener("change", render);
  render();
}
