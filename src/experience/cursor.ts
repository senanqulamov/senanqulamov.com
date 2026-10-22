// The pointer has one immediate dot and one spring-driven ring. Hover changes read layout once.

import { $, esc } from "./dom";
import { coarse, reduce } from "./env";
import { mouse } from "./state";

type Rect = { left: number; top: number; width: number; height: number; radius: string };

export const Cursor = (() => {
  const ring = $("#curRing"),
    dot = $("#curDot"),
    label = $("#curLabel");
  if (coarse || !ring || !dot || !label) return { tick() {} };

  let x = mouse.x,
    y = mouse.y,
    vx = 0,
    vy = 0,
    down = false,
    visible = false;
  let mode = "default",
    target: HTMLElement | null = null,
    magnetic: HTMLElement | null = null,
    rect: Rect | null = null;
  let dirtyRect = false,
    labelWidth = 0,
    mx = 0,
    my = 0;
  const setMode = (next: string, text = "") => {
    mode = next;
    ring.dataset.mode = next;
    label.innerHTML = text;
  };
  const readRect = () => {
    if (!magnetic) return (rect = null);
    const r = magnetic.getBoundingClientRect();
    rect = {
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height,
      radius: getComputedStyle(magnetic).borderRadius,
    };
    dirtyRect = false;
  };
  const clearTarget = () => {
    if (magnetic) magnetic.style.transform = "";
    target = null;
    magnetic = null;
    rect = null;
    mx = 0;
    my = 0;
    setMode("default");
  };
  const updateTarget = (node: HTMLElement) => {
    const next = node.closest<HTMLElement>(
      "[data-mag],[data-drag],[data-cursor],input,textarea,select,a,button,label,summary,[role=button],.book3d",
    );
    if (next === target) {
      if (next?.dataset.drag !== undefined) {
        if (next.dataset.dragging === "true") setMode("default");
        else if (mode !== "drag") {
          setMode(
            "drag",
            `<i aria-hidden="true">‹</i>${esc(next.dataset.drag || "Drag")}<i aria-hidden="true">›</i>`,
          );
          labelWidth = label.offsetWidth;
        }
      }
      return;
    }
    target = next;
    if (magnetic && magnetic !== next?.closest<HTMLElement>("[data-mag]")) magnetic.style.transform = "";
    magnetic = next?.closest<HTMLElement>("[data-mag]") || null;
    mx = 0;
    my = 0;
    if (magnetic) readRect();
    if (!next) return setMode("default");
    if (next.matches("input:not([type=range]):not([type=checkbox]):not([type=radio]),textarea,select"))
      return setMode("text");
    if (next.dataset.drag !== undefined) {
      if (next.dataset.dragging === "true") return setMode("default");
      setMode(
        "drag",
        `<i aria-hidden="true">‹</i>${esc(next.dataset.drag || "Drag")}<i aria-hidden="true">›</i>`,
      );
      labelWidth = label.offsetWidth;
      return;
    }
    if (next.dataset.cursor !== undefined) {
      setMode("label", `${esc(next.dataset.cursor)} <i aria-hidden="true">→</i>`);
      labelWidth = label.offsetWidth;
      return;
    }
    setMode("link");
  };
  document.addEventListener(
    "pointermove",
    (event) => {
      const hit = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
      if (hit) updateTarget(hit);
      else clearTarget();
      visible = true;
      document.body.classList.add("cursor-on");
    },
    { passive: true },
  );
  document.addEventListener("pointerover", (event) => {
    updateTarget(event.target as HTMLElement);
    visible = true;
    document.body.classList.add("cursor-on");
  });
  document.addEventListener("pointerout", (event) => {
    const related = event.relatedTarget as Node | null;
    if (target && (!related || !target.contains(related))) clearTarget();
  });
  document.addEventListener("pointerdown", () => (down = true), { passive: true });
  document.addEventListener("pointerup", () => (down = false), { passive: true });
  document.addEventListener("pointerleave", () => {
    visible = false;
    document.body.classList.remove("cursor-on");
  });
  addEventListener("blur", () => {
    visible = false;
    document.body.classList.remove("cursor-on");
  });
  addEventListener("pointerover", () => {
    visible = true;
    document.body.classList.add("cursor-on");
  });
  addEventListener("focus", () => (dirtyRect = true));
  addEventListener("scroll", () => (dirtyRect = true), { passive: true });
  addEventListener("resize", () => (dirtyRect = true));

  return {
    tick() {
      if (dirtyRect) readRect();
      if (magnetic && rect) {
        const cx = rect.left + rect.width / 2 + mx;
        const cy = rect.top + rect.height / 2 + my;
        const dx = mouse.x - cx;
        const dy = mouse.y - cy;
        const range = Math.max(rect.width, rect.height) * 0.9;
        const active = Math.hypot(dx, dy) < range;
        mx += ((active ? dx * 0.3 : 0) - mx) * 0.18;
        my += ((active ? dy * 0.3 : 0) - my) * 0.18;
        magnetic.style.transform = `translate3d(${mx.toFixed(2)}px,${my.toFixed(2)}px,0)`;
      }
      const offset = target?.dataset.cursorOffset ? Number(target.dataset.cursorOffset) || 0 : 0;
      const tx = rect ? rect.left + rect.width / 2 + mx : mouse.x + offset;
      const ty = rect ? rect.top + rect.height / 2 + my : mouse.y + offset;
      const response = reduce ? 1 : 0.18;
      const nx = x + (tx - x) * response,
        ny = y + (ty - y) * response;
      vx = nx - x;
      vy = ny - y;
      x = nx;
      y = ny;
      let width = 36,
        height = 36,
        radius = "50%";
      if (mode === "link") width = height = 56;
      if (mode === "text") {
        width = 2;
        height = 22;
        radius = "1px";
      }
      if (mode === "label" || mode === "drag") {
        width = Math.max(76, labelWidth + 30);
        height = 32;
        radius = "999px";
      }
      if (rect) {
        width = rect.width + 8;
        height = rect.height + 8;
        radius = rect.radius;
      }
      const speed = reduce ? 0 : Math.min(Math.hypot(vx, vy) / 18, 0.25);
      const angle = Math.atan2(vy, vx);
      const squash = mode === "drag" ? Math.min(Math.abs(vx) / 24, 0.12) : 0;
      ring.style.width = `${width}px`;
      ring.style.height = `${height}px`;
      ring.style.borderRadius = radius;
      ring.style.opacity = visible ? "1" : "0";
      ring.style.transform = `translate3d(${x}px,${y}px,0) rotate(${angle}rad) scale(${(down ? 0.85 : 1) * (1 + speed + squash)},${(down ? 0.85 : 1) * (1 - speed * 0.6 - squash)})`;
      label.style.transform = `translate(-50%,-50%) rotate(${-angle}rad)`;
      dot.style.opacity =
        visible && mode !== "link" && mode !== "text" && mode !== "label" && mode !== "drag" && !rect
          ? "1"
          : "0";
      dot.style.transform = `translate3d(${mouse.x}px,${mouse.y}px,0)`;
    },
  };
})();

export function magTick() {}
