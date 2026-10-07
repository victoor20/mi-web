# victorrocamora.com

Web personal de Víctor Rocamora: servicio técnico informático en Elche, AI Engineering y guías tech.
Sitio estático generado con [Eleventy](https://www.11ty.dev/).

## Desarrollo

Requisitos: Node.js LTS.

```bash
npm install      # una vez
npm start        # servidor local con recarga en http://localhost:8080
npm run build    # genera la web publicable en _site/
npm run images   # regenera logos e iconos optimizados en src/assets/img/
```

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
scripts/images.mjs     Generación de AVIF/WebP/PNG e iconos
```

`src/assets/logo-vr-email.png` se publica en `/assets/logo-vr-email.png`, la ruta que usa la firma de correo. No moverlo.
