// Holograma de Jarvis: experiencia guiada con respuestas escritas de antemano.
//
// Las respuestas llegan a través de un "proveedor" con una única función:
//   ask(id) -> Promise<{ text: string, focus: string[] }>
// Hoy el proveedor lee el guion local. Si algún día se conecta a una IA real, basta con
// crear otro proveedor (por ejemplo, uno que haga fetch a un backend propio con límites
// de uso) y pasarlo a mountHologram, sin tocar la interfaz.

const scriptProvider = (script) => ({
  async ask(id) {
    const item = script.questions.find((q) => q.id === id);
    return item ? { text: item.a, focus: item.focus } : { text: "No tengo respuesta para eso.", focus: [] };
  },
});

export default function jarvis(root, { reduceMotion }) {
  const script = JSON.parse(root.querySelector("[data-holo-script]").textContent);
  mountHologram(root, scriptProvider(script), script, { reduceMotion });
}

function mountHologram(root, provider, script, { reduceMotion }) {
  const answer = root.querySelector("[data-holo-answer]");
  const asked = root.querySelector("[data-holo-asked]");
  const figure = root.querySelector("[data-holo-figure]");
  const arch = root.querySelector(".arch");
  const buttons = [...root.querySelectorAll("[data-q]")];
  const toMap = root.querySelector("[data-tomap]");
  const beam = root.querySelector("[data-beam]");
  const seeing = root.querySelector("[data-seeing]");
  const seeingQ = root.querySelector("[data-seeing-q]");
  const wrap = root.querySelector("[data-arch-wrap]");
  // El botón lleva al esquema solo cuando el usuario lo pulsa (nunca solo)
  toMap?.addEventListener("click", () => { toMap.dataset.pressed = "1"; toMap.classList.remove("is-breathing"); wrap.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); });
  // Los destellos (bolita de la órbita) solo corren mientras el holograma se ve
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => root.classList.toggle("is-seen", e.isIntersecting)).observe(root);
  const restart = (el, cls) => { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); };

  root.querySelectorAll("[data-holo-ui]").forEach((el) => (el.hidden = false));
  root.querySelector("[data-holo-static]").hidden = true;
  root.classList.add("is-live");

  let typing = 0;

  const highlight = (focus) => {
    arch.classList.toggle("has-focus", focus.length > 0);
    arch.querySelectorAll("[data-node]").forEach((n) => n.classList.toggle("is-focus", focus.includes(n.dataset.node)));
    arch.querySelectorAll("[data-edge]").forEach((e) => {
      const [a, b] = e.dataset.edge.split(" ");
      // Se ilumina si une dos nodos activos, o un nodo activo con el orquestador
      const both = focus.includes(a) && focus.includes(b);
      const toCore = (a === "orquestador" && focus.includes(b)) || (b === "orquestador" && focus.includes(a));
      e.classList.toggle("is-focus", both || toCore);
    });
  };

  // Escribe la respuesta palabra a palabra; con movimiento reducido aparece entera
  const type = (text) => {
    const run = ++typing;
    figure.classList.add("is-speaking");
    if (reduceMotion) {
      answer.textContent = text;
      figure.classList.remove("is-speaking");
      return;
    }
    const words = text.split(" ");
    answer.textContent = "";
    let i = 0;
    const step = () => {
      if (run !== typing) return;
      answer.textContent = words.slice(0, ++i).join(" ");
      if (i < words.length) setTimeout(step, 38 + Math.random() * 40);
      else figure.classList.remove("is-speaking");
    };
    step();
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      asked.textContent = btn.textContent;
      const { text, focus } = await provider.ask(btn.dataset.q);
      highlight(focus);
      type(text);
      seeingQ.textContent = btn.textContent;
      seeing.hidden = false;
      toMap.hidden = false;
      if (!reduceMotion) { restart(beam, "is-pulse"); restart(arch, "is-beat"); restart(toMap, "is-new"); if (!toMap.dataset.pressed) toMap.classList.add("is-breathing"); }
    });
    btn.setAttribute("aria-pressed", "false");
  });

  highlight([]);
}
