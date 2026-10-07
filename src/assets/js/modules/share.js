// Recomendar: compartir con el menú nativo del móvil o copiar el enlace.
export default function share(root) {
  const box = root.querySelector("[data-share]");
  if (!box) return;
  const status = root.querySelector("[data-share-status]");
  const { url, text } = box.dataset;
  const nativeBtn = box.querySelector("[data-share-native]");
  const copyBtn = box.querySelector("[data-copy]");

  if (navigator.share) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener("click", () => {
      navigator.share({ title: "Víctor Rocamora", text, url }).then(() => window.umami?.track?.("recomendar-nativo")).catch(() => {});
    });
  }
  if (navigator.clipboard) {
    copyBtn.hidden = false;
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(url);
        status.textContent = "Enlace copiado.";
        window.umami?.track?.("recomendar-copiar");
      } catch {
        status.textContent = `Copia este enlace: ${url}`;
      }
    });
  }
}
