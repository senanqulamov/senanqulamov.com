import { essays } from "@/data/essays";
import { pages } from "@/data/navigation";
import { projects } from "@/data/projects";
import { $, $$, body } from "./dom";
import { isMobile, reduce, gsap } from "./env";
import { switchLang } from "./language";
import { setSound, soundOn } from "./sound";
import { GL, lenis } from "./state";
import { Dock } from "./director/dock";
import { setTheme } from "./theme";

const sheet = $("#mobileMenu"), dock = $(".mobile-dock"), scrim = $("#mobileMenuScrim"), search = $<HTMLInputElement>("#mmSearch"), results = $("#mmResults"), track = $("#mmTrack"), tabs = $$<HTMLButtonElement>("[data-mm-tab]"), tabbar = $(".mm-tabs");
let open = false, dragY: number | null = null, sx = 0, sy = 0;
const setTab = (next: "pages" | "settings") => {
  tabs.forEach((button) => button.setAttribute("aria-selected", String(button.dataset.mmTab === next)));
  tabbar.classList.toggle("settings", next === "settings");
  track.classList.toggle("settings", next === "settings");
};
function close() {
  if (!open) return;
  open = false;
  sheet.setAttribute("aria-hidden", "true");
  body.classList.remove("mobile-menu-open");
  lenis?.start();
  if (GL) GL.override = null;
  gsap.to(sheet.children, { opacity: 0, duration: reduce ? 0 : .18, onComplete: () => gsap.set(sheet.children, { clearProps: "opacity" }) });
  dock.focus();
}
function openSheet() {
  if (open || !isMobile()) return;
  open = true;
  setTab("pages");
  search.value = "";
  results.classList.remove("on");
  $("#mmPages").classList.remove("searching");
  sheet.setAttribute("aria-hidden", "false");
  body.classList.add("mobile-menu-open");
  lenis?.stop();
  const stage = $(".mm-gl-stage").getBoundingClientRect();
  if (GL) GL.override = { m: 0, u: (stage.left + stage.width / 2) / innerWidth, v: (stage.top + stage.height / 2) / innerHeight, s: (stage.width * 3.125 * .9) / innerHeight, dim: 1 };
  gsap.fromTo(sheet.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: reduce ? 0 : .7, ease: "expo.out", delay: .12, stagger: .025 });
  setTimeout(() => search.focus(), 250);
}
const toggle = () => open ? close() : openSheet();
dock.addEventListener("click", (event) => { if (!(event.target as HTMLElement).closest("#dirBtn")) toggle(); });
$("#menuBtn").addEventListener("click", (event) => { if (isMobile()) { event.stopPropagation(); toggle(); } });
dock.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); } });
scrim.addEventListener("click", close);
tabs.forEach((button) => button.addEventListener("click", () => setTab(button.dataset.mmTab as "pages" | "settings")));
search.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase(), pane = $("#mmPages");
  pane.classList.toggle("searching", !!query);
  if (!query) { results.classList.remove("on"); return; }
  const found = [...pages.map((item) => ({ n: item.title, k: "Page", u: item.href })), ...projects.map((item) => ({ n: item.title, k: "Project", u: "/work/" + item.slug })), ...essays.map((item) => ({ n: item.title, k: "Essay", u: "/journal/" + item.slug }))].filter((item) => item.n.toLowerCase().includes(query)).slice(0, 5);
  results.replaceChildren(...found.map((item) => { const li = document.createElement("li"), link = document.createElement("a"), name = document.createElement("span"), kind = document.createElement("small"); link.href = item.u; name.textContent = item.n; kind.textContent = item.k; link.append(name, kind); li.append(link); return li; }));
  results.classList.add("on");
});
sheet.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.closest("[data-mm-director]")) { event.preventDefault(); close(); Dock.setOpen(true); return; }
  const language = target.closest<HTMLElement>("[data-mm-lang]");
  if (language) { switchLang(language.dataset.mmLang as any); return; }
  const theme = target.closest<HTMLElement>("[data-mm-theme]");
  if (theme) { setTheme(theme.dataset.mmTheme as "dark" | "light" | "auto"); $$<HTMLElement>("[data-mm-theme]").forEach((button) => button.setAttribute("aria-pressed", String(button === theme))); return; }
  if (target.closest("[data-sound]")) { setSound(!soundOn); return; }
  const copy = target.closest<HTMLElement>("[data-mm-copy]");
  if (copy) { navigator.clipboard?.writeText(copy.dataset.mmCopy || ""); const label = copy.querySelector("span"); if (label) { label.textContent = "Copied"; setTimeout(() => label.textContent = "Copy", 1600); } }
});
sheet.addEventListener("pointerdown", (event) => { sx = event.clientX; sy = event.clientY; if (event.clientY - sheet.getBoundingClientRect().top < 60) dragY = event.clientY; });
sheet.addEventListener("pointermove", (event) => {
  const edge = (event.target as HTMLElement).closest<HTMLElement>(".mm-reel-card,.mm-live a");
  if (edge) { const r = edge.getBoundingClientRect(), angle = Math.atan2(event.clientY - r.top - r.height / 2, event.clientX - r.left - r.width / 2) * 180 / Math.PI + 90; edge.style.setProperty("--a", `${angle}deg`); }
  if (dragY !== null) sheet.style.transform = `translateY(${Math.max(0, event.clientY - dragY)}px)`;
});
sheet.addEventListener("pointerup", (event) => {
  if (dragY !== null) { const distance = event.clientY - dragY; dragY = null; sheet.style.transform = ""; if (distance > 110) close(); return; }
  const dx = event.clientX - sx, dy = event.clientY - sy;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4 && !(event.target as HTMLElement).closest(".mm-reel")) setTab(dx < 0 ? "settings" : "pages");
});
addEventListener("keydown", (event) => { if (event.key === "Escape" && open) close(); });
