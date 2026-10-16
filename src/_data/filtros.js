// «Cómo elijo lo que recomiendo» (/guias/): cinco filtros y situaciones de ejemplo para demostrarlos.
// Todo es ilustrativo: productos genéricos, sin marcas ni precios reales. Se muestra marcado como ejemplo.
//   cae: posición (0-4) del filtro donde se descarta el candidato, o null si pasa los cinco.
//   motivo: por qué se descarta (o por qué pasa).
export default {
  filtros: [
    { id: "uso", name: "Uso real", short: "Uso", ask: "¿Resuelve lo que de verdad necesitas?" },
    { id: "compat", name: "Compatibilidad", short: "Compat.", ask: "¿Encaja con tu equipo?" },
    { id: "precio", name: "Calidad-precio", short: "Precio", ask: "¿Compensa lo que cuesta?" },
    { id: "vigencia", name: "Vigencia", short: "Vigencia", ask: "¿Sigue siendo válido hoy?" },
    { id: "transparencia", name: "Transparencia", short: "Transp.", ask: "¿Lo recomendaría igual sin comisión?" },
  ],
  escenarios: [
    {
      id: "portatil-lento",
      label: "Mi portátil de 2018 va lento",
      contexto: "Supuesto: disco mecánico, bahía SATA de 2,5\" y un procesador aceptable.",
      candidatos: [
        { name: "SSD SATA de 500 GB", cae: null, motivo: "Pasa los cinco filtros: ataca el cuello de botella real y encaja sin sorpresas." },
        { name: "Kit de memoria de 32 GB", cae: 0, motivo: "Para navegar y ofimática no cambia nada: el problema está en el disco." },
        { name: "SSD NVMe de gama alta", cae: 1, motivo: "El portátil solo admite SATA: físicamente no encajaría." },
        { name: "Portátil nuevo de gama media", cae: 2, motivo: "Es pagar un equipo entero para arreglar lo que resuelve una sola pieza." },
      ],
      eleccion: "SSD SATA de 500 GB, con copia de seguridad antes de clonar el disco.",
    },
    {
      id: "pc-estudiar",
      label: "Quiero montar un PC para estudiar",
      contexto: "Supuesto: ofimática, clases en línea y algo de programación.",
      candidatos: [
        { name: "Procesador con gráficos integrados, 16 GB de RAM y SSD", cae: null, motivo: "Pasa los cinco filtros: lo que hace falta, sin pagar de más." },
        { name: "Tarjeta gráfica dedicada de gama alta", cae: 0, motivo: "Estudiar no la aprovecha: es potencia que no vas a usar." },
        { name: "Placa con un socket distinto al del procesador", cae: 1, motivo: "No encajan entre sí: no hay forma de montarlo." },
        { name: "Kit de piezas de una generación descatalogada", cae: 3, motivo: "Cuesta encontrar repuestos y la ficha ya no es fiable." },
      ],
      eleccion: "Procesador con gráficos integrados, 16 GB de RAM y SSD, y una caja y una fuente que dejen margen para ampliar.",
    },
    {
      id: "monitor-trabajo",
      label: "Necesito un monitor para trabajar",
      contexto: "Supuesto: ofimática durante horas, conectado a un portátil con USB-C.",
      candidatos: [
        { name: "Monitor de 27\" nítido, con USB-C", cae: null, motivo: "Pasa los cinco filtros: cómodo para leer y se conecta con un solo cable." },
        { name: "Monitor sin entrada compatible con el portátil", cae: 1, motivo: "Sin la conexión adecuada harían falta adaptadores: no encaja." },
        { name: "Monitor de gama muy alta para diseño profesional", cae: 2, motivo: "Pagarías una precisión de color que tu trabajo no pide." },
        { name: "Un modelo que solo recomendaría por la comisión", cae: 4, motivo: "Si la única razón es lo que me pagarían, no entra." },
      ],
      eleccion: "Monitor de 27\" nítido, con USB-C, y soporte regulable en altura.",
    },
  ],
};
