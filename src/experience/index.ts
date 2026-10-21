// Starts the experience once, after React has rendered the page shell.

import Lenis from "lenis";
import { isLang, type Lang } from "@/i18n";
import { Cursor, magTick } from "./cursor";
import { Dock } from "./director/dock";
import { $$, body, lerp, root } from "./dom";
import { gsap, reduce, ScrollTrigger } from "./env";
import { gpuIdle, startExtras } from "./extras";
import { drawHeroName } from "./pages/home";
import { setLang } from "./i18n";
import "./language";
import { Loader } from "./loader";
import { drawMenu, menuBusy, menuOpen } from "./menu";
import "./palette";
import { connectRouter, navigate, onRendered } from "./router";
import { scrollTick } from "./scroll";
import { AMB, soundOn } from "./sound";
import { GL, lenis, mouse, page, setGL, setLenis } from "./state";
import { syncThemeButton } from "./theme";
import { tr } from "./i18n";

let started = false;

export function start(router: Parameters<typeof connectRouter>[0], lang: Lang) {
  if (started) return;
  started = true;
  connectRouter(router);
  setLang(isLang(lang) ? lang : "en");

  if (!reduce) {
    setLenis(new Lenis({ lerp: 0.085, smoothWheel: true }));
    lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const readiness = { fonts: false, portrait: false, shaders: false };
  const disableGL = () => {
    setGL(null);
    body.classList.add("no-gl");
    readiness.portrait = true;
    readiness.shaders = true;
  };
  (document.fonts?.ready || Promise.resolve()).then(() => (readiness.fonts = true));

  const beginGL = async () => {
    let gl;
    try {
      const { initGL } = await import("./gl/engine");
      gl = initGL();
    } catch {
      disableGL();
      return;
    }
    if (!gl) {
      disableGL();
      return;
    }
    setGL(gl);
    GL.override = { m: 0, u: 0.5, v: 0.5, s: 0.07, dim: 1 };
    GL.setLight(root.dataset.theme === "light" ? 1 : 0, true);
    gl.pTex.then(() => (readiness.portrait = true));
    gl.ready.then(
      () => {
        if (GL === gl) readiness.shaders = true;
      },
      () => {
        if (GL === gl) disableGL();
      },
    );
    setTimeout(() => {
      if (GL === gl && !gl.isReady) disableGL();
    }, 4000);
    onRendered(location.pathname);
  };
  requestAnimationFrame(() => requestAnimationFrame(beginGL));

  $$("[data-theme-label]").forEach(
    (e) => (e.textContent = tr(root.dataset.theme === "light" ? "Light" : "Dark")),
  );
  syncThemeButton();
  startExtras();

  let last = performance.now();
  let frameCount = 0;
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!Loader.entered) Loader.tick(now, readiness);
    else Dock.activateWhenIdle();
    scrollTick();
    Cursor.tick();
    magTick();
    if (AMB.filter && soundOn) {
      const v = lenis ? Math.min(1, Math.abs(lenis.velocity || 0) / 25) : 0;
      AMB.filter.frequency.setTargetAtTime(650 + v * 900 + (menuOpen ? 250 : 0), AMB.ctx.currentTime, 0.25);
    }
    if (menuOpen && GL && GL.lens > 0.5 && GL.override && !menuBusy) {
      GL.override.u = lerp(GL.override.u, mouse.x / innerWidth, 0.12);
      GL.override.v = lerp(GL.override.v, mouse.y / innerHeight, 0.12);
    }
    page?.tick?.(dt, now);
    frameCount++;
    const idle = gpuIdle();
    if (GL?.isReady && !document.hidden && !(idle && frameCount % 2)) GL.render(idle ? dt * 2 : dt);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  addEventListener("resize", () => {
    if (menuOpen) setTimeout(drawMenu, 100);
    if (document.querySelector("#heroName.gl-name")) setTimeout(drawHeroName, 120);
    lenis?.resize();
    ScrollTrigger.refresh();
  });
}

export { navigate, onRendered };
