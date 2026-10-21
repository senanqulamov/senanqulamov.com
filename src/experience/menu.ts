// The full-screen menu. The page recedes, titles flip in, and the chrome object becomes a lens over them.

import { books } from "@/data/books";
import { essays } from "@/data/essays";
import { pages } from "@/data/navigation";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { $, $$, body, esc, fonts, root, scramble } from "./dom";
import { gsap } from "./env";
import { GL, lenis, route, scene } from "./state";
import { tr } from "./i18n";
import { buzz } from "./ui";
import { SFX } from "./sound";
import { sectionOf, titleOf } from "./routes";
import { GLT } from "./transitions";
import { scrollTick } from "./scroll";
import { menuShapes, pageAccents } from "./gl/scenes";

const menuEl = $("#menu"),
  mList = $("#mList"),
  mPrev = $("#mPreview"),
  mBig = $("#mBig"),
  mBigT = $("#mBigT");
export let menuOpen = false,
  menuBusy = false;
let menuKb = false;
const menuTarget = () => ({
  m: 1,
  u: innerWidth < 980 ? 0.7 : 0.32,
  v: innerWidth < 980 ? 0.42 : 0.42,
  s: innerWidth < 980 ? 0.24 : 0.36,
  dim: 1,
});
function menuItemsIn() {
  const chars = $$(".mi-t .ch", mList);
  gsap.fromTo(
    chars,
    { yPercent: 130, rotate: 10, opacity: 0 },
    { yPercent: 0, rotate: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: { each: 0.009 } },
  );
  gsap.fromTo(
    $$(".m-list li", mList),
    { "--lw": "0%" },
    { "--lw": "100%", duration: 1.2, ease: "expo.inOut", stagger: 0.035 },
  );
  gsap.fromTo(
    $$(".mi-n,.mi-d", mList),
    { opacity: 0, x: -16 },
    { opacity: 1, x: 0, duration: 0.8, stagger: 0.025, delay: 0.2 },
  );
  gsap.fromTo(
    $$(".m-side > *"),
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.07, delay: 0.3 },
  );
}
export async function openMenu() {
  if (menuOpen || menuBusy || GLT.busy) return;
  menuBusy = true;
  menuOpen = true;
  $("#menuBtn").setAttribute("aria-expanded", String(true));
  lenis && lenis.stop();
  mPrev.textContent = tr(
    (pages.find((p) => p.key === (route ? sectionOf(route) : "home")) || pages[0]).description,
  );
  if (GLT.ok()) {
    const r = $("#menuBtn").getBoundingClientRect();
    await GLT.cover({
      x: (r.left + r.width / 2) / innerWidth,
      y: (r.top + r.height / 2) / innerHeight,
      shape: 1,
      spin: 1,
    });
  }
  if (GLT.ok()) {
    await GLT.emboss("Menu", 380);
    await gsap.to(GL, {
      melt: 1,
      duration: 0.45,
      ease: "power2.in",
      onComplete: () => {
        GL.emboss = 0;
        GL.melt = 0;
      },
    });
  }
  body.classList.add("menu-open", "menu-full");
  menuItemsIn();
  const t = menuTarget();
  if (GLT.ok()) {
    await GLT.reveal(t);
    GL.front(true);
    GL.bgA = 0;
    gsap.to(GL, { lens: 1, duration: 0.6 });
    setTimeout(drawMenu, 700);
  }
  GL && (GL.override = t);
  menuBusy = false;
  if (menuKb) mList.querySelector("a")?.focus({ preventScroll: true });
}
export function closeMenuInstant(keepGL?: boolean) {
  if (GL) GL.lens = 0;
  menuOpen = false;
  menuBusy = false;
  body.classList.remove("menu-open", "menu-full");
  $("#menuBtn").setAttribute("aria-expanded", String(false));
  mList.classList.remove("dim");
  mBig.classList.remove("on");
  $$(".m-list a.hot").forEach((a) => a.classList.remove("hot"));
  if (GL && !keepGL) GL.override = null;
  gsap.set($$(".mi-t .ch,.mi-n,.mi-d,.m-side > *", menuEl), { clearProps: "all" });
  lenis && lenis.start();
}
export async function closeMenu() {
  if (!menuOpen || menuBusy || GLT.busy) return;
  menuBusy = true;
  gsap.to($$(".mi-t .ch", mList), {
    yPercent: -120,
    opacity: 0,
    duration: 0.5,
    ease: "expo.in",
    stagger: { each: 0.004, from: "end" },
  });
  if (GLT.ok()) {
    GL.override = null;
    GL.lens = 0;
    await GLT.cover({ x: GL.st.u, y: GL.st.v, shape: 1, gather: false, spin: -1 });
  }
  closeMenuInstant(true);
  scrollTick(true);
  if (GLT.ok()) {
    await GLT.emboss(titleOf(route), 420);
    await gsap.to(GL, {
      melt: 1,
      duration: 0.45,
      ease: "power2.in",
      onComplete: () => {
        GL.emboss = 0;
        GL.melt = 0;
      },
    });
    await GLT.reveal({ m: scene.m, u: scene.u, v: scene.v, s: scene.s });
  }
  menuBusy = false;
}
$("#menuBtn").addEventListener("click", (e: MouseEvent) => {
  menuKb = e.detail === 0;
  buzz(10);
  menuOpen ? closeMenu() : openMenu();
});
export function drawMenu() {
  if (!GL || !menuOpen) return;
  const fg = getComputedStyle(root).getPropertyValue("--fg").trim() || "#ECEBF2",
    ice = getComputedStyle(root).getPropertyValue("--ice").trim() || "#A8E0FF";
  const dim = mList.classList.contains("dim");
  GL.setMenuTex((x) => {
    $$(".m-list a", mList).forEach((a) => {
      const t = $(".mi-t", a),
        r = t.getBoundingClientRect(),
        cs = getComputedStyle(t),
        fs = parseFloat(cs.fontSize);
      x.font = `500 ${fs}px ${fonts.display()}`;
      try {
        x.letterSpacing = -fs * 0.045 + "px";
      } catch (e) {}
      x.textBaseline = "middle";
      x.globalAlpha = dim && !a.classList.contains("hot") ? 0.22 : 1;
      x.fillStyle = a.classList.contains("hot") || a.classList.contains("cur-page") ? ice : fg;
      x.fillText(t.getAttribute("aria-label") || t.textContent, r.left, r.top + r.height * 0.52);
      const n = $(".mi-n", a),
        nr = n.getBoundingClientRect();
      x.font = `400 12px ${fonts.text()}`;
      try {
        x.letterSpacing = "0px";
      } catch (e) {}
      x.globalAlpha = 0.6;
      x.fillStyle = fg;
      x.fillText(n.firstChild ? n.firstChild.textContent : "", nr.left, nr.top + nr.height / 2);
    });
    x.globalAlpha = 1;
  });
}
function hotItem(a: HTMLElement) {
  if (!a) return;
  const p = pages.find((x) => x.key === a.dataset.k);
  $$(".m-list a").forEach((x) => x.classList.toggle("hot", x === a));
  mList.classList.add("dim");
  mBigT.innerHTML = `<span>${esc(tr(p.title))}</span>`.repeat(6);
  mBig.classList.add("on");
  if (GL && GL.override && !menuBusy) {
    GL.override.m = menuShapes[p.key];
    GL.st.burst = 0.2;
  }
  scramble(mPrev, tr(p.description), 450);
  drawMenu();
  SFX.glass(pages.indexOf(p));
}
mList.addEventListener("pointerover", (e) => {
  const a = (e.target as HTMLElement).closest<HTMLElement>("a");
  if (a && !a.classList.contains("hot")) hotItem(a);
});
mList.addEventListener("pointerleave", () => {
  setTimeout(drawMenu, 30);
  mList.classList.remove("dim");
  mBig.classList.remove("on");
  $$(".m-list a.hot").forEach((a) => a.classList.remove("hot"));
});
mList.addEventListener("focusin", (e) => hotItem((e.target as HTMLElement).closest<HTMLElement>("a")));

