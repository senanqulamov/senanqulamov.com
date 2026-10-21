// The work index: list, grid, and the Space view where projects float past in 3D.

import { projects } from "@/data/projects";
import { $, $$, clamp, pad2, scramble, smoothstep } from "../dom";
import { gsap, isMobile, reduce, ScrollTrigger } from "../env";
import { cleanup, clicked, GL, lenis, page, route } from "../state";
import { tr } from "../i18n";
import { SFX } from "../sound";
import { navigate } from "../router";

export function mountWork(view: HTMLElement) {
  const list = $("#plist"),
    grid = $("#pgrid"),
    space = $("#space"),
    stage = $("#spStage");
  let cur = -1;
  const canSpace = !!GL && !reduce;
  function setView(v: string) {
    $$("[data-v]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.v === v)));
    list.hidden = v !== "list";
    grid.hidden = v !== "grid";
    space.hidden = v !== "space";
    if (GL) GL.space.on = v === "space";
    if (v === "grid") gsap.set($$(".pcard", grid), { opacity: 1, y: 0, filter: "none" });
    localStorage.setItem("sq-workview", v);
    page.sections = $$("[data-s]", view).filter((s) => !s.hidden && !s.closest<HTMLElement>("[hidden]"));
    lenis && lenis.resize();
    ScrollTrigger.refresh();
  }
  $$("[data-f]").forEach((b) =>
    b.addEventListener("click", () => {
      $$("[data-f]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      const f = b.dataset.f;
      if (GL) GL.space.filter = f;
      $$(".prow,.pcard", view).forEach((r) => (r.hidden = !(f === "all" || r.dataset.type === f)));
      if (space.hidden) {
        const vis = $$(".prow:not([hidden]),.pcard:not([hidden])", view).slice(0, 10);
        gsap.fromTo(
          vis,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "expo.out",
            stagger: 0.04,
            clearProps: "transform,opacity",
          },
        );
      }
      lenis && lenis.resize();
      ScrollTrigger.refresh();
    }),
  );
  $$("[data-v]").forEach((b) =>
    b.addEventListener("click", () => {
      if (b.dataset.v === "space" && !canSpace) return;
      setView(b.dataset.v);
      SFX.whoosh();
    }),
  );
  if (!canSpace) $("[data-v=space]").hidden = true;
  const saved = localStorage.getItem("sq-workview");
  setView(
    canSpace && (saved || (!isMobile() ? "space" : "list")) === "space"
      ? "space"
      : saved === "grid"
        ? "grid"
        : "list",
  );
  if (GL) {
    GL.space.filter = "all";
    cleanup.push(() => {
      GL.space.on = false;
    });
  }
  const show = (i: number) => {
    if (i === cur) return;
    cur = i;
    const p = projects[i];
    $("#spIdx").textContent = `${pad2(i + 1)} / ${projects.length}`;
    const t = $<HTMLAnchorElement>("#spTitle");
    t.href = "/work/" + p.slug;
    scramble(t, p.title, 450);
    $("#spSub").textContent = p.subtitle;
    $("#spMeta").textContent = `${p.client}, ${p.year}`;
    SFX.glass(i);
    GL && (GL.pulse = 0.25);
  };
  stage.addEventListener("click", (e) => {
    if (!GL || (e.target as HTMLElement).closest<HTMLElement>("a")) return;
    const i = GL.space.hover;
    if (i < 0) return;
    clicked.rect = GL.spaceRect(i);
    navigate("/work/" + projects[i].slug);
  });
  addEventListener("keydown", kd);
  function kd(e: KeyboardEvent) {
    if (route.k !== "work" || space.hidden || /input|textarea/i.test(document.activeElement.tagName)) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
      const r = space.getBoundingClientRect(),
        tot = r.height - innerHeight,
        tgt = space.offsetTop + tot * clamp((Math.max(cur, 0) + d) / (projects.length - 1), 0, 1);
      lenis ? lenis.scrollTo(tgt, { duration: 0.9 }) : scrollTo(0, tgt);
    }
  }
  cleanup.push(() => removeEventListener("keydown", kd));
  page.tick = () => {
    if (!GL) return;
    if (space.hidden) {
      GL.space.vis = 0;
      return;
    }
    const r = space.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight), 0, 1);
    GL.space.p = p;
    GL.space.vis =
      smoothstep(innerHeight, innerHeight * 0.85, r.top) * smoothstep(0, innerHeight * 0.3, r.bottom);
    GL.space.clip = [r.top, r.bottom];
    GL.space.vel = lenis ? lenis.velocity || 0 : 0;
    $("#spBar").style.transform = `scaleX(${p.toFixed(3)})`;
    show(Math.round(p * (projects.length - 1)));
    stage.dataset.cursor = tr(GL.space.hover >= 0 ? "Open" : "Fly");
  };
}
