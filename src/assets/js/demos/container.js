// Demo de la fase 4: una petición entra en un contenedor Docker y devuelve la respuesta (simulación).
const ENDPOINTS = [
  {
    req: 'POST /resumir\n{"texto": "Reparar un portátil lento…"}',
    log: 'INFO:  172.17.0.1 - "POST /resumir HTTP/1.1" 200 OK',
    res: '200 OK · 184 ms\n{"resumen": "Cambiar el disco por un SSD…", "tokens": 41}',
  },
  {
    req: "GET /salud",
    log: 'INFO:  172.17.0.1 - "GET /salud HTTP/1.1" 200 OK',
    res: '200 OK · 3 ms\n{"estado": "ok"}',
  },
];

export default function container(root, { reduceMotion }) {
  const ep = root.querySelector("[data-ct-ep]");
  const on = root.querySelector("[data-ct-on]");
  const send = root.querySelector("[data-ct-send]");
  const packet = root.querySelector("[data-ct-packet]");
  const box = root.querySelector("[data-ct-box]");
  const req = root.querySelector("[data-ct-req]");
  const log = root.querySelector("[data-ct-log]");
  const res = root.querySelector("[data-ct-res]");
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  const reset = () => {
    timers.forEach(clearTimeout); timers = [];
    packet.getAnimations().forEach((a) => a.cancel());
    box.classList.remove("is-hot", "is-off");
    log.textContent = "Esperando peticiones en :8000";
    res.textContent = "Pulsa «Enviar»";
    res.classList.remove("is-error");
    packet.style.opacity = "0";
    req.textContent = ENDPOINTS[Number(ep.value)].req;
  };

  const fly = (from, to, ms) => packet.animate([{ left: from, opacity: 1 }, { left: to, opacity: 1 }], { duration: ms, easing: "ease-in-out", fill: "forwards" }).finished;

  const go = async () => {
    reset();
    const e = ENDPOINTS[Number(ep.value)];
    const up = on.checked;
    box.classList.toggle("is-off", !up);
    if (reduceMotion) { show(e, up); return; }
    send.disabled = true;
    try {
      await fly("0%", up ? "100%" : "92%", 650);
      if (!up) { show(e, false); return; }
      box.classList.add("is-hot");
      log.textContent = e.log;
      await new Promise((r) => later(r, 450));
      await fly("100%", "0%", 650);
      box.classList.remove("is-hot");
      res.textContent = e.res;
      packet.style.opacity = "0";
    } catch { /* animación cancelada al reiniciar */ } finally { send.disabled = false; }
  };

  const show = (e, up) => {
    packet.style.opacity = "0";
    box.classList.remove("is-hot");
    if (up) { log.textContent = e.log; res.textContent = e.res; res.classList.remove("is-error"); }
    else {
      log.textContent = "(nadie escucha en :8000)";
      res.textContent = "Error de conexión: connection refused\nArranca el contenedor: docker run -p 8000:8000 mi-api";
      res.classList.add("is-error");
    }
  };

  send.hidden = false;
  send.addEventListener("click", go);
  ep.addEventListener("change", reset);
  on.addEventListener("change", reset);
  reset();
}
