// The loader: drops of chrome fall and merge while the site loads, then the name rises in the metal.

import { $, $$, body, lerp, scramble } from "./dom";
import { gsap, isMobile, reduce, ScrollTrigger } from "./env";
import { GL, lenis, route, scene } from "./state";
import { tr } from "./i18n";
import { setSound, SFX } from "./sound";
import { GLT } from "./transitions";
import { introPage, scrollTick } from "./scroll";
import { playHero } from "./pages/home";

export const Loader = (() => {
  const el = $("#loader"),
    cols = $$(".odo .col"),
    word = $("#lWord"),
    bar = $("#lBar"),
    enter = $("#lEnter");
  let p = 0,
    done = false,
    entered = false,
    ready2 = false,
    t0 = performance.now(),
    wi = 0,
    wantSound = true,
    drops = 0,
    dropping = false;
  const WORDS = [
    "Melting the chrome",
    "Compiling the engineer",
    "Tuning the listener",
    "Staging the founder",
    "Setting seat 48",
  ];

  function setNum(n) {
    const s = String(n).padStart(3, "0");
    cols.forEach((c, i) => {
      c.style.transform = `translateY(${-+s[i] * 1.15}em)`;
    });
  }
  const wordT = setInterval(() => {
    if (done) {
      clearInterval(wordT);
      return;
    }
    scramble(word, tr(WORDS[wi++ % WORDS.length]), 500);
  }, 1000);
  scramble(word, tr(WORDS[0]), 500);
  $("#lSound").addEventListener("click", (e) => {
    e.stopPropagation();
    wantSound = !wantSound;
    (e.currentTarget as HTMLElement).setAttribute("aria-pressed", String(wantSound));
    $("#lSoundT").textContent = tr(wantSound ? "With sound" : "Without sound");
  });
  const base = () => ({ m: 0, u: 0.5, v: 0.5, s: 0.07 + Math.min(p, 1) * 0.3, dim: 1 });
  function drop() {
    const gl = GL;
    if (!gl) {
      drops++;
      return;
    }
    dropping = true;
    const o = { y: 7, r: 0.34 };
    gl.drop(o.y, o.r);
    gsap.to(o, {
      y: 0,
      duration: 0.5,
      ease: "power2.in",
      onUpdate: () => {
        if (GL === gl) gl.drop(o.y, o.r);
      },
      onComplete: () => {
        if (GL !== gl) {
          dropping = false;
          return;
        }
        drops++;
        gl.st.burst = 0.55;
        gl.pulse = 0.7;
        gl.splash(0.5, 0.5);
        SFX.drop(0.8 + drops * 0.05);
        gsap.to(o, {
          r: 0,
          duration: 0.35,
          ease: "power2.out",
          onUpdate: () => {
            if (GL === gl) gl.drop(o.y, o.r);
          },
          onComplete: () => {
            dropping = false;
          },
        });
      },
    });
  }
  async function finale() {
    if (!GL || reduce) {
      ready2 = true;
      enter.classList.add("on");
      gsap.set(enter.children, { opacity: 1, y: 0 });
      return;
    }
    GL.override = null;
    await GLT.cover({ x: 0.5, y: 0.5, shape: 0, gather: false, spin: 1.2 });
    GL.setTitle("Senan Qulamov");
    SFX.chord();
    gsap.fromTo(GL, { emboss: 0 }, { emboss: 1, duration: 0.9, ease: "power2.out" });
    enter.classList.add("on");
    gsap.fromTo(
      enter.children,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.1, delay: 0.3 },
    );
    gsap.to([".odo-w", ".l-word3", ".l-bar"], { opacity: 0, duration: 0.6 });
    ready2 = true;
    setTimeout(() => {
      if (!entered) {
        wantSound = false;
        enterSite();
      }
    }, 15000);
  }
  async function enterSite() {
    if (entered || !done) return;
    entered = true;
    if (wantSound) setSound(true);
    const fin = () => {
      el.hidden = true;
    };
    gsap.to(enter, { opacity: 0, y: 20, duration: 0.4 });
    body.classList.remove("loading");
    body.classList.add("ready");
    lenis && lenis.start();
    if (GL && !reduce && GL.drive) {
      SFX.melt();
      await gsap.to(GL, { melt: 1, duration: 0.7, ease: "power2.in" });
      GL.emboss = 0;
      GL.melt = 0;
      scrollTick(true);
      if (route && route.k === "home") playHero();
      setTimeout(introPage, 200);
      gsap.to(".l-top", { opacity: 0, duration: 0.4 });
      fin();
      await GLT.reveal({ m: scene.m, u: scene.u, v: scene.v, s: scene.s });
    } else {
      if (GL) {
        GL.override = null;
        GL.front(false);
      }
      if (route && route.k === "home") playHero();
      introPage();
      fin();
    }
    scrollTick(true);
    ScrollTrigger.refresh();
  }
  el.addEventListener("click", () => {
    if (ready2 || done) enterSite();
  });
  addEventListener("keydown", (e) => {
    if (
      (ready2 || (!GL && done)) &&
      !entered &&
      (e.key === "Enter" || e.key === " ") &&
      !(e.target as HTMLElement).closest<HTMLElement>("#lSound")
    ) {
      e.preventDefault();
      enterSite();
    }
  });
  return {
    get entered() {
      return entered;
    },
    tick(now: number, readiness: { fonts: boolean; portrait: boolean; shaders: boolean }) {
      if (entered || done) return;
      const minT = reduce ? 0.4 : isMobile() ? 2.6 : 3.6;
      const lin = Math.min(1, (now - t0) / 1000 / minT);
      const signalsReady = readiness.fonts && readiness.portrait && readiness.shaders;
      const forced = now - t0 >= 10000;
      p = Math.min(signalsReady || forced ? 1 : 0.92, 1 - Math.pow(1 - lin, 1.8));
      setNum(Math.round(p * 100));
      bar.style.transform = `scaleX(${p})`;
      if (GL) {
        GL.setIntro(1);
        if (!GL.drive) GL.override = base();
        GL.gatherTarget = lerp(3.2, 1, p);
        if (reduce) drops = 10;
        else if (!dropping && drops < Math.floor(p * 10)) drop();
      }
      if (p >= 0.999 && (!GL || drops >= 10) && !dropping) {
        done = true;
        clearInterval(wordT);
        scramble(word, tr("Ready"), 400);
        finale();
      }
    },
  };
})();
