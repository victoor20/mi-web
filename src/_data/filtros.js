// «Cómo elijo lo que recomiendo» (/guias/): encajar piezas. Cada situación tiene una ilustración con su hueco y cuatro piezas
// candidatas; al arrastrarlas (o con «Probar esta pieza») cada una encaja, rebota o se va a otro sitio, con su motivo.
// Todo es ilustrativo: productos genéricos, sin marcas ni precios reales. Se muestra marcado como ejemplo.
//
// Geometría en unidades del SVG. Dos encuadres: ancho (680×400, piezas a la derecha) y estrecho (400×620, piezas debajo).
//   hole / slot: { x, y, w, h, label } → centro y tamaño del hueco (y de la ranura secundaria, si la hay)
//   piezas: rule "fit" (encaja), "bounce" (rebota) o "elsewhere" (va a la ranura secundaria y no resuelve el problema)
//           short: etiqueta en la ilustración; filter: posición (0-4) del filtro que no supera; shape: SVG centrado en (0, 0); ly: altura de su etiqueta
const homesWide = [[540, 56], [540, 150], [540, 244], [540, 338]];
const homesNarrow = [[100, 452], [300, 452], [100, 556], [300, 556]];
const frame = (inner) => `<rect class="h" x="-60" y="-36" width="120" height="72" rx="5"/><path class="fa" d="M-54 30 L54 -30 V30 Z"/>${inner}`;

