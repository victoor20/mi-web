// ¿Compensa ampliar tu portátil? Cuatro respuestas → veredicto razonado con enlace a la sección de la guía.
const LINKS = {
  cuello: { label: "Ver «Primero: identificar el cuello de botella»", href: "#primero-identificar-el-cuello-de-botella" },
  ssd: { label: "Ver «SSD: la mejora que más se nota»", href: "#ssd-la-mejora-que-mas-se-nota" },
  ram: { label: "Ver «Memoria: cuándo merece la pena»", href: "#memoria-cuando-merece-la-pena" },
  caso: { label: "Ver «Qué hacer según tu caso»", href: "#que-hacer-segun-tu-caso" },
};

// Orden de las reglas = orden de prioridad, igual que en el texto de la guía
function verdict({ disk, ram, cpu, heat }) {
  if (cpu === "justo") {
    return { tone: "stop", title: "Probablemente no compensa", text: "Si el procesador, la batería y la pantalla ya están muy limitados, ampliar es invertir en un equipo que se queda corto por otros lados. Quizá sea mejor guardar el dinero para renovar.", links: [LINKS.caso] };
  }
  if (heat === "si") {
    return { tone: "wait", title: "Empieza por el mantenimiento", text: "Calor, ruido o apagones apuntan antes a polvo, pasta térmica degradada o ventilación obstruida que a falta de piezas. Confundir falta de mantenimiento con falta de potencia es de los errores más habituales.", links: [LINKS.cuello] };
  }
  if (disk === "nose") {
    return { tone: "wait", title: "Primero averigua qué almacenamiento tiene", text: "De eso depende casi todo: un disco mecánico (HDD) cambia por completo con un SSD, y uno que ya es SSD pide otro tipo de mejora. Un disco siempre al 100 % es la señal clásica.", links: [LINKS.cuello] };
  }
  if (disk === "hdd") {
    if (ram === "4") {
      return { tone: "go", title: "Sí: SSD y, si es ampliable, memoria", text: "Con disco mecánico, el SSD es el cambio que más se nota. Con 4 GB o menos conviene mirar también la memoria, siempre que el portátil tenga ranuras (muchos la llevan soldada).", links: [LINKS.ssd, LINKS.ram] };
    }
    return { tone: "go", title: "Sí: empieza por un SSD", text: "Con un disco mecánico y un equipo que aún acompaña, el SSD es la mejora más rentable: el arranque, los programas y la respuesta general mejoran mucho. Comprueba antes qué formato admite y haz copia de seguridad antes de clonar.", links: [LINKS.ssd] };
  }
  if (ram === "16") {
    return { tone: "wait", title: "Probablemente no compensa ampliar", text: "Con SSD y 16 GB, el cuello de botella suele estar en otro sitio: el mantenimiento, los programas en segundo plano o el procesador. Revisa eso antes de gastar.", links: [LINKS.cuello] };
  }
  return { tone: "go", title: "Sí: merece la pena mirar la memoria", text: "Con SSD pero 8 GB o menos, subir a 16 GB puede alargarle bastante la vida si se atasca con la multitarea. Antes, comprueba ranuras libres, capacidad máxima y tipo de memoria: en muchos portátiles va soldada.", links: [LINKS.ram] };
}

export default function ampliar(root) {
  const form = root.querySelector("[data-form]");
  const out = root.querySelector("[data-result]");
  const hint = root.querySelector("[data-hint]");
  const NAMES = ["disk", "ram", "cpu", "heat"];

  const render = () => {
    const a = Object.fromEntries(NAMES.map((n) => [n, form.elements[n].value]));
    const done = NAMES.filter((n) => a[n]).length;
    out.querySelector(".tool__card")?.remove();
    if (done < NAMES.length) {
      hint.hidden = false;
      hint.textContent = done ? `Llevas ${done} de 4. Responde las que faltan para ver el veredicto.` : "Responde las cuatro preguntas para ver el veredicto.";
      return;
    }
    hint.hidden = true;
    const v = verdict(a);
    const card = document.createElement("div");
    card.className = `tool__card tool__card--${v.tone}`;
    const kicker = document.createElement("p");
    kicker.className = "mono";
    kicker.textContent = "Veredicto";
    const h = document.createElement("h3");
    h.textContent = v.title;
    const p = document.createElement("p");
    p.textContent = v.text;
    const links = document.createElement("p");
    links.className = "tool__links";
    v.links.forEach((l) => {
      const el = document.createElement("a");
      el.className = "text-link";
      el.href = l.href;
      el.textContent = `${l.label} →`;
      links.append(el);
    });
    const help = document.createElement("p");
    help.className = "tool__links";
    help.append("¿Dudas con tu caso concreto? ");
    const ask = document.createElement("a");
    ask.className = "text-link";
    ask.href = "/contacto/?servicio=ssd-ram&origen=guia-acelerar-herramienta";
    ask.textContent = "Cuéntamelo →";
    help.append(ask);
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "tool__reset";
    reset.textContent = "Empezar de nuevo";
    reset.addEventListener("click", () => { form.reset(); render(); form.querySelector("input")?.focus(); });
    card.append(kicker, h, p, links, help, reset);
    out.append(card);
  };
  form.addEventListener("change", render);
}
