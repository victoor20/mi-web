// «Cómo elijo lo que recomiendo» (/guias/): encajar piezas, con el mismo arrastre e imán que la 404.
// Cada pieza se arrastra (ratón, dedo o lápiz) al hueco: la buena encaja con destello y sonido; las demás rebotan
// o se van a otra ranura, y siempre aparece su motivo. «Probar esta pieza» hace lo mismo con teclado y lector de pantalla.
// Sin JavaScript se ven la ilustración, las piezas y los cinco filtros (texto siempre legible).
import { createSound } from "../lib/sound.js";

const SNAP = 70; // distancia (unidades del SVG) a la que una pieza suelta se evalúa en el hueco
const NEAR = 120; // distancia a la que el hueco se ilumina

export default function encaje(root, { reduceMotion }) {
  const sound = createSound(!reduceMotion);
  const tabs = [...root.querySelectorAll("[data-scenario]")];
  const panels = [...root.querySelectorAll("[data-panel]")];
  const narrowMq = window.matchMedia("(max-width: 600px)");

  const games = panels.map((panel) => setup(panel));

  // Cambio de situación
  tabs.forEach((t) => t.addEventListener("click", () => {
    tabs.forEach((x) => x.setAttribute("aria-pressed", String(x === t)));
    panels.forEach((p) => p.classList.toggle("is-on", p.dataset.panel === t.dataset.scenario));
  }));

  // Encuadre: ancho (piezas a la derecha) o estrecho (piezas debajo). El hueco del escenario no cambia de sitio.
  const layout = () => games.forEach((g) => g.layout(narrowMq.matches));
  narrowMq.addEventListener("change", layout);
  layout();

  function setup(panel) {
    const svg = panel.querySelector("[data-svg]");
    const holeEl = panel.querySelector("[data-hole]");
    const slotEl = panel.querySelector("[data-slot]");
    const msg = panel.querySelector("[data-msg]");
    const win = panel.querySelector("[data-win]");
    const hole = { x: +holeEl.dataset.x, y: +holeEl.dataset.y };
    const slot = slotEl ? { x: +slotEl.dataset.x, y: +slotEl.dataset.y } : null;
    const pieces = [...panel.querySelectorAll("[data-piece]")].map((el) => {
      const row = panel.querySelector(`[data-row="${el.dataset.piece}"]`);
      return {
        el, row, id: el.dataset.piece, rule: el.dataset.rule,
        wide: el.dataset.wide.split(",").map(Number), narrow: el.dataset.narrow.split(",").map(Number),
        hx: 0, hy: 0, tx: 0, ty: 0, at: "home",
        name: row.querySelector(".fit__try-name").textContent,
        result: row.querySelector("[data-result]"),
      };
    });
    const byEl = new Map(pieces.map((p) => [p.el, p]));
    let narrow = false;
    let busy = null;

    const apply = (p) => {
      p.el.style.setProperty("--hx", `${p.hx}px`);
      p.el.style.setProperty("--hy", `${p.hy}px`);
      p.el.style.setProperty("--tx", `${p.tx.toFixed(1)}px`);
      p.el.style.setProperty("--ty", `${p.ty.toFixed(1)}px`);
    };
    const target = (p) => (p.at === "hole" ? hole : p.at === "slot" ? slot : null);
    const moveTo = (p, pt) => { p.tx = pt ? pt.x - p.hx : 0; p.ty = pt ? pt.y - p.hy : 0; apply(p); };

    const say = (text, ok) => {
      msg.textContent = text;
      msg.classList.toggle("is-ok", ok === true);
      msg.classList.toggle("is-ko", ok === false);
    };
    const mark = (p, ok, text) => {
      p.result.textContent = text;
      p.row.classList.toggle("is-ok", ok);
      p.row.classList.toggle("is-ko", !ok);
    };
    const flash = (el, cls) => {
      el.classList.remove(cls);
      void el.getBoundingClientRect();
      el.classList.add(cls);
      el.addEventListener("animationend", () => el.classList.remove(cls), { once: true });
    };

    // Resultado de soltar una pieza en el hueco
    const evaluate = (p) => {
      const filter = p.result.dataset.filter;
      const reason = p.result.dataset.reason;
      if (p.rule === "fit") {
        pieces.forEach((o) => { if (o !== p && o.at === "hole") { o.at = "home"; moveTo(o, null); } });
        p.at = "hole";
        moveTo(p, hole);
        p.el.classList.add("is-placed");
        flash(p.el, "is-glow");
        holeEl.classList.add("is-filled");
        flash(holeEl, "is-flash");
        sound.snap();
        setTimeout(() => sound.win(), 180);
        say(`✓ ${p.name}: encaja y pasa los cinco filtros.`, true);
        mark(p, true, "✓ Encaja y pasa los cinco filtros.");
        win.classList.add("is-on");
      } else if (p.rule === "elsewhere" && slot) {
        p.at = "slot";
        moveTo(p, slot);
        p.el.classList.add("is-parked");
        sound.snap();
        say(`✕ ${filter}: ${reason}`, false);
        mark(p, false, `✕ ${filter}: ${reason}`);
      } else {
        // Rebota: vuelve a su sitio con un temblor y el hueco se enciende en rojo
        p.at = "home";
        moveTo(p, null);
        flash(p.el, "is-shake");
        flash(holeEl, "is-reject");
        sound.thud();
        say(`✕ ${filter}: ${reason}`, false);
        mark(p, false, `✕ ${filter}: ${reason}`);
      }
    };

    // --- Arrastrar (mismo enfoque que la 404)
    const toSvg = (e) => {
      const pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    };
    const layer = panel.querySelector("[data-pieces]");
    layer.addEventListener("touchstart", (e) => {
      const p = byEl.get(e.target.closest(".fit__piece"));
      if (p && p.at !== "hole") e.preventDefault(); // en SVG, touch-action no basta para que no se desplace la página
    }, { passive: false });

    let drag = null;
    layer.addEventListener("pointerdown", (e) => {
      const p = byEl.get(e.target.closest(".fit__piece"));
      if (!p || p.at === "hole" || busy || e.button > 0) return;
      e.preventDefault();
      sound.unlock();
      layer.append(p.el); // al frente
      p.el.setPointerCapture(e.pointerId);
      if (p.at === "slot") { p.at = "home"; p.el.classList.remove("is-parked"); }
      const pos = toSvg(e);
      drag = { p, id: e.pointerId, dx: p.hx + p.tx - pos.x, dy: p.hy + p.ty - pos.y };
      p.el.classList.add("is-dragging");
    });
    layer.addEventListener("pointermove", (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const { p } = drag;
      const pos = toSvg(e);
      p.tx = pos.x + drag.dx - p.hx;
      p.ty = pos.y + drag.dy - p.hy;
      apply(p);
      const d = Math.hypot(p.hx + p.tx - hole.x, p.hy + p.ty - hole.y);
      holeEl.classList.toggle("is-near", d < NEAR);
      if (slotEl) slotEl.classList.toggle("is-near", Math.hypot(p.hx + p.tx - slot.x, p.hy + p.ty - slot.y) < NEAR);
    });
    const release = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const { p } = drag;
      drag = null;
      p.el.classList.remove("is-dragging");
      holeEl.classList.remove("is-near");
      slotEl?.classList.remove("is-near");
      const cx = p.hx + p.tx, cy = p.hy + p.ty;
      const nearHole = Math.hypot(cx - hole.x, cy - hole.y) < SNAP;
      const nearSlot = slot && Math.hypot(cx - slot.x, cy - slot.y) < SNAP;
      if (nearHole || (nearSlot && p.rule === "elsewhere")) evaluate(p);
      else { p.at = "home"; moveTo(p, null); } // soltada lejos: vuelve a su sitio sin más
    };
    layer.addEventListener("pointerup", release);
    layer.addEventListener("pointercancel", release);

    // --- Alternativa sin arrastrar: la pieza viaja sola al hueco y se evalúa igual
    panel.querySelectorAll("[data-try]").forEach((btn) => btn.addEventListener("click", () => {
      const p = pieces.find((x) => x.id === btn.dataset.try);
      if (!p || busy) return;
      sound.unlock();
      if (p.at === "hole") { say(`✓ ${p.name}: ya está en su sitio.`, true); return; }
      p.el.classList.remove("is-parked");
      layer.append(p.el);
      if (reduceMotion) { evaluate(p); return; }
      p.el.classList.add("is-trying");
      moveTo(p, hole);
      busy = setTimeout(() => { busy = null; p.el.classList.remove("is-trying"); evaluate(p); }, 380);
    }));

    // --- Volver a probar
    panel.querySelector("[data-reset]").addEventListener("click", () => {
      pieces.forEach((p) => {
        p.at = "home";
        p.el.classList.remove("is-placed", "is-parked");
        moveTo(p, null);
        p.result.textContent = "";
        p.row.classList.remove("is-ok", "is-ko");
      });
      holeEl.classList.remove("is-filled");
      win.classList.remove("is-on");
      say("Arrastra una pieza al hueco o usa «Probar esta pieza».");
      panel.querySelector("[data-try]")?.focus();
    });

    return {
      layout(isNarrow) {
        narrow = isNarrow;
        // Al colocar las piezas por primera vez (o al cambiar de encuadre) no se anima el salto
        pieces.forEach((p) => p.el.classList.add("is-instant"));
        requestAnimationFrame(() => requestAnimationFrame(() => pieces.forEach((p) => p.el.classList.remove("is-instant"))));
        svg.setAttribute("viewBox", narrow ? "0 0 400 620" : "0 0 680 400");
        pieces.forEach((p) => {
          [p.hx, p.hy] = narrow ? p.narrow : p.wide;
          moveTo(p, target(p));
        });
      },
    };
  }
}
