import { readFileSync } from "node:fs";

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
    new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date))
  );

  eleventyConfig.addWatchTarget("src/assets/css/");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
