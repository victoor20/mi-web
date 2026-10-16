// Simulador «Anatomía de una automatización» (/ia/): cada escenario avanza fase a fase solo cuando el usuario pulsa
// «Siguiente» o «Anterior». La fase activa se ilumina, la línea se rellena hasta ella y el panel muestra qué le pasa al dato.
// Las decisiones del usuario (data-choice) cambian lo que se ve después (data-show-if) y algunas fases esperan a que decida
// (data-needs). Sin JavaScript se ven todas las fases en texto.
export default function simulador(root) {
  const tabs = [...root.querySelectorAll("[data-scenario]")];
  const panels = [...root.querySelectorAll("[data-scenario-panel]")];
  const names = [...root.querySelectorAll(".sim__scenario.is-on .sim__name")].map((n) => n.textContent);

  root.classList.add("is-ready");

  tabs.forEach((t) => t.addEventListener("click", () => {
    tabs.forEach((x) => x.setAttribute("aria-pressed", String(x === t)));
    panels.forEach((p) => p.classList.toggle("is-on", p.dataset.scenarioPanel === t.dataset.scenario));
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
    };

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
