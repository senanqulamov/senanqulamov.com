// The custom cursor, magnetic buttons and the tilt on cards.

import { $, $$, esc, lerp } from "./dom";
import { coarse } from "./env";
import { mouse } from "./state";

document.addEventListener("pointerover", (e) => {
  const b = (e.target as HTMLElement).closest && (e.target as HTMLElement).closest<HTMLElement>(".btn,.chip");
  if (!b || b.contains(e.relatedTarget as Node)) return;
  const r = b.getBoundingClientRect();
  b.style.setProperty("--x", e.clientX - r.left + "px");
  b.style.setProperty("--y", e.clientY - r.top + "px");
});
document.addEventListener("pointerout", (e) => {
  const b = (e.target as HTMLElement).closest && (e.target as HTMLElement).closest<HTMLElement>(".btn,.chip");
  if (!b || b.contains(e.relatedTarget as Node)) return;
  const r = b.getBoundingClientRect();
  b.style.setProperty("--x", e.clientX - r.left + "px");
  b.style.setProperty("--y", e.clientY - r.top + "px");
});
document.addEventListener(
  "pointermove",
  (e) => {
    if (coarse) return;
    const t =
      (e.target as HTMLElement).closest && (e.target as HTMLElement).closest<HTMLElement>("[data-tilt]");
    if (!t) return;
    const r = t.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width,
      y = (e.clientY - r.top) / r.height;
    t.style.transform = `perspective(900px) rotateX(${((0.5 - y) * 8).toFixed(2)}deg) rotateY(${((x - 0.5) * 10).toFixed(2)}deg) translateZ(0)`;
    t.style.setProperty("--gx", x * 100 + "%");
    t.style.setProperty("--gy", y * 100 + "%");
  },
  { passive: true },
);
document.addEventListener("pointerout", (e) => {
  const t =
    (e.target as HTMLElement).closest && (e.target as HTMLElement).closest<HTMLElement>("[data-tilt]");
  if (t && !t.contains(e.relatedTarget as Node)) t.style.transform = "";
});

export const Cursor = (() => {
  const ring = $("#curRing"),
    dot = $("#curDot"),
    lab = $("#curLabel");
  let x = mouse.x,
    y = mouse.y,
    s = 1,
    ts = 1,
    mode = "",
    vx = 0,
    vy = 0,
    down = false;
  const SIZE = { "": 14, link: 58, label: 112, drag: 112, text: 4 };
  function set(m: string, t = "") {
    mode = m;
    ring.dataset.mode = m;
    lab.innerHTML = t || "";
  }
  document.addEventListener("pointerover", (e) => {
    const t = e.target as HTMLElement;
    if (
      t.closest<HTMLElement>("input:not([type=range]):not([type=checkbox]):not([type=radio]),textarea,select")
    ) {
      set("text");
      return;
    }
    const d = t.closest<HTMLElement>("[data-drag]");
    if (d) {
      set(
        "drag",
        `<svg viewBox="0 0 24 24" width="14" aria-hidden="true"><path d="M8 6 2 12l6 6M16 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>${esc(d.dataset.drag || "Drag")}`,
      );
      return;
    }
    const lb = t.closest<HTMLElement>("[data-cursor]"),
      ext = t.closest<HTMLElement>("a[target=_blank]");
    if (lb) {
      set("label", esc(lb.dataset.cursor) + (ext ? ' <span aria-hidden="true">↗</span>' : ""));
      return;
    }
    if (ext) {
      set("label", 'Open <span aria-hidden="true">↗</span>');
      return;
    }
    if (t.closest<HTMLElement>("a,button,label,summary,[role=button],.book3d")) {
      set("link");
      return;
    }
    set("");
  });
  document.addEventListener("pointerleave", () => {
    ring.classList.add("off");
  });
  document.addEventListener("pointerenter", () => {
    ring.classList.remove("off");
  });
  addEventListener("pointerdown", () => (down = true));
  addEventListener("pointerup", () => (down = false));
  return {
    tick() {
      if (coarse) return;
      const k = mode === "" ? 0.32 : 0.2;
      const nx = lerp(x, mouse.x, k),
        ny = lerp(y, mouse.y, k);
      vx = nx - x;
      vy = ny - y;
      x = nx;
      y = ny;
      ts = SIZE[mode] ?? 14;
      if (down) ts *= 0.75;
      s = lerp(s, ts, 0.18);
      const sp = mode === "" ? Math.min(Math.hypot(vx, vy) / 30, 0.6) : 0,
        ang = Math.atan2(vy, vx);
      ring.style.transform = `translate(${x}px,${y}px) rotate(${ang}rad) scale(${1 + sp},${1 - sp * 0.4})`;
      ring.style.width = ring.style.height = s.toFixed(1) + "px";
      lab.style.transform = `translate(-50%,-50%) rotate(${-ang}rad)`;
      dot.style.transform = `translate(${mouse.x}px,${mouse.y}px)`;
    },
  };
})();
export function magTick() {
  if (coarse) return;
  $$("[data-mag]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const cx = r.left + r.width / 2 - ((el as any)._mx || 0),
      cy = r.top + r.height / 2 - ((el as any)._my || 0),
      dx = mouse.x - cx,
      dy = mouse.y - cy,
      d = Math.hypot(dx, dy),
      R = Math.max(r.width, r.height) * 0.85;
    (el as any)._mx = lerp((el as any)._mx || 0, d < R ? dx * 0.28 : 0, 0.14);
    (el as any)._my = lerp((el as any)._my || 0, d < R ? dy * 0.36 : 0, 0.14);
    el.style.transform = `translate(${(el as any)._mx.toFixed(2)}px,${(el as any)._my.toFixed(2)}px)`;
  });
}
