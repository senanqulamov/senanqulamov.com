// Phone menu: the dock grows into a sheet (ported from design/mobile-prototype.html).
// Desktop keeps its own menu (menu.ts); everything here returns early above 820px.

import { essays } from "@/data/essays";
import { pages } from "@/data/navigation";
import { projects } from "@/data/projects";
import { $, $$, body, root } from "./dom";
import { gsap, isMobile, reduce } from "./env";
import { tr } from "./i18n";
import { switchLang } from "./language";
import { setSound, soundOn } from "./sound";
import { GL, lenis } from "./state";
import { Dock } from "./director/dock";
import { setTheme, type ThemeMode } from "./theme";

const sheet = $("#mobileMenu");
const scrim = $("#mmScrim");
const dock = $(".mobile-dock");
const search = $<HTMLInputElement>("#mmSearch");
const results = $("#mmResults");
const track = $("#mmTrack");
const viewport = $("#mmViewport");
const tabbar = $(".mm-tabs");
const orb = $<HTMLCanvasElement>("#mmOrb");
const WAVE = "M0 24 Q25 4 50 24 T100 24 T150 24 T200 24 T250 24 T300 24 T350 24 T400 24";
const FLAT = "M0 24 Q25 24 50 24 T100 24 T150 24 T200 24 T250 24 T300 24 T350 24 T400 24";
const D = (s: number) => (reduce ? 0 : s);
let open = false;
let busy = false;

/* ---------- geometry: the sheet starts as the dock's exact outline ---------- */
function dockBox() {
  const r = dock.getBoundingClientRect();
  return {
    left: r.left,
    right: innerWidth - r.right,
    bottom: innerHeight - r.bottom,
    height: r.height,
    borderRadius: `${r.height / 2}px`,
  };
}
function sheetBox() {
  const side = Math.max(0, (innerWidth - 520) / 2);
  gsap.set(sheet, { left: side, right: side, bottom: 0, height: "auto", borderRadius: "30px 30px 0 0" });
  return { left: side, right: side, bottom: 0, height: sheet.offsetHeight, borderRadius: "30px 30px 0 0" };
}

/* ---------- the live chrome blob in the header ---------- */
// The 3D layer sits under the sheet, so the blob is rendered at the header's position
// and copied into a small canvas there after every frame.
const octx = orb?.getContext("2d");
function blobToHeader(on: boolean) {
  if (!GL) return;
  if (!on) {
    GL.override = null;
    GL.afterRender = null;
    return;
  }
  const place = () => {
    const r = orb.getBoundingClientRect();
    GL.override = {
      m: 0,
      u: (r.left + r.width / 2) / innerWidth,
      v: (r.top + r.height / 2) / innerHeight,
      s: (r.width * 0.78 * 3.125) / innerHeight,
      dim: 1,
    };
    return r;
  };
  place();
  GL.afterRender = (gl: HTMLCanvasElement) => {
    if (!octx) return;
    const r = place();
    const k = gl.width / innerWidth;
    octx.clearRect(0, 0, orb.width, orb.height);
    octx.drawImage(gl, r.left * k, r.top * k, r.width * k, r.height * k, 0, 0, orb.width, orb.height);
  };
}

