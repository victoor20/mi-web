// Simulador «Anatomía de una automatización» (/ia/): una estación cada vez, grande, con un único botón con verbo.
// Momentos: el ejemplo (intro) y las cuatro fases (0 Disparador, 1 Proceso, 2 Control humano, 3 Resultado).
// El contenido solo avanza cuando el usuario pulsa el botón o decide; el minimapa permite volver a las fases ya vistas.
// Sin JavaScript se ve todo el texto seguido; con movimiento reducido no hay animaciones (lo gestiona el CSS).
export default function simulador(root) {
  const tabs = [...root.querySelectorAll("[data-scenario]")];
  const panels = [...root.querySelectorAll("[data-scenario-panel]")];
  const art = root.querySelector("[data-art]");
  const tagEl = art.querySelector("[data-tag]");
  const renders = new Map();

  root.classList.add("is-ready");

  tabs.forEach((t) => t.addEventListener("click", () => {
    tabs.forEach((x) => x.setAttribute("aria-pressed", String(x === t)));
    panels.forEach((p) => p.classList.toggle("is-on", p.dataset.scenarioPanel === t.dataset.scenario));
    renders.get(panels.find((p) => p.dataset.scenarioPanel === t.dataset.scenario))?.({ animate: false });
  }));

  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  panels.forEach((panel) => {
    const verbs = panel.dataset.verbs.split("|");
    const mapItems = [...panel.querySelectorAll("[data-node]")];
    const action = panel.querySelector("[data-action]");
    const act = panel.querySelector("[data-act]");
    const end = panel.querySelector("[data-end]");
    const retry = panel.querySelector("[data-retry]");
    const mean = panel.querySelector("[data-mean]");
    const variantBtns = [...panel.querySelectorAll("[data-pick-variant]")];
    const variants = [...panel.querySelectorAll("[data-variant]")];
    const hasVariants = variants.length > 0;
    let step = -1; // -1 = el ejemplo
    let seen = -1;
    let choices = {};
    let variant = null;

    const met = (need) => {
      if (!need) return true;
      const [g, v] = need.split("=");
      return v ? choices[g] === v : Boolean(choices[g]);
    };
    const scope = () => (hasVariants ? variants.find((v) => !v.hidden) : panel.querySelector(".sim__panel"));
    const bodyAt = (n) => (n < 0 ? panel.querySelector('[data-step-body="intro"]') : scope()?.querySelector(`[data-step-body="${n}"]`));

    const refreshChoices = () => {
      panel.querySelectorAll("[data-show-if]").forEach((el) => { el.hidden = !el.dataset.showIf.split(" ").some((c) => met(c)); });
      panel.querySelectorAll("[data-choice-group]").forEach((g) => {
        g.querySelectorAll("[data-choice]").forEach((b) => b.setAttribute("aria-pressed", String(choices[g.dataset.choiceGroup] === b.dataset.choice)));
      });
    };

    const render = ({ animate = false } = {}) => {
      // Contenido: solo el momento actual
      panel.querySelectorAll("[data-step-body]").forEach((b) => b.classList.toggle("is-current", b === bodyAt(step)));
      // Minimapa
      mapItems.forEach((li, i) => {
        li.classList.toggle("is-done", i < step);
        li.classList.toggle("is-on", i === step);
        const btn = li.querySelector("[data-goto]");
        btn.disabled = i > seen;
        if (i === step) btn.setAttribute("aria-current", "step"); else btn.removeAttribute("aria-current");
      });
      // «Qué significa» la fase actual
      mean.hidden = step < 0;
      if (step >= 0) { const b = document.createElement("strong"); b.textContent = "Qué significa: "; mean.replaceChildren(b, mapItems[step].querySelector(".sim__map-mean").textContent); }
      // Acción: botón con verbo, opciones de decisión o final
      const body = bodyAt(step);
      const waiting = step >= 0 && !met(body?.dataset.needs);
      const atEnd = step === 3;
      action.hidden = atEnd || waiting;
      act.textContent = verbs[step + 1] || "Siguiente";
      act.disabled = step === -1 && hasVariants && !variant;
      end.classList.toggle("is-shown", atEnd);
      retry.hidden = !atEnd;
      panel.classList.toggle("is-intro", step === -1);
      // La estación grande (compartida) refleja este escenario cuando está activo
      if (panel.classList.contains("is-on")) {
        art.dataset.at = step < 0 ? "intro" : String(step);
        art.dataset.obj = panel.dataset.obj;
        art.classList.toggle("is-noai", panel.hasAttribute("data-noai"));
        art.classList.toggle("is-waiting", step === 2 && waiting);
        art.classList.toggle("is-decided", step === 2 && Boolean(body?.dataset.needs) && !waiting);
        let tag = (hasVariants ? variant?.dataset.tag : panel.dataset.tag) || "";
        const tagChoice = variant?.dataset.tagChoice;
        if (tagChoice) tag = choices[tagChoice] ? panel.querySelector(`[data-choice-group="${tagChoice}"] [aria-pressed="true"]`)?.textContent || "" : "¿?";
        tagEl.textContent = step >= 1 ? tag : "";
        if (animate) restart(art, "is-arrive"); else art.classList.remove("is-arrive");
      }
    };

    const go = (n, { animate = true } = {}) => {
      step = n;
      seen = Math.max(seen, n);
      render({ animate });
      // El foco sigue al usuario: en las decisiones, a la primera opción; al final, a «Probar otro ejemplo»
      const body = bodyAt(step);
      if (step === 3) retry.focus({ preventScroll: true });
      else if (step >= 0 && !met(body?.dataset.needs)) body.querySelector("[data-choice]")?.focus({ preventScroll: true });
    };

    const reset = () => {
      choices = {};
      seen = -1;
      if (hasVariants) {
        variant = null;
        variantBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
        variants.forEach((v, i) => { v.hidden = i !== 0; });
      }
      refreshChoices();
      step = -1;
      render();
    };

    action.hidden = false;
    act.addEventListener("click", () => go(step + 1));
    retry.addEventListener("click", () => { reset(); (variantBtns[0] || act).focus({ preventScroll: true }); });
    mapItems.forEach((li, i) => li.querySelector("[data-goto]").addEventListener("click", () => { if (i <= seen) go(i, { animate: false }); }));

    // Paso 0 del correo: elegir el ejemplo
    variantBtns.forEach((b) => b.addEventListener("click", () => {
      variantBtns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      variants.forEach((v) => { v.hidden = v.dataset.variant !== b.dataset.pickVariant; });
      variant = variants.find((v) => !v.hidden);
      choices = {};
      refreshChoices();
      render();
    }));

    // Decisiones: si cumplen lo que la fase espera, se pasa a la siguiente
    panel.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-choice]");
      if (!btn) return;
      choices[btn.closest("[data-choice-group]").dataset.choiceGroup] = btn.dataset.choice;
      refreshChoices();
      if (met(bodyAt(step)?.dataset.needs)) go(step + 1);
      else render();
    });

    renders.set(panel, render);
    reset();
  });
}
