// Preguntas frecuentes de /lo-que-se-hacer/ (modo portfolio), agrupadas por tema. Texto plano: también alimenta el JSON-LD FAQPage.
// En modo comercial la página mantiene sus preguntas propias.
import site from "./site.js";

const groups = [
  {
    id: "diagnostico",
    label: "Diagnóstico",
    items: [
      {
        q: "¿Por dónde empiezas ante un fallo?",
        a: "Por lo más sencillo y probable. Voy descartando causas una a una y solo cambio una pieza cuando sé cuál es la culpable.",
      },
      {
        q: "Mi portátil no enciende, ¿qué puedo probar antes de abrirlo?",
        a: "Comprueba que el cargador funciona en otra toma y que el piloto de carga se enciende. Desconecta todo lo externo (USB, monitor), quita el cargador y mantén pulsado el botón de encendido unos 15 segundos; luego vuelve a conectarlo. Si sigue igual, mejor no abrirlo a la fuerza.",
      },
      {
        q: "¿Cada cuánto conviene limpiar un portátil por dentro?",
        a: "Como orientación, una vez al año si lo usas a diario; antes si hay mucho polvo, mascotas o lo apoyas en superficies blandas. Si se calienta más de lo normal o el ventilador suena más fuerte, es la señal de que ya toca.",
      },
    ],
  },
  {
    id: "formateo",
    label: "Formateo",
    items: [
      {
        q: "¿Pierdo mis archivos si formateo?",
        a: "No, si hay forma de conservarlos. Antes de borrar nada se hace copia de lo importante y se comprueba que se abre bien.",
      },
      {
        q: "¿Cuándo merece la pena reinstalar Windows?",
        a: "Cuando el sistema arrastra años de programas, errores repetidos o restos de un virus y limpiar por encima ya no basta. Si el fallo viene de una pieza, reinstalar no lo arregla.",
      },
      {
        q: "¿Qué conviene tener a mano antes de reinstalar?",
        a: "Las cuentas y licencias que uses, una lista de los programas que necesitas y los controladores del equipo (o conexión a internet para descargarlos). Con eso, volver a dejarlo todo en su sitio es mucho más fácil.",
      },
    ],
  },
  {
    id: "segunda-vida",
    label: "Segunda vida",
    items: [
      {
        q: "¿Merece la pena arreglar un portátil antiguo?",
        a: "A menudo sí: un SSD y más memoria cambian por completo un equipo de varios años. Aun así, depende del procesador y de lo que se le pida.",
      },
      {
        q: "¿Cómo sé si mi portátil admite más memoria?",
        a: "Busca el modelo exacto (en la etiqueta o en la información del sistema) y consulta en la web del fabricante el tipo de memoria, la capacidad máxima y cuántas ranuras tiene. En algunos portátiles va soldada y no se puede ampliar.",
      },
      {
        q: "¿Se nota de verdad cambiar a un SSD?",
        a: "Sí, sobre todo si el equipo tiene un disco mecánico: el arranque, la apertura de programas y la respuesta general mejoran mucho. Con un procesador muy antiguo la mejora tiene su techo.",
      },
    ],
  },
  {
    id: "discos-datos",
    label: "Discos y datos",
    items: [
      {
        q: "¿Se pueden recuperar los datos de un disco estropeado?",
        a: "Muchas veces sí, cuando el problema es lógico (borrados, particiones dañadas, un sistema que no arranca). Si el disco tiene daño físico grave, lo prudente es acudir a un laboratorio especializado antes que arriesgar los datos.",
      },
      {
        q: "He borrado un archivo sin querer, ¿qué hago?",
        a: "Usa lo menos posible ese disco: lo que se escriba después puede sobrescribir lo borrado. Mira primero la papelera, las versiones anteriores y la nube; si no está, se puede probar un programa de recuperación instalado en otro disco.",
      },
      {
        q: "¿Qué copia de seguridad es suficiente para casa?",
        a: "Una regla sencilla es la 3-2-1: tres copias de lo importante, en dos soportes distintos y una fuera de casa. Por ejemplo, el equipo, un disco externo y una copia en la nube. Y de vez en cuando, comprobar que se puede restaurar.",
      },
    ],
  },
  {
    id: "montaje",
    label: "Montaje",
    items: [
      {
        q: "¿Qué reviso antes de comprar piezas para un sobremesa?",
        a: "Que el socket del procesador coincida con la placa, que la memoria sea del tipo que admite, que la fuente tenga potencia y conectores suficientes y que todo quepa en la caja. Mi guía de compatibilidad recoge el checklist completo.",
      },
      {
        q: "¿Portátil o sobremesa?",
        a: "Depende del uso. El portátil, si necesitas moverte; el sobremesa suele dar más potencia por lo mismo y es más fácil de ampliar y de reparar.",
      },
    ],
  },
  {
    id: "seguridad",
    label: "Seguridad",
    items: [
      {
        q: "¿Hace falta un antivirus de pago en casa?",
        a: "Para un uso doméstico, Microsoft Defender actualizado suele bastar si además mantienes el sistema al día y no instalas software de procedencia dudosa. Importan más los hábitos que la marca.",
      },
      {
        q: "¿Cómo reconozco un correo o una web sospechosos?",
        a: "Desconfía de la urgencia, de los remitentes raros, de los enlaces que no coinciden con la web real y de los adjuntos que no esperabas. Ante la duda, entra escribiendo tú la dirección en vez de pulsar el enlace.",
      },
      {
        q: "¿Merece la pena usar un gestor de contraseñas?",
        a: "Sí: permite tener una contraseña larga y distinta en cada sitio sin tener que memorizarlas. Y conviene activar la verificación en dos pasos, al menos en el correo y el banco.",
      },
    ],
  },
];

export default site.isCommercial ? null : groups;
