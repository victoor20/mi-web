// Valores calculados de cada página de caso (se generan desde src/_data/casos.js).
import schemaData from "../_data/schemaData.js";
import site from "../_data/site.js";

export default {
  eleventyComputed: {
    title: (data) => `${data.caso.title} · Caso real · ${site.name}`,
    description: (data) => data.caso.description,
    updated: (data) => data.caso.updated,
    jsonld: (data) => {
      const url = `${site.url}${data.page.url}`;
      return {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: data.caso.title,
            description: data.caso.description,
            datePublished: data.caso.published,
            dateModified: data.caso.updated,
            inLanguage: "es-ES",
            mainEntityOfPage: url,
            author: { "@type": "Person", "@id": schemaData.ids.person, name: site.name, url: `${site.url}/sobre-mi/` },
            publisher: { "@type": "Person", "@id": schemaData.ids.person, name: site.name },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${site.url}/` },
              { "@type": "ListItem", position: 2, name: site.isCommercial ? "Servicios" : "Lo que sé hacer", item: `${site.url}${site.servicesUrl}` },
              { "@type": "ListItem", position: 3, name: data.caso.short, item: url },
            ],
          },
        ],
      };
    },
  },
};
