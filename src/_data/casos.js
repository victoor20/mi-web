// Casos reales anonimizados que se muestran en /lo-que-se-hacer/ dentro de su tema, indexados por el slug del servicio.
//   steps: [{ label, text }] en orden; result y lesson van destacados al final.
export default {
  formateo: {
    title: "Un Windows que no arrancaba, y unas partidas que no se podían perder",
    steps: [
      { label: "El equipo.", text: "Un sobremesa de 2008 (Core 2 Quad, 4 GB DDR2) con un SSD. Windows 10 entraba en un bucle de reinicios con pantallazos azules (CRITICAL_PROCESS_DIED) tras un problema con los mods de un juego." },
      { label: "Primero, los datos.", text: "Arranqué desde un USB de rescate (Hiren's BootCD PE) y copié a otro USB lo importante, sobre todo las partidas y el contenido del juego, que era lo que más importaba." },
      { label: "Reparar antes de formatear.", text: "Comprobación del disco (CHKDSK), reparación de Windows sin arrancarlo (DISM), revisión del registro y de su copia automática (vacía) y un punto de restauración (falló). La instalación estaba demasiado dañada para recuperarla con garantías." },
      { label: "Instalación limpia.", text: "Windows desde cero, actualizaciones, controladores y los programas necesarios." },
      { label: "El juego, con cuidado.", text: "Reinstalación con todos sus complementos y restauración de las partidas. Los mods no se copiaron a ciegas: se instalaron sus versiones actuales y se recuperó la configuración personal, para no arrastrar el problema." },
      { label: "Dejarlo preparado.", text: "Punto de restauración, imagen completa del sistema para recuperarlo rápido si vuelve a fallar y corrección de dos avisos molestos al arrancar." },
    ],
    result: "De inutilizable a funcionando sin pantallazos, con las partidas, los mods y los archivos personales recuperados y con copia de seguridad completa.",
    lesson: "Primero se salvan los datos, después se intenta reparar y solo al final se formatea. Y en un equipo de 2008, si vuelven los fallos graves de hardware, toca valorar cambiarlo antes que seguir invirtiendo.",
  },
};
