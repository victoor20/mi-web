// Guías: índice lateral con la sección activa y barra de lectura.
export default function article(root) {
  const body = root.querySelector("[data-article-body]");
  const toc = root.querySelector("[data-toc]");
  const list = root.querySelector("[data-toc-list]");
  const headings = [...body.querySelectorAll("h2[id]")];

  if (headings.length >= 3) {
    headings.forEach((h) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      li.append(a);
      list.append(li);
    });
    toc.hidden = false;

    const links = [...list.querySelectorAll("a")];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("is-active", l.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: "0px 0px -70% 0px" });
    headings.forEach((h) => io.observe(h));
  }

  // Barra fina de progreso de lectura bajo la cabecera
  const bar = document.createElement("div");
  bar.className = "read-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.append(bar);
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = body.getBoundingClientRect();
    const total = r.height - window.innerHeight * 0.5;
    const p = Math.min(1, Math.max(0, -r.top / (total || 1)));
    bar.style.transform = `scaleX(${p.toFixed(3)})`;
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}
