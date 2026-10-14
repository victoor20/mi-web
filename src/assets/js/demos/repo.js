// Demo de la fase 6: un repositorio de proyecto por dentro, con carpetas que se pliegan y archivos que se abren.
// Contenido ilustrativo (no es un repositorio real).
const FILES = {
  main: { name: "app/main.py", code: `from fastapi import FastAPI\nfrom .rag import responder\n\napp = FastAPI()\n\n@app.post("/preguntar")\ndef preguntar(pregunta: str):\n    return responder(pregunta)` },
  rag: { name: "app/rag.py", code: `def responder(pregunta: str) -> dict:\n    fragmentos = buscar(pregunta, k=3)\n    texto = generar(pregunta, fragmentos)\n    return {"respuesta": texto, "fuentes": fragmentos}` },
  test: { name: "tests/test_rag.py", code: `def test_cita_fuentes():\n    r = responder("¿Qué es un SSD?")\n    assert r["fuentes"]` },
  docker: { name: "Dockerfile", code: `FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY app app\nCMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]` },
  req: { name: "requirements.txt", code: `fastapi\nuvicorn\nllama-index` },
};

export default function repo(root) {
  const view = root.querySelector("[data-rp-view]");
  const readme = view.innerHTML; // el README ya está maquetado en el HTML
  const files = [...root.querySelectorAll("[data-rp-file]")];
  root.querySelector(".rp").classList.add("is-ready");

  const open = (btn) => {
    files.forEach((f) => f.removeAttribute("aria-current"));
    btn.setAttribute("aria-current", "true");
    const key = btn.dataset.rpFile;
    if (key === "readme") { view.innerHTML = readme; return; }
    const f = FILES[key];
    const name = document.createElement("p"); name.className = "rp__file mono"; name.textContent = f.name;
    const pre = document.createElement("pre"); pre.className = "rp__code"; pre.textContent = f.code;
    view.replaceChildren(name, pre);
  };
  files.forEach((b) => b.addEventListener("click", () => open(b)));

  // Carpetas plegables
  root.querySelectorAll("[data-rp-dir]").forEach((dir) => {
    dir.hidden = false;
    const children = dir.parentElement.querySelector(".rp__children");
    dir.addEventListener("click", () => {
      const open = dir.getAttribute("aria-expanded") !== "true";
      dir.setAttribute("aria-expanded", String(open));
      children.hidden = !open;
    });
  });
}
