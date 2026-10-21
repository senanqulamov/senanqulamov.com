// The library: a 3D ring of books you can spin and open. Phones get a swipeable shelf of flip cards.

import { bookThemes, books } from "@/data/books";
import { $, $$, esc } from "../dom";
import { gsap } from "../env";
import { cleanup, mouse, route } from "../state";
import { tr } from "../i18n";
import { buzz } from "../ui";
import { blip, SFX } from "../sound";

export const Library = (() => {
  let shelf: HTMLElement[],
    ring: HTMLElement,
    stage: HTMLElement,
    vis: HTMLElement[] = [],
    step = 0,
    R = 0,
    ang = 0,
    target = 0,
    active = -1,
    drag: { x: number; t: number; moved: boolean } | null = null,
    raf = 0,
    idle = 0,
    wheelTimer = 0,
    selectTimer = 0;
  function dims() {
    const m = innerWidth < 700;
    return { w: m ? 112 : 184, h: m ? 166 : 270 };
  }
  function layout() {
    vis = shelf.filter((b) => !b.hidden);
    const n = vis.length,
      d = dims();
    step = 360 / n;
    R = Math.max(d.w * 1.4, (d.w * (innerWidth < 700 ? 1.02 : 1.32) * n) / (2 * Math.PI));
    vis.forEach((b, i) => {
      b.dataset.a = String(i * step);
      b.style.setProperty("--a", i * step + "deg");
      b.style.setProperty("--R", R + "px");
    });
  }
  function nearest(i: number) {
    const t = -i * step;
    let k = Math.round((ang - t) / 360);
    return t + k * 360;
  }
  function select(i: number, open = true) {
    if (!vis.length) return;
    i = (i + vis.length) % vis.length;
    const el = vis[i];
    active = i;
    target = nearest(i);
    idle = performance.now();
    shelf.forEach((b) => {
      b.classList.toggle("on", b === el);
      b.classList.remove("open");
    });
    ring.classList.add("has-on");
    clearTimeout(selectTimer);
    if (open) selectTimer = window.setTimeout(() => el.classList.add("open"), 650);
    const b = books[+el.dataset.bk];
    $("#libDetail").innerHTML =
      `<div><span class="tag">${tr(bookThemes[b.theme])}</span><h3>${esc(b.title)}</h3><p class="muted">${esc(b.author)}, ${b.year}</p></div><div><p class="muted" style="font-size:13px;margin:0 0 10px">${tr("Why it is on the shelf")}</p><p class="why">${esc(b.why)}</p>${b.quote ? `<blockquote>${esc(b.quote)}</blockquote>` : ""}</div>`;
    $("#libCount").textContent = `${i + 1} / ${vis.length}`;
    gsap.fromTo(
      "#libDetail > *",
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.08 },
    );
    blip(420 + i * 30, 0.15);
  }
  function tick() {
    if (!ring.isConnected) {
      cancelAnimationFrame(raf);
      return;
    }
    if (!drag && active < 0) target -= 0.06;
    if (!drag && active >= 0 && performance.now() - idle > 14000) {
      shelf.forEach((b) => b.classList.remove("on", "open"));
      ring.classList.remove("has-on");
      active = -1;
    }
    ang += (target - ang) * 0.075;
    const tilt = -8 + (mouse.y / innerHeight - 0.5) * 6;
    ring.style.transform = `translateZ(${-R}px) rotateX(${tilt.toFixed(2)}deg) rotateY(${ang.toFixed(2)}deg)`;
    vis.forEach((b) => {
      let rel = ((((+b.dataset.a + ang) % 360) + 540) % 360) - 180;
      const f = Math.cos((rel * Math.PI) / 180);
      b.style.setProperty("--f", f.toFixed(3));
    });
    raf = requestAnimationFrame(tick);
  }
  return {
    mount() {
      shelf = $$(".book3d");
      ring = $("#libRing");
      stage = $("#libStage");
      ang = target = 0;
      active = -1;
      layout();
      shelf.forEach((b) =>
        b.addEventListener("click", () => {
          if (drag && drag.moved) return;
          const i = vis.indexOf(b);
          if (i === active) b.classList.toggle("open");
          else select(i);
        }),
      );
      stage.addEventListener("pointerdown", (e) => {
        drag = { x: e.clientX, t: target, moved: false };
        stage.setPointerCapture?.(e.pointerId);
      });
      stage.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x;
        if (Math.abs(dx) > 6) drag.moved = true;
        target = drag.t + dx * 0.22;
        idle = performance.now();
        if (drag.moved && active >= 0) {
          shelf.forEach((b) => b.classList.remove("open"));
        }
      });
      const up = () => {
        if (!drag) return;
        const moved = drag.moved;
        setTimeout(() => {
          drag = null;
        }, 0);
        if (moved) {
          const i = ((Math.round(-target / step) % vis.length) + vis.length) % vis.length;
          select(i, false);
        }
      };
      stage.addEventListener("pointerup", up);
      stage.addEventListener("pointercancel", up);
      stage.addEventListener(
        "wheel",
        (e) => {
          e.preventDefault();
          target -= (e.deltaY + e.deltaX) * 0.12;
          idle = performance.now();
          clearTimeout(wheelTimer);
          wheelTimer = window.setTimeout(() => {
            const i = ((Math.round(-target / step) % vis.length) + vis.length) % vis.length;
            select(i, false);
          }, 260);
        },
        { passive: false },
      );
      $("#libPrev").addEventListener("click", () => select(active < 0 ? 0 : active - 1));
      $("#libNext").addEventListener("click", () => select(active + 1));
      $$("[data-bf]").forEach((b) =>
        b.addEventListener("click", () => {
          $$("[data-bf]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          const f = b.dataset.bf;
          shelf.forEach((k) => {
            k.hidden = !(f === "all" || k.dataset.t === f);
            k.classList.remove("on", "open");
          });
          $$(".mbook").forEach((k) => {
            k.hidden = !(f === "all" || k.dataset.t === f);
            k.classList.remove("flip");
          });
          const lm = $("#libMob");
          if (lm) {
            lm.scrollLeft = 0;
            lm.dispatchEvent(new Event("scroll"));
          }
          layout();
          select(0);
        }),
      );
      const kd = (e: KeyboardEvent) => {
        if (route.k !== "library" || /input|textarea/i.test(document.activeElement.tagName)) return;
        if (e.key === "ArrowRight") {
          select(active + 1);
          e.preventDefault();
        }
        if (e.key === "ArrowLeft") {
          select(active < 0 ? 0 : active - 1);
          e.preventDefault();
        }
      };
      addEventListener("keydown", kd);
      addEventListener("resize", layout);
      cleanup.push(() => {
        removeEventListener("keydown", kd);
        removeEventListener("resize", layout);
        cancelAnimationFrame(raf);
      });
      const mob = $("#libMob");
      if (mob) {
        $$(".mbook", mob).forEach((b) =>
          b.addEventListener("click", () => {
            b.classList.toggle("flip");
            SFX.glass(+b.dataset.bk);
            buzz(6);
          }),
        );
        const tilt = () => {
          const r = mob.getBoundingClientRect(),
            cx = r.left + r.width / 2;
          $$(".mbook:not([hidden])", mob).forEach((b) => {
            const br = b.getBoundingClientRect();
            const d = (br.left + br.width / 2 - cx) / r.width;
            b.style.setProperty("--ry", (d * -34).toFixed(1) + "deg");
            b.style.setProperty("--sc", (1 - Math.min(0.14, Math.abs(d) * 0.2)).toFixed(3));
          });
        };
        mob.addEventListener("scroll", tilt, { passive: true });
        requestAnimationFrame(tilt);
      }
      $("#libDetail").innerHTML =
        `<p class="muted" style="margin:0">${tr("Pick a book from the ring to read why it is on the shelf.")}</p>`;
      $("#libCount").textContent = tr(`${vis.length} books`);
      raf = requestAnimationFrame(tick);
    },
  };
})();