/* ---------- open / close ---------- */
function markCurrent() {
  const path = location.pathname.replace(/\/$/, "") || "/";
  $$<HTMLAnchorElement>(".mm-chips a, .mm-row", sheet).forEach((a) => {
    const href = a.getAttribute("href") || "";
    a.classList.toggle("current", href === path || (href !== "/" && path.startsWith(href)));
  });
}
function openMenu() {
  if (open || busy || !isMobile()) return;
  open = busy = true;
  gsap.set(sheet, { display: "flex", overflowY: "hidden" });
  setTab("pages", true);
  search.value = "";
  runSearch("");
  markCurrent();
  syncSettings();
  sheet.setAttribute("aria-hidden", "false");
  body.classList.add("mobile-menu-open", "mm-merged");
  lenis?.stop();
  gsap.set(sheet.children, { opacity: 1 });
  const to = sheetBox();
  const from = dockBox();
  gsap.fromTo(sheet, from, {
    ...to,
    duration: D(0.8),
    ease: "expo.out",
    onComplete: () => {
      gsap.set(sheet, { height: "auto", overflowY: "auto" });
      busy = false;
    },
  });
  gsap.to("#view", {
    scale: 0.93,
    opacity: 0.55,
    transformOrigin: "50% 0%",
    duration: D(0.7),
    ease: "expo.out",
  });
  gsap.to(scrim, { opacity: 1, duration: D(0.5) });
  gsap.fromTo(
    $$(".mm-top > *", sheet),
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: D(0.7), ease: "expo.out", delay: D(0.12) },
  );
  gsap.fromTo(
    $$(".mm-card, .mm-row, .mm-chips a", sheet),
    { y: 26, opacity: 0, scale: 0.96 },
    { y: 0, opacity: 1, scale: 1, duration: D(0.6), ease: "expo.out", stagger: 0.025, delay: D(0.18) },
  );
  requestAnimationFrame(() => blobToHeader(true));
  dock.setAttribute("aria-expanded", "true");
}
function closeMenu() {
  if (!open || busy) return;
  busy = true;
  blobToHeader(false);
  gsap.set(sheet, { overflowY: "hidden" });
  gsap.to(sheet.children, { opacity: 0, duration: D(0.18) });
  gsap.fromTo(
    sheet,
    { height: sheet.offsetHeight },
    {
      ...dockBox(),
      duration: D(0.55),
      ease: "expo.inOut",
      delay: D(0.08),
      onComplete: () => {
        gsap.set(sheet, { display: "none" });
        body.classList.remove("mobile-menu-open", "mm-merged");
        sheet.setAttribute("aria-hidden", "true");
        open = busy = false;
      },
    },
  );
  gsap.to("#view", {
    scale: 1,
    opacity: 1,
    duration: D(0.55),
    ease: "expo.out",
    clearProps: "transform,opacity",
  });
  gsap.to(scrim, { opacity: 0, duration: D(0.35) });
  lenis?.start();
  dock.setAttribute("aria-expanded", "false");
  dock.focus({ preventScroll: true });
}
export const MobileMenu = { open: openMenu, close: closeMenu, isOpen: () => open };

/* ---------- the whole dock toggles the menu; only the orb opens the Director ---------- */
function press(el: Element) {
  el.classList.add("press");
  const up = () => {
    el.classList.remove("press");
    removeEventListener("pointerup", up);
    removeEventListener("pointercancel", up);
  };
  addEventListener("pointerup", up);
  addEventListener("pointercancel", up);
}
dock?.addEventListener("pointerdown", () => press(dock));
$("#dirBtn")?.addEventListener("pointerdown", (e) => isMobile() && press(e.currentTarget as Element));
dock?.addEventListener("click", () => (open ? closeMenu() : openMenu()));
dock?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    open ? closeMenu() : openMenu();
  }
});
$("#menuBtn")?.addEventListener(
  "click",
  (e) => {
    if (!isMobile()) return;
    e.stopImmediatePropagation();
    open ? closeMenu() : openMenu();
  },
  true,
);
scrim?.addEventListener("click", closeMenu);
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && open) closeMenu();
});
addEventListener("resize", () => {
  if (open && !isMobile()) closeMenu();
});

/* ---------- tabs and swipe ---------- */
function setTab(t: "pages" | "settings", instant = false) {
  const set = t === "settings";
  tabbar.classList.toggle("settings", set);
  $$<HTMLButtonElement>("[data-mm-tab]", tabbar).forEach((b) =>
    b.setAttribute("aria-selected", String(b.dataset.mmTab === t)),
  );
  gsap.to(track, { xPercent: set ? -50 : 0, duration: instant ? 0 : D(0.55), ease: "expo.out" });
  const pane = $(`[data-mm-pane="${t}"]`, sheet);
  viewport.style.height = `${pane.offsetHeight}px`;
  if (set && !instant)
    gsap.fromTo(
      $$(".mm-look, .mm-lang, .mm-snd, .mm-mot, .mm-about, .mm-contacts, .mm-label", pane),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: D(0.5), ease: "expo.out", stagger: 0.03, delay: D(0.1) },
    );
}
$$<HTMLButtonElement>("[data-mm-tab]", tabbar).forEach((b) =>
  b.addEventListener("click", () => setTab(b.dataset.mmTab as "pages" | "settings")),
);
let sx: number | null = null;
let sy = 0;
viewport?.addEventListener("pointerdown", (e) => {
  if (!(e.target as HTMLElement).closest(".mm-reel")) {
    sx = e.clientX;
    sy = e.clientY;
  }
});
addEventListener("pointerup", (e) => {
  if (sx === null) return;
  const dx = e.clientX - sx;
  const dy = e.clientY - sy;
  sx = null;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) setTab(dx < 0 ? "settings" : "pages");
});

