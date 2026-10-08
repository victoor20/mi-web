// Configuración central del sitio.
// Todo lo que aparece entre [CORCHETES] es un marcador pendiente de rellenar.
// Un valor con marcador se trata como "no configurado": la web lo oculta o lo desactiva.
export default {
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
    activity: "Servicios informáticos y consultoría tecnológica como trabajador autónomo",
  },

  // Zona de servicio: sin establecimiento ni dirección pública
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
  web3formsKey: "[WEB3FORMS_ACCESS_KEY]",
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
  // Search Console: solo el valor de content="..." de la etiqueta HTML de verificación
  googleSiteVerification: "[GOOGLE_SITE_VERIFICATION]",
  googleReviewsUrl: "[ENLACE_RESEÑAS_GOOGLE]",

  // Three.js servido desde el propio dominio. Se genera al compilar desde node_modules/three
  // (versión fijada en package.json); ver THREE_EXPORTS en eleventy.config.js.
  threeUrl: "/assets/vendor/three.min.js",

  // Imagen para redes sociales (1200x630, generada con npm run images)
  ogImage: { url: "/assets/img/og-default.png", width: 1200, height: 630, alt: "Víctor Rocamora · Servicio técnico informático y laboratorio de IA" },

  nav: [
    { label: "Servicios", url: "/servicios/" },
    { label: "Laboratorio IA", url: "/ia/" },
    { label: "Guías", url: "/guias/" },
    { label: "Sobre mí", url: "/sobre-mi/" },
  ],
  cta: { label: "Pedir presupuesto", url: "/contacto/" },
};
