// Tarjeta de contacto (.vcf) de la web. vCard 3.0 con CHARSET=UTF-8 en cada campo con texto y saltos de línea CRLF:
// Outlook de escritorio ignora la codificación del servidor (GitHub Pages no manda charset), y sin el parámetro lee las
// tildes como Latin-1 («VÃctor»). Android e iPhone leen el parámetro sin problema.
export default class {
  data() {
    return { permalink: "/assets/victor-rocamora.vcf", eleventyExcludeFromCollections: true };
  }
  render({ site }) {
    const nota = site.isCommercial ? "Servicio técnico informático y automatizaciones" : "Técnico de sistemas, guías tech y laboratorio de IA";
    const url = site.url.replace(/\/$/, "");
    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N;CHARSET=UTF-8:Rocamora;Víctor;;;",
      "FN;CHARSET=UTF-8:Víctor Rocamora",
      "TITLE;CHARSET=UTF-8:Técnico de sistemas",
      "NOTE;CHARSET=UTF-8:" + nota,
      "EMAIL;TYPE=INTERNET,WORK:" + site.email,
      "URL;TYPE=WORK:" + url,
      "item1.URL:" + site.linkedin,
      "item1.X-ABLabel:LinkedIn",
      "X-SOCIALPROFILE;TYPE=linkedin:" + site.linkedin,
      "END:VCARD",
      "",
    ].join("\r\n");
  }
}
