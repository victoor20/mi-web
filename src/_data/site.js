// Configuración central del sitio.
// Todo lo que aparece entre [CORCHETES] es un marcador pendiente de rellenar.
// Un valor con marcador se trata como "no configurado": la web lo oculta o lo desactiva.
// Modo de la web: es el único interruptor entre las dos versiones.
//   "portfolio": identidad personal, sin oferta comercial (por defecto)
//   "comercial": servicio técnico con presupuesto, zona de servicio y reseñas (etiqueta de Git: version-comercial)
// Para probar el otro modo sin tocar el archivo: SITE_MODE=comercial npm run build
const mode = process.env.SITE_MODE || "portfolio";
if (!["portfolio", "comercial"].includes(mode)) throw new Error(`site.mode debe ser "portfolio" o "comercial" (es "${mode}")`);
const comercial = mode === "comercial";

export default {
  mode,
  isCommercial: comercial,
  // URL de la página de servicios (en modo portfolio es "Lo que sé hacer")
  servicesUrl: comercial ? "/servicios/" : "/lo-que-se-hacer/",
  name: "Víctor Rocamora",
  url: "https://victorrocamora.com",
  lang: "es",
  locale: "es_ES",
  email: "victor@victorrocamora.com",
  linkedin: "https://www.linkedin.com/in/victorrocamora",

  // Datos del titular (aviso legal y privacidad)
  legal: {
    fullName: "[NOMBRE Y APELLIDOS]",
    nif: "[NIF]",
    address: "[DOMICILIO FISCAL]",
    activity: comercial
      ? "Servicios informáticos y consultoría tecnológica como trabajador autónomo"
      : "Web personal con contenido divulgativo y enlaces de afiliado",
  },

  // Zona de servicio (modo comercial): sin establecimiento ni dirección pública.
  // En modo portfolio solo se usan base y region, en "Sobre mí", como lugar de residencia
  area: {
    label: "Crevillent, Elche y comarca",
    base: "Crevillent",
    region: "Alicante",
    // Municipios que cubres (se usan en servicios y en el JSON-LD)
    towns: ["Crevillent", "Elche", "[OTROS MUNICIPIOS CERCANOS]"],
    // Por ejemplo: "A domicilio" y/o "Recogida y entrega del equipo"
    modes: "[MODALIDAD: a domicilio / recogida del equipo]",
    hours: "[HORARIO DE ATENCIÓN]",
  },

  // Afiliación: cambiar aquí el tracking ID afecta a todos los enlaces
  affiliate: {
    amazonTag: "prysmotec-21",
    amazonDomain: "www.amazon.es",
    // PcComponentes: poner a true cuando aprueben la solicitud para mostrar sus enlaces y avisos
    pccomponentesActive: false,
    pccomponentesVerification: "96f738f1a54d9d3634fe97949826043b",
  },

  // Formulario (Web3Forms) y anti-spam
  web3formsKey: "7498a9e6-3158-410a-bc7b-51cc78486fad",
  // Cloudflare Turnstile: requiere plan Pro de Web3Forms. Vacío = desactivado.
  turnstileSiteKey: "",

  // Analítica sin cookies
  // Copia websiteId y src de Umami: Settings > Websites > Edit > Tracking code
  umami: {
    websiteId: "[UMAMI_WEBSITE_ID]",
    src: "https://cloud.umami.is/script.js",
    // Región de datos de la cuenta, tal como aparece en la política de privacidad: "la Unión Europea" o "Estados Unidos"
    region: "[REGIÓN DE DATOS DE UMAMI]",
  },
  // Search Console se verifica por DNS (TXT en Nominalia). Esto es solo alternativa: el valor de content="..."
  // de la etiqueta HTML de verificación. Con marcador, no se inserta nada.
  googleSiteVerification: "[GOOGLE_SITE_VERIFICATION]",
  googleReviewsUrl: "[ENLACE_RESEÑAS_GOOGLE]",

  // Three.js servido desde el propio dominio. Se genera al compilar desde node_modules/three
  // (versión fijada en package.json); ver THREE_EXPORTS en eleventy.config.js.
  threeUrl: "/assets/vendor/three.min.js",

  // Imagen para redes sociales (1200x630, generada con npm run images)
  ogImage: comercial
    ? { url: "/assets/img/og-default.png", width: 1200, height: 630, alt: "Víctor Rocamora · Servicio técnico informático y laboratorio de IA" }
    : { url: "/assets/img/og-portfolio.png", width: 1200, height: 630, alt: "Víctor Rocamora · Técnico de sistemas, guías tech y laboratorio de IA" },

  nav: [
    comercial ? { label: "Servicios", url: "/servicios/" } : { label: "Lo que sé hacer", url: "/lo-que-se-hacer/" },
    { label: "Laboratorio IA", url: "/ia/" },
    { label: "Guías", url: "/guias/" },
    { label: "Sobre mí", url: "/sobre-mi/" },
  ],
  cta: { label: comercial ? "Pedir presupuesto" : "Contactar", url: "/contacto/" },

  // Idiomas. show: false oculta el selector de la cabecera y del menú móvil.
  // Cada idioma con available: false se muestra como «Próximamente» (sin enlace) y aún no genera hreflang.
  // Cuando exista una traducción: available: true y url con el prefijo de sus páginas (p. ej. "/en"); el hreflang sale solo.
  languages: {
    show: true,
    items: [
      { code: "es", label: "ES", name: "Español", hreflang: "es-ES", available: true, url: "" },
      { code: "va", label: "VA", name: "Valencià", hreflang: "ca-ES-valencia", available: false, url: "/va" },
      { code: "en", label: "EN", name: "English", hreflang: "en", available: false, url: "/en" },
    ],
  },
};
