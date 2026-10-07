import { readFileSync } from "node:fs";
import site from "./src/_data/site.js";

// Un valor está "configurado" si existe y no contiene un marcador [ASÍ]
const isSet = (value) => typeof value === "string" ? value.trim() !== "" && !/\[[^\]]+\]/.test(value) : Boolean(value);

export default function (eleventyConfig) {
  // Recursos estáticos tal cual (logos, imágenes optimizadas, JS, CSS no crítico)
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ CNAME: "CNAME" });

  // Fuentes de Google Fonts servidas desde el propio dominio (rendimiento y RGPD)
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2": "assets/fonts/archivo-latin-wght-normal.woff2",
    "node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2": "assets/fonts/jetbrains-mono-latin-400-normal.woff2",
  });

  // El CSS crítico se inyecta inline en <head>; el resto se carga sin bloquear
  eleventyConfig.addFilter("inlineFile", (path) => readFileSync(path, "utf8"));
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).href);
  eleventyConfig.addFilter("dateIso", (date) => new Date(date).toISOString().slice(0, 10));
  eleventyConfig.addFilter("dateEs", (date) =>
    new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(new Date(date))
  );
  eleventyConfig.addFilter("isSet", isSet);
  // Muestra el valor o, si es un marcador, lo resalta para que se vea que falta
  eleventyConfig.addFilter("ph", (value) =>
    isSet(value) ? value : `<span class="placeholder">${value}</span>`
  );
  eleventyConfig.addFilter("setOnly", (list) => (list || []).filter(isSet));
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));

  // Enlaces de afiliado: el tracking ID solo vive en site.js
  eleventyConfig.addFilter("amazonUrl", (product) => {
    const base = `https://${site.affiliate.amazonDomain}`;
    const url = product.asin
      ? new URL(`/dp/${product.asin}`, base)
      : new URL(`/s?k=${encodeURIComponent(product.amazonSearch || product.name)}`, base);
    url.searchParams.set("tag", site.affiliate.amazonTag);
    return url.href;
  });

  // Guías: colección ordenada por fecha de actualización
  eleventyConfig.addCollection("guias", (api) =>
    api.getFilteredByTag("guia").sort((a, b) => new Date(b.data.updated || b.date) - new Date(a.data.updated || a.date))
  );

  // Tabla de contenidos: añade id a los h2 de los artículos
  eleventyConfig.addTransform("headingIds", (content, outputPath) => {
    if (!outputPath?.endsWith(".html") || !content.includes("data-article-body")) return content;
    const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return content.replace(/<h2>(.*?)<\/h2>/g, (_, text) => `<h2 id="${slug(text)}">${text}</h2>`);
  });

  eleventyConfig.addWatchTarget("src/assets/css/");

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
