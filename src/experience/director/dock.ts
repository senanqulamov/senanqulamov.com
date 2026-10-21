// The floating Director: a button on every page, the chat panel, and the bust standing beside it.

import type { Route } from "../routes";
import { $, $$, body } from "../dom";
import { coarse, gsap, reduce } from "../env";
import { lenis } from "../state";
import { tr } from "../i18n";
import { buzz } from "../ui";
import { SFX } from "../sound";
import { Voice } from "./voice";
import { MiniFace } from "./mini-face";
import { ChatCore } from "./chat";
import { ChatUI } from "./chat-ui";

export const Dock = (() => {
  const btn = $("#dirBtn"),
    panel = $("#dirPanel"),
    fig = $("#dirFig");
  let open = false,
    ui: ReturnType<typeof ChatUI> = null,
    tl: gsap.core.Timeline = null;
  const holder = $("#dirFace"),
    figHolder = $("#dirFigFace");
  let faceQueued = false;
  function activateFace() {
    if (!MiniFace.start()) return false;
    btn.classList.add("live");
    return true;
  }
  function showFace(target: HTMLElement, frame: number) {
    if (!activateFace()) return;
    target.appendChild(MiniFace.el);
    MiniFace.frameTo(frame, true);
  }
  function activateWhenIdle() {
    if (faceQueued || MiniFace.ok()) return;
    faceQueued = true;
    const start = () => showFace(holder, 0);
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(start, { timeout: 2000 });
    } else {
      setTimeout(start, 800);
    }
  }
  ChatCore.sub((ev, s) => {
    if (ev === "state") {
      const el = $("#dirState");
      if (el) {
        el.textContent = tr(
          { think: "Thinking", speak: "Speaking", listen: "Listening", idle: "Listening" }[s] || "Listening",
        );
        el.dataset.s = s;
      }
      btn.dataset.s = s;
      fig.dataset.s = s;
    }
  });
  const mobile = () => innerWidth < 820;
  function setOpen(o: boolean) {
    if (o === open) return;
    open = o;
    btn.setAttribute("aria-expanded", String(o));
    body.classList.toggle("dir-open", o);
    tl && tl.kill();
    const br = btn.getBoundingClientRect();
    if (o) {
      showFace(figHolder, 1);
      panel.hidden = false;
      fig.hidden = false;
      if (!ui) {
        ui = ChatUI($("#dirChat"), { compact: true });
        $("#dirChat").addEventListener("navigate", () => setOpen(false));
      }
      const pr = panel.getBoundingClientRect(),
        ox = br.left + br.width / 2 - pr.left,
        oy = br.top + br.height / 2 - pr.top;
      if (!reduce) {
        tl = gsap.timeline();
        tl.to(btn, { scale: 0.6, opacity: 0, duration: 0.35, ease: "power2.in" }, 0)
          .fromTo(
            panel,
            { clipPath: `circle(30px at ${ox}px ${oy}px)`, opacity: 1 },
            {
              clipPath: `circle(${Math.hypot(pr.width, pr.height) * 1.1}px at ${ox}px ${oy}px)`,
              duration: 0.85,
              ease: "expo.inOut",
              clearProps: "clipPath",
            },
            0,
          )
          .from(
            $$(".dir-h > *, .cx-top > *, .cx-m, .cx-welcome, .cx-form, .cx-note", panel),
            { opacity: 0, y: 16, duration: 0.6, stagger: 0.03, ease: "expo.out" },
            0.35,
          )
          .fromTo(
            fig,
            { opacity: 0, y: mobile() ? 60 : 140, scale: 0.6, rotate: -8 },
            { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 1.1, ease: "back.out(1.5)" },
            0.25,
          )
          .fromTo(
            ".dir-shadow",
            { scale: 0.2, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.9, ease: "expo.out" },
            0.45,
          )
          .add(() => {
            MiniFace.nod(1.4);
          }, 0.9);
      }
      SFX.glass(3);
      SFX.swell(0.5);
      buzz(8);
      if (!coarse) setTimeout(() => ui.focus(), 500);
      if (mobile()) lenis && lenis.stop();
    } else {
      Voice.stop();
      ChatCore.setState("idle");
      const done = () => {
        panel.hidden = true;
        fig.hidden = true;
        if (MiniFace.ok()) showFace(holder, 0);
        gsap.set([btn, panel, fig], { clearProps: "all" });
      };
      if (!reduce) {
        const pr = panel.getBoundingClientRect(),
          ox = br.left + br.width / 2 - pr.left,
          oy = br.top + br.height / 2 - pr.top;
        tl = gsap.timeline({ onComplete: done });
        tl.to(
          fig,
          { y: mobile() ? 50 : 120, scale: 0.6, opacity: 0, rotate: 6, duration: 0.5, ease: "back.in(1.6)" },
          0,
        )
          .to(".dir-shadow", { scale: 0.2, opacity: 0, duration: 0.4 }, 0)
          .to($$(".cx-m, .cx-form, .cx-top", panel), { opacity: 0, y: 10, duration: 0.25, stagger: 0.01 }, 0)
          .fromTo(
            panel,
            { clipPath: `circle(${Math.hypot(pr.width, pr.height) * 1.1}px at ${ox}px ${oy}px)` },
            { clipPath: `circle(28px at ${ox}px ${oy}px)`, duration: 0.6, ease: "expo.inOut" },
            0.15,
          )
          .to(btn, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, 0.6);
      } else done();
      SFX.whoosh();
      lenis && lenis.start();
    }
  }
  btn.addEventListener("pointerenter", () => showFace(holder, 0), { once: true });
  btn.addEventListener("click", () => setOpen(!open));
  $("#dirClose").addEventListener("click", () => setOpen(false));
  $("#dirFull").addEventListener("click", () => setOpen(false));
  fig.addEventListener("click", () => {
    ChatCore.poke();
    SFX.glass(1);
  });
  addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        btn.focus();
        e.stopPropagation();
      }
    },
    true,
  );
  document.addEventListener("pointerdown", (e) => {
    const t = e.target as Node;
    if (open && !panel.contains(t) && !fig.contains(t) && !btn.contains(t) && !mobile()) setOpen(false);
  });
  if (window.visualViewport)
    visualViewport.addEventListener("resize", () => {
      if (!open || !mobile()) return;
      const kb = Math.max(0, innerHeight - visualViewport.height);
      panel.style.bottom = kb + "px";
      panel.style.maxHeight = visualViewport.height - 20 + "px";
      fig.style.bottom = `calc(${kb}px + min(86vh,640px) - 46px)`;
    });
  return {
    activateWhenIdle,
    sync(r: Route | null) {
      const hide = !r || r.k === "ask";
      body.classList.toggle("dir-hide", hide);
      if (hide && open) setOpen(false);
    },
    setOpen,
  };
})();
