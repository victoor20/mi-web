// Trayectoria de "Sobre mí": las etapas de la línea de tiempo y las insignias de formación complementaria.
// "when" es la etiqueta de la izquierda; "url" y "link" (opcionales) añaden un enlace al final de la nota.
export default {
  stages: [
    { when: "Base", title: "Ingeniería Informática", where: "Universidad Miguel Hernández de Elche · sin finalizar", note: "Mi punto de partida en programación y fundamentos de la informática." },
    { when: "2022–2024", title: "CFGS en Administración de Sistemas Informáticos en Red (ASIR)", where: "IES Severo Ochoa · Elche", note: "Sistemas, redes y servicios." },
    { when: "2025–2026", title: "Curso de especialización en Administración Cloud", where: "IES Poeta Paco Mollá · Petrer", note: "Centrado en AWS." },
    { when: "2025–2026", title: "Máster en Inteligencia Artificial, con doble titulación", where: "BIG school · Universidad Isabel I", note: "Incluye el Diploma de Experto Universitario en IA." },
    { when: "En curso", title: "AI Engineering", where: "Formación autodidacta", note: "Agentes, RAG y APIs, además del máster.", url: "/ia/", link: "Ver la hoja de ruta" },
  ],
  badges: [
    { tag: "AWS", text: "AWS Academy Cloud Security Builder (Trained)" },
    { tag: "LAB", text: "+40 laboratorios y simulaciones de AWS Skill Builder" },
    { tag: "SEC", text: "5 cursos de Academia de Hackers (2025)" },
    { tag: "PY", text: "Python Essentials 1 y 2 · Cisco Networking Academy" },
  ],
};
