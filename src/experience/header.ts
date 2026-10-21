// The header pill: page number, title, the sliding link highlight and the Baku clock.

import type { Route } from "./routes";
import { pages } from "@/data/navigation";
import { $, $$, pad2, scramble } from "./dom";
import { tr } from "./i18n";
import { setSound, soundOn } from "./sound";
import { numberOf, sectionOf, titleOf } from "./routes";
import { openPalette } from "./palette";
import { toggleTheme } from "./theme";

export const hdr = $("#hdr"),
  pgN = $("#pgN"),
  pgT = $("#pgT"),
  pgProg = $("#pgProg"),
  ind = $(".pill .ind");
$("#themeBtn").addEventListener("click", (e) => toggleTheme(e.currentTarget as HTMLElement));
$("#mTheme").addEventListener("click", (e) => toggleTheme(e.currentTarget as HTMLElement));
$$("[data-sound]").forEach((b) => b.addEventListener("click", () => setSound(!soundOn)));
$("#palBtn").addEventListener("click", () => openPalette());
export function moveInd(a: HTMLElement) {
  if (!a) {
    ind.style.opacity = "0";
    return;
  }
  const p = a.parentElement.getBoundingClientRect(),
    r = a.getBoundingClientRect();
  ind.style.left = r.left - p.left + "px";
  ind.style.width = r.width + "px";
  ind.style.opacity = "1";
}
$$(".pill .pg-links a").forEach((a) => {
  a.addEventListener("pointerenter", () => moveInd(a));
});
$(".pill .pg-links").addEventListener("pointerleave", () => moveInd($(".pill .pg-links a.on")));
const fmtClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Baku",
  hour: "2-digit",
  minute: "2-digit",
});
export const clockTick = () => {
  const s = "Baku " + fmtClock.format(new Date());
  $$("[data-clock]").forEach((e) => (e.textContent = tr(s)));
};
setInterval(clockTick, 15000);

/** Updates the page number, title and active link in the header pill. */
export function setHeader(r: Route) {
  pgN.textContent = numberOf(r) + " / " + pad2(pages.length);
  scramble(pgT, titleOf(r), 600);
  $$(".pill .pg-links a").forEach((a) =>
    a.classList.toggle("on", a.getAttribute("href") === "/" + sectionOf(r)),
  );
  setTimeout(() => moveInd($(".pill .pg-links a.on")), 50);
  $$("#mList a").forEach((a) => a.classList.toggle("cur-page", a.dataset.k === sectionOf(r)));
  clockTick();
  hdr.classList.remove("hide", "compact");
}
