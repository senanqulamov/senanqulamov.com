import { $, $$, esc, pad2 } from "../dom";
import { gsap } from "../env";
import { lenis, route } from "../state";
import { blip } from "../sound";

export const Lightbox = (() => {
  const lb = $("#lb"),
    stage = $("#lbStage"),
    track = $("#lbTrack"),
    closeButton = $("#lbClose");
  let list: {
      src: string;
      alt?: string;
      caption?: string;
      place?: string;
      year?: number;
      credit?: string;
    }[] = [],
    host = "",
    i = 0,
    open = false,
    origin: HTMLElement | null = null;
  let pageY = 0,
    oldOverflow = "",
    oldHeight = "";
  let pointer: {
    id: number;
    x: number;
    y: number;
    time: number;
    dx: number;
    direction: "pending" | "x" | "y";
  } | null = null;

  const frames = () => $$<HTMLElement>(".lb-frame", track);
  const frame = () => frames()[i];
  const baseX = (index = i) => {
    const item = frames()[index];
    return item ? stage.clientWidth / 2 - item.offsetLeft - item.offsetWidth / 2 : 0;
  };
  const setTrack = (x = baseX()) => gsap.set(track, { x });
  const springBack = () => gsap.to(track, { x: baseX(), duration: 0.6, ease: "expo.out", overwrite: true });
  const focusable = () =>
    $$<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])", lb).filter(
      (x) => !x.hidden,
    );

  function render() {
    const escapedHost = esc(host);
    track.innerHTML = list
      .map(
        (item, k) =>
          `<article class="lb-frame" data-index="${k}" aria-label="Screen ${k + 1} of ${list.length}"><div class="bw-bar"><i></i><i></i><i></i><span>${escapedHost}</span></div><div class="lb-view" data-lenis-prevent><img src="${esc(item.src)}" alt="${esc(item.alt || `Project screen ${k + 1}`)}" draggable="false">${item.caption ? `<p class="lb-caption">${esc(item.caption)}${item.place || item.year ? `<small>${esc([item.place, item.year].filter(Boolean).join(" · "))}</small>` : ""}${item.credit ? `<small>Photo: ${esc(item.credit)}</small>` : ""}</p>` : ""}</div></article>`,
      )
      .join("");
    $("#lbThumbs").innerHTML = list
      .map(
        (item, k) =>
          `<button data-k="${k}" aria-label="Screen ${k + 1}"><img src="${esc(item.src)}" alt=""></button>`,
      )
      .join("");
  }
  function sync() {
    $("#lbCount").textContent = `${pad2(i + 1)} / ${pad2(list.length)}`;
    frames().forEach((item, k) => item.classList.toggle("is-active", k === i));
    $$("#lbThumbs button").forEach((button, k) => {
      const active = k === i;
      button.classList.toggle("on", active);
      button.setAttribute("aria-current", String(active));
    });
    $("#lbThumbs button.on")?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    ($("#lbPrev") as HTMLButtonElement).disabled = i === 0;
    ($("#lbNext") as HTMLButtonElement).disabled = i === list.length - 1;
  }
  function go(next: number, animate = true) {
    const target = Math.max(0, Math.min(next, list.length - 1));
    if (target === i && animate) return springBack();
    const changed = target !== i;
    i = target;
    if (changed) {
      frames().forEach((item, k) => {
        if (k !== i) gsap.set(item, { clearProps: "transform,opacity" });
      });
    }
    const view = frame()?.querySelector<HTMLElement>(".lb-view");
    if (view) view.scrollTop = 0;
    sync();
    gsap.killTweensOf(track);
    animate ? springBack() : setTrack();
    if (changed) blip(600 + i * 40, 0.12);
  }
  function lock() {
    pageY = scrollY;
    oldOverflow = document.body.style.overflow;
    oldHeight = document.body.style.height;
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    lenis?.stop();
  }
  function unlock() {
    document.body.style.overflow = oldOverflow;
    document.body.style.height = oldHeight;
    lenis?.start();
    scrollTo(0, pageY);
  }
  function openAt(index: number, from?: HTMLElement) {
    if (!list.length || open) return;
    i = Math.max(0, Math.min(index, list.length - 1));
    origin = from || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    open = true;
    lock();
    render();
    lb.classList.add("on");
    sync();
    requestAnimationFrame(() => {
      setTrack();
      const item = frame();
      const source = origin?.getBoundingClientRect();
      if (item && source) {
        const target = item.getBoundingClientRect();
        gsap.fromTo(
          item,
          {
            x: source.left + source.width / 2 - target.left - target.width / 2,
            y: source.top + source.height / 2 - target.top - target.height / 2,
            scale: source.width / target.width,
            opacity: 0.6,
          },
          { x: 0, y: 0, scale: 1, opacity: 1, duration: 1, ease: "expo.inOut" },
        );
      }
      gsap.fromTo(".lb-bg", { opacity: 0 }, { opacity: 1, duration: 0.5 });
      gsap.fromTo(
        [".lb-top", ".lb-thumbs", ".lb-arrow"],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.65, delay: 0.25, stagger: 0.05 },
      );
      closeButton.focus({ preventScroll: true });
    });
  }
  function close() {
    if (!open) return;
    open = false;
    const item = frame(),
      source = origin?.getBoundingClientRect();
    const done = () => {
      lb.classList.remove("on");
      gsap.set([item, ".lb-top", ".lb-thumbs", ".lb-arrow", ".lb-bg"], { clearProps: "all" });
      unlock();
      origin?.focus({ preventScroll: true });
    };
    if (!item || !source) return done();
    const target = item.getBoundingClientRect();
    gsap.to([".lb-top", ".lb-thumbs", ".lb-arrow"], { opacity: 0, duration: 0.2 });
    gsap.to(".lb-bg", { opacity: 0, duration: 0.45, delay: 0.15 });
    gsap.to(item, {
      x: source.left + source.width / 2 - target.left - target.width / 2,
      y: source.top + source.height / 2 - target.top - target.height / 2,
      scale: source.width / target.width,
      opacity: 0.6,
      duration: 0.8,
      ease: "expo.inOut",
      onComplete: done,
    });
  }

  closeButton.addEventListener("click", close);
  $(".lb-bg", lb).addEventListener("click", close);
  $("#lbPrev").addEventListener("click", () => go(i - 1));
  $("#lbNext").addEventListener("click", () => go(i + 1));
  $("#lbThumbs").addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("button[data-k]");
    if (button) go(Number(button.dataset.k));
  });
  addEventListener(
    "keydown",
    (event) => {
      if (!open) return;
      if (event.key === "Escape") return close();
      if (event.key === "ArrowLeft") return go(i - 1);
      if (event.key === "ArrowRight") return go(i + 1);
      if (event.key === "Home") return go(0);
      if (event.key === "End") return go(list.length - 1);
      if (event.key === "Tab") {
        const items = focusable(),
          first = items[0],
          last = items[items.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    true,
  );
  stage.addEventListener("pointerdown", (event) => {
    if (!open || event.button !== 0) return;
    pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
      dx: 0,
      direction: "pending",
    };
    stage.setPointerCapture(event.pointerId);
    gsap.killTweensOf(track);
  });
  stage.addEventListener("pointermove", (event) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const dx = event.clientX - pointer.x,
      dy = event.clientY - pointer.y;
    if (pointer.direction === "pending" && Math.hypot(dx, dy) >= 8)
      pointer.direction = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (pointer.direction !== "x") return;
    event.preventDefault();
    pointer.dx = dx;
    stage.dataset.dragging = "true";
    const resisted = (i === 0 && dx > 0) || (i === list.length - 1 && dx < 0);
    setTrack(baseX() + (resisted ? dx * 0.32 : dx));
  });
  const release = (event: PointerEvent) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const p = pointer;
    pointer = null;
    stage.dataset.dragging = "false";
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    if (p.direction !== "x") return;
    const fast = Math.abs(p.dx) / Math.max(1, performance.now() - p.time) > 0.5;
    if (Math.abs(p.dx) > stage.clientWidth * 0.18 || fast) go(i + (p.dx < 0 ? 1 : -1));
    else springBack();
  };
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  addEventListener("resize", () => open && setTrack());
  return {
    openAt,
    mount(
      items: (
        | string
        | { src: string; alt?: string; caption?: string; place?: string; year?: number; credit?: string }
      )[],
    ) {
      list = (items || []).map((item) => (typeof item === "string" ? { src: item } : item));
      host = $(".tour-frame .bw-bar span")?.textContent || "";
      $("#lbTitle").textContent = route && route.k === "project" ? route.p.title : "";
    },
  };
})();
