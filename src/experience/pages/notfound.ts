// The 404 page: drag anywhere to pull the two drops together and you are sent home.

import { $, clamp } from "../dom";
import { gsap } from "../env";
import { cleanup, GL } from "../state";
import { tr } from "../i18n";
import { SFX } from "../sound";
import { navigate } from "../router";

/** How far the two drops have been pulled together, read by the scroll engine. */
export const lostDrops = { join: 0, drag: null as { x: number; j: number } | null, done: false };
export function mountNotFound(view: HTMLElement) {
  lostDrops.join = 0;
  lostDrops.done = false;
  const bar = $("#nfBar"),
    hint = $("#nfHint"),
    sec = $(".nf", view);
  const down = (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest<HTMLElement>("a,button")) return;
    lostDrops.drag = { x: e.clientX, j: lostDrops.join };
    SFX.whoosh();
  };
  const move = (e: PointerEvent) => {
    if (!lostDrops.drag || lostDrops.done) return;
    lostDrops.join = clamp(
      lostDrops.drag.j + Math.abs(e.clientX - lostDrops.drag.x) / (innerWidth * 0.32),
      0,
      1,
    );
    bar.style.transform = `scaleX(${lostDrops.join})`;
    if (Math.random() < 0.15) SFX.tone(200 + lostDrops.join * 600, { d: 0.12, peak: 0.02 });
    if (lostDrops.join >= 0.98) {
      lostDrops.done = true;
      lostDrops.drag = null;
      GL && GL.burst();
      GL && (GL.pulse = 1);
      SFX.chord();
      hint.textContent = tr("Welcome back. Taking you home.");
      setTimeout(() => navigate("/"), 900);
    }
  };
  const up = () => {
    if (!lostDrops.drag || lostDrops.done) return;
    lostDrops.drag = null;
    const o = { j: lostDrops.join };
    gsap.to(o, {
      j: 0,
      duration: 1,
      ease: "elastic.out(1,.5)",
      onUpdate: () => {
        lostDrops.join = o.j;
        bar.style.transform = `scaleX(${o.j})`;
      },
    });
    SFX.drop(0.6);
  };
  sec.addEventListener("pointerdown", down);
  addEventListener("pointermove", move);
  addEventListener("pointerup", up);
  cleanup.push(() => {
    removeEventListener("pointermove", move);
    removeEventListener("pointerup", up);
  });
}
