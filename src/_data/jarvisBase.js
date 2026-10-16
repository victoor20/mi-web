// Recorrido por el Jarvis Control Center (/proyectos/jarvis/): una pestaña por habitación y un visor con sus capturas.
// Las capturas salen de material/jarvis/ ya pixeladas (scripts/jarvis-images.mjs, que guarda qué se tapa en cada una)
// y se publican en src/assets/img/jarvis/<nombre>-<ancho>.
// review: true = texto redactado a partir de las capturas, pendiente de que Víctor lo revise.
export default {
  rooms: [
  {
    "id": "sala-central",
    "name": "Sala central",
    "icon": "sala",
    "review": true,
    "shots": [
      {
        "name": "sala-central1",
        "w": 745,
        "h": 722
      },
      {
        "name": "sala-central2",
        "w": 754,
        "h": 741
      },
      {
        "name": "sala-central3",
        "w": 748,
        "h": 729
      }
    ],
    "shows": "El estado general de la base de un vistazo: si OpenClaw, el panel, las copias y el consumo del modelo están bien, y cuándo se actualizó cada módulo.",
    "why": "Si algo falla lo veo antes de que me lo diga nadie, y sin entrar en el equipo."
  },
  {
    "id": "terminal",
    "name": "Cuarto terminal",
    "icon": "terminal",
    "review": true,
    "shots": [
      {
        "name": "cuarto-terminal",
        "w": 749,
        "h": 462
      }
    ],
    "shows": "Qué modelo usa Jarvis en cada momento y de dónde salen los datos de consumo, siempre como agregados.",
    "why": "Saber qué modelo responde y cuánto consume evita sorpresas en el coste y en el comportamiento."
  },
  {
    "id": "biblioteca",
    "name": "Biblioteca de skills",
    "icon": "biblioteca",
    "review": true,
    "shots": [
      {
        "name": "biblioteca-skills1",
        "w": 761,
        "h": 726
      },
      {
        "name": "biblioteca-skills2",
        "w": 748,
        "h": 723
      }
    ],
    "shows": "Las skills y herramientas que Jarvis tiene a mano, con su origen, su nivel de riesgo y si necesitan mi confirmación antes de actuar.",
    "why": "Cuantas menos herramientas y mejor delimitadas, más fácil es saber qué puede hacer y qué no."
  },
  {
    "id": "seguridad",
    "name": "Cuarto de seguridad",
    "icon": "seguridad",
    "review": true,
    "shots": [
      {
        "name": "cuarto-seguridad1",
        "w": 756,
        "h": 728
      },
      {
        "name": "cuarto-seguridad2",
        "w": 754,
        "h": 731
      }
    ],
    "shows": "Autenticación, permisos de los archivos sensibles, puertos y servicios en marcha, con los datos concretos tapados.",
    "why": "Un agente con acceso a herramientas tiene que estar cerrado por defecto; aquí compruebo que lo está."
  },
  {
    "id": "tablon",
    "name": "Tablón de avisos",
    "icon": "tablon",
    "review": true,
    "shots": [
      {
        "name": "tablon-avisos1",
        "w": 745,
        "h": 529
      }
    ],
    "shows": "Avisos y diagnóstico en modo seguro, y las acciones futuras, que aparecen bloqueadas.",
    "why": "Que una acción se vea pero todavía no se pueda ejecutar es la forma de añadir capacidades sin riesgos."
  },
  {
    "id": "comunicaciones",
    "name": "Comunicaciones",
    "icon": "comunicaciones",
    "review": true,
    "shots": [
      {
        "name": "comunicaciones",
        "w": 753,
        "h": 662
      }
    ],
    "shows": "Los canales por los que hablo con Jarvis (Telegram, voz a texto y texto a voz) y el riesgo de cada uno.",
    "why": "Es la puerta de entrada: si un canal falla o tiene riesgo alto, tiene que saltar a la vista."
  },
  {
    "id": "servidor",
    "name": "Servidor",
    "icon": "servidor",
    "review": true,
    "shots": [
      {
        "name": "cuarto-servidor1",
        "w": 753,
        "h": 726
      },
      {
        "name": "cuarto-servidor2",
        "w": 753,
        "h": 728
      }
    ],
    "shows": "Las copias de seguridad cifradas en dos destinos, lo que procesa cada una y si la comprobación salió sin errores, con los horarios tapados.",
    "why": "Una copia que no se comprueba no es una copia: aquí veo que las dos funcionan."
  }
],
};
