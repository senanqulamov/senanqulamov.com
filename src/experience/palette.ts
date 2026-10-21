import { essays } from "@/data/essays";
import { pages } from "@/data/navigation";
import { projects } from "@/data/projects";
// Command palette (Cmd or Ctrl + K) and the global keyboard shortcuts.

import { profile } from "@/data/profile";
import { $, $$, esc, root } from "./dom";
import { GL, lenis } from "./state";
import { tr } from "./i18n";
import { copy, toast } from "./ui";
import { blip, setSound, soundOn } from "./sound";
import { closeMenu, menuOpen } from "./menu";
import { toggleTheme } from "./theme";
import { navigate } from "./router";
import { Sketches } from "./lab/sketches";
import { switchLang } from "./language";

const pal = $("#pal"),
  palIn = $<HTMLInputElement>("#palIn"),
  palList = $("#palList");
let palItems: PaletteItem[] = [],
  palSel = 0;
type PaletteItem = { t: string; s: string; go?: string; act?: () => void; after?: string };
const allItems = (): PaletteItem[] => [
  ...pages.map((p) => ({ t: tr(p.title), s: tr("Page"), go: p.href })),
  ...projects.map((p) => ({ t: p.title, s: "Project, " + p.subtitle, go: "/work/" + p.slug })),
  ...essays.map((b) => ({ t: b.title, s: "Essay", go: "/journal/" + b.slug })),
  {
    t: tr(root.dataset.theme === "light" ? "Switch to dark theme" : "Switch to light theme"),
    s: "Action",
    act: () => toggleTheme($("#themeBtn")),
  },
  { t: soundOn ? "Turn sound off" : "Turn sound on", s: "Action", act: () => setSound(!soundOn) },
  { t: "Copy email address", s: "Action", act: () => copy(profile.email, "Email copied") },
  { t: "English", s: "Language", act: () => switchLang("en") },
  { t: "Azərbaycanca", s: "Language", act: () => switchLang("az") },
  { t: "Русский", s: "Language", act: () => switchLang("ru") },
  { t: tr("Reduce effects"), s: "Accessibility", act: () => $("#fxBtn").click() },
  { t: "Download CV as PDF", s: "Action", go: "/credits", after: "print" },
];
function palRender() {
  const q = palIn.value.trim().toLowerCase();
  palItems = allItems()
    .filter((i) => !q || (i.t + " " + i.s).toLowerCase().includes(q))
    .slice(0, 12);
  palSel = Math.min(palSel, Math.max(0, palItems.length - 1));
  palList.innerHTML = palItems.length
    ? palItems
        .map(
          (i, k) =>
            `<li role="option" data-k="${k}" class="${k === palSel ? "on" : ""}" aria-selected="${k === palSel}"><span>${esc(i.t)}</span><small>${esc(i.s)}</small></li>`,
        )
        .join("")
    : `<li>No match. Try a project, an essay or a page name.</li>`;
}
export function openPalette() {
  pal.classList.add("open");
  palIn.value = "";
  palSel = 0;
  palRender();
  lenis && lenis.stop();
  setTimeout(() => palIn.focus(), 50);
}
export function closePalette() {
  pal.classList.remove("open");
  if (!menuOpen) lenis && lenis.start();
}
function palRun(i) {
  const it = palItems[i];
  if (!it) return;
  closePalette();
  if (it.act) it.act();
  else {
    navigate(it.go);
    if (it.after === "print") setTimeout(() => window.print(), 2600);
  }
}
palIn.addEventListener("input", () => {
  palSel = 0;
  palRender();
});
palIn.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    palSel = Math.min(palItems.length - 1, palSel + 1);
    palRender();
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    palSel = Math.max(0, palSel - 1);
    palRender();
    e.preventDefault();
  } else if (e.key === "Enter") {
    palRun(palSel);
    e.preventDefault();
  }
});
palList.addEventListener("click", (e) => {
  const li = (e.target as HTMLElement).closest<HTMLElement>("li[data-k]");
  if (li) palRun(+li.dataset.k);
});
palList.addEventListener("pointermove", (e) => {
  const li = (e.target as HTMLElement).closest<HTMLElement>("li[data-k]");
  if (li && +li.dataset.k !== palSel) {
    palSel = +li.dataset.k;
    $$("li", palList).forEach((x, k) => x.classList.toggle("on", k === palSel));
  }
});
$(".pal-bg").addEventListener("click", closePalette);
$$("[data-open-palette]").forEach((b) => b.addEventListener("click", openPalette));
let keys = "";
addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    pal.classList.contains("open") ? closePalette() : openPalette();
    return;
  }
  if (e.key === "Escape") {
    if (pal.classList.contains("open")) closePalette();
    else if ($("#labStage").classList.contains("on")) Sketches.close();
    else if (menuOpen) {
      closeMenu();
      $("#menuBtn").focus();
    }
    return;
  }
  if (/input|textarea|select/i.test(document.activeElement.tagName)) return;
  keys = (keys + e.key).slice(-2);
  if (keys === "48") {
    GL && GL.burst();
    toast("Seat 48 is yours. Welcome backstage.");
    blip(660, 0.4);
  }
});
