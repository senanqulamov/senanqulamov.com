// Project page: the title rises, the cover recedes as you scroll, and the guided tour walks through the screens.

import { $, $$, pad2 } from "../dom";
import { gsap, reduce, ScrollTrigger, SplitText } from "../env";
import { GL, lenis } from "../state";
import { SFX } from "../sound";
import { Lightbox } from "./lightbox";

const Tour = (() => {
  const ZOOM = [
    { s: 1, x: 50, y: 0 },
    { s: 1.45, x: 18, y: 14 },
    { s: 1.35, x: 82, y: 20 },
    { s: 1.4, x: 30, y: 72 },
    { s: 1.3, x: 72, y: 62 },
    { s: 1.5, x: 50, y: 35 },
  ];
  return {
    mount() {
      const imgs = $$<HTMLImageElement>(".tour-img");
      if (!imgs.length) return;
      const steps = $$(".tstep"),
        dots = $$(".tour-dots button"),
        spot = $("#tourSpot");
      let cur = -1;
      function go(i: number) {
        if (i === cur) return;
        const prev = cur;
        cur = i;
        const z = ZOOM[i % ZOOM.length];
        $("#tourNum").textContent = `${pad2(i + 1)} / ${pad2(imgs.length)}`;
        dots.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
        steps.forEach((s, k) => s.classList.toggle("on", k === i));
        imgs.forEach((im, k) => {
          im.style.zIndex = String(k === i ? 2 : k === prev ? 1 : 0);
        });
        const im = imgs[i];
        if (!reduce) {
          gsap.killTweensOf(im);
          gsap.fromTo(
            im,
            {
              clipPath: i > prev ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
              opacity: 1,
              scale: z.s * 1.12,
              transformOrigin: `${z.x}% ${z.y}%`,
            },
            { clipPath: "inset(0% 0% 0% 0%)", scale: z.s, duration: 1.2, ease: "expo.inOut" },
          );
          gsap.to(spot, {
            left: z.x + "%",
            top: z.y + "%",
            opacity: z.s > 1 ? 1 : 0,
            scale: z.s > 1 ? 1 : 0.4,
            duration: 1.1,
            ease: "expo.inOut",
          });
        } else {
          imgs.forEach((x, k) => (x.style.opacity = k === i ? "1" : "0"));
        }
        SFX.tick();
        GL && (GL.pulse = 0.2);
      }
      imgs.forEach((im, k) => {
        im.style.opacity = k ? "0" : "1";
      });
      $$(".tstep-img").forEach((el, i) => {
        const o = () => {
          Lightbox.openAt(i, el);
        };
        el.addEventListener("click", o);
        el.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            o();
          }
        });
      });
      if (innerWidth <= 980) {
        Lightbox.mount(imgs.map((i) => i.src));
        return;
      }
      steps.forEach((s, i) =>
        ScrollTrigger.create({
          trigger: s,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (st) => {
            if (st.isActive) go(i);
          },
        }),
      );
      go(0);
      dots.forEach((d, i) =>
        d.addEventListener("click", () => {
          const t = steps[i].getBoundingClientRect().top + scrollY - innerHeight * 0.35;
          lenis ? lenis.scrollTo(t, { duration: 1 }) : scrollTo({ top: t, behavior: "smooth" });
        }),
      );
      const open = () => Lightbox.openAt(Math.max(cur, 0), $("#tourFrame"));
      $("#tourFrame").addEventListener("click", open);
      $("#tourOpen").addEventListener("click", open);
      Lightbox.mount(imgs.map((i) => i.src));
    },
  };
})();

export function mountProject(view: HTMLElement) {
  Tour.mount();
  const t = $("#pjTitle");
  if (!reduce) {
    const sp = SplitText.create(t, { type: "chars", mask: "chars" });
    gsap.from(sp.chars, { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.035, delay: 0.15 });
    gsap.from(".pj-hero-in .crumb,.pj-hero-in .pd-sub,.pj-scroll", {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.08,
      delay: 0.5,
    });
    gsap.fromTo(
      "#pjMedia",
      { clipPath: "inset(0% 0% 0% 0% round 0px)" },
      {
        clipPath: "inset(7% 4% 7% 4% round 28px)",
        ease: "none",
        scrollTrigger: { trigger: ".pj-hero", start: "top top", end: "bottom top", scrub: true },
      },
    );
    gsap.fromTo(
      "#pjMedia img",
      { scale: 1.06 },
      {
        scale: 1.25,
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: ".pj-hero", start: "top top", end: "bottom top", scrub: true },
      },
    );
    gsap.to(".pj-hero-in", {
      yPercent: -30,
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: ".pj-hero", start: "20% top", end: "bottom top", scrub: true },
    });
  }
}