/* ---------- drag the sheet down to close ---------- */
let dragY: number | null = null;
sheet?.addEventListener("pointerdown", (e) => {
  if (e.clientY - sheet.getBoundingClientRect().top < 60) dragY = e.clientY;
});
addEventListener("pointermove", (e) => {
  if (dragY !== null && open && !busy) gsap.set(sheet, { y: Math.max(0, e.clientY - dragY) });
});
addEventListener("pointerup", (e) => {
  if (dragY === null) return;
  const d = e.clientY - dragY;
  dragY = null;
  gsap.set(sheet, { y: 0 });
  if (d > 110) closeMenu();
});

/* ---------- chrome edge follows the finger ---------- */
sheet?.addEventListener(
  "pointermove",
  (e) => {
    $$<HTMLElement>(".mm-edge", sheet).forEach((el) => {
      const r = el.getBoundingClientRect();
      const a =
        (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI +
        90;
      el.style.setProperty("--a", `${a}deg`);
    });
  },
  { passive: true },
);

/* ---------- search ---------- */
const index = [
  ...pages.map((p) => ({ n: tr(p.title), k: tr("Page"), u: p.href })),
  ...projects.map((p) => ({ n: p.title, k: tr("Project"), u: `/work/${p.slug}` })),
  ...essays.map((p) => ({ n: tr(p.title), k: tr("Essay"), u: `/journal/${p.slug}` })),
];
function runSearch(raw: string) {
  const q = raw.trim().toLowerCase();
  sheet.classList.toggle("searching", !!q);
  const hits = q ? index.filter((x) => x.n.toLowerCase().includes(q)).slice(0, 6) : [];
  results.hidden = !hits.length;
  results.replaceChildren(
    ...hits.map((h) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = h.u;
      const n = document.createElement("span");
      n.textContent = h.n;
      const k = document.createElement("small");
      k.textContent = h.k;
      a.append(n, k);
      li.append(a);
      return li;
    }),
  );
}
search?.addEventListener("input", () => runSearch(search.value));

/* ---------- settings ---------- */
function syncSettings() {
  const mode = (localStorage.getItem("sq-theme") as ThemeMode) || "auto";
  $$<HTMLElement>("[data-mm-theme]", sheet).forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.mmTheme === mode)),
  );
  const lang = root.lang || "en";
  $$<HTMLElement>("[data-mm-lang]", sheet).forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.mmLang === lang)),
  );
  const snd = $("#mmSound");
  snd.classList.toggle("on", soundOn);
  snd.setAttribute("aria-pressed", String(soundOn));
  $("small", snd).textContent = tr(soundOn ? "On" : "Off");
  $("path", snd).setAttribute("d", soundOn ? WAVE : FLAT);
  const calm = localStorage.getItem("sq-reduce") === "1";
  const mot = $("#mmMotion");
  mot.classList.toggle("calm", calm);
  mot.setAttribute("aria-pressed", String(!calm));
  $("small", mot).textContent = tr(calm ? "Calm" : "Full");
}
sheet?.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;
  if (t.closest("[data-mm-director]")) {
    e.preventDefault();
    closeMenu();
    setTimeout(() => Dock.setOpen(true), D(0.5) * 1000);
    return;
  }
  const look = t.closest<HTMLElement>("[data-mm-theme]");
  if (look) {
    setTheme(look.dataset.mmTheme as ThemeMode);
    syncSettings();
    return;
  }
  const lang = t.closest<HTMLElement>("[data-mm-lang]");
  if (lang) {
    $$<HTMLElement>("[data-mm-lang]", sheet).forEach((b) =>
      b.setAttribute("aria-pressed", String(b === lang)),
    );
    closeMenu();
    switchLang(lang.dataset.mmLang as Parameters<typeof switchLang>[0]);
    return;
  }
  if (t.closest("#mmSound")) {
    setSound(!soundOn);
    syncSettings();
    return;
  }
  if (t.closest("#mmMotion")) {
    // Motion changes how the whole site renders, so the page reloads after the blob shows the new speed.
    const calm = localStorage.getItem("sq-reduce") !== "1";
    const mot = $("#mmMotion");
    mot.classList.toggle("calm", calm);
    $("small", mot).textContent = tr(calm ? "Calm" : "Full");
    localStorage.setItem("sq-reduce", calm ? "1" : "0");
    setTimeout(() => location.reload(), 900);
    return;
  }
  const copy = t.closest<HTMLElement>("[data-mm-copy]");
  if (copy) {
    navigator.clipboard?.writeText(copy.dataset.mmCopy || "").catch(() => {});
    const label = $("small", copy);
    label.textContent = tr("Copied");
    setTimeout(() => (label.textContent = tr("Copy")), 1600);
    return;
  }
  // any other link inside the sheet: close first, then the router takes over
  if (t.closest("a[href]")) closeMenu();
});
