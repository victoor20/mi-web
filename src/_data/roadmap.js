// Hoja de ruta de AI Engineering (/ia/). Todo lo que cambia con el avance está aquí.
//
// Estado de cada fase ("state"): "pendiente" | "en-curso" | "completada" | "permanente"
// Posición del marcador ("progress"): la fase en la que estás y el porcentaje que llevas de ella.
//   Ejemplo: { phase: 1, percent: 50 } = a mitad de la fase 1.
//   Para terminar la fase 1 y empezar la 2: { phase: 2, percent: 0 }.
// Cada fase lleva una línea «Para qué sirve» en lenguaje llano ("use"), lo que aprendo ("learn"), los recursos ("resources") y los
// proyectos que salen de ella ("projects"), junto a su demostración interactiva simulada ("demo": id del módulo
// en src/assets/js/demos/ y título). Si una lista está vacía, esa parte no se muestra.
export default {
  progress: { phase: 1, percent: 50 },
  states: {
    pendiente: "Pendiente",
    "en-curso": "En curso",
    completada: "Completada",
    permanente: "Permanente",
  },
  phases: [
    {
      title: "Python sólido",
      use: "Es el idioma con el que se construye casi todo en IA: sin él, lo demás se queda en teoría.",
      summary: "La base de programación sobre la que se apoya todo lo demás.",
      state: "en-curso",
      demo: { id: "python", title: "Ejecuta un fragmento de Python" },
      learn: ["Funciones, clases y manejo de librerías", "Entornos virtuales, ficheros y excepciones", "Pensar en Python para proyectos reales"],
      resources: [{ name: "CS50P: introducción a la programación con Python", by: "Harvard" }],
      projects: ["Proyecto final de CS50P"],
    },
    {
      title: "Cómo funcionan los LLMs",
      use: "Entender qué hay detrás de un chat de IA para usarlo bien: qué puede hacer, cuánto cuesta y dónde falla.",
      summary: "APIs, prompts, tokens y contexto.",
      state: "pendiente",
      demo: { id: "tokens", title: "Así trocea un modelo tu frase" },
      learn: ["Llamar a las APIs de OpenAI y Anthropic", "Prompt engineering básico y parseo de respuestas", "Gestión del contexto"],
      resources: [{ name: "LangChain for LLM Application Development", by: "DeepLearning.AI" }],
      projects: [],
    },
    {
      title: "Agentes y RAG",
      use: "Que la IA trabaje con tus documentos y use herramientas, diciendo de dónde saca cada dato.",
      summary: "LangGraph, RAG agéntico y memoria a largo plazo.",
      state: "pendiente",
      demo: { id: "rag", title: "Así responde un RAG, citando sus fuentes" },
      learn: ["Agentes con LangGraph", "RAG agéntico con LlamaIndex", "Memoria a largo plazo"],
      resources: [
        { name: "AI Agents in LangGraph", by: "DeepLearning.AI" },
        { name: "Building Agentic RAG with LlamaIndex", by: "DeepLearning.AI" },
        { name: "Long-Term Agentic Memory with LangGraph", by: "DeepLearning.AI" },
      ],
      projects: ["Asistente con memoria conectado a APIs", "Sistema multiagente para una tarea real"],
    },
    {
      title: "Despliegue",
      use: "Que lo que funciona en mi ordenador funcione también para otras personas, de forma estable.",
      summary: "Que lo construido salga de mi equipo.",
      state: "pendiente",
      demo: { id: "container", title: "Una petición entra en un contenedor" },
      learn: ["Crear APIs para modelos de IA", "Dockerizar aplicaciones", "Exponer endpoints"],
      resources: [
        { name: "Tutorial oficial de FastAPI", by: "FastAPI" },
        { name: "Documentación oficial de Docker", by: "Docker" },
      ],
      projects: ["Agente RAG sobre PDFs, con FastAPI y Docker"],
    },
    {
      title: "Modelos open source",
      use: "Poder usar modelos que funcionan en un equipo propio, sin depender siempre de un servicio externo.",
      summary: "Trabajar con modelos abiertos a través de Hugging Face.",
      state: "pendiente",
      demo: { id: "quant", title: "Cuantización: menos bits, menos peso" },
      learn: ["Descargar y usar modelos de Hugging Face", "Fine-tuning básico y cuantización", "Ejecutar modelos en local"],
      resources: [
        { name: "Curso oficial de Hugging Face", by: "Hugging Face" },
        { name: "Open Source Models with Hugging Face", by: "DeepLearning.AI" },
      ],
      projects: [],
    },
    {
      title: "Portfolio de proyectos en GitHub",
      use: "Que cada cosa aprendida quede publicada y cualquiera pueda comprobarla.",
      summary: "En paralelo desde la fase 3: cada fase deja algo publicado.",
      state: "permanente",
      demo: { id: "repo", title: "Un repositorio de proyecto, por dentro" },
      learn: ["Documentar, probar y mantener cada proyecto para que se pueda reproducir"],
      resources: [{ name: "GitHub", by: "Repositorios públicos" }],
      projects: ["Agente RAG sobre PDFs, con FastAPI y Docker", "Asistente con memoria conectado a APIs", "Sistema multiagente para una tarea real"],
    },
  ],
};
