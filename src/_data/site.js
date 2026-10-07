// Configuración central del sitio.
// Todo lo que aparece entre [CORCHETES] es un marcador pendiente de rellenar.
export default {
  name: "Víctor Rocamora",
  url: "https://victorrocamora.com",
  lang: "es",
  locale: "es_ES",
  email: "victor@victorrocamora.com",
  linkedin: "https://www.linkedin.com/in/victorrocamora",

  // Zona de servicio (negocio sin establecimiento ni dirección pública)
  area: {
    label: "Elche y alrededores",
    region: "Alicante",
    // Municipios exactos que cubres, por ejemplo ["Elche", "Santa Pola", "Crevillent"]
    towns: ["[MUNICIPIOS]"],
    // "A domicilio", "Recogida y entrega del equipo"...
    modes: ["[MODALIDAD: a domicilio / recogida del equipo]"],
    hours: "[HORARIO]",
  },

  // Afiliación: cambiar aquí el tracking ID afecta a todos los enlaces
  affiliate: {
    amazonTag: "prysmotec-21",
    amazonDomain: "www.amazon.es",
    // Meta de verificación de PcComponentes (se mantiene para volver a solicitarlo)
    pccomponentesVerification: "96f738f1a54d9d3634fe97949826043b",
  },

  // Servicios externos (se integran en fases posteriores)
  web3formsKey: "[WEB3FORMS_ACCESS_KEY]",
  umami: {
    websiteId: "[UMAMI_WEBSITE_ID]",
    src: "https://cloud.umami.is/script.js",
  },
  googleSiteVerification: "[GOOGLE_SITE_VERIFICATION]",
  googleReviewsUrl: "[ENLACE_RESEÑAS_GOOGLE]",

  // Three.js desde CDN, versión fijada para que no cambie sin control
  threeUrl: "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.min.js",

  nav: [
    { label: "Servicios", url: "/servicios/" },
    { label: "IA", url: "/ia/" },
    { label: "Guías", url: "/guias/" },
    { label: "Sobre mí", url: "/sobre-mi/" },
  ],
  cta: { label: "Pedir presupuesto", url: "/contacto/" },
};
