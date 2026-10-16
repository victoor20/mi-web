# victorrocamora.com

Web personal de Víctor Rocamora (Eleventy 3 + Nunjucks). Se trabaja en la rama `rediseno`; no se fusiona con `main` sin pedirlo.

## Principio de diseño (seguirlo siempre)

- **El contenido avanza cuando el usuario actúa**: arrastrar, pulsar, elegir. Nada de secuencias o scrollytelling que avancen solos.
- **Lo automático queda solo para el ambiente**: destellos, estrellas, flotación del logo, el cometa del retrato.
- **Cada página tiene su propia mecánica interactiva**, relacionada con su contenido, sin repetir la misma en todas
  (p. ej. encajar piezas en /guias/, el taller paso a paso en la guía modelo, el buscador por síntoma en /lo-que-se-hacer/,
  el minijuego del logo en la 404). Antes de añadir una, comprobar que no duplica la de otra página.
- **El texto importante siempre es legible sin interactuar** (SEO y accesibilidad): la interacción ilustra, no esconde el contenido.
- **Respetar siempre**: `prefers-reduced-motion` (sin animación, estado final estático), teclado (alternativa con botones a todo
  lo que se arrastra), táctil (pointer events; en SVG, `touchstart` no pasivo para que no desplace la página) y rendimiento
  (sin librerías, bucles solo con la sección en pantalla, sin CLS: reservar el espacio y estilos críticos en `criticalSections`).

## Flujo de trabajo

- Comprobar escritorio y móvil antes de subir.
- Después de cada push, verificar el run de Lighthouse en GitHub **por el `head_sha` del commit** (no por número de run)
  antes de dar el resumen.
- Modo de la web: `site.mode` en `src/_data/site.js` ("portfolio" por defecto, "comercial" con `SITE_MODE=comercial`).
