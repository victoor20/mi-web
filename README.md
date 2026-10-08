# victorrocamora.com

Web personal de Víctor Rocamora: servicio técnico informático en Elche, AI Engineering y guías tech.
Sitio estático generado con [Eleventy](https://www.11ty.dev/).

## Desarrollo

Requisitos: Node.js LTS.

```bash
npm install      # una vez
npm start        # servidor local con recarga en http://localhost:8080
npm run build    # genera la web publicable en _site/
npm run images   # regenera logos, iconos e imagen social (og-default.png) en src/assets/img/
```

## Publicación

- `.github/workflows/deploy.yml` compila y publica en GitHub Pages en cada push a `main`
  (Settings > Pages > Source debe ser **GitHub Actions**).
- `.github/workflows/lighthouse.yml` pasa Lighthouse a las páginas principales en la rama `rediseno`
  y en los pull requests a `main`. Los informes se descargan desde el run (Artifacts > lighthouse).
- `sitemap.xml` y `robots.txt` se generan solos. Las páginas con `noindex: true` quedan fuera del sitemap.

## Configuración pendiente

Todo vive en `src/_data/site.js`. Mientras un valor tenga `[CORCHETES]`, la web lo trata como no configurado:
Umami y la verificación de Search Console no se insertan, y los textos legales lo marcan en amarillo.

## Productos de las guías

En `src/_data/products.js`, pega en `amazonUrl` la URL de la ficha de amazon.es tal cual (o solo el ASIN).
La web extrae el ASIN y genera `https://www.amazon.es/dp/ASIN?tag=prysmotec-21`. Sin `amazonUrl`,
el enlace lleva a una búsqueda. Los enlaces cortos (amzn.to, amzn.eu) se rechazan al compilar.

## Three.js

Se sirve desde el propio dominio (`/assets/vendor/three.min.js`), empaquetado con esbuild al compilar a partir
de `node_modules/three` (versión fijada en `package.json`). Solo incluye las clases de `THREE_EXPORTS`
en `eleventy.config.js`: si `hero3d.js` usa una nueva, hay que añadirla allí.

## Estructura

```
src/
  _data/site.js        Configuración central: email, zona, afiliados, claves (marcadores [ASÍ])
  _includes/layouts/   Plantillas de página
  _includes/partials/  Cabecera, pie, CTA móvil
  assets/css/          critical.css (inline en <head>) y site.css (resto)
  assets/js/           main.js (común) y hero3d.js (logo 3D, carga diferida)
  assets/img/          Imágenes optimizadas (generadas con npm run images)
  index.njk            Home
  sitemap.njk, robots.njk
scripts/images.mjs     Generación de AVIF/WebP/PNG, iconos e imagen social
```

`src/assets/logo-vr-email.png` se publica en `/assets/logo-vr-email.png`, la ruta que usa la firma de correo. No moverlo.
