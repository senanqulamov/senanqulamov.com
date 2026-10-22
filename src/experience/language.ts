// Switching language. The cookie tells the server which language to render; the
// chrome object presses the page title into its surface and morphs it into the
// new language while the page re-renders underneath.

import { isLang, LANG_COOKIE, type Lang } from "@/i18n";
import { $$ } from "./dom";
import { gsap } from "./env";
import { announce } from "./extras";
import { getLang, setLang } from "./i18n";
import { drawMenu, menuOpen } from "./menu";
import { refreshRoute } from "./router";
import { titleOf } from "./routes";
import { introPage, scrollTick } from "./scroll";
import { SFX } from "./sound";
import { GL, route, scene } from "./state";
import { GLT, setTransitioning } from "./transitions";
import { wait } from "./dom";
import { ChatCore } from "./director/chat";

const names: Record<Lang, string> = { en: "English", az: "Azərbaycanca", ru: "Русский" };
let busy = false;

export async function switchLang(next: Lang) {
  if (!isLang(next) || next === getLang() || busy) return;
  busy = true;
  document.cookie = `${LANG_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
  const swap = async () => {
    setLang(next);
    ChatCore.setSiteLang(next);
    document.documentElement.lang = next;
    await refreshRoute();
    scrollTick(true);
    if (menuOpen) setTimeout(drawMenu, 60);
  };
  if (GLT.ok() && !menuOpen && !GLT.busy) {
    GLT.busy = true;
    setTransitioning(true);
    await GLT.cover({ x: 0.5, y: 0.5, shape: 1, gather: false, spin: 0.8 });
    await GLT.emboss(titleOf(route), 380);
    await gsap.to(GL, { emboss: 0, duration: 0.22, ease: "power2.in" });
    setLang(next);
    ChatCore.setSiteLang(next);
    GL.setTitle(titleOf(route));
    SFX.glass(["en", "az", "ru"].indexOf(next) * 2 + 1);
    await gsap.to(GL, { emboss: 1, duration: 0.4, ease: "power2.out" });
    await swap();
    await wait(380);
    SFX.melt();
    await gsap.to(GL, {
      melt: 1,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => ((GL.emboss = 0), (GL.melt = 0)),
    });
    setTimeout(introPage, 250);
    await GLT.reveal({ m: scene.m, u: scene.u, v: scene.v, s: scene.s });
    GLT.busy = false;
    setTransitioning(false);
  } else {
    await swap();
  }
  $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === next)));
  announce(`Language: ${names[next]}`);
  busy = false;
}

$$("[data-lang]").forEach((b) => b.addEventListener("click", () => switchLang(b.dataset.lang as Lang)));
$$("#langBtn").forEach((b) =>
  b.addEventListener("click", () => {
    const order: Lang[] = ["en", "az", "ru"];
    switchLang(order[(order.indexOf(getLang()) + 1) % order.length]);
  }),
);
