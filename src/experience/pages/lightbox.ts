// Full-screen viewer for project screens, opened from the guided tour.

import { $, $$, pad2 } from "../dom";
import { gsap } from "../env";
import { lenis, route } from "../state";
import { blip } from "../sound";

export const Lightbox = (() => {
  const lb = $("#lb"),
    img = $<HTMLImageElement>("#lbImg"),
    frame = $("#lbFrame");
  let list: string[] = [],
    figs: HTMLElement[] = [],
    i = 0,
    open = false,
    dragX: number | null = null;
  function thumbs() {
    $("#lbThumbs").innerHTML = list
      .map(
        (s, k) =>
          `<button class="${k === i ? "on" : ""}" data-k="${k}" aria-label="Screen ${k + 1}"><img src="${s}" alt=""></button>`,
      )
      .join("");
  }
  function show(k: number, dir = 0) {
    i = (k + list.length) % list.length;
    $("#lbCount").textContent = `${pad2(i + 1)} / ${pad2(list.length)}`;
    $$("#lbThumbs button").forEach((b, n) => b.classList.toggle("on", n === i));
    const t = $("#lbThumbs button.on");
    if (t) t.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    if (dir) {
      gsap.to(frame, {
        x: -dir * 80,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          img.src = list[i];
          $(".lb-view", lb).scrollTop = 0;
          gsap.fromTo(
            frame,
            { x: dir * 80, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6, ease: "expo.out" },
          );
        },
      });
    } else {
      img.src = list[i];
    }
    blip(600 + i * 40, 0.12);
  }
  function openAt(k: number, from?: HTMLElement) {
    if (!list.length) return;
    open = true;
    lb.classList.add("on");
    lenis && lenis.stop();
    thumbs();
    show(k);
    if (window.gsap) {
      const r = (from || figs[k]).getBoundingClientRect();
      gsap.set(lb, { opacity: 1 });
      gsap.fromTo(".lb-bg", { opacity: 0 }, { opacity: 1, duration: 0.6 });
      requestAnimationFrame(() => {
        const f = frame.getBoundingClientRect();
        gsap.fromTo(
          frame,
          {
            x: r.left + r.width / 2 - (f.left + f.width / 2),
            y: r.top + r.height / 2 - (f.top + f.height / 2),
            scale: r.width / f.width,
            opacity: 0.6,
          },
          { x: 0, y: 0, scale: 1, opacity: 1, duration: 1, ease: "expo.inOut" },
        );
      });
      gsap.fromTo(
        [".lb-top", ".lb-thumbs", ".lb-arrow"],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.4, stagger: 0.06 },
      );
    }
    setTimeout(() => $("#lbClose").focus(), 50);
  }
  function close() {
    if (!open) return;
    open = false;
    const fig = $("#tourFrame") || figs[i];
    const done = () => {
      lb.classList.remove("on");
      lenis && lenis.start();
      fig && fig.focus({ preventScroll: true });
    };
    if (fig) {
      const r = fig.getBoundingClientRect(),
        f = frame.getBoundingClientRect();
      gsap.to([".lb-top", ".lb-thumbs", ".lb-arrow"], { opacity: 0, duration: 0.3 });
      gsap.to(".lb-bg", { opacity: 0, duration: 0.7, delay: 0.2 });
      gsap.to(frame, {
        x: r.left + r.width / 2 - (f.left + f.width / 2),
        y: r.top + r.height / 2 - (f.top + f.height / 2),
        scale: r.width / f.width,
        duration: 0.8,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(frame, { clearProps: "all" });
          done();
        },
      });
    } else done();
  }
  $("#lbClose").addEventListener("click", close);
  $(".lb-bg", lb).addEventListener("click", close);
  $("#lbPrev").addEventListener("click", () => show(i - 1, -1));
  $("#lbNext").addEventListener("click", () => show(i + 1, 1));
  $("#lbThumbs").addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("button");
    if (b) {
      const k = +b.dataset.k;
      show(k, k > i ? 1 : -1);
    }
  });
  addEventListener(
    "keydown",
    (e) => {
      if (!open) return;
      if (e.key === "Escape") {
        close();
        e.stopPropagation();
      }
      if (e.key === "ArrowRight") show(i + 1, 1);
      if (e.key === "ArrowLeft") show(i - 1, -1);
    },
    true,
  );
  const st = $("#lbStage");
  st.addEventListener("pointerdown", (e) => {
    if ((e.target as HTMLElement).closest<HTMLElement>(".lb-view") && e.pointerType !== "mouse") return;
    dragX = e.clientX;
  });
  addEventListener("pointerup", (e) => {
    if (dragX == null || !open) return;
    const dx = e.clientX - dragX;
    dragX = null;
    if (Math.abs(dx) > 60) show(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
  return {
    openAt: (k: number, from?: HTMLElement) => {
      figs = [from, ...figs].filter(Boolean);
      openAt(k, from);
    },
    mount(srcs: string[]) {
      list = srcs || [];
      figs = [];
      $("#lbHost").textContent = $(".tour-frame .bw-bar span")?.textContent || "";
      $("#lbTitle").textContent = route && route.k === "project" ? route.p.title : "";
    },
  };
})();
