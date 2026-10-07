// Cuestionario de contacto por pasos.
// Sin JavaScript: todos los pasos visibles, validación nativa y envío normal con redirección.
// Con JavaScript: un paso cada vez, barra de progreso, validación por paso y envío sin recargar.

const MIN_SECONDS = 4; // menos que esto suele ser un bot

export default function contact(form) {
  const steps = [...form.querySelectorAll("[data-step]")];
  const nav = form.querySelector("[data-nav]");
  const prev = form.querySelector("[data-prev]");
  const next = form.querySelector("[data-next]");
  const progress = form.querySelector("[data-progress]");
  const bar = progress.querySelector("[role=progressbar]");
  const count = form.querySelector("[data-count]");
  const status = form.querySelector("[data-status]");
  const submit = form.querySelector("[data-submit]");
  const summary = form.querySelector("[data-summary]");
  const started = Date.now();
  let current = 0;

  form.noValidate = true; // la validación la hace este módulo, paso a paso
  form.classList.add("is-stepped");
  nav.hidden = false;
  progress.hidden = false;

  // Rellenar desde la URL: ?servicio=slug y ?origen=informe
  const params = new URLSearchParams(location.search);
  const pre = params.get("servicio");
  const preInput = pre && form.querySelector(`input[name="servicio"][data-slug="${CSS.escape(pre)}"]`);
  if (preInput) preInput.checked = true;
  const origin = params.get("origen") || params.get("ref");
  if (origin) form.querySelector("[data-origin]").value = origin.slice(0, 40);

  const show = (i, focus = true) => {
    current = i;
    steps.forEach((s, j) => { s.hidden = j !== i; });
    prev.hidden = i === 0;
    next.hidden = i === steps.length - 1;
    const n = i + 1;
    bar.setAttribute("aria-valuenow", String(n));
    bar.style.setProperty("--p", n / steps.length);
    count.textContent = `Paso ${n} de ${steps.length}`;
    if (i === steps.length - 1) fillSummary();
    if (focus) steps[i].querySelector("legend").focus({ preventScroll: true });
    if (focus && form.getBoundingClientRect().top < 0) form.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validate = (step) => {
    const fields = [...step.querySelectorAll("input, textarea")].filter((f) => f.type !== "hidden" && f.name !== "botcheck");
    let ok = true;
    const radios = new Set();
    fields.forEach((f) => {
      if (f.type === "radio") { radios.add(f.name); return; }
      const valid = f.checkValidity() && (f.minLength <= 0 || f.value.trim().length >= f.minLength || !f.required);
      f.setAttribute("aria-invalid", String(!valid));
      if (!valid) ok = false;
    });
    radios.forEach((name) => {
      const checked = step.querySelector(`input[name="${name}"]:checked`);
      if (!checked) ok = false;
    });
    const error = step.querySelector("[data-error]");
    error.hidden = ok;
    if (!ok) {
      const firstBad = step.querySelector('[aria-invalid="true"]') || step.querySelector("input");
      firstBad?.focus();
    }
    return ok;
  };

  const fillSummary = () => {
    const data = new FormData(form);
    const rows = [["Necesitas", data.get("servicio")], ["Equipo", data.get("equipo")], ["Urgencia", data.get("urgencia")], ["Contacto", [data.get("nombre"), data.get("email"), data.get("municipio")].filter(Boolean).join(" · ")]];
    summary.replaceChildren(...rows.filter(([, v]) => v).map(([k, v]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt"); dt.className = "mono"; dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = v;
      row.append(dt, dd);
      return row;
    }));
    summary.hidden = false;
  };

  next.addEventListener("click", () => { if (validate(steps[current])) show(current + 1); });
  prev.addEventListener("click", () => show(current - 1));

  // Al elegir una opción en un paso de botones, avanzar solo
  form.querySelectorAll('[data-step="1"] input, [data-step="3"] input').forEach((input) => {
    input.addEventListener("change", () => {
      steps[current].querySelector("[data-error]").hidden = true;
      setTimeout(() => { if (steps[current].contains(input)) show(current + 1); }, 220);
    });
  });

  // Enter en un campo de texto avanza en lugar de enviar
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && current < steps.length - 1) {
      e.preventDefault();
      next.click();
    }
  });

  form.addEventListener("input", (e) => {
    if (e.target.getAttribute("aria-invalid") === "true" && e.target.checkValidity()) e.target.setAttribute("aria-invalid", "false");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate(steps[current])) return;
    if (form.botcheck.checked) return; // bot
    if ((Date.now() - started) / 1000 < MIN_SECONDS) {
      status.textContent = "Un momento… vuelve a pulsar Enviar en unos segundos.";
      return;
    }
    if (form.dataset.keySet !== "true") {
      status.textContent = `El formulario aún no está activo. Escríbeme a ${form.dataset.email}, por favor.`;
      return;
    }

    submit.disabled = true;
    status.textContent = "Enviando…";
    try {
      const payload = Object.fromEntries(new FormData(form));
      delete payload.redirect;
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || res.statusText);
      window.umami?.track?.("solicitud-enviada", { servicio: payload.servicio, urgencia: payload.urgencia, origen: payload.origen });
      location.href = "/contacto/enviado/";
    } catch (err) {
      submit.disabled = false;
      status.textContent = "No se ha podido enviar. Inténtalo de nuevo o escríbeme por correo.";
      console.warn("Envío fallido:", err);
    }
  });

  // Si el servicio llega elegido desde otra página, se empieza por los detalles
  show(preInput ? 1 : 0, false);
}
