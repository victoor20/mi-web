// Catálogo de servicios: se usa en la home, en /servicios/ y en el cuestionario de contacto.
// Modo comercial: el catálogo de servicios. Modo portfolio: lo mismo contado como "lo que sé hacer" (mismos slug, guide y group).
import site from "./site.js";

const comercial = [
  {
    slug: "diagnostico-reparacion",
    name: "Diagnóstico y reparación",
    short: "Portátiles y sobremesa que no arrancan, se calientan, hacen ruido o se apagan solos.",
    solves: "Cuando algo falla y no sabes si tiene arreglo. Localizo la causa antes de proponer nada y te digo con claridad si compensa repararlo.",
    includes: ["Revisión de hardware y software", "Pruebas de temperatura, disco y memoria", "Sustitución de piezas cuando hace falta", "Limpieza interna y pasta térmica"],
    note: "Si la reparación no merece la pena, te lo digo antes de gastar.",
  },
  {
    slug: "formateo",
    name: "Formateo y puesta a punto",
    short: "Windows limpio, controladores al día y tus archivos y programas de vuelta en su sitio.",
    solves: "Para el sistema que arrastra años de programas, errores o virus. Se reinstala desde cero sin que pierdas lo importante.",
    includes: ["Copia previa de tus datos", "Instalación limpia del sistema", "Controladores y actualizaciones", "Restauración de archivos y programas habituales"],
    note: "Antes de borrar nada, acordamos qué hay que conservar.",
  },
  {
    slug: "ssd-ram",
    name: "Segunda vida a tu portátil",
    short: "Cambio a SSD y ampliación de memoria cuando un equipo lento aún tiene recorrido.",
    solves: "Muchos portátiles que parecen acabados solo necesitan un SSD y algo más de RAM. Compruebo antes qué admite el tuyo.",
    includes: ["Comprobación de compatibilidad", "Clonado del disco actual al SSD", "Instalación y prueba de la memoria", "Ajustes de arranque y rendimiento"],
    note: "Te explico qué mejora esperar antes de comprar ninguna pieza.",
    guide: "/guias/acelerar-portatil-lento-ssd-ram/",
  },
  {
    slug: "discos-datos",
    name: "Discos y datos",
    short: "Sustitución y clonado de discos, copias de seguridad y recuperación de archivos.",
    solves: "Para el disco que hace ruidos, la carpeta borrada por error o el negocio que no tiene copia de nada.",
    includes: ["Diagnóstico del estado del disco", "Clonado y sustitución", "Recuperación lógica de archivos", "Sistema de copias de seguridad"],
    note: "Si el disco tiene daño físico grave, te oriento hacia un laboratorio especializado en lugar de arriesgar tus datos.",
  },
  {
    slug: "montaje-compra",
    name: "Montaje y asesoría de compra",
    short: "Torres a medida o ayuda para elegir sin pagar por lo que no vas a usar.",
    solves: "Para montar un sobremesa con piezas que encajen o elegir portátil sabiendo qué importa en tu caso.",
    includes: ["Selección de componentes compatibles", "Montaje, cableado y pruebas", "Instalación del sistema", "Recomendación razonada de compra"],
    note: "Partimos de tu uso real y tu presupuesto, no de la ficha más llamativa.",
    guide: "/guias/compatibilidad-componentes-pc/",
  },
  {
    slug: "negocios",
    name: "Informática para pequeños negocios",
    short: "Mantenimiento, copias, wifi y red, correo y los equipos del día a día.",
    solves: "Para el comercio u oficina que necesita que todo funcione sin tener un departamento técnico.",
    includes: ["Mantenimiento preventivo", "Copias de seguridad automáticas", "Red, wifi e impresoras", "Correo y cuentas de trabajo"],
    note: "Un único interlocutor que conoce cómo está montado tu negocio.",
  },
  {
    slug: "automatizacion",
    name: "Automatizaciones sencillas",
    short: "Tareas repetitivas que pueden hacerse solas: correos, hojas de cálculo, avisos y documentos.",
    solves: "Para ese trabajo manual que se repite cada semana. Si se puede automatizar de forma fiable y sencilla, lo monto; si no, te lo digo.",
    includes: ["Análisis de la tarea", "Flujos con reglas o con IA cuando aporta", "Pruebas con tus datos reales", "Documentación para que sepas cómo funciona"],
    note: "Empiezo por lo pequeño y comprobable, sin prometer milagros.",
    group: "automatizacion",
  },
];

const portfolio = [
  {
    slug: "diagnostico-reparacion",
    name: "Diagnóstico y reparación",
    short: "Portátiles y sobremesa que no arrancan, se calientan, hacen ruido o se apagan solos.",
    story: "He tenido entre manos portátiles que no encendían, torres que se apagaban solas y equipos que sonaban como un secador. Lo que más me ha enseñado es a localizar la causa antes de cambiar piezas: casi siempre era un cargador, un disco o una limpieza pendiente, y no el equipo entero.",
  },
  {
    slug: "formateo",
    name: "Formateo y puesta a punto",
    short: "Windows limpio, controladores al día y archivos y programas de vuelta en su sitio.",
    story: "Sistemas que arrastraban años de programas, errores y algún virus. Reinstalarlos desde cero, con copia previa de lo importante y los controladores al día, devuelve la agilidad sin que se pierdan documentos ni fotos.",
  },
  {
    slug: "ssd-ram",
    name: "Segunda vida a un portátil",
    short: "Cambio a SSD y ampliación de memoria cuando un equipo lento aún tiene recorrido.",
    story: "Muchos portátiles que parecían acabados solo necesitaban un SSD y algo más de memoria. Lo primero es comprobar qué admite cada modelo; después, clonar el disco y ajustar el arranque cambia por completo el día a día. De ahí salió una de mis guías.",
    guide: "/guias/acelerar-portatil-lento-ssd-ram/",
  },
  {
    slug: "discos-datos",
    name: "Discos y datos",
    short: "Sustitución y clonado de discos, copias de seguridad y recuperación de archivos.",
    story: "Discos que hacían ruidos, carpetas borradas por error y equipos que no tenían copia de nada. Cuando el fallo es lógico suele haber recuperación; si el daño es físico, lo prudente es dejarlo en manos de un laboratorio especializado antes que arriesgar los datos.",
  },
  {
    slug: "montaje-compra",
    name: "Montaje y elección de equipos",
    short: "Torres a medida o criterio para elegir sin pagar por lo que no se va a usar.",
    story: "Sobremesas montados con piezas que encajan y portátiles elegidos según el uso real, no según la ficha más llamativa. Esa experiencia está detrás de mis guías de compatibilidad y de compra.",
    guide: "/guias/compatibilidad-componentes-pc/",
  },
  {
    slug: "automatizacion",
    name: "Automatizaciones sencillas",
    short: "Tareas repetitivas que pueden hacerse solas: correos, hojas de cálculo, avisos y documentos.",
    story: "Trabajo manual que se repite cada semana y que puede resolverse con reglas sencillas o con ayuda de IA. Prefiero lo pequeño y comprobable, dejarlo documentado y reconocer cuándo una tarea no compensa automatizarla; eso también forma parte del oficio.",
    group: "automatizacion",
  },
];

export default site.isCommercial ? comercial : portfolio;
