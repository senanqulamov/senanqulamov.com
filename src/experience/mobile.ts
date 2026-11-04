// Phone-only helpers: the section links that live in the dock, and hiding the
// dock while the keyboard is open.

import { $, $$, body } from "./dom";
import { isMobile } from "./env";
import { tr } from "./i18n";

/** In-page navigation that moves into the dock on phones, in order of preference. */
const SOURCES = [
  ".cv-nav a", // Credits: Profile, Ventures, Experience…
  ".lab-nav a", // Lab experiments
  ".toc a", // Essay contents
  ".st-steps button", // Start a project scenes
  ".filters button[data-f]", // Work filters
  ".filters button[data-bf]", // Library themes
];

let observer: MutationObserver | null = null;

const isActive = (el: HTMLElement) =>
  el.classList.contains("on") ||
  el.classList.contains("cur") ||
  el.getAttribute("aria-pressed") === "true" ||
  el.getAttribute("aria-current") === "true";

/** The visible label of a source link, without leading numbers or counts. */
function labelOf(el: HTMLElement) {
  const first = [...el.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  const text = (first ? first.textContent : el.textContent).trim();
  return text.replace(/^\d+\s*[./]?\s*/, "") || text;
}

function mountDockNav(view: HTMLElement) {
  const bar = $("#dockSub");
  if (!bar) return;
  observer?.disconnect();
  observer = null;
  bar.innerHTML = "";
  body.classList.remove("has-dock-sub");
  if (!isMobile()) return;

  const items = SOURCES.map((sel) => $$<HTMLElement>(sel, view)).find((list) => list.length > 1);
  if (!items) return;
  const pairs = items.map((src) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "ds-chip";
    chip.textContent = labelOf(src);
    chip.addEventListener("click", () => src.click());
    bar.appendChild(chip);
    return [src, chip] as const;
  });
  const sync = () =>
    pairs.forEach(([src, chip]) => {
      const on = isActive(src);
      if (on === chip.classList.contains("on")) return;
      chip.classList.toggle("on", on);
      chip.setAttribute("aria-current", String(on));
      if (on)
        bar.scrollTo({
          left: chip.offsetLeft - bar.clientWidth / 2 + chip.offsetWidth / 2,
          behavior: "smooth",
        });
    });
  observer = new MutationObserver(sync);
  pairs.forEach(([src]) =>
    observer.observe(src, { attributes: true, attributeFilter: ["class", "aria-pressed", "aria-current"] }),
  );
  sync();
  body.classList.add("has-dock-sub");
}

export function mountMobile(view: HTMLElement) {
  mountDockNav(view);
  if (!isMobile()) return;
  $$<HTMLTextAreaElement>(".cx-form textarea").forEach((t) => (t.placeholder = tr("Ask me anything")));
  const pal = $<HTMLInputElement>("#palIn");
  if (pal) pal.placeholder = tr("Search pages and projects");
}

// The dock steps aside while the on-screen keyboard is open.
const typing = (el: EventTarget | null) =>
  el instanceof HTMLElement && el.matches("input, textarea, select, [contenteditable]");
let kbTimer = 0;
addEventListener("focusin", (e) => {
  if (!isMobile() || !typing(e.target)) return;
  clearTimeout(kbTimer);
  body.classList.add("kb-open");
});
addEventListener("focusout", () => {
  clearTimeout(kbTimer);
  kbTimer = window.setTimeout(() => {
    if (!typing(document.activeElement)) body.classList.remove("kb-open");
  }, 120);
});