export function cardVis(k: string) {
  const typ = (list) => `<div class="v-type">${list.map((t) => `<span>${esc(t)}</span>`).join("")}</div>`;
  const inner =
    {
      home: `<img class="v-img" src="${profile.portrait}" alt="">`,
      work: `<div class="v-grid">${projects
        .slice(0, 6)
        .map((p) => `<img src="${p.cover}" alt="">`)
        .join("")}</div>`,
      journal: typ(essays.map((b) => b.title)),
      post: typ(essays.map((b) => b.title)),
      services: typ(services.map((s) => s.title)),
      start: typ([
        "Website",
        "Web app",
        "Marketplace",
        "Admin panel",
        "Backend and APIs",
        "Security review",
        "Tech lead",
      ]),
      credits: `<img class="v-img v-mono" src="${profile.portrait}" alt="">`,
      ask: `<div class="v-chat"><i>What have you built?</i><i>Twenty-two products so far.</i><i>How much does a web app cost?</i><i>From AZN 4,500.</i></div>`,
      library: `<div class="v-books">${books.map((b, i) => `<i style="background:${b.color};height:${55 + ((i * 37) % 40)}%"></i>`).join("")}</div>`,
      lab: `<div class="v-lab"></div>`,
      press: `<img class="v-img v-duo" src="${profile.portrait}" alt="">`,
      contact: `<div class="v-mail">qulamovsenan<br>@gmail.com</div>`,
      notfound: `<div class="v-mail">404</div>`,
    }[k] || "";
  return `<div class="vis" style="--acc:${pageAccents[k] || "#A8E0FF"}">${inner}</div>`;
}
