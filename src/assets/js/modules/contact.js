// Cuestionario de contacto por pasos.
// Sin JavaScript: todos los pasos visibles, validación nativa y envío normal con redirección.
// Con JavaScript: un paso cada vez, barra de progreso, validación por paso y envío sin recargar.

const MIN_SECONDS = 4; // menos que esto suele ser un bot
const MAX_LINKS = 2; // más enlaces que esto en un mensaje es casi siempre spam

// Erratas comunes en el dominio del correo → dominio que probablemente se quería escribir
const TYPOS = {
  "gmial.com": "gmail.com", "gmal.com": "gmail.com", "gmai.com": "gmail.com", "gmail.con": "gmail.com", "gmil.com": "gmail.com", "gmail.cm": "gmail.com", "gnail.com": "gmail.com", "gmail.comm": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmal.com": "hotmail.com", "hotmail.con": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.es.com": "hotmail.es",
  "outlok.com": "outlook.com", "outlook.con": "outlook.com", "outloo.com": "outlook.com", "outlook.es.com": "outlook.es",
  "yaho.com": "yahoo.es", "yaho.es": "yahoo.es", "yahoo.con": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.es.com": "yahoo.es",
  "icloud.con": "icloud.com", "iclod.com": "icloud.com", "live.con": "live.com",
};
const EMAIL_RE = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
const NAME_RE = /^\p{L}[\p{L} '’-]*$/u;
const clean = (v) => v.replace(/\s+/g, " ").trim();
const countLinks = (v) => (v.match(/(?:https?:\/\/|www\.)\S+/gi) || []).length;

// Cada validador devuelve un mensaje de error o "" si el valor es válido (y, en el correo, una sugerencia opcional)
const VALIDATORS = {
  nombre(v) {
    if (!v) return "Dime tu nombre para saber a quién responder.";
    if (v.length < 2) return "El nombre es muy corto: pon al menos 2 letras.";
    if (v.length > 60) return "El nombre es muy largo: máximo 60 caracteres.";
    if (!NAME_RE.test(v)) return "Usa solo letras, espacios, guiones y apóstrofos.";
    return "";
  },
  email(v) {
    if (!v) return "Escribe tu correo para que pueda responderte.";
    if (/\s/.test(v)) return "El correo no puede llevar espacios.";
    if (v.length > 120 || !EMAIL_RE.test(v)) return "Ese correo no parece válido. Revisa que tenga la forma nombre@dominio.com.";
    return "";
  },
  descripcion(v) {
    if (v.length < 20) return `Cuéntame un poco más: faltan ${20 - v.length} caracteres para llegar al mínimo de 20.`;
    if (v.length > 2000) return "El mensaje es demasiado largo: máximo 2000 caracteres.";
    if (countLinks(v) > MAX_LINKS) return "Has incluido más de 2 enlaces. Por seguridad no los admito en el mensaje: quita alguno o cuéntamelo con palabras.";
    return "";
  },
  equipo(v) {
    if (v.length > 120) return "Este campo admite como máximo 120 caracteres.";
    if (countLinks(v) > 0) return "Aquí basta con el modelo o el tipo de equipo, sin enlaces.";
    return "";
  },
};

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
  // Síntoma elegido en la página «Lo que sé hacer»: viaja como campo y se muestra en los detalles del caso
  const symptom = (params.get("sintoma") || "").trim().slice(0, 80);
  if (symptom) {
    const hidden = document.createElement("input");
    hidden.type = "hidden"; hidden.name = "sintoma"; hidden.value = symptom;
    form.append(hidden);
    const note = document.createElement("p");
    note.className = "field__hint quiz__symptom";
    note.append("Partimos de: ");
    const strong = document.createElement("strong");
    strong.textContent = symptom;
    note.append(strong);
    steps[1]?.querySelector("legend")?.after(note);
  }

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

  // --- Errores junto al campo (anunciados al lector de pantalla con role="alert") y sugerencia de erratas en el correo
  const errEl = (f) => form.querySelector(`[data-err="${f.name}"]`);
  const setError = (f, msg, suggestion = "") => {
    const el = errEl(f);
    f.setAttribute("aria-invalid", String(Boolean(msg)));
    if (!el) return;
    el.textContent = "";
    if (!msg) return;
    el.append(msg);
    if (suggestion) {
      el.append(" ");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "field__suggest";
      btn.textContent = `¿Querías decir ${suggestion}?`;
      btn.addEventListener("click", () => { f.value = suggestion; setError(f, ""); f.focus(); });
      el.append(btn);
    }
  };
  const acknowledged = new Set(); // correos con posible errata que la persona ha decidido mantener
  const checkField = (f, { blocking = true } = {}) => {
    const rule = VALIDATORS[f.name];
    if (!rule) return true;
    const value = f.name === "descripcion" ? clean(f.value) : clean(f.value);
    if (f.name !== "descripcion") f.value = value; // recortar espacios al salir
    let msg = rule(value);
    if (!msg && f.name === "email") {
      const domain = value.split("@")[1]?.toLowerCase();
      const fix = TYPOS[domain];
      if (fix && !acknowledged.has(value)) {
        const suggestion = value.split("@")[0] + "@" + fix;
        setError(f, "Ese dominio parece una errata.", suggestion);
        if (blocking) acknowledged.add(value); // la primera vez frena; si insiste con el mismo correo, se respeta
        return !blocking;
      }
    }
    if (f.required === false && !value) msg = "";
    setError(f, msg);
    return !msg;
  };
  const updateCounter = (f) => {
    const el = form.querySelector(`[data-count-for="${f.name}"]`);
    if (!el) return;
    const n = clean(f.value).length;
    el.textContent = `${n} / 2000 · mínimo 20`;
    el.classList.toggle("is-ok", n >= 20 && n <= 2000);
  };
  // Al salir del campo se valida; al escribir, se corrige el error en cuanto deja de serlo
  form.querySelectorAll("input, textarea").forEach((f) => {
    if (!VALIDATORS[f.name]) return;
    f.addEventListener("blur", () => { if (f.value || f.dataset.touched) checkField(f, { blocking: false }); f.dataset.touched = "1"; });
    f.addEventListener("input", () => {
      if (f.name === "descripcion") updateCounter(f);
      if (f.getAttribute("aria-invalid") === "true") checkField(f, { blocking: false });
    });
  });
  const desc = form.querySelector("#descripcion");
  if (desc) updateCounter(desc);

  const validate = (step) => {
    const fields = [...step.querySelectorAll("input, textarea")].filter((f) => f.type !== "hidden" && f.name !== "botcheck");
    let ok = true;
    let first = null;
    const radios = new Set();
    fields.forEach((f) => {
      if (f.type === "radio") { radios.add(f.name); return; }
      if (f.type === "checkbox") {
        const valid = f.checked || !f.required;
        f.setAttribute("aria-invalid", String(!valid));
        if (!valid) { ok = false; first ||= f; }
        return;
      }
      if (!checkField(f)) { ok = false; first ||= f; }
    });
    radios.forEach((name) => {
      if (!step.querySelector(`input[name="${name}"]:checked`)) { ok = false; first ||= step.querySelector(`input[name="${name}"]`); }
    });
    const error = step.querySelector("[data-error]");
    // Los mensajes van junto a cada campo; el aviso general solo se usa en los pasos de botones o casillas
    const generic = !step.querySelector("[data-err]");
    error.hidden = ok || !generic;
    if (!ok) first?.focus();
    return ok;
  };

  const fillSummary = () => {
    const data = new FormData(form);
    const rows = [["Necesitas", data.get("servicio")], ["Síntoma", data.get("sintoma")], ["Equipo", data.get("equipo")], ["Urgencia", data.get("urgencia")], ["Contacto", [data.get("nombre"), data.get("email"), data.get("municipio")].filter(Boolean).join(" · ")]];
    summary.replaceChildren(...rows.filter(([, v]) => v).map(([k, v]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = v;
      row.append(dt, dd);
      return row;
    }));
    summary.hidden = false;
  };

  next.addEventListener("click", () => { if (validate(steps[current])) show(current + 1); });
  prev.addEventListener("click", () => show(current - 1));

  // Al elegir una opción en un paso de botones, avanzar solo
  form.querySelectorAll(".quiz__choices input").forEach((input) => {
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
      const data = new FormData(form);
      const tema = String(data.get("servicio") || "");
      const nombre = String(data.get("nombre") || "");
      // Web3Forms muestra los campos tal cual se llaman y en este orden
      const payload = {
        access_key: data.get("access_key"),
        subject: `Nueva consulta · ${tema} · ${nombre}`,
        from_name: "Web de Víctor Rocamora",
        replyto: String(data.get("email") || ""),
        "Nombre": nombre,
        "Correo": data.get("email"),
        "Tema": tema,
        ...(data.get("sintoma") ? { "Síntoma": data.get("sintoma") } : {}),
        ...(data.get("equipo") ? { "Equipo": data.get("equipo") } : {}),
        ...(data.get("urgencia") ? { "Urgencia": data.get("urgencia") } : {}),
        ...(data.get("municipio") ? { "Municipio": data.get("municipio") } : {}),
        "Descripción": clean(String(data.get("descripcion") || "")),
        "Origen": data.get("origen"),
        "Privacidad": data.get("privacidad"),
      };
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || res.statusText);
      window.umami?.track?.("solicitud-enviada", { servicio: tema, urgencia: payload["Urgencia"], origen: payload["Origen"] });
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
