---
title: "Checklist de compatibilidad de componentes de PC · Guías"
h1: "Checklist antes de comprar componentes para tu PC: compatibilidad sin sustos"
description: "Qué revisar antes de comprar CPU, placa base, RAM, SSD, gráfica, fuente, caja y refrigeración para que todas las piezas encajen."
category: "Componentes"
need: "montar"
published: 2026-08-01
updated: 2026-08-01
service: "montaje-compra"
affiliate: true
summary: "antes de pagar, confirma placa y CPU, generación de RAM, tipo de SSD, conectores de la fuente, espacio para la gráfica, formato de caja y compatibilidad de la refrigeración. Si una pieza obliga a cambiar otra sin querer, no era una compra aislada."
---
Comprar componentes parece sencillo hasta que llegan las dudas: si el procesador encaja en la placa, si la memoria es DDR4 o DDR5, si el SSD es M.2 NVMe o SATA, si la fuente tiene conectores suficientes o si la gráfica cabe en la caja. Muchas compras fallan por eso: no porque la pieza sea mala, sino porque no encaja con el resto.

Esta guía no afirma compatibilidades concretas entre modelos. Sirve para repasar los puntos que más fallan y comprar con criterio en lugar de improvisar.

## Por qué comprobar la compatibilidad antes de comprar

La compatibilidad no depende de una sola especificación. Un procesador puede parecer perfecto y necesitar una placa con un socket concreto, un chipset compatible y, a veces, una versión de BIOS determinada. Una memoria puede ser rápida y no servir porque es de otra generación. Un SSD puede ser M.2 y no ser NVMe, o no alcanzar su velocidad máxima en esa ranura.

Revisarlo antes evita devoluciones, montajes frustrados y gastos extra en adaptadores, fuentes o cajas que no estaban previstos. También ayuda a no pagar por funciones que tu equipo no va a aprovechar.

## Placa base y procesador: socket y chipset

La primera comprobación es la pareja placa y procesador. Deben coincidir el socket físico y el soporte real de la placa para esa familia de CPU. En Intel y AMD no basta con que el procesador parezca de la misma generación: consulta la lista oficial de procesadores compatibles del fabricante de la placa.

El chipset también cuenta. Define la conectividad, las líneas PCIe, el soporte de memoria, las opciones de overclock y el número de puertos. Dentro de una misma plataforma hay chipsets con prestaciones muy distintas, así que revisa el de la placa concreta.

- Comprueba el socket de CPU y placa.
- Revisa la lista oficial de CPU soportadas.
- Mira si hace falta actualizar la BIOS.
- Confirma que el chipset tiene las funciones que necesitas.

## Memoria: DDR4 o DDR5, capacidad, frecuencia y ranuras

La RAM tiene cuatro puntos clave: generación, formato, capacidad y configuración. DDR4 y DDR5 no son intercambiables: la placa admite una u otra. En sobremesa se usan módulos DIMM; muchos portátiles llevan SO-DIMM o memoria soldada, aunque aquí hablamos de torres.

Conviene revisar cuántas ranuras tiene la placa, la capacidad máxima y las combinaciones que recomienda el fabricante. La frecuencia anunciada de un kit no garantiza que funcione a esa velocidad en cualquier placa: depende del controlador de memoria, de la BIOS y de los perfiles.

Como regla práctica: elige la generación que pide la placa, revisa capacidad máxima y ranuras libres, prioriza kits completos frente a mezclar módulos sueltos y consulta la lista de memorias compatibles (QVL) si el montaje es exigente.

Algunos kits de referencia, siempre que coincidan con lo que admite tu placa:

{% product "corsair-vengeance-ddr5-32-6000" %}
{% product "crucial-pro-ddr5-32-5600" %}
{% product "kingston-fury-beast-ddr4-32-3200" %}

## Almacenamiento: SATA, M.2, NVMe y PCIe

Aquí suele haber mucha confusión. SATA es una interfaz más antigua, habitual en los SSD de 2,5 pulgadas. M.2 es un formato físico, no una garantía de velocidad: hay unidades M.2 SATA y unidades M.2 NVMe. NVMe usa PCIe y suele rendir más, pero necesita una ranura compatible.

Las generaciones PCIe marcan la velocidad máxima teórica. Están pensadas para ser compatibles entre sí, pero en almacenamiento M.2 no conviene darlo por hecho en cualquier combinación. Revisa las ranuras disponibles, las longitudes admitidas, la generación de cada una y si alguna comparte líneas con otros puertos.

- Confirma si necesitas 2,5" SATA, M.2 SATA o M.2 NVMe.
- Revisa la longitud del módulo M.2 (por ejemplo, 2280).
- Comprueba la generación PCIe de la ranura.
- Mira si usar cierta ranura desactiva algún puerto SATA.

## Gráfica, fuente y caja: potencia, conectores y espacio

La tarjeta gráfica no solo tiene que encajar en la ranura PCIe. También debe caber en la caja y recibir la alimentación adecuada. Revisa la longitud, el grosor en slots, el espacio respecto a ventiladores o radiadores y los conectores que pide.

La fuente necesita potencia suficiente, conectores adecuados, calidad razonable y margen para el conjunto. Algunas gráficas usan conectores PCIe de 6 u 8 pines y otras el de 16 pines. No lo resuelvas con adaptadores improvisados si el fabricante pide cables dedicados.

- Potencia recomendada por el fabricante de la gráfica.
- Conectores necesarios y cables disponibles en la fuente.
- Longitud y grosor reales de la GPU.
- Espacio máximo para gráfica que admite la caja.
- Flujo de aire y margen para ampliaciones futuras.

## Refrigeración: socket, altura, radiador y espacio

La refrigeración también tiene compatibilidad. En disipadores por aire hay que revisar el soporte del socket, la altura máxima que admite la caja y el posible choque con módulos de memoria altos. En refrigeración líquida, además, el tamaño del radiador, las posiciones compatibles de la caja y el espacio con la placa y los ventiladores. Fíate de las medidas oficiales, no de una foto.

## Errores habituales

- Comprar CPU y placa con distinto socket.
- No comprobar si la BIOS admite el procesador elegido.
- Tratar DDR4 y DDR5 como si fueran variantes compatibles.
- Comprar un SSD M.2 sin saber si la ranura admite NVMe o solo SATA.
- Elegir una gráfica que encaja en la ranura pero no cabe por longitud o grosor.
- Quedarse corto de fuente o de conectores.
- Montar un disipador demasiado alto para la caja.
- Comprar por impulso sin abrir manuales ni fichas oficiales.

## Checklist final

- **Placa y CPU:** socket, chipset, lista oficial de procesadores y BIOS.
- **Memoria:** DDR4 o DDR5, formato, capacidad, ranuras, kit y QVL si procede.
- **SSD:** SATA, M.2 o NVMe, longitud, generación PCIe y ranuras libres.
- **Gráfica:** longitud, grosor, conectores, potencia recomendada y ventilación.
- **Fuente:** potencia, conectores, calidad y margen.
- **Caja:** formato de placa, espacio para la GPU, altura del disipador y radiadores.
- **Refrigeración:** soporte de socket, medidas, separación con la RAM y flujo de aire.
- **Conjunto:** que ninguna pieza obligue a cambiar otra sin querer.

## Conclusión

La mejor compra no es la pieza más potente, sino la que encaja con el resto y con tu uso real. Abre la ficha oficial de la placa, revisa el manual y confirma cada punto antes de pagar. Si una compatibilidad no está clara, mejor detenerse a comprobarla que descubrir el problema con las piezas encima de la mesa.