const escenarios = [
  {
    id: "portatil-lento",
    label: "Mi portátil de 2018 va lento",
    contexto: "Supuesto: disco mecánico, bahía SATA de 2,5\" libre al cambiarlo y un procesador aceptable.",
    scene: `<rect class="s" x="60" y="22" width="280" height="172" rx="8"/>
      <rect class="a dim" x="74" y="36" width="252" height="144" rx="4"/>
      <path class="f" d="M74 180 L326 36 V180 Z"/>
      <path class="s" d="M30 200 H370 L392 334 H8 Z"/>
      <path class="a dim" d="M152 320 H248"/>`,
    hole: { x: 150, y: 262, w: 96, h: 56, label: "SATA 2,5\"" },
    slot: { x: 300, y: 262, w: 110, h: 28, label: "Memoria" },
    piezas: [
      { id: "ssd-nvme", short: "SSD NVMe", name: "SSD NVMe", rule: "bounce", filter: 1, reason: "El portátil solo admite SATA: el NVMe no encaja en esa bahía.",
        shape: `<rect class="h" x="-62" y="-10" width="124" height="20" rx="3"/><path class="a" d="M-50 -4 h22 v8 h-22z M-18 -4 h40 v8 h-40z M52 -10 v20"/>`, ly: 34 },
      { id: "ram", short: "Kit de memoria 32 GB", name: "Kit de memoria de 32 GB", rule: "elsewhere", filter: 0, reason: "Encaja, pero en la memoria: para navegar y ofimática no resuelve nada, el cuello de botella es el disco.",
        shape: `<rect class="h" x="-52" y="-12" width="104" height="10" rx="2"/><rect class="h" x="-52" y="2" width="104" height="10" rx="2"/><path class="a" d="M-40 -7 h12 M-20 -7 h12 M0 -7 h12 M20 -7 h12 M-40 7 h12 M-20 7 h12 M0 7 h12 M20 7 h12"/>`, ly: 34 },
      { id: "portatil-nuevo", short: "Portátil nuevo", name: "Portátil nuevo", rule: "bounce", filter: 2, reason: "No cabe, y tampoco hace falta: es pagar un equipo entero por lo que arregla una pieza.",
        shape: `<rect class="h" x="-56" y="-34" width="112" height="54" rx="5"/><path class="fa" d="M-50 16 L50 -28 V16 Z"/><path class="h" d="M-70 22 H70 L74 30 H-74 Z"/>`, ly: 48 },
      { id: "ssd-sata", short: "SSD SATA 500 GB", name: "SSD SATA de 500 GB", rule: "fit",
        shape: `<rect class="h" x="-48" y="-28" width="96" height="56" rx="5"/><path class="fa" d="M-48 28 L48 -28 V28 Z"/><text class="fit__in" y="5">SSD</text>`, ly: 46 },
    ],
    eleccion: "SSD SATA de 500 GB, con copia de seguridad antes de clonar el disco.",
  },
  {
    id: "se-calienta",
    label: "Mi portátil se calienta",
    contexto: "Supuesto: se calienta y el ventilador suena fuerte; el equipo, por lo demás, va bien.",
    scene: `<rect class="s" x="60" y="22" width="280" height="150" rx="8"/>
      <rect class="a dim" x="74" y="36" width="252" height="122" rx="4"/>
      <path class="f" d="M74 158 L326 36 V158 Z"/>
      <path class="s" d="M30 180 H370 L392 316 H8 Z"/>
      <path class="warn" d="M120 168 q-8 -12 0 -24 q8 -12 0 -24 M200 168 q-8 -12 0 -24 q8 -12 0 -24 M280 168 q-8 -12 0 -24 q8 -12 0 -24"/>
      <path class="a dim" d="M152 302 H248"/>`,
    hole: { x: 150, y: 248, w: 120, h: 62, label: "Ventilador y disipador" },
    slot: { x: 200, y: 366, w: 180, h: 22, label: "Debajo del portátil" },
    piezas: [
      { id: "limpieza", short: "Limpieza y pasta térmica", name: "Limpieza interna y pasta térmica", rule: "fit",
        shape: `<rect class="h" x="-50" y="-12" width="76" height="24" rx="6"/><path class="fa" d="M-50 12 L26 -12 V12 Z"/><path class="h" d="M26 -5 L48 0 L26 5"/><circle class="a" cx="58" cy="0" r="5"/>`, ly: 34 },
      { id: "base", short: "Base refrigeradora", name: "Base refrigeradora", rule: "elsewhere", filter: 0, reason: "Alivia la temperatura, pero no resuelve la causa: el polvo y la pasta seguirán donde están.",
        shape: `<rect class="h" x="-60" y="-12" width="120" height="24" rx="4"/><circle class="a" cx="-26" cy="0" r="8"/><circle class="a" cx="26" cy="0" r="8"/>`, ly: 34 },
      { id: "ventilador", short: "Ventilador nuevo", name: "Ventilador nuevo", rule: "bounce", filter: 2, reason: "Solo compensa si el actual está roto: antes hay que comprobar si gira bien o si solo está lleno de polvo.",
        shape: `<circle class="h" cx="0" cy="0" r="30"/><circle class="a" cx="0" cy="0" r="5"/><path class="a" d="M0 -5 C0 -22 12 -26 15 -19 C6 -18 3 -10 0 -5 Z M5 0 C22 0 26 12 19 15 C18 6 10 3 5 0 Z M0 5 C0 22 -12 26 -15 19 C-6 18 -3 10 0 5 Z M-5 0 C-22 0 -26 -12 -19 -15 C-18 -6 -10 -3 -5 0 Z"/>`, ly: 48 },
      { id: "portatil-nuevo", short: "Portátil nuevo", name: "Portátil nuevo", rule: "bounce", filter: 2, reason: "Es pagar un equipo entero por un problema de mantenimiento.",
        shape: `<rect class="h" x="-56" y="-34" width="112" height="54" rx="5"/><path class="fa" d="M-50 16 L50 -28 V16 Z"/><path class="h" d="M-70 22 H70 L74 30 H-74 Z"/>`, ly: 48 },
    ],
    eleccion: "Limpieza interna y pasta térmica nueva, que es lo que suele resolver el calor y el ruido.",
  },
  {
    id: "pc-estudiar",
    label: "Quiero montar un PC para estudiar",
    contexto: "Supuesto: ofimática, clases en línea y algo de programación, sobre una placa ya elegida.",
    scene: `<rect class="s" x="30" y="24" width="340" height="340" rx="10"/>
      <path class="f" d="M30 364 L370 24 V364 Z"/>
      <path class="a dim" d="M58 56 H118 M58 74 H100 M58 330 H342 M58 312 H180"/>
      <rect class="a dim" x="282" y="56" width="10" height="120" rx="2"/><rect class="a dim" x="300" y="56" width="10" height="120" rx="2"/>`,
    hole: { x: 160, y: 132, w: 72, h: 72, label: "Socket" },
    slot: { x: 196, y: 254, w: 236, h: 22, label: "PCIe" },
    piezas: [
      { id: "gpu", short: "Gráfica de gama alta", name: "Gráfica de gama alta", rule: "elsewhere", filter: 0, reason: "Encaja en la ranura PCIe, pero estudiar no la aprovecha: es potencia que no vas a usar.",
        shape: `<rect class="h" x="-66" y="-20" width="132" height="40" rx="4"/><circle class="a" cx="-30" cy="0" r="13"/><circle class="a" cx="22" cy="0" r="13"/>`, ly: 40 },
      { id: "cpu-otro", short: "Otro socket", name: "Procesador de otro socket", rule: "bounce", filter: 1, reason: "Su socket no es el de la placa: no hay forma de montarlo.",
        shape: `<rect class="h" x="-40" y="-40" width="80" height="80" rx="4"/><rect class="a" x="-24" y="-24" width="48" height="48" rx="2"/><path class="warn" d="M-40 -16 L-16 -40"/>`, ly: 56 },
      { id: "kit-viejo", short: "Kit descatalogado", name: "Kit de una generación descatalogada", rule: "bounce", filter: 3, reason: "Cuesta encontrar repuestos y la ficha ya no es fiable: no supera la vigencia.",
        shape: `<rect class="h" x="-54" y="-26" width="108" height="52" rx="5"/><path class="a dim" d="M-40 -10 h80 M-40 4 h56"/><circle class="warn" cx="40" cy="14" r="7"/>`, ly: 42 },
      { id: "cpu-igpu", short: "CPU con gráficos integrados", name: "Procesador con gráficos integrados", rule: "fit",
        shape: `<rect class="h" x="-36" y="-36" width="72" height="72" rx="4"/><rect class="a" x="-22" y="-22" width="44" height="44" rx="2"/><text class="fit__in" y="5">CPU</text>`, ly: 52 },
    ],
    eleccion: "Procesador con gráficos integrados, 16 GB de RAM y SSD: lo que hace falta, sin pagar de más.",
  },
  {
    id: "monitor-trabajo",
    label: "Necesito un monitor para trabajar",
    contexto: "Supuesto: ofimática durante horas, conectado a un portátil que solo tiene USB-C.",
    scene: `<path class="s" d="M10 300 H390"/>
      <path class="a dim" d="M44 300 V372 M356 300 V372"/>
      <path class="s" d="M282 296 H384 L376 286 H290 Z"/>
      <rect class="s" x="292" y="224" width="80" height="60" rx="4"/>
      <path class="f" d="M296 280 L368 228 V280 Z"/>
      <path class="a dim" d="M160 222 V296 M128 296 H192"/>`,
    hole: { x: 160, y: 182, w: 120, h: 72, label: "Monitor" },
    piezas: [
      { id: "solo-vga", short: "Sin entrada compatible", name: "Monitor sin entrada compatible", rule: "bounce", filter: 1, reason: "El portátil solo tiene USB-C: harían falta adaptadores. No encaja.",
        shape: frame(`<text class="fit__in" y="5">Solo VGA</text>`), ly: 52 },
      { id: "pro", short: "Para diseño profesional", name: "Monitor para diseño profesional", rule: "bounce", filter: 2, reason: "Pagarías una precisión de color que tu trabajo no pide.",
        shape: frame(`<text class="fit__in" y="5">Pro</text>`), ly: 52 },
      { id: "comision", short: "Modelo «patrocinado»", name: "Un modelo «patrocinado»", rule: "bounce", filter: 4, reason: "Si la única razón para recomendarlo es lo que me pagarían, no entra.",
        shape: frame(`<text class="fit__in" y="5">Patrocinado</text>`), ly: 52 },
      { id: "usb-c", short: "27\" con USB-C", name: "Monitor de 27\" con USB-C", rule: "fit",
        shape: frame(`<text class="fit__in" y="5">USB-C</text>`), ly: 52 },
    ],
    eleccion: "Monitor de 27\" nítido, con USB-C y soporte regulable en altura.",
  },
];

// Mezcla fija por situación: la pieza buena no siempre está en el mismo sitio
for (const e of escenarios) e.piezas.forEach((p, i) => { p.homeWide = homesWide[i]; p.homeNarrow = homesNarrow[i]; });

export default {
  filtros: [
    { id: "uso", short: "Uso", name: "Uso real", ask: "¿Resuelve lo que de verdad necesitas?" },
    { id: "compat", short: "Compat.", name: "Compatibilidad", ask: "¿Encaja con tu equipo: formato, conexiones, potencia, generación?" },
    { id: "precio", short: "Precio", name: "Calidad-precio", ask: "¿Compensa lo que cuesta frente a lo que mejora?" },
    { id: "vigencia", short: "Vigencia", name: "Vigencia", ask: "¿Ficha, variante y disponibilidad siguen siendo válidas hoy?" },
    { id: "transparencia", short: "Transp.", name: "Transparencia", ask: "¿Lo recomendaría igual sin comisión?" },
  ],
  escenarios,
};
