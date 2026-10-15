// Preguntas frecuentes de cada página (modo portfolio). Cada página tiene las suyas y no se repiten entre páginas.
// Texto plano: el mismo contenido alimenta el componente y el JSON-LD FAQPage (src/_data/schemaData.js).
//   id    → identifica la pregunta y viaja como origen ("faq-<id>") en el cuestionario de contacto
//   help  → slug del servicio: añade «¿No se resuelve? Cuéntamelo» con ese tema ya elegido en el cuestionario
//   link  → { label, url }: enlace contextual al final de la respuesta
// Enfoque de las respuestas técnicas: ayudar primero, marcar el límite (cuándo deja de ser buena idea seguir solo) y llevar a contacto.
// En modo comercial la página de servicios mantiene sus preguntas propias y el resto de páginas no muestra FAQ.
import site from "./site.js";
import roadmap from "./roadmap.js";

const fase = roadmap.phases[roadmap.progress.phase - 1];

const servicios = [
  {
    id: "diagnostico",
    label: "Diagnóstico",
    items: [
      {
        id: "por-donde",
        help: "diagnostico-reparacion",
        q: "¿Por dónde empiezas ante un fallo?",
        a: "Por lo más sencillo y probable: voy descartando causas una a una y solo cambio una pieza cuando sé cuál es la culpable. Si quieres adelantar trabajo, apunta cuándo empezó, qué estabas haciendo y qué mensajes de error aparecen. Y si hay olor a quemado, un golpe o líquido de por medio, mejor no seguir probando.",
      },
      {
        id: "no-enciende",
        help: "diagnostico-reparacion",
        q: "Mi portátil no enciende, ¿qué puedo comprobar?",
        a: "Puede ser el cargador, la batería, una pieza interna o la placa. Sin abrirlo, prueba otra toma de corriente, mira si el cargador está dañado o muy caliente y si se enciende algún piloto. Si no da ninguna señal, huele a quemado o ha sufrido líquido o un golpe, deja de insistir: seguir probando puede empeorarlo.",
      },
      {
        id: "limpieza",
        help: "diagnostico-reparacion",
        q: "¿Cada cuánto conviene limpiar un portátil por dentro?",
        a: "Como orientación, una vez al año si lo usas a diario, y antes si se calienta o el ventilador suena más de lo normal. Mientras tanto, mantén libres las rejillas y úsalo sobre una superficie dura. Abrirlo sin experiencia no es buena idea: hay tornillos y cintas frágiles, y puede afectar a la garantía.",
      },
    ],
  },
  {
    id: "formateo",
    label: "Formateo",
    items: [
      {
        id: "perder-archivos",
        help: "formateo",
        q: "¿Pierdo mis archivos si formateo?",
        a: "No, si hay forma de conservarlos: antes se hace copia de lo importante y se comprueba que se abre bien. Tú puedes adelantar copiando tus documentos y fotos a un disco externo o a la nube. Si el equipo no arranca o el disco da errores, no lo fuerces: ahí lo primero es asegurar los datos.",
      },
      {
        id: "reinstalar",
        help: "formateo",
        q: "¿Cuándo merece la pena reinstalar Windows?",
        a: "Cuando el sistema arrastra años de programas, errores repetidos o restos de un virus y limpiar por encima ya no basta. Si el fallo viene de una pieza (disco, memoria), reinstalar no lo arregla y solo hace perder tiempo. Si no tienes claro cuál es tu caso, no reinstales a ciegas.",
      },
      {
        id: "antes-reinstalar",
        help: "formateo",
        q: "¿Qué conviene tener a mano antes de reinstalar?",
        a: "Las cuentas y licencias que uses, una lista de los programas que necesitas y los controladores del equipo (o conexión a internet para descargarlos). Lo que no conviene es borrar particiones sin tener antes una copia de lo importante.",
      },
    ],
  },
  {
    id: "segunda-vida",
    label: "Segunda vida",
    items: [
      {
        id: "portatil-antiguo",
        help: "ssd-ram",
        q: "¿Merece la pena arreglar un portátil antiguo?",
        a: "A menudo sí: un SSD y más memoria cambian por completo un equipo de varios años. Depende del procesador y de lo que se le pida; si es muy antiguo o el resto de piezas está al límite, ampliar puede no compensar.",
      },
      {
        id: "mas-memoria",
        help: "ssd-ram",
        q: "¿Cómo sé si mi portátil admite más memoria?",
        a: "Busca el modelo exacto (en la etiqueta o en la información del sistema) y consulta en la web del fabricante el tipo de memoria, la capacidad máxima y las ranuras. En algunos portátiles va soldada y no se puede ampliar. Comprar sin comprobarlo es el error más habitual; si no lo tienes claro, no compres todavía.",
      },
      {
        id: "ssd-se-nota",
        help: "ssd-ram",
        q: "¿Se nota de verdad cambiar a un SSD?",
        a: "Sí, sobre todo si el equipo tiene un disco mecánico: el arranque, la apertura de programas y la respuesta general mejoran mucho. Con un procesador muy antiguo la mejora tiene su techo. El cambio implica clonar o reinstalar, así que solo conviene hacerlo con copia de lo importante.",
      },
    ],
  },
  {
    id: "discos-datos",
    label: "Discos y datos",
    items: [
      {
        id: "recuperar-datos",
        help: "discos-datos",
        q: "¿Se pueden recuperar los datos de un disco estropeado?",
        a: "Muchas veces sí, cuando el problema es lógico (borrados, particiones dañadas, un sistema que no arranca). Si el disco hace ruidos, no aparece o se desconecta, apágalo y no sigas usándolo: cada intento puede empeorarlo. Con daño físico grave, lo prudente es un laboratorio especializado.",
      },
      {
        id: "borre-archivo",
        help: "discos-datos",
        q: "He borrado un archivo sin querer, ¿qué hago?",
        a: "Usa lo menos posible ese disco: lo que se escriba después puede sobrescribir lo borrado. Mira primero la papelera, las versiones anteriores y la nube. Si es importante y no aparece, evita instalar programas en ese mismo disco y consúltalo antes de seguir probando.",
      },
      {
        id: "copia-casa",
        help: "discos-datos",
        q: "¿Qué copia de seguridad es suficiente para casa?",
        a: "Una regla sencilla es la 3-2-1: tres copias de lo importante, en dos soportes distintos y una fuera de casa (por ejemplo, el equipo, un disco externo y la nube). Y de vez en cuando, comprobar que se puede restaurar: una copia que no se ha probado es solo una esperanza.",
      },
    ],
  },
  {
    id: "montaje",
    label: "Montaje",
    items: [
      {
        id: "comprar-piezas",
        help: "montaje-compra",
        q: "¿Qué reviso antes de comprar piezas para un sobremesa?",
        a: "Que el socket del procesador coincida con la placa, que la memoria sea del tipo que admite, que la fuente tenga potencia y conectores suficientes y que todo quepa en la caja. Si hay una pieza que no tienes clara, mejor no comprarla todavía.",
        link: { label: "Ver la guía de compatibilidad", url: "/guias/compatibilidad-componentes-pc/" },
      },
      {
        id: "portatil-o-sobremesa",
        help: "montaje-compra",
        q: "¿Portátil o sobremesa?",
        a: "Depende del uso. El portátil, si necesitas moverte; el sobremesa suele dar más potencia por lo mismo y es más fácil de ampliar y de reparar. Si dudas entre dos opciones concretas, contrástalas con lo que vas a hacer a diario antes de decidir.",
      },
    ],
  },
  {
    id: "seguridad",
    label: "Seguridad",
    items: [
      {
        id: "antivirus",
        help: "seguridad",
        q: "¿Hace falta un antivirus de pago en casa?",
        a: "Para un uso doméstico, Microsoft Defender actualizado suele bastar si además mantienes el sistema al día y no instalas software de procedencia dudosa. Si crees que ya tienes un virus, no instales varios programas a la vez: desconecta el equipo de internet, no introduzcas contraseñas y consúltalo.",
      },
      {
        id: "correo-sospechoso",
        help: "seguridad",
        q: "¿Cómo reconozco un correo o una web sospechosos?",
        a: "Desconfía de la urgencia, de los remitentes raros, de los enlaces que no coinciden con la web real y de los adjuntos que no esperabas. Ante la duda, entra escribiendo tú la dirección. Si ya pulsaste o pusiste tus datos, cambia las contraseñas desde otro dispositivo y consúltalo cuanto antes.",
      },
      {
        id: "gestor-contrasenas",
        help: "seguridad",
        q: "¿Merece la pena usar un gestor de contraseñas?",
        a: "Sí: permite tener una contraseña larga y distinta en cada sitio sin memorizarlas. Conviene activar además la verificación en dos pasos, al menos en el correo y el banco. Y guarda con cuidado la clave maestra y los códigos de recuperación: si se pierden, no hay atajo.",
      },
    ],
  },
];

