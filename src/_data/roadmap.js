// Hoja de ruta de AI Engineering (/ia/). Para actualizar el avance, cambia solo "state" de cada fase:
//   "pendiente" | "en-curso" | "completada" | "permanente"
// El orden de las fases es el del array; la numeración sale sola.
export default {
  states: {
    pendiente: "Pendiente",
    "en-curso": "En curso",
    completada: "Completada",
    permanente: "Permanente",
  },
  phases: [
    {
      title: "Python sólido",
      detail: "CS50P de Harvard: la base de programación sobre la que se apoya todo lo demás.",
      state: "en-curso",
    },
    {
      title: "Cómo funcionan los LLMs",
      detail: "APIs, prompts, tokens y contexto, con LangChain for LLM Application Development (DeepLearning.AI).",
      state: "pendiente",
    },
    {
      title: "Agentes y RAG",
      detail: "LangGraph, RAG agéntico con LlamaIndex y memoria a largo plazo (DeepLearning.AI).",
      state: "pendiente",
    },
    {
      title: "Despliegue",
      detail: "APIs con FastAPI y contenedores con Docker para que lo construido salga de mi equipo.",
      state: "pendiente",
    },
    {
      title: "Modelos open source",
      detail: "Trabajar con modelos abiertos a través de Hugging Face.",
      state: "pendiente",
    },
    {
      title: "Portfolio de proyectos en GitHub",
      detail: "Va en paralelo desde la fase 3 y no se cierra: cada fase deja algo publicado.",
      state: "permanente",
      projects: [
        "Agente RAG sobre PDFs, con FastAPI y Docker",
        "Asistente con memoria conectado a APIs",
        "Sistema multiagente para una tarea real",
      ],
    },
  ],
};
