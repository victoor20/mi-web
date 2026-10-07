// Filtro de guías por necesidad. Sin JavaScript se ve el listado completo.
export default function guides(root) {
  const filter = root.querySelector("[data-filter]");
  const chips = [...filter.querySelectorAll("[data-need]")];
  const rows = [...root.querySelectorAll(".guide-row")];
  const empty = root.querySelector("[data-empty]");
  filter.hidden = false;

  const apply = (need) => {
    let shown = 0;
    rows.forEach((row) => {
      const on = need === "todas" || row.dataset.need === need;
      row.hidden = !on;
      if (on) shown++;
    });
    empty.hidden = shown > 0;
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.need === need)));
  };

  chips.forEach((chip) => chip.addEventListener("click", () => apply(chip.dataset.need)));
}
