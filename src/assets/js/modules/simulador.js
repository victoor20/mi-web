// Simulador «Anatomía de una automatización» (/ia/): cada escenario avanza fase a fase solo cuando el usuario pulsa
// «Siguiente» o «Anterior». La fase activa se ilumina, la línea se rellena hasta ella y el panel muestra qué le pasa al dato.
// Las decisiones del usuario (data-choice) cambian lo que se ve después (data-show-if) y algunas fases esperan a que decida
// (data-needs). Sin JavaScript se ven todas las fases en texto.
export default function simulador(root, { reduceMotion }) {
  const tabs = [...root.querySelectorAll("[data-scenario]")];
  const panels = [...root.querySelectorAll("[data-scenario-panel]")];
  const names = [...root.querySelectorAll(".sim__scenario.is-on .sim__name")].map((n) => n.textContent);
  const hints = [...root.querySelectorAll(".sim__scenario.is-on .sim__hint")].map((n) => n.textContent);
  const updaters = new Map();

  root.classList.add("is-ready");
  const scene = setupScene(root.querySelector("[data-scene]"), reduceMotion);

  tabs.forEach((t) => t.addEventListener("click", () => {
    tabs.forEach((x) => x.setAttribute("aria-pressed", String(x === t)));
    panels.forEach((p) => p.classList.toggle("is-on", p.dataset.scenarioPanel === t.dataset.scenario));
    const active = panels.find((p) => p.dataset.scenarioPanel === t.dataset.scenario);
    updaters.get(active)?.(true);
  }));

  panels.forEach((panel) => {
    const nodes = [...panel.querySelectorAll("[data-node]")];
    const controls = panel.querySelector("[data-controls]");
    const prev = panel.querySelector("[data-prev]");
    const next = panel.querySelector("[data-next]");
    const count = panel.querySelector("[data-count]");
    const wait = panel.querySelector("[data-wait]");
    const how = panel.querySelector("[data-how]");
    const variantBtns = [...panel.querySelectorAll("[data-pick-variant]")];
    const variants = [...panel.querySelectorAll("[data-variant]")];
    const total = nodes.length;
    let step = 0;
    let choices = {};

    const scope = () => panel.querySelector("[data-variant]:not([hidden])") || panel.querySelector(".sim__panel");
    const bodyAt = (n) => scope().querySelector(`[data-step-body="${n}"]`);

    // ¿Se cumple la condición de una fase (data-needs="grupo" o "grupo=valor")?
    const met = (need) => {
      if (!need) return true;
      const [g, v] = need.split("=");
      return v ? choices[g] === v : Boolean(choices[g]);
    };

    const refreshChoices = () => {
      panel.querySelectorAll("[data-show-if]").forEach((el) => {
        el.hidden = !el.dataset.showIf.split(" ").some((c) => met(c));
      });
      panel.querySelectorAll("[data-choice-group]").forEach((g) => {
        g.querySelectorAll("[data-choice]").forEach((b) => b.setAttribute("aria-pressed", String(choices[g.dataset.choiceGroup] === b.dataset.choice)));
      });
    };

    const show = (n) => {
      step = Math.max(0, Math.min(total - 1, n));
      panel.style.setProperty("--p", String(step / (total - 1)));
      nodes.forEach((node, i) => {
        node.classList.toggle("is-on", i === step);
        node.classList.toggle("is-done", i < step);
      });
      scope().querySelectorAll("[data-step-body]").forEach((b) => b.classList.toggle("is-current", Number(b.dataset.stepBody) === step));
      const body = bodyAt(step);
      const blocked = !met(body?.dataset.needs);
      count.textContent = `Fase ${step + 1} de ${total}: ${names[step]}`;
      prev.disabled = step === 0;
      next.disabled = blocked;
      next.textContent = step === total - 1 ? "Empezar de nuevo" : "Siguiente";
      wait.hidden = !blocked;
      how.classList.toggle("is-shown", step === total - 1);
      panel.classList.toggle("is-end", step === total - 1);
      syncScene();
    };

    // La escena (compartida) refleja este escenario cuando está activo
    const syncScene = (jump = false) => {
      if (!scene || !panel.classList.contains("is-on")) return;
      const variant = panel.querySelector("[data-variant]:not([hidden])");
      const tagChoice = variant?.dataset.tagChoice;
      let tag = variant?.dataset.tag || panel.dataset.tag || "";
      if (tagChoice) {
        const pressed = panel.querySelector(`[data-choice-group="${tagChoice}"] [aria-pressed="true"]`);
        tag = pressed ? pressed.textContent : "¿?";
      }
      const body = bodyAt(step);
      const now = body ? [...body.querySelectorAll("p:not(.sim__what)")].map((p) => p.textContent.trim()).filter(Boolean)[0] || "" : "";
      scene.update({
        obj: panel.dataset.obj, noai: panel.hasAttribute("data-noai"), step, total, tag,
        waiting: !met(body?.dataset.needs), decided: Boolean(body?.dataset.needs) && met(body.dataset.needs),
        def: hints[step], now, jump,
      });
    };
    updaters.set(panel, syncScene);

    const reset = () => { choices = {}; refreshChoices(); show(0); };

    controls.hidden = false;
    prev.addEventListener("click", () => show(step - 1));
    next.addEventListener("click", () => (step === total - 1 ? reset() : show(step + 1)));

    // Muestras alternativas (los tres correos): elegir una vuelve al principio
    variantBtns.forEach((b) => b.addEventListener("click", () => {
      variantBtns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      variants.forEach((v) => { v.hidden = v.dataset.variant !== b.dataset.pickVariant; });
      reset();
    }));

    // Decisiones del usuario
    panel.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-choice]");
      if (!btn) return;
      const group = btn.closest("[data-choice-group]").dataset.choiceGroup;
      choices[group] = btn.dataset.choice;
      refreshChoices();
      show(step);
    });

    reset();
  });
}

