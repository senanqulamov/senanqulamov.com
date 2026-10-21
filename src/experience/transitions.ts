// Every page change is performed by the chrome object: it gathers where you clicked, swallows the screen, presses the next title into its surface, then settles on the new page. Projects open with their cover growing from the row you clicked.

import type { Project } from "@/data/projects";
import type { Route } from "./routes";
import type { Rect } from "./state";
import { projectTypeLabel, projects } from "@/data/projects";
import { $, $$, charSpans, esc, lerp, pad2, wait } from "./dom";
import { gsap, isMobile, reduce } from "./env";
import { GL, lastPointer, route, scene } from "./state";
import { tr } from "./i18n";
import { blip, SFX } from "./sound";
import { numberOf, titleOf } from "./routes";
import { introPage, scrollTick } from "./scroll";
import { closeMenuInstant } from "./menu";
import { transitions } from "./gl/scenes";

export let transitioning = false;
export const setTransitioning = (v: boolean) => {
  transitioning = v;
};

export const GLT = (() => {
  const label = $("#curtainLabel"),
    tl_ = label.querySelector(".cl-t"),
    tf = label.querySelector(".cl-from"),
    tt = label.querySelector(".cl-to"),
    tline = label.querySelector(".cl-line b");
  let busy = false;
  const ok = () => !!(GL && !reduce);
  function labelIn(title: string, from: string, to: string) {
    tf.textContent = from || "";
    tt.textContent = to || "";
    tl_.innerHTML = [...title]
      .map((c) => `<span class="ch">${c === " " ? "&nbsp;" : esc(c)}</span>`)
      .join("");
    gsap.set(label, { opacity: 1 });
    gsap.fromTo(
      tl_.children,
      { yPercent: 120, rotateX: -80, opacity: 0 },
      { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.025 },
    );
    gsap.fromTo(label.querySelector(".cl-route"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
    gsap.fromTo(tline, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "expo.inOut" });
  }
  function labelOut() {
    gsap.to(tl_.children, { yPercent: -120, opacity: 0, duration: 0.45, ease: "expo.in", stagger: 0.01 });
    gsap.to(label.querySelector(".cl-route"), {
      opacity: 0,
      duration: 0.3,
      onComplete: () => gsap.set(label, { opacity: 0 }),
    });
  }
  // 1) gather into a droplet at (x,y), 2) swell from there until it swallows the screen
  async function cover({
    x,
    y,
    shape = 0,
    gather = true,
    spin = 0,
  }: {
    x: number;
    y: number;
    shape?: number;
    gather?: boolean;
    spin?: number;
  }) {
    const st = GL.st;
    const d = { m: st.morph, u: st.u, v: st.v, s: st.s, dim: 1 };
    GL.drive = d;
    GL.front(true);
    GL.bgA = 0;
    GL.cover = 0;
    GL.override = null;
    const tl = gsap.timeline();
    let t = 0;
    const sp = isMobile() ? 0.75 : 1;
    if (gather) {
      tl.to(d, { u: x, v: y, s: 0.16, duration: 0.6 * sp, ease: "expo.inOut" }, 0).to(
        d,
        { m: shape, duration: 0.6 * sp, ease: "power2.inOut" },
        0,
      );
      t = 0.55 * sp;
      SFX.whoosh();
      tl.add(() => {
        GL.splash(x, y);
        SFX.drop(1.2);
      }, t - 0.05);
    } else tl.to(d, { m: shape, duration: 0.5, ease: "power2.inOut" }, 0);
    tl.add(() => {
      GL.burst();
      SFX.swell(0.95 * sp);
    }, t)
      .to(d, { u: 0.5, v: 0.5, duration: 0.85 * sp, ease: "expo.in" }, t)
      .to(d, { s: 3.6, duration: 0.95 * sp, ease: "expo.in" }, t)
      .to(GL, { cover: 1, duration: 0.3, ease: "none" }, t + 0.75 * sp);
    if (spin) tl.to(GL.st, { tiltX: "+=" + spin, duration: 1.2, ease: "expo.inOut" }, 0);
    await tl;
  }
  // shrink from full-screen chrome into the object's new home, morphing on the way
  async function reveal(target: { m: number; u: number; v: number; s: number }) {
    const d = GL.drive;
    const tl = gsap.timeline();
    const sp = isMobile() ? 0.8 : 1;
    tl.add(() => SFX.thud(), 0.9 * sp);
    tl.to(GL, { cover: 0, duration: 0.25, ease: "none" }, 0)
      .to(d, { s: target.s, duration: 1.25 * sp, ease: "expo.out" }, 0.05)
      .to(d, { u: target.u, v: target.v, duration: 1.25 * sp, ease: "expo.out" }, 0.05)
      .to(d, { m: target.m, duration: 1.1 * sp, ease: "power3.inOut" }, 0.15);
    await tl;
    GL.front(false);
    GL.drive = null;
  }
  async function emboss(t: string, hold = 720) {
    GL.setTitle(t);
    GL.melt = 0;
    SFX.chord();
    await gsap.fromTo(GL, { emboss: 0 }, { emboss: 1, duration: 0.55, ease: "power2.out" });
    await wait(isMobile() ? hold * 0.7 : hold);
    SFX.melt();
  }
  async function page(r: Route, commit: () => Promise<void>, { fromMenu = false } = {}) {
    if (!ok()) {
      if (fromMenu) closeMenuInstant();
      await commit();
      introPage();
      return;
    }
    busy = true;
    transitioning = true;
    const cfg = transitions[r.k] || transitions.home,
      x = fromMenu ? GL.st.u : lastPointer.x,
      y = fromMenu ? GL.st.v : lastPointer.y;
    await cover({ x, y, shape: cfg.cover, gather: !fromMenu, spin: cfg.spin });
    labelIn(titleOf(r), route ? numberOf(route) + " " + titleOf(route) : "", numberOf(r) + " " + titleOf(r));
    if (fromMenu) closeMenuInstant(true);
    await commit();
    scrollTick(true);
    await emboss(titleOf(r));
    labelOut();
    setTimeout(introPage, 300);
    await gsap.to(GL, { melt: 0.55, duration: 0.35, ease: "power2.in" });
    gsap.to(GL, {
      melt: 1,
      duration: 0.35,
      ease: "power1.out",
      onComplete: () => {
        GL.emboss = 0;
        GL.melt = 0;
      },
    });
    await reveal({ m: scene.m, u: scene.u, v: scene.v, s: scene.s });
    busy = false;
    transitioning = false;
  }
  return {
    cover,
    reveal,
    page,
    emboss,
    get busy() {
      return busy;
    },
    set busy(v) {
      busy = v;
    },
    ok,
  };
})();

export const ProjectLoader = (() => {
  const el = $("#pload"),
    bg = $("#plBg"),
    im = $<HTMLImageElement>("#plImg"),
    T_ = $("#plT"),
    N = $("#plN"),
    bar = $("#plBar");
  const load = (u: string) =>
    new Promise<void>((r) => {
      if (!u) return r();
      const i = new Image();
      i.onload = i.onerror = () => r();
      i.src = u;
    });
  async function run(p: Project, index: number, rect: Rect | null, onCovered: () => Promise<void>) {
    if (reduce) {
      await onCovered();
      return;
    }
    const r = rect || {
      l: innerWidth * 0.3,
      t: innerHeight * 0.3,
      w: innerWidth * 0.4,
      h: innerHeight * 0.4,
      r: 18,
    };
    const ins = `inset(${r.t}px ${innerWidth - r.l - r.w}px ${innerHeight - r.t - r.h}px ${r.l}px round ${r.r ?? 18}px)`;
    bg.style.background = `linear-gradient(140deg,${p.colors[0]},${p.colors[1]})`;
    im.src = p.cover || "";
    im.alt = "";
    im.style.display = "";
    $("#plVis").innerHTML = "";
    $("#pload .pl-top span:last-child").textContent = tr("Loading the case study");
    $("#pload").classList.remove("lightcard");
    T_.innerHTML = charSpans(p.title);
    $("#plSub").textContent = p.subtitle;
    $("#plMeta").textContent = `${pad2(index + 1)} / ${projects.length}, ${p.client}`;
    $("#plC").textContent = p.year + ", " + tr(projectTypeLabel[p.type]);
    el.classList.add("on");
    el.style.opacity = "1";
    blip(420, 0.6);
    GL && GL.burst();
    const prog = { v: 0 };
    const urls = [p.cover, ...p.images.slice(1, 4)].filter(Boolean);
    let loaded = 0;
    const all = Promise.all(
      urls.map((u) =>
        load(u).then(() => {
          loaded++;
        }),
      ),
    );
    const tl = gsap.timeline();
    tl.fromTo(
      bg,
      { clipPath: ins },
      { clipPath: "inset(0px 0px 0px 0px round 0px)", duration: 1.1, ease: "expo.inOut" },
    )
      .fromTo(
        im,
        { opacity: 0, scale: 1.35 },
        { opacity: 1, scale: 1.05, duration: 1.4, ease: "expo.out" },
        0.5,
      )
      .fromTo(
        $$(".ch", T_),
        { yPercent: 120, rotate: 6 },
        { yPercent: 0, rotate: 0, duration: 1, ease: "expo.out", stagger: 0.03 },
        0.6,
      )
      .fromTo(
        [$(".pl-top", el), $("#plSub"), $(".pl-bot", el)],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
        0.75,
      );
    const t0 = performance.now();
    await new Promise<void>((res) => {
      const step = () => {
        const real = loaded / urls.length,
          time = Math.min(1, (performance.now() - t0) / 1800);
        prog.v = lerp(prog.v, Math.min(real, time), 0.12);
        if (real >= 1 && time >= 1) prog.v = Math.max(prog.v, 0.999);
        N.textContent = String(Math.round(prog.v * 100)).padStart(3, "0");
        bar.style.transform = `scaleX(${prog.v})`;
        if (prog.v >= 0.995 || performance.now() - t0 > 6000) res();
        else requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      all.then(() => {});
    });
    N.textContent = "100";
    bar.style.transform = "scaleX(1)";
    await onCovered();
    await wait(150);
    setTimeout(introPage, 500);
    const out = gsap.timeline();
    out
      .to($$(".ch", T_), { yPercent: -120, duration: 0.6, ease: "expo.in", stagger: 0.015 }, 0)
      .to(
        [$(".pl-top", el), $("#plSub"), $(".pl-bot", el), bar.parentElement],
        { opacity: 0, duration: 0.4 },
        0,
      )
      .to(el, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, 0.45);
    await out;
    el.classList.remove("on");
    gsap.set([$(".pl-top", el), $("#plSub"), $(".pl-bot", el), bar.parentElement], { clearProps: "opacity" });
  }
  return { run };
})();
