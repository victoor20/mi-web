// Recorrido por el Jarvis Control Center (/proyectos/jarvis/). Zonas en % sobre la captura general (1229×860).
// Las capturas salen de material/jarvis/ (scripts/jarvis-images.mjs) y solo se publican las revisadas, sin rutas,
// usuarios, IP, puertos, nombres de equipo, cuentas ni horarios de copia. Las habitaciones sin captura publicable
// lo explican en su texto.
// review: true = texto redactado a partir de la captura, pendiente de que Víctor lo revise.
export default {
  rooms: [
    { id: "sala-central", name: "Sala central", spot: [27.3, 50.8, 44.6, 25.7], img: { name: "jarvis-sala-central", ws: [480, 748], w: 748, h: 729 }, review: true,
      text: "La mesa principal resume el estado de toda la base. En esta parte, el consumo del modelo: tokens del día, de la semana y del mes, y un coste estimado que no equivale a la factura real." },
    { id: "terminal", name: "Cuarto terminal", spot: [4.9, 28.5, 21.3, 20.9], img: { name: "jarvis-terminal", ws: [480, 749], w: 749, h: 462 }, review: true,
      text: "Qué modelo usa Jarvis en cada momento y de dónde salen los datos de consumo. Solo se muestran agregados, sin el contenido de las conversaciones." },
    { id: "biblioteca", name: "Biblioteca de skills", spot: [27.5, 28.5, 21.3, 20.9], img: { name: "jarvis-biblioteca", ws: [480, 761], w: 761, h: 726 }, review: true,
      text: "Las herramientas que Jarvis tiene a mano, con su origen, su nivel de riesgo y si necesitan mi confirmación antes de actuar. Se pueden filtrar por grupo, riesgo o efectos externos." },
    { id: "seguridad", name: "Cuarto de seguridad", spot: [50.1, 28.5, 21.5, 20.9], review: true,
      text: "Autenticación, permisos y servicios. Es justo lo que no se publica, así que esta habitación se queda sin captura." },
    { id: "tablon", name: "Tablón de avisos", spot: [72.8, 28.5, 21.6, 20.9], img: { name: "jarvis-tablon", ws: [480, 745], w: 745, h: 529 }, review: true,
      text: "Avisos y diagnóstico en modo seguro. Las acciones futuras aparecen bloqueadas: se ven, pero todavía no se pueden ejecutar desde el panel." },
    { id: "comunicaciones", name: "Comunicaciones", spot: [4.9, 51.2, 21.3, 25], review: true,
      text: "Los canales por los que hablo con Jarvis: Telegram, voz a texto y texto a voz. Su captura muestra detalles de acceso, así que no se publica." },
    { id: "servidor", name: "Servidor / NAS", spot: [72.8, 51.2, 21.6, 25], review: true,
      text: "Las copias de seguridad cifradas y sus comprobaciones. Los horarios de copia no se publican, así que esta habitación se queda sin captura." },
  ],
};
