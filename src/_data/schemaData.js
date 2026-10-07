// Datos estructurados (JSON-LD) generados desde site.js y services.js.
import site from "./site.js";
import services from "./services.js";

const isSet = (v) => typeof v === "string" && v.trim() !== "" && !/\[[^\]]+\]/.test(v);
const id = (frag) => `${site.url}/#${frag}`;

const person = {
  "@type": "Person",
  "@id": id("persona"),
  name: site.name,
  url: `${site.url}/sobre-mi/`,
  email: `mailto:${site.email}`,
  image: `${site.url}/assets/img/icon-512.png`,
  jobTitle: "Técnico de sistemas",
  sameAs: [site.linkedin],
  knowsAbout: ["Reparación de ordenadores", "Sistemas informáticos", "Cloud", "Automatización", "Inteligencia artificial"],
};

// Negocio de área de servicio: sin dirección postal, con municipios en areaServed
const business = {
  "@type": "ProfessionalService",
  "@id": id("servicio-tecnico"),
  name: `${site.name} · Servicio técnico informático`,
  url: `${site.url}/servicios/`,
  email: site.email,
  image: `${site.url}/assets/img/icon-512.png`,
  logo: `${site.url}/assets/img/icon-512.png`,
  description: "Reparación, puesta a punto y mejora de portátiles y ordenadores, informática para pequeños negocios y automatizaciones sencillas.",
  founder: { "@id": id("persona") },
  areaServed: site.area.towns.filter(isSet).map((name) => ({
    "@type": "City",
    name,
    containedInPlace: { "@type": "AdministrativeArea", name: "Provincia de Alicante" },
  })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, description: s.short, url: `${site.url}/servicios/#${s.slug}` },
    })),
  },
};

const website = {
  "@type": "WebSite",
  "@id": id("web"),
  url: `${site.url}/`,
  name: site.name,
  inLanguage: "es-ES",
  publisher: { "@id": id("persona") },
};

export default {
  home: { "@context": "https://schema.org", "@graph": [website, person, business] },
  services: { "@context": "https://schema.org", "@graph": [business, person] },
  person: { "@context": "https://schema.org", "@graph": [person] },
  ids: { person: id("persona"), website: id("web") },
};
