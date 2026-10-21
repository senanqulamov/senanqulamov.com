// Accessibility helpers, small easter eggs and a little prefetching.

import { projects } from "@/data/projects";
import { $, $$, body } from "./dom";
import { gsap } from "./env";
import { tr } from "./i18n";
import { Loader } from "./loader";
import { menuOpen } from "./menu";
import { tintOf } from "./routes";
import { SFX, soundOn } from "./sound";
import { GL, lenis, route } from "./state";
import { GLT } from "./transitions";
import { toast } from "./ui";

export function announce(text: string) {
  const el = $("#announce");
  if (!el) return;
  el.textContent = "";
  setTimeout(() => (el.textContent = text), 40);
}

/** Moves keyboard focus to the new page's heading after a page change. */
export function focusHeading() {
  const h = $("#view h1");
  if (!h) return;
  h.setAttribute("tabindex", "-1");
  h.focus({ preventScroll: true });
}

$(".skip")?.addEventListener("click", (e) => {
  e.preventDefault();
  const target = $("#view h1") || $("#view");
  target.setAttribute("tabindex", "-1");
  target.focus();
});

const effectsReduced = localStorage.getItem("sq-reduce") === "1";
const fxButton = $("#fxBtn");
if (fxButton) {
  fxButton.setAttribute("aria-pressed", String(effectsReduced));
  fxButton.textContent = tr(effectsReduced ? "Full effects" : "Reduce effects");
  fxButton.addEventListener("click", () => {
    localStorage.setItem("sq-reduce", effectsReduced ? "0" : "1");
    location.reload();
  });
}

// Keep keyboard focus inside the menu while it is open.
addEventListener("keydown", (e) => {
  if (e.key !== "Tab" || !menuOpen) return;
  const focusable = [$("#menuBtn"), ...$$("#menu a, #menu button")].filter((x) => x.offsetParent !== null);
  if (!focusable.length) return;
  const i = focusable.indexOf(document.activeElement as HTMLElement);
  if (e.shiftKey && i <= 0) {
    e.preventDefault();
    focusable[focusable.length - 1].focus();
  } else if (!e.shiftKey && i === focusable.length - 1) {
    e.preventDefault();
    focusable[0].focus();
  }
});

// Easter eggs: the Konami code, typing "calm", and stars after 22:00 in Baku.
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
let keys: string[] = [];
let calm = false;
let breathButton: HTMLButtonElement | null = null;
let breathTimer = 0;

addEventListener("keydown", (e) => {
  if (/input|textarea|select/i.test(document.activeElement.tagName)) return;
  keys = [...keys, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-10);
  if (keys.join(",") === KONAMI.join(",")) {
    keys = [];
    liquidMode();
  }
  if (
    keys
      .filter((k) => k.length === 1)
      .join("")
      .slice(-4) === "calm"
  ) {
    keys = [];
    therapistMode(!calm);
  }
});

function liquidMode() {
  if (!GL) return;
  toast("Liquid mode unlocked.");
  SFX.chord();
  let n = 0;
  const timer = setInterval(() => {
    GL.st.burst = 1;
    GL.pulse = 0.8;
    GL.splash(Math.random(), Math.random());
    SFX.drop(0.5 + Math.random());
    if (++n > 26) clearInterval(timer);
  }, 320);
}

function therapistMode(on: boolean) {
  calm = on;
  body.classList.toggle("calm", on);
  gsap.globalTimeline.timeScale(on ? 0.6 : 1);
  if (lenis) lenis.options.lerp = on ? 0.04 : 0.085;
  GL?.setTint(on ? "#7fa6c9" : route?.k === "project" ? tintOf(route.p) : null);
  if (!on) {
    toast("Therapist mode off.");
    clearInterval(breathTimer);
    breathButton?.remove();
    breathButton = null;
    return;
  }
  toast("Therapist mode. Breathe in, breathe out.");
  const button = document.createElement("button");
  button.className = "breath";
  button.setAttribute("aria-label", String(tr("Leave therapist mode")));
  button.innerHTML = `<i></i><span>${tr("Breathe in")}</span>`;
  button.addEventListener("click", () => therapistMode(false));
  document.body.appendChild(button);
  breathButton = button;
  let inhale = true;
  breathTimer = window.setInterval(() => {
    inhale = !inhale;
    button.querySelector("span").textContent = tr(inhale ? "Breathe in" : "Breathe out");
    if (soundOn) SFX.tone(inhale ? 196 : 146.8, { type: "sine", a: 1.2, d: 2.6, peak: 0.03 });
    if (GL) GL.pulse = inhale ? 0.5 : 0;
  }, 4000);
}

function nightCheck() {
  const hour = +new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Baku",
    hour: "2-digit",
    hour12: false,
  }).format(new Date());
  const night = hour >= 22 || hour < 6;
  if (GL) GL.stars = night;
  if (night && !body.classList.contains("night")) {
    body.classList.add("night");
    if (!sessionStorage.getItem("sq-night")) {
      setTimeout(() => toast("It's late in Baku. Night mode is on."), 9000);
      sessionStorage.setItem("sq-night", "1");
    }
  }
  if (!night) body.classList.remove("night");
}

export function startExtras() {
  nightCheck();
  setInterval(nightCheck, 60000);
  console.log(
    "%cSenan Qulamov",
    "font:700 28px sans-serif;color:#B9A7FF",
    '\nYou opened the console, so you are my kind of person.\nTry the Konami code, type "calm", or "48".\nHiring or building something? qulamovsenan@gmail.com',
  );
}

// Load a project's first screens as soon as someone hovers its link.
const prefetched = new Set<string>();
document.addEventListener(
  "pointerover",
  (e) => {
    const link = (e.target as HTMLElement).closest?.('a[href^="/work/"]');
    if (!link) return;
    const slug = link.getAttribute("href").split("/")[2];
    if (prefetched.has(slug)) return;
    prefetched.add(slug);
    const project = projects.find((p) => p.slug === slug);
    if (!project) return;
    [project.cover, ...project.images.slice(1, 3)].filter(Boolean).forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  },
  { passive: true },
);

// When nobody has touched anything for a while, the WebGL layer renders at half rate.
let lastActivity = performance.now();
for (const event of ["pointermove", "wheel", "keydown", "touchstart", "scroll"]) {
  addEventListener(event, () => (lastActivity = performance.now()), { passive: true });
}

export const gpuIdle = () =>
  performance.now() - lastActivity > 5000 &&
  !GLT.busy &&
  !menuOpen &&
  Loader.entered &&
  !(lenis && Math.abs(lenis.velocity || 0) > 0.1);
