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

// Modo portfolio: formación y reconocimientos
if (!site.isCommercial) {
  person.alumniOf = ["IES Severo Ochoa (Elche)", "IES Poeta Paco Mollá (Petrer)", "BIG school", "Universidad Isabel I"].map((name) => ({ "@type": "EducationalOrganization", name }));
  person.award = "2.º puesto en la Final Nacional AWS JAM 2026 (Barcelona, 19 de junio de 2026), con el equipo S3-less";
}

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

// Modo portfolio: solo Person (sin ProfessionalService ni areaServed)
export default {
  home: { "@context": "https://schema.org", "@graph": site.isCommercial ? [website, person, business] : [website, person] },
  services: { "@context": "https://schema.org", "@graph": site.isCommercial ? [business, person] : [person] },
  person: { "@context": "https://schema.org", "@graph": [person] },
  ids: { person: id("persona"), website: id("web") },
};