// Escena ilustrada: cuatro estaciones y el objeto del escenario, que viaja de una a otra.
// Cada llegada dispara una microanimación (buzón, máquina, lupa, carpeta); con movimiento reducido no hay animación.
function setupScene(scene, reduceMotion) {
  if (!scene) return null;
  const stations = [...scene.querySelectorAll("[data-st]")];
  const obj = scene.querySelector("[data-obj]");
  const tagEl = scene.querySelector("[data-tag]");
  const balloon = scene.querySelector("[data-balloon]");
  const bDef = scene.querySelector("[data-b-def]");
  const bNow = scene.querySelector("[data-b-now]");
  let last = null;
  let state = null;
  scene.classList.add("is-live");
  balloon.hidden = false;

  const place = (instant) => {
    if (!state) return;
    const box = scene.getBoundingClientRect();
    const svg = stations[state.step].querySelector("svg").getBoundingClientRect();
    const x = svg.left - box.left + svg.width / 2;
    const y = svg.top - box.top + svg.height * 0.18;
    if (instant || reduceMotion) obj.classList.add("is-instant");
    obj.style.setProperty("--ox", `${x.toFixed(1)}px`);
    obj.style.setProperty("--oy", `${y.toFixed(1)}px`);
    if (instant || reduceMotion) requestAnimationFrame(() => obj.classList.remove("is-instant"));
    // Globo junto a la estación activa
    const bw = balloon.offsetWidth;
    const left = Math.min(Math.max(x - bw / 2, 0), box.width - bw);
    balloon.style.setProperty("--bl", `${left.toFixed(1)}px`);
    balloon.style.setProperty("--ba", `${(x - left).toFixed(1)}px`);
  };

  window.addEventListener("resize", () => place(true));

  return {
    update(s) {
      const moved = !last || last.step !== s.step || last.obj !== s.obj || s.jump;
      state = s;
      scene.dataset.obj = s.obj;
      scene.classList.toggle("is-noai", s.noai);
      scene.style.setProperty("--p", String(s.step / (s.total - 1)));
      stations.forEach((st, i) => { st.classList.toggle("is-on", i === s.step); st.classList.toggle("is-done", i < s.step); });
      for (let i = 0; i < 4; i++) scene.classList.toggle(`is-at-${i}`, i === s.step);
      scene.classList.toggle("is-waiting", s.step === 2 && s.waiting);
      scene.classList.toggle("is-decided", s.step === 2 && s.decided);
      tagEl.textContent = s.step >= 1 ? s.tag : "";
      bDef.textContent = s.def;
      bNow.textContent = s.now;
      if (moved && !reduceMotion) {
        scene.classList.remove("is-arrive");
        void scene.offsetWidth;
        scene.classList.add("is-arrive");
      }
      place(!last || s.jump);
      last = s;
    },
  };
}
