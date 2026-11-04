// Light and dark themes. The switch reveals the new theme in a circle from the button.

import { $, $$, root } from "./dom";
import { reduce } from "./env";
import { GL } from "./state";
import { tr } from "./i18n";
import { blip } from "./sound";

let themeBusy = false;
export type ThemeMode = "dark" | "light" | "auto";

export function setTheme(mode: ThemeMode) {
  const resolved =
    mode === "auto" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : mode;
  root.dataset.theme = resolved;
  root.dataset.themeMode = mode;
  localStorage.setItem("sq-theme", mode);
  syncThemeButton();
  GL && GL.setLight(resolved === "light" ? 1 : 0, true);
  $$("[data-theme-label]").forEach((e) => (e.textContent = tr(resolved === "light" ? "Light" : "Dark")));
}

matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
  if (localStorage.getItem("sq-theme") === "auto") setTheme("auto");
});

/** Switch to a mode with the same circular reveal as the desktop toggle, from the tapped element. */
export function setThemeAnimated(mode: ThemeMode, fromEl?: HTMLElement) {
  const resolved =
    mode === "auto" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : mode;
  if (resolved === root.dataset.theme) {
    setTheme(mode);
    return Promise.resolve();
  }
  return toggleTheme(fromEl, mode);
}

export async function toggleTheme(fromEl?: HTMLElement, mode?: ThemeMode) {
  if (themeBusy) return;
  themeBusy = true;
  const next = root.dataset.theme === "light" ? "dark" : "light";
  const r = (fromEl || $("#themeBtn")).getBoundingClientRect(),
    x = r.left + r.width / 2,
    y = r.top + r.height / 2;
  const apply = () => {
    setTheme(mode || next);
  };
  blip(next === "light" ? 1180 : 520, 0.35);
  if ((document as any).startViewTransition && !reduce) {
    root.classList.add("vt-run");
    const vt = (document as any).startViewTransition(apply);
    try {
      await vt.ready;
      const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const ease = "cubic-bezier(.76,0,.24,1)";
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${R * 0.18}px at ${x}px ${y}px)`,
            `circle(${R}px at ${x}px ${y}px)`,
          ],
          offset: [0, 0.25, 1],
        },
        { duration: 1250, easing: ease, pseudoElement: "::view-transition-new(root)" },
      );
      root.animate(
        {
          transform: ["scale(1) rotate(0deg)", "scale(.92) rotate(-1.5deg)"],
          filter: ["blur(0px) brightness(1)", "blur(8px) brightness(.6)"],
          borderRadius: ["0px", "40px"],
        },
        { duration: 1250, easing: ease, pseudoElement: "::view-transition-old(root)" },
      );
      await vt.finished;
    } catch (e) {}
    root.classList.remove("vt-run");
  } else apply();
  GL && GL.burst();
  themeBusy = false;
}

export function syncThemeButton() {
  const b = $("#themeBtn");
  if (!b) return;
  const light = root.dataset.theme === "light";
  b.setAttribute("aria-checked", String(light));
  const lbl = tr(light ? "Switch to dark theme" : "Switch to light theme");
  b.setAttribute("aria-label", String(lbl));
  b.title = lbl;
}
