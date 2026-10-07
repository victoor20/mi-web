// Guion del holograma de Jarvis. Respuestas escritas de antemano: no hay ningún modelo detrás.
// "focus" indica qué nodos del diagrama de arquitectura se iluminan con cada respuesta.
export default {
  greeting: "Hola. Soy una representación de Jarvis: mis respuestas las ha escrito Víctor de antemano y no estoy conectado a ningún modelo. Elige una pregunta.",
  questions: [
    {
      id: "que-es",
      q: "¿Qué es Jarvis?",
      a: "Soy el agente personal de Víctor y funciono 24/7 en un equipo dedicado. No soy un chatbot: tengo memoria persistente, herramientas controladas y tareas programadas, con un principio de autonomía controlada.",
      focus: ["orquestador", "modelo", "memoria", "herramientas", "tareas"],
    },
    {
      id: "memoria",
      q: "¿Cómo recuerda las cosas?",
      a: "Guardo memoria persistente de los proyectos y del contexto que importa. Mi comportamiento vive en archivos separados (identidad, reglas, herramientas y memoria), así que se puede revisar y corregir qué sé y cómo actúo.",
      focus: ["memoria", "comportamiento"],
    },
    {
      id: "puede",
      q: "¿Qué puede hacer?",
      a: "Ayudo con tareas técnicas y de desarrollo, recuerdo en qué punto está cada proyecto, preparo borradores para LinkedIn, vigilo ofertas de trabajo y oportunidades, y redacto correos para que Víctor los revise.",
      focus: ["herramientas", "tareas", "memoria"],
    },
    {
      id: "permiso",
      q: "¿Qué no hace sin permiso?",
      a: "Nada con efectos fuera: enviar correos, publicar, hacer push a un repositorio o borrar. Lo preparo y espero su aprobación. Puedo equivocarme, y por eso la última palabra no es mía.",
      focus: ["gate", "acciones"],
    },
    {
      id: "construido",
      q: "¿Cómo está construido?",
      a: "OpenClaw me orquesta y un modelo de OpenAI razona. Hablo por Telegram con texto o voz: transcribo en local con Whisper y respondo con síntesis de voz. Todo corre en un equipo Lubuntu dedicado.",
      focus: ["telegram", "voz", "orquestador", "modelo", "host"],
    },
    {
      id: "fiabilidad",
      q: "¿Y si algo falla?",
      a: "Funciono como servicio persistente, con copias de seguridad cifradas en dos capas y un panel privado de supervisión para ver qué hago y cómo estoy.",
      focus: ["host"],
    },
    {
      id: "futuro",
      q: "¿Hacia dónde va?",
      a: "De responder cuando me hablan a vigilar, detectar y proponer acciones por mi cuenta. Pero proponer no es actuar: las decisiones siguen siendo de Víctor.",
      focus: ["tareas", "gate"],
    },
  ],
};
