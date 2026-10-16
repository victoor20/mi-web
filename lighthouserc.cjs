// Lighthouse CI. Las URL dependen del modo de la web (site.mode): la página de servicios es
// /servicios/ en modo comercial y /lo-que-se-hacer/ en portfolio. Se detecta en _site, ya compilado.
const fs = require("node:fs");

const servicesUrl = ["/servicios/", "/lo-que-se-hacer/"].find((u) => fs.existsSync(`./_site${u}index.html`));
if (!servicesUrl) throw new Error("No encuentro la página de servicios en _site: ¿se ha ejecutado npm run build?");

const paths = [
  "/",
  servicesUrl,
  "/contacto/",
  "/ia/",
  "/proyectos/jarvis/",
  "/guias/",
  "/guias/acelerar-portatil-lento-ssd-ram/",
  "/sobre-mi/",
  "/casos/windows-no-arrancaba/",
  "/gracias/",
  "/contacto/enviado/",
  "/privacidad/",
];

module.exports = {
  ci: {
    collect: {
      staticDistDir: "./_site",
      url: paths.map((p) => `http://localhost${p}`),
      numberOfRuns: 3,
    },
    // /gracias/ y /contacto/enviado/ son noindex a propósito: Lighthouse les resta SEO por no poder indexarse,
    // así que a esas dos no se les exige la nota de SEO (todo lo demás, sí).
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: "^http://localhost/(?!gracias/|contacto/enviado/)",
          assertions: {
            "categories:accessibility": ["error", { minScore: 0.95 }],
            "categories:best-practices": ["error", { minScore: 0.95 }],
            "categories:seo": ["error", { minScore: 0.95 }],
            "categories:performance": ["warn", { minScore: 0.85 }],
            "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
          },
        },
        {
          matchingUrlPattern: "^http://localhost/(gracias|contacto/enviado)/",
          assertions: {
            "categories:accessibility": ["error", { minScore: 0.95 }],
            "categories:best-practices": ["error", { minScore: 0.95 }],
            "categories:performance": ["warn", { minScore: 0.85 }],
            "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
          },
        },
      ],
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci" },
  },
};
