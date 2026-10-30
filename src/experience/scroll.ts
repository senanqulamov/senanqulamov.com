// Scroll choreography. Elements rise, un-blur and split into characters as they enter, every effect is scrubbed so it plays backwards too, and the chrome object glides between positions set per section.

import { $, $$, body, clamp, lerp, root, smoothstep } from "./dom";
import { gsap, isMobile, reduce, ScrollTrigger, SplitText } from "./env";
import { GL, lenis, mouse, page, route, scene } from "./state";
import { tr } from "./i18n";
import { titleOf } from "./routes";
import { GLT } from "./transitions";
import { menuOpen } from "./menu";
import { keptOnMobile, scenes } from "./gl/scenes";
import { DIRECTOR_SHAPE } from "./gl/spirit";
import { hdr } from "./header";
import { lostDrops } from "./pages/notfound";

export const intro: (() => void)[] = [];
let refreshQueued = false;

export function cacheScrollLayout() {
  if (!page) return;
  const elements = new Set<HTMLElement>([
    ...page.sections,
    ...page.stacks,
    ...["#hero", "[data-s='contact']", "#faceSlot"]
      .map((selector) => $(selector, $("#view")))
      .filter(Boolean),
  ]);
  const metrics = new Map<HTMLElement, { top: number; height: number; bottom: number }>();
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const top = rect.top + scrollY;
    const height = rect.height;
    metrics.set(el, { top, height, bottom: top + height });
  });
  page.metrics = metrics;
}