const inicio = [
  {
    id: "quien",
    q: "¿Quién eres y a qué te dedicas?",
    a: "Soy Víctor Rocamora, técnico de sistemas (ASIR y especialización en cloud sobre AWS) y estoy formándome en IA con un máster y estudio propio. Reparo y pongo a punto equipos, recupero datos y automatizo tareas sencillas; lo que aprendo de IA lo pruebo en proyectos propios, como Jarvis.",
    link: { label: "Conocer mi trayectoria", url: "/sobre-mi/" },
  },
  {
    id: "web",
    q: "¿Qué voy a encontrar en esta web?",
    a: "Lo que sé hacer con los equipos y por dónde suelo empezar, guías para comprar y mejorar un ordenador con criterio y mi laboratorio de IA, con la hoja de ruta de lo que estoy aprendiendo y el proyecto Jarvis.",
    link: { label: "Ver lo que sé hacer", url: "/lo-que-se-hacer/" },
  },
  {
    id: "contactar",
    q: "¿Cómo puedo contactar contigo?",
    a: `Con el cuestionario de contacto, que son cuatro pasos cortos, o escribiéndome directamente a ${site.email}. También estoy en LinkedIn.`,
    link: { label: "Abrir el cuestionario", url: "/contacto/?origen=faq-contactar" },
  },
  {
    id: "despues",
    q: "¿Qué pasa después de escribirte?",
    a: "Leo tu mensaje y te respondo por correo. Si puedo ayudarte, te cuento cómo lo haría; si no, intento orientarte hacia quien pueda.",
  },
];

