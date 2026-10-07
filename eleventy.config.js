import { readFileSync } from "node:fs";
import site from "./src/_data/site.js";

import products from "./src/_data/products.js";

// Un valor está "configurado" si existe y no contiene un marcador [ASÍ]
const isSet = (value) => typeof value === "string" ? value.trim() !== "" && !/\[[^\]]+\]/.test(value) : Boolean(value);

// Enlaces de afiliado: el tracking ID solo vive en site.js
const amazonUrl = (product) => {
  const base = `https://${site.affiliate.amazonDomain}`;
  const url = isSet(product.asin)
    ? new URL(`/dp/${product.asin}`, base)
    : new URL(`/s?k=${encodeURIComponent(product.amazonSearch || product.name)}`, base);
  url.searchParams.set("tag", site.affiliate.amazonTag);
  return url.href;
};

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

  eleventyConfig.addFilter("amazonUrl", amazonUrl);

  // Tarjeta de producto: {% product "id" %} dentro de una guía. Una única plantilla para toda la web.
  eleventyConfig.addShortcode("product", (id) => {
    const p = products[id];
    if (!p) throw new Error(`Producto desconocido en una guía: ${id}`);
    const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    const amazon = amazonUrl(p);
    const pcc = site.affiliate.pccomponentesActive && isSet(p.pccUrl)
      ? `<a class="btn btn--ghost btn--sm" href="${esc(p.pccUrl)}" rel="sponsored nofollow noopener" target="_blank" data-umami-event="afiliado-pccomponentes" data-umami-event-producto="${esc(id)}">Ver en PcComponentes ↗</a>`
      : "";
    return `<article class="product" data-reveal>
  <div class="product__glyph" aria-hidden="true"><span>${esc(p.glyph)}</span></div>
  <div class="product__body">
    <p class="product__cat mono">${esc(p.category)}</p>
    <h3 class="product__name">${esc(p.name)}</h3>
    <p class="product__why">${esc(p.why)}</p>
    <ul class="product__specs">${(p.specs || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    <div class="product__links">
      <a class="btn btn--ghost btn--sm" href="${esc(amazon)}" rel="sponsored nofollow noopener" target="_blank" data-umami-event="afiliado-amazon" data-umami-event-producto="${esc(id)}">Ver en Amazon ↗</a>${pcc}
    </div>
    <p class="product__note">Enlace de afiliado. Precio y disponibilidad, en la tienda.</p>
  </div>
</article>`;
  });

  eleventyConfig.addFilter("readingTime", (html) => {
    const words = String(html).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
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
