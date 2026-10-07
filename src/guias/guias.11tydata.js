// Valores por defecto para todo lo que hay en src/guias/: cada .md es una guía.
import schemaData from "../_data/schemaData.js";
import site from "../_data/site.js";

export default {
  layout: "layouts/article.njk",
  tags: ["guia"],
  pccVerification: true,
  permalink: (data) => `/guias/${data.page.fileSlug}/`,
  eleventyComputed: {
    jsonld: (data) =>
      data.page.inputPath.endsWith(".md")
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: data.h1 || data.title,
            description: data.description,
            datePublished: new Date(data.published || data.updated).toISOString().slice(0, 10),
            dateModified: new Date(data.updated).toISOString().slice(0, 10),
            inLanguage: "es-ES",
            mainEntityOfPage: `${site.url}${data.page.url}`,
            author: { "@type": "Person", "@id": schemaData.ids.person, name: site.name, url: `${site.url}/sobre-mi/` },
            publisher: { "@type": "Person", "@id": schemaData.ids.person, name: site.name },
          }
        : undefined,
  },
};
