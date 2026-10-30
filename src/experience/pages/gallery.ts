import { galleryPhotos } from "@/data/gallery";
import { gsap, reduce, ScrollTrigger } from "../env";
import { cleanup } from "../state";
import { Lightbox } from "./lightbox";

type Column = {
  track: HTMLElement;
  height: number;
  images: { element: HTMLElement; top: number; height: number }[];
};

const speed = [1, 0.75, 1.15, 0.85, 0.95];
const wrap = (value: number, length: number) => ((value % length) + length) % length;
const columnCount = () => (innerWidth >= 1440 ? 5 : innerWidth >= 1100 ? 4 : innerWidth >= 768 ? 3 : 2);

export function mountGallery(view: HTMLElement) {
  const section = view.querySelector<HTMLElement>(".gallery");
  const wall = view.querySelector<HTMLElement>("#galleryWall");
  const grid = view.querySelector<HTMLElement>("#galleryGrid");
  const progress = view.querySelector<HTMLElement>("#galleryProgress");
  if (!section || !wall || !grid || !progress) return;
  if (grid.dataset.galleryMounted === "true") return;
  grid.dataset.galleryMounted = "true";

  // Keep the React-rendered originals through resize rebuilds; copies are disposable.
  const originals = Array.from(grid.querySelectorAll<HTMLElement>("[data-gallery-photo]"));
  let columns: Column[] = [];
  let pinTween: gsap.core.Tween | null = null;
  let entrance: gsap.core.Tween | null = null;
  let imageEntrance: gsap.core.Tween | null = null;
  let resizeTimer = 0;
  let disposed = false;
  let viewportHeight = 0;
  let phone = false;

  const onClick = (event: MouseEvent) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>("[data-gallery-open]");
    if (!button || !grid.contains(button)) return;
    Lightbox.mount(galleryPhotos);
    Lightbox.openAt(Number(button.dataset.galleryOpen), button);
  };
  grid.addEventListener("click", onClick);
  Lightbox.mount(galleryPhotos);

  function render(value: number) {
    columns.forEach(({ track, height, images }, index) => {
      const distance = value * speed[index] * height;
      const y = index % 2 === 0 ? -wrap(distance, height) : -height + wrap(distance, height);
      track.style.transform = `translate3d(0, ${y}px, 0)`;
      if (phone) return;
      images.forEach(({ element, top, height: imageHeight }) => {
        const imageTop = top + y;
        if (imageTop > viewportHeight || imageTop + imageHeight < 0) return;
        const phase = (viewportHeight - imageTop) / (viewportHeight + imageHeight);
        element.style.setProperty("--drift", `${(-4 + phase * 8).toFixed(2)}%`);
      });
    });
    progress.style.transform = `scaleX(${value})`;
  }

  function rebuild() {
    pinTween?.kill();
    entrance?.kill();
    imageEntrance?.kill();
    pinTween = entrance = imageEntrance = null;
    document.body.classList.remove("gallery-pinned");
    gsap.set(progress, { clearProps: "transform" });
    grid.replaceChildren();
    columns = [];
    viewportHeight = wall.clientHeight;
    phone = innerWidth < 768;

    const count = columnCount();
    const gap = innerWidth < 768 ? 6 : 8;
    const available = (grid.clientWidth - gap * (count + 1)) / count;
    const slots: HTMLElement[][] = Array.from({ length: count }, () => []);
    const heights = Array.from({ length: count }, () => 0);
    const counts = Array.from({ length: count }, () => 0);

    originals.forEach((card, index) => {
      const minimum = Math.min(...counts);
      const candidates = counts.map((length, i) => (length === minimum ? i : -1)).filter((i) => i >= 0);
      const target = candidates.reduce((best, i) => (heights[i] < heights[best] ? i : best), candidates[0]);
      slots[target].push(card);
      counts[target]++;
      heights[target] += (available * galleryPhotos[index].height) / galleryPhotos[index].width + gap;
    });

    section.classList.toggle("gallery-static", reduce);
    slots.forEach((items, index) => {
      const column = document.createElement("div");
      column.className = "gallery-column";
      const track = document.createElement("div");
      track.className = "gallery-track";
      const cycle = document.createElement("div");
      cycle.className = "gallery-cycle";
      cycle.append(...items);
      column.append(track);
      track.append(cycle);
      grid.append(column);

      if (reduce) return;
      // A cycle must cover the viewport even after translating by one whole copy.
      const seed = [...items];
      while (cycle.offsetHeight < viewportHeight * 1.3) {
        seed.forEach((card) => cycle.append(makeCopy(card)));
      }
      const duplicate = cycle.cloneNode(true) as HTMLElement;
      duplicate.setAttribute("aria-hidden", "true");
      duplicate.querySelectorAll<HTMLButtonElement>("button").forEach((button) => (button.tabIndex = -1));
      duplicate.querySelectorAll<HTMLElement>(".gallery-image").forEach((image) => {
        image.classList.add("is-loaded");
      });
      track.append(duplicate);
      const cycleHeight = cycle.offsetHeight;
      const images = Array.from(track.querySelectorAll<HTMLElement>(".gallery-frame")).map((frame) => ({
        element: frame.querySelector<HTMLElement>(".gallery-image img")!,
        top: frame.offsetTop,
        height: frame.offsetHeight,
      }));
      columns[index] = { track, height: cycleHeight, images };
      track.style.transform = `translate3d(0, ${index % 2 ? -cycleHeight : 0}px, 0)`;
    });

    if (reduce) {
      entrance = gsap.fromTo(wall, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: "power2.out" });
      ScrollTrigger.refresh();
      return;
    }

    const entranceTargets = Array.from(grid.querySelectorAll<HTMLElement>(".gallery-column"));
    entrance = gsap.fromTo(
      entranceTargets,
      { yPercent: 12, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: wall, start: "top 95%", once: true },
      },
    );
    imageEntrance = gsap.fromTo(
      grid.querySelectorAll(".gallery-image"),
      { scale: 1.15 },
      {
        scale: 1,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.005,
        scrollTrigger: { trigger: wall, start: "top 95%", once: true },
      },
    );
    const state = { value: 0 };
    pinTween = gsap.to(state, {
      value: 1,
      ease: "none",
      onUpdate: () => render(state.value),
      scrollTrigger: {
        trigger: wall,
        start: "top top",
        end: () => `+=${innerHeight * (innerWidth < 768 ? 2 : 3)}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onToggle: (self) => document.body.classList.toggle("gallery-pinned", self.isActive),
      },
    });
    render(0);
    ScrollTrigger.refresh();
  }

  function makeCopy(card: HTMLElement) {
    const copy = card.cloneNode(true) as HTMLElement;
    copy.setAttribute("aria-hidden", "true");
    copy.querySelectorAll<HTMLButtonElement>("button").forEach((button) => (button.tabIndex = -1));
    copy.querySelector<HTMLElement>(".gallery-image")?.classList.add("is-loaded");
    return copy;
  }

  const resize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (!disposed) rebuild();
    }, 180);
  };
  addEventListener("resize", resize);
  rebuild();
  cleanup.push(() => {
    disposed = true;
    clearTimeout(resizeTimer);
    removeEventListener("resize", resize);
    grid.removeEventListener("click", onClick);
    pinTween?.kill();
    entrance?.kill();
    imageEntrance?.kill();
    grid.replaceChildren(...originals);
    delete grid.dataset.galleryMounted;
    document.body.classList.remove("gallery-pinned");
  });
}
