// Casos reales anonimizados: cada uno tiene su página en /casos/<slug>/ (src/casos/caso.njk, con paginación sobre esta lista).
// Para añadir otro caso, basta con añadir un objeto a la lista.
//   service: slug del tema de «Lo que sé hacer» donde se enlaza (also: otros temas donde también encaja)
//   link:    texto del enlace en ese tema
//   ficha:   tres datos de un vistazo (equipo, problema, resultado)
//   stages:  etapas del recorrido; icon es un nombre de partials/icons.njk; checks (opcional) = lista de comprobaciones
//            con su resultado (ok: true/false); conclusion (opcional) = frase de cierre de la etapa
//   published / updated: solo para el JSON-LD y el sitemap (no se muestran)
export default [
  {
    slug: "windows-no-arrancaba",
    service: "formateo",
    also: ["discos-datos"],
    link: "Ver un caso real: un Windows que no arrancaba",
    title: "Un Windows que no arrancaba, y unas partidas que no se podían perder",
    short: "Un Windows que no arrancaba",
    summary: "Un sobremesa de 2008 entraba en un bucle de reinicios con pantallazos azules. Primero salvé lo que importaba, después intenté repararlo y solo al final instalé desde cero.",
    description: "Caso real anonimizado: un sobremesa de 2008 con Windows 10 en bucle de reinicios. Cómo se salvaron los datos, qué se intentó antes de formatear y cómo quedó el equipo.",
    published: "2026-10-16",
    updated: "2026-10-16",
    ficha: [
      { label: "Equipo", text: "Sobremesa de 2008" },
      { label: "Problema", text: "Bucle de reinicios con pantallazos azules" },
      { label: "Resultado", text: "Funcionando, datos recuperados y con copia completa" },
    ],
    stages: [
      { icon: "alerta", title: "El problema", text: "Un sobremesa de 2008 (Core 2 Quad, 4 GB DDR2) con un SSD. Windows 10 entraba en un bucle de reinicios con pantallazos azules (CRITICAL_PROCESS_DIED) tras un problema con los mods de un juego." },
      { icon: "copia", title: "Primero, los datos", text: "Arranqué desde un USB de rescate (Hiren's BootCD PE) y copié a otro USB lo importante, sobre todo las partidas y el contenido del juego, que era lo que más importaba." },
      {
        icon: "llave", title: "Intentar reparar",
        text: "Antes de formatear, lo razonable es intentar reparar. Estas fueron las comprobaciones y su resultado:",
        checks: [
          { name: "Comprobación del disco (CHKDSK)", ok: true, result: "Sin errores graves" },
          { name: "Reparación de Windows sin arrancarlo (DISM)", ok: false, result: "Falló" },
          { name: "Copia automática del registro", ok: false, result: "Estaba vacía" },
          { name: "Punto de restauración", ok: false, result: "Falló" },
        ],
        conclusion: "Demasiado dañado para recuperarlo con garantías: toca instalar limpio.",
      },
      { icon: "decision", title: "La decisión", text: "Con la instalación demasiado dañada para recuperarla con garantías, lo sensato era formatear. Y se podía hacer sin miedo porque lo importante ya estaba a salvo." },
      { icon: "windows", title: "Instalación limpia", text: "Windows desde cero, actualizaciones, controladores y los programas necesarios." },
      { icon: "juego", title: "El juego, con cuidado", text: "Reinstalación con todos sus complementos y restauración de las partidas. Los mods no se copiaron a ciegas: se instalaron sus versiones actuales y se recuperó la configuración personal, para no arrastrar el problema." },
      { icon: "escudo", title: "Dejarlo preparado", text: "Punto de restauración, imagen completa del sistema para recuperarlo rápido si vuelve a fallar y corrección de dos avisos molestos al arrancar." },
    ],
    result: "De inutilizable a funcionando sin pantallazos, con las partidas, los mods y los archivos personales recuperados y con copia de seguridad completa.",
    lesson: "Primero se salvan los datos, después se intenta reparar y solo al final se formatea. Y en un equipo de 2008, si vuelven los fallos graves de hardware, toca valorar cambiarlo antes que seguir invirtiendo.",
    cta: { text: "¿Te pasa algo parecido?", label: "Cuéntamelo", servicio: "formateo", origen: "caso-windows" },
    note: "Caso real anonimizado: no incluye datos personales.",
  },
];