export function queueScrollRefresh() {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    cacheScrollLayout();
    ScrollTrigger.refresh();
  });
}
function inFold(el: Element) {
  const r = el.getBoundingClientRect();
  return r.top < innerHeight * 0.92;
}
export function anim(
  el: gsap.TweenTarget,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  opts: {
    trigger?: Element;
    start?: string;
    end?: string;
    scrub?: number | boolean;
    stagger?: number;
    delay?: number;
    dur?: number;
    always?: boolean;
  } = {},
) {
  if (reduce) {
    return;
  }
  const st = {
    trigger: opts.trigger || el,
    start: opts.start || "top 96%",
    end: opts.end || "top 62%",
    scrub: opts.scrub ?? 0.8,
  };
  if (inFold((opts.trigger || el) as Element) && !opts.always) {
    gsap.set(el, from);
    intro.push(() =>
      gsap.to(
        el,
        Object.assign({}, to, {
          duration: opts.dur || 1.3,
          ease: "expo.out",
          stagger: opts.stagger ? opts.stagger * 1.5 : 0,
          delay: opts.delay || 0,
        }),
      ),
    );
    return;
  }
  gsap.fromTo(
    el,
    from,
    Object.assign({}, to, { ease: "none", stagger: opts.stagger || 0, scrollTrigger: st }),
  );
}
export function introPage() {
  const list = intro.splice(0);
  list.forEach((f, i) => setTimeout(f, i * 40));
}
export function setupScroll(view: HTMLElement) {
  if (reduce) {
    $$(".fade,[data-clip],.line-in", view).forEach((e) => e.classList.add("in"));
    $$("[data-count]", view).forEach(
      (n) => (n.textContent = n.dataset.count + ("plus" in n.dataset ? "+" : "")),
    );
    return;
  }
  root.classList.add("gs");
  // headings: characters climb out of a mask as the heading enters
  $$("[data-split]", view).forEach((el) => {
    if (el.id === "heroName" || el.closest<HTMLElement>("#hero")) return;
    const txt = el.textContent.trim();
    el.setAttribute("aria-label", String(txt));
    const sp = SplitText.create(el, { type: "words,chars", mask: "words", aria: "hidden" });
    anim(
      sp.chars,
      { yPercent: 118, rotate: 7 },
      { yPercent: 0, rotate: 0 },
      { trigger: el, stagger: 0.02, start: "top 98%", end: "top 58%" },
    );
    if (el.classList.contains("h-xl") && !el.closest<HTMLElement>(".page-head,.pj-hero,.post-head,.nf"))
      gsap.fromTo(
        el,
        { xPercent: 3 },
        {
          xPercent: -3,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
  });
  $$("[data-lines]", view).forEach((el) => {
    if (el.closest<HTMLElement>("#hero")) return;
    const sp = SplitText.create(el, { type: "lines", mask: "lines" });
    anim(
      sp.lines,
      { yPercent: 105 },
      { yPercent: 0 },
      { trigger: el, stagger: 0.08, start: "top 95%", end: "top 65%" },
    );
  });
  $$("[data-scrub]", view).forEach((el) => {
    const sp = SplitText.create(el, { type: "words" });
    gsap.fromTo(
      sp.words,
      { opacity: 0.12, filter: "blur(3px)" },
      {
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 50%", scrub: true },
      },
    );
  });
  // generic blocks rise and un-blur
  $$(".fade", view).forEach((el) => {
    if (el.closest<HTMLElement>(".pgrid[hidden]")) return;
    anim(
      el,
      { y: 70, opacity: 0, filter: "blur(6px)" },
      { y: 0, opacity: 1, filter: "blur(0px)" },
      { start: "top 98%", end: "top 72%" },
    );
  });
  // cards tip forward in 3D
  $$(".glass.fade,.door-card,.essay,.way,.exp,.pcard", view).forEach((el) => {
    gsap.set(el, { transformPerspective: 1000 });
    anim(
      el,
      { rotateX: 28, transformOrigin: "50% 100%" },
      { rotateX: 0 },
      { start: "top 100%", end: "top 70%" },
    );
  });
  // rows slide in from the side, each on its own
  $$(
    ".prow,.jrow,.job,.formats li,.pj-feat li,.topics li,.acc > li,.cv-stats > div,.ptable tbody tr",
    view,
  ).forEach((el, i) =>
    anim(
      el,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1 },
      { start: "top 100%", end: "top 80%", delay: inFold(el) ? i * 0.05 : 0 },
    ),
  );
  // images: clip open + settle
  $$("[data-clip]", view).forEach((el) => {
    const im = el.querySelector("img");
    anim(
      el,
      { clipPath: "inset(22% 12% 22% 12% round 28px)" },
      { clipPath: "inset(0% 0% 0% 0% round 18px)" },
      { start: "top 100%", end: "top 45%" },
    );
    if (im)
      gsap.fromTo(
        im,
        { scale: 1.3 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
  });
  $$(".line-in", view).forEach((el) => el.classList.add("in"));
  $$(".sec-label", view).forEach((el) =>
    anim(el, { opacity: 0, x: -30 }, { opacity: 1, x: 0 }, { start: "top 98%", end: "top 80%" }),
  );
  $$("[data-speed]", view).forEach((el) =>
    gsap.to(el, {
      yPercent: +el.dataset.speed * -120,
      ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    }),
  );
  // counters replay every time they enter
  $$("[data-count]", view).forEach((n) => {
    const to = +n.dataset.count,
      plus = "plus" in n.dataset,
      o = { v: 0 };
    const run = () =>
      gsap.fromTo(
        o,
        { v: 0 },
        {
          v: to,
          duration: 1.6,
          ease: "expo.out",
          onUpdate: () => (n.textContent = Math.round(o.v) + (plus ? "+" : "")),
        },
      );
    ScrollTrigger.create({ trigger: n, start: "top 92%", onEnter: run, onEnterBack: run });
  });
  // big footer signature drifts with scroll
  $$(".foot-sig", view).forEach((el) =>
    gsap.fromTo(
      el,
      { xPercent: 12 },
      {
        xPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      },
    ),
  );
}
let lastY = 0;
export function scrollTick(force = false) {
  if (!page) return;
  const y = scrollY,
    mid = innerHeight * 0.5,
    narrow = innerWidth < 980,
    secs = page.sections;
  let cur: HTMLElement = null;
  if (secs.length) {
    let i = 0;
    const midDoc = y + mid;
    const metrics = page.metrics || new Map();
    for (let k = 0; k < secs.length; k++) {
      if ((metrics.get(secs[k])?.top ?? Infinity) <= midDoc) i = k;
    }
    const s = secs[i],
      n = secs[i + 1],
      metric = metrics.get(s),
      t = metric ? clamp((midDoc - metric.top) / metric.height, 0, 1) : 0;
    cur = s;
    const a = scenes[s.dataset.s] || scenes.page,
      b = n ? scenes[n.dataset.s] || scenes.page : a,
      k = smoothstep(0.72, 1, t),
      g = (o, key) => (narrow ? o["m" + key] : o[key]);
    scene.m = lerp(a.m, b.m, k);
    scene.u = lerp(g(a, "u"), g(b, "u"), k);
    scene.v = lerp(g(a, "v"), g(b, "v"), k);
    scene.s = lerp(g(a, "s"), g(b, "s"), k);
    scene.dim = lerp(a.dim, b.dim, k);
    if (body.classList.contains("gallery-pinned")) scene.dim = 0;
    if (innerWidth < 820 && !keptOnMobile.includes(s.dataset.s)) {
      scene.u = 0.86;
      scene.v = 0.9;
      scene.s = 0.1;
      scene.dim = 0.65;
    }
  }
  const view = $("#view");
  const ct = $("[data-s='contact']", view);
  const contact = ct && page.metrics?.get(ct);
  scene.join = contact ? smoothstep(0.1, 0.9, (innerHeight - (contact.top - y)) / innerHeight) : 0;
  if (route && route.k === "notfound") scene.join = lostDrops.join;
  if (route && route.k === "ask") {
    const fs = $("#faceSlot", view);
    if (fs) {
      // The face is framed by this live panel rect, including its responsive
      // left column width. Cached vertical metrics alone cannot represent it.
      const rect = fs.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) {
        scene.m = DIRECTOR_SHAPE;
        scene.u = (rect.left + rect.width / 2) / innerWidth;
        scene.v = (rect.top + rect.height * 0.4) / innerHeight;
        scene.s = (Math.min(rect.width, rect.height) * 0.36 * 3.125) / innerHeight;
        scene.dim = 1;
      }
    }
  }
  if (GL) {
    const hero = route && route.k === "home" ? $("#hero", view) : null;
    const heroMetric = hero && page.metrics?.get(hero);
    const hb = heroMetric && { top: heroMetric.top - y, bottom: heroMetric.bottom - y };
    const heroOn =
      !!hb && hb.bottom > innerHeight * 0.45 && !menuOpen && !GLT.busy && body.classList.contains("ready");
    GL.heroLensT = heroOn ? 1 : 0;
    if (heroOn && mouse.active && mouse.y < hb.bottom) {
      const k = smoothstep(innerHeight * 0.45, innerHeight * 0.9, hb.bottom);
      scene.u = lerp(scene.u, mouse.x / innerWidth, k);
      scene.v = lerp(scene.v, mouse.y / innerHeight, k);
      scene.s = lerp(scene.s, isMobile() ? 0.22 : 0.3, k);
      scene.m = lerp(scene.m, 0, k);
    }
    if (cur && cur.dataset.s === "story" && scene.spin != null) {
      scene.u = lerp(0.12, 0.88, scene.spin);
    }
  }
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight),
    pr = y / max;
  $("#pgProg").style.transform = `scaleX(${pr.toFixed(3)})`;
  $("#hudBar").style.transform = `scaleX(${pr.toFixed(3)})`;
  const lbl = cur
    ? {
        hero: "Hello",
        belief: "Belief",
        story: "The story",
        bidbary: "BidBary",
        work: "Work",
        services: "Studio",
        ideas: "Ideas",
        project: route && route.k === "project" ? route.p.title : "Project",
      }[cur.dataset.s] || titleOf(route)
    : "";
  const hs = $("#hudSec");
  const lblT = tr(lbl);
  if (hs.textContent !== lblT) hs.textContent = lblT;
  if (!menuOpen) {
    hdr.classList.toggle("compact", y > 110);
    if (!force) {
      if (y > lastY + 6 && y > innerHeight * 1.2) hdr.classList.add("hide");
      else if (y < lastY - 4) hdr.classList.remove("hide");
    }
  }
  lastY = y;
  const v = lenis ? clamp(lenis.velocity || 0, -40, 40) : 0;
  if (GL) GL.vel = v;
  page.skew.forEach((el) => {
    el.style.transform = `skewX(${(-v * 0.25).toFixed(2)}deg)`;
  });
  page.stacks.forEach((c, i) => {
    const n = page.stacks[i + 1];
    if (narrow || !n || n.parentNode !== c.parentNode) {
      c.style.transform = "";
      c.style.filter = "";
      return;
    }
    const nt = page.metrics?.get(n)?.top,
      ctop = page.metrics?.get(c)?.top;
    if (nt == null || ctop == null) return;
    const p = clamp(1 - (nt - ctop) / (innerHeight * 0.75), 0, 1);
    c.style.transform = `scale(${(1 - p * 0.07).toFixed(4)}) rotateX(${(p * 6).toFixed(2)}deg)`;
    c.style.filter = `brightness(${(1 - p * 0.4).toFixed(3)})`;
  });
}