const ia = [
  {
    id: "formacion",
    q: "¿Qué has estudiado de IA?",
    a: "Un máster en Inteligencia Artificial de BIG school con doble titulación, que incluye el Diploma de Experto Universitario en IA de la Universidad Isabel I, y estudio propio siguiendo la hoja de ruta de esta página. Vengo de ASIR y de una especialización en cloud sobre AWS.",
    link: { label: "Ver mi formación completa", url: "/sobre-mi/" },
  },
  {
    id: "hoja-ruta",
    q: "¿Qué es la hoja de ruta y por dónde vas?",
    a: `Es el orden en el que estoy aprendiendo AI Engineering por mi cuenta, en ${roadmap.phases.length} fases. Ahora estoy en la fase ${roadmap.progress.phase}, «${fase.title}»${roadmap.progress.percent ? ` (${roadmap.progress.percent} %)` : ""}. Las fases pueden cambiar de orden o de contenido a medida que avance.`,
  },
  {
    id: "demos",
    q: "¿Las demostraciones de la hoja de ruta son reales?",
    a: "Son simulaciones ligeras que se ejecutan en tu navegador para ver el concepto en acción, y están marcadas como tales. Lo real está en los proyectos que salen de cada fase, como Jarvis.",
  },
  {
    id: "jarvis",
    q: "¿Qué es Jarvis y qué hace?",
    a: "Un agente personal que funciona día y noche en un equipo dedicado: me escucha por Telegram, recuerda los proyectos y usa herramientas controladas. Lo importante es que cualquier acción externa me la propone y espera mi permiso antes de hacerla.",
    link: { label: "Conocer a Jarvis", url: "/proyectos/jarvis/" },
  },
];

const guias = [
  {
    id: "criterio",
    q: "¿Cómo elijo lo que recomiendo?",
    a: "Empiezo por el problema y no por el producto: uso real, compatibilidad, calidad-precio y vigencia. Si algo no compensa, lo digo, y a veces la mejor recomendación es no comprar.",
    link: { label: "Leer cómo lo hago", url: "/guias/transparencia/" },
  },
  {
    id: "afiliados",
    q: "¿Son de afiliado los enlaces de las guías?",
    a: "Algunos sí: los de las tarjetas de producto, que están marcadas como tales. Si compras a través de ellos recibo una pequeña comisión y tú pagas lo mismo. Esa comisión no cambia lo que recomiendo.",
    link: { label: "Ver la transparencia y afiliación", url: "/guias/transparencia/" },
  },
  {
    id: "actualizacion",
    q: "¿Se actualizan las guías?",
    a: "Cada guía indica la fecha de su última revisión. Compruebo fichas, variantes y disponibilidad antes de enlazar y no publico precios, porque cambian a diario. Si ves un dato desactualizado, avísame y lo corrijo.",
    link: { label: "Avisarme de un error", url: "/contacto/?servicio=otro&origen=faq-actualizacion" },
  },
];

const contacto = [
  {
    id: "enviar",
    q: "¿Qué ocurre cuando envío el formulario?",
    a: "El mensaje me llega por correo y verás una página de confirmación. No hace falta crear ninguna cuenta ni se publica nada. Tus datos se usan solo para responderte.",
    link: { label: "Leer la política de privacidad", url: "/privacidad/" },
  },
  {
    id: "respuesta",
    q: "¿Cuándo me respondes?",
    a: "Leo todos los mensajes y respondo en cuanto me es posible, pero no puedo prometer un plazo fijo. Si pasan unos días sin noticias, revisa la carpeta de spam y vuelve a escribirme por correo.",
  },
  {
    id: "datos",
    q: "¿Qué datos conviene incluir?",
    a: "Lo que ayude a entender tu caso: el equipo y su modelo si lo sabes, qué ocurre y desde cuándo, qué has probado y los mensajes de error. Si es otro tipo de consulta, basta con contar qué buscas. No incluyas contraseñas ni datos bancarios.",
  },
];

export default site.isCommercial ? null : { servicios, inicio, ia, guias, contacto };
