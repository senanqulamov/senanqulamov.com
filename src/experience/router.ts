// Connects the experience to Next.js navigation. Clicking a link runs the chrome
// transition first; the new page is committed in the middle of it, while the screen
// is covered. Back and forward buttons swap pages directly.

import { Dock } from "./director/dock";
import { $, $$, body } from "./dom";
import { gsap, ScrollTrigger } from "./env";
import { announce, focusHeading } from "./extras";
import { initFields } from "./forms";
import { setHeader } from "./header";
import { closeMenu, menuOpen } from "./menu";
import { mountAsk } from "./pages/ask";
import { mountCredits } from "./pages/credits";
import { Essay } from "./pages/essay";
import { mountHome } from "./pages/home";
import { mountNotFound } from "./pages/notfound";
import { mountPress } from "./pages/press";
import { mountProject } from "./pages/project";
import { Library } from "./pages/library";
import { Start } from "./pages/start";
import { mountWork } from "./pages/work";
import { closePalette } from "./palette";
import { numberOf, parseRoute, tintOf, titleOf, type Route } from "./routes";
import { intro, introPage, scrollTick, setupScroll } from "./scroll";
import { GL, cleanup, clicked, lenis, route, runCleanup, setPage, setRoute } from "./state";
import { GLT, ProjectLoader, setTransitioning, transitioning } from "./transitions";
import { copy } from "./ui";
import { pages } from "@/data/navigation";

type NextRouter = { push: (href: string, options?: { scroll?: boolean }) => void; refresh: () => void };

let nextRouter: NextRouter | null = null;
let waitingForRender: ((pathname: string) => void) | null = null;
let firstRender = true;
let pageContext: gsap.Context | null = null;

export const connectRouter = (router: NextRouter) => (nextRouter = router);

const mounts: Partial<Record<Route["k"], (view: HTMLElement, r: Route) => void>> = {
  home: mountHome,
  work: mountWork,
  project: mountProject,
  post: (_, r) => r.k === "post" && Essay.mount(r.b),
  credits: mountCredits,
  start: () => Start.mount(),
  ask: mountAsk,
  library: () => Library.mount(),
  lab: () => {
    void Promise.all([import("./lab/experiments"), import("./lab/sketches")]).then(
      ([{ LabX }, { Sketches }]) => {
        LabX.mount();
        Sketches.mountPreviews();
      },
    );
  },
  press: mountPress,
  notfound: mountNotFound,
};

function wireCommonControls(view: HTMLElement) {
  $$("[data-copy]", view).forEach((b) => b.addEventListener("click", () => copy(b.dataset.copy)));
  $$(".acc button", view).forEach((b) =>
    b.addEventListener("click", () => {
      const item = b.closest<HTMLElement>("li");
      const open = !item.classList.contains("open");
      item.classList.toggle("open", open);
      b.setAttribute("aria-expanded", String(open));
      setTimeout(() => {
        lenis?.resize();
        ScrollTrigger.refresh();
      }, 750);
    }),
  );
  initFields(view);
  let refreshTimer = 0;
  $$<HTMLImageElement>("img", view).forEach((img) => {
    if (img.complete) return;
    img.addEventListener(
      "load",
      () => {
        clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
      },
      { once: true },
    );
  });
}

/** Undoes everything the current page set up, before React swaps it out. */
export function unmountPage() {
  runCleanup();
  pageContext?.revert();
  pageContext = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
  intro.length = 0;
}

function mountPage(pathname: string) {
  const r = parseRoute(pathname);
  setRoute(r);
  const view = $("#view");
  body.dataset.page = r.k;
  setHeader(r);
  if (GL) {
    GL.setTint(r.k === "project" ? tintOf(r.p) : null);
    GL.nameA = 0;
    GL.nameEl = null;
    GL.holdOn = r.k === "work" || r.k === "home";
  }
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else scrollTo(0, 0);

  wireCommonControls(view);
  setPage({ sections: $$("[data-s]", view), skew: $$("[data-skew]", view), stacks: $$(".scard,.pcd", view) });
  pageContext = gsap.context(() => {
    mounts[r.k]?.(view, r);
    setupScroll(view);
  }, view);
  if (!body.classList.contains("loading") && !transitioning) setTimeout(introPage, 60);

  Dock.sync(r);
  announce(`${r.k === "home" ? "Senan Qulamov" : titleOf(r)}, ${numberOf(r)} / ${pages.length}`);
  if (!firstRender) focusHeading();
  firstRender = false;
  requestAnimationFrame(() => {
    scrollTick(true);
    ScrollTrigger.refresh();
    lenis?.resize();
  });
}

/** React calls this after a page has been committed to the DOM. */
export function onRendered(pathname: string) {
  if (waitingForRender) {
    const resolve = waitingForRender;
    waitingForRender = null;
    resolve(pathname);
    return;
  }
  if (!firstRender) unmountPage();
  mountPage(pathname);
}

/** Asks Next.js for the new page and resolves once it is on screen and mounted. */
function commit(apply: () => void) {
  return new Promise<void>((resolve) => {
    unmountPage();
    waitingForRender = (pathname) => {
      mountPage(pathname);
      resolve();
    };
    apply();
  });
}

export const pushRoute = (href: string) => commit(() => nextRouter.push(href, { scroll: false }));
export const refreshRoute = () => commit(() => nextRouter.refresh());

export async function navigate(href: string) {
  const url = new URL(href, location.href);
  if (url.pathname === location.pathname && url.search === location.search) {
    if (menuOpen) closeMenu();
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  closePalette();
  const target = parseRoute(url.pathname);
  const destination = url.pathname + url.search;
  const rect = clicked.rect;
  clicked.rect = null;
  if (GLT.busy) return pushRoute(destination);
  if (target.k === "project" && !menuOpen) {
    setTransitioning(true);
    await ProjectLoader.run(target.p, target.index, rect, () => pushRoute(destination));
    setTransitioning(false);
    return;
  }
  await GLT.page(target, () => pushRoute(destination), { fromMenu: menuOpen });
}

// Internal links go through navigate(); in-page anchors scroll smoothly.
document.addEventListener(
  "click",
  (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as HTMLElement).closest?.("a");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    const href = link.getAttribute("href") || "";
    if (href === "#top" || link.hasAttribute("data-top")) {
      e.preventDefault();
      if (lenis) lenis.scrollTo(0, { duration: 1.8 });
      else scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { offset: -100, duration: 1.4 });
      else target.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/api/")) return;
    e.preventDefault();
    const host = link.closest<HTMLElement>("[data-peek],.pcard,.pj-next,.door-card,.jrow") || link;
    const r = host.getBoundingClientRect();
    clicked.rect = { l: r.left, t: r.top, w: r.width, h: r.height, r: Math.min(30, r.height / 2) };
    navigate(href);
  },
  true,
);

export { route, cleanup };
