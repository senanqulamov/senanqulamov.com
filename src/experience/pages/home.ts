// Home: the hero intro and the name drawn into the WebGL layer, the horizontal story, the marquee and the live auction demo.

import { liveLot } from "@/data/home";
import { $, $$, body, fonts, lerp } from "../dom";
import { coarse, gsap, isMobile, reduce, SplitText } from "../env";
import { cleanup, GL, lenis, mouse, page, scene } from "../state";
import { tr } from "../i18n";
import { buzz } from "../ui";
import { blip, SFX } from "../sound";

export function drawHeroName() {
  const el = $("#heroName");
  if (!GL || !el || !el.isConnected) return;
  const rows = $$(".row", el);
  GL.setName(el, (x, r) => {
    rows.forEach((row) => {
      const rg = document.createRange();
      rg.selectNodeContents(row);
      const rr = rg.getBoundingClientRect();
      const fs = parseFloat(getComputedStyle(el).fontSize);
      const tx = Number(gsap.getProperty(row, "x")) || 0;
      x.font = `700 ${fs}px ${fonts.display()}`;
      try {
        x.letterSpacing = -fs * 0.065 + "px";
      } catch (e) {}
      x.textBaseline = "alphabetic";
      x.fillStyle = "#fff";
      x.fillText(row.textContent, rr.left - r.left - tx, rr.top - r.top + rr.height * 0.79);
    });
  });
}
function heroNameToGL() {
  const el = $("#heroName");
  if (!GL || !el || reduce) return;
  drawHeroName();
  el.classList.add("gl-name");
  gsap.to(GL, { nameA: 1, duration: 0.6 });
}
export function playHero() {
  const rows = $$("#heroName .row");
  if (reduce) {
    body.classList.add("hero-in");
    return;
  }
  const sp = rows.map((r) => SplitText.create(r, { type: "chars", aria: "none" }));
  const tl = gsap.timeline({ delay: 0.1 });
  tl.from(
    sp[0].chars,
    {
      yPercent: 120,
      rotateX: -90,
      opacity: 0,
      transformOrigin: "50% 100%",
      duration: 1.4,
      ease: "expo.out",
      stagger: 0.045,
    },
    0,
  )
    .from(
      sp[1].chars,
      {
        yPercent: 120,
        rotateX: -90,
        opacity: 0,
        transformOrigin: "50% 100%",
        duration: 1.4,
        ease: "expo.out",
        stagger: { each: 0.045, from: "end" },
      },
      0.12,
    )
    .from(
      [".hero-top > *", ".hero-intro .btn"],
      { opacity: 0, y: 24, duration: 1, ease: "expo.out", stagger: 0.07 },
      0.5,
    )
    .from(".badge", { scale: 0, rotate: -120, duration: 1.4, ease: "expo.out" }, 0.9)
    .from([".hero-meta", ".portrait-cap"], { opacity: 0, y: 20, duration: 1, stagger: 0.1 }, 1);
  const p = $(".hero-intro p");
  if (p) {
    const ls = SplitText.create(p, { type: "lines", mask: "lines" });
    tl.from(ls.lines, { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.08 }, 0.55);
  }
  tl.add(() => heroNameToGL(), 2.3);
  // scroll: the name splits apart, the portrait recedes
  gsap.to(rows[0], {
    xPercent: -14,
    ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(rows[1], {
    xPercent: 12,
    ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero-intro,.hero-top", {
    opacity: 0,
    y: -60,
    ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "60% top", scrub: true },
  });
  gsap.to("#pSlot", {
    yPercent: -18,
    scale: 0.9,
    ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
  });
}
export function mountHome(view: HTMLElement) {
  const nameEl = $("#heroName");
  const mq = $("#mq");
  let mqX = 0;
  const story = $("#story"),
    track = $("#track"),
    sProg = $("#sProg"),
    panels = $$(".panel:not(.intro)", track);
  if (!isMobile()) {
    story.classList.add("pinned");
    const dist = () => track.scrollWidth - innerWidth;
    const st = gsap.to(track, {
      x: () => -dist(),
      ease: "none",
      scrollTrigger: {
        trigger: story,
        start: "top top",
        end: () => "+=" + dist(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (s) => {
          scene.spin = s.progress;
          sProg.style.transform = `scaleX(${s.progress.toFixed(3)})`;
        },
      },
    });
    panels.forEach((p) => {
      gsap.from($$("h3,p,.scene-n", p), {
        y: 60,
        opacity: 0,
        stagger: 0.08,
        ease: "expo.out",
        duration: 1,
        scrollTrigger: { trigger: p, containerAnimation: st, start: "left 80%", once: true },
      });
    });
  }
  if (body.classList.contains("ready")) playHero();
  let slotX = 0,
    slotY = 0;
  const weights = new WeakMap<HTMLElement, number>();
  page.tick = (dt, t) => {
    const v = lenis ? Math.abs(lenis.velocity || 0) : 0;
    mqX -= (40 + v * 14) * dt;
    const w = mq.scrollWidth / 2;
    if (-mqX > w) mqX += w;
    mq.style.transform = `translate3d(${mqX.toFixed(1)}px,0,0)`;
    panels.forEach((p, i) => {
      const pr = p.getBoundingClientRect();
      const on = pr.left < innerWidth * 0.62 && pr.right > innerWidth * 0.3;
      if (on && !p.classList.contains("act")) {
        GL && (GL.pulse = 0.6);
        SFX.glass(i + 2);
      }
      p.classList.toggle("act", on);
    });
    const slot = $("#pSlot");
    if (slot && !coarse) {
      slotX = lerp(slotX, (mouse.x / innerWidth - 0.5) * -22, 0.06);
      slotY = lerp(slotY, (mouse.y / innerHeight - 0.5) * -16, 0.06);
      slot.style.translate = `${slotX.toFixed(2)}px ${slotY.toFixed(2)}px`;
    }
    if (nameEl && GL) {
      const rows = $$(".row", nameEl);
      GL.rows = rows.map(
        (r) =>
          ((Number(gsap.getProperty(r, "xPercent")) || 0) / 100) * r.offsetWidth +
          (Number(gsap.getProperty(r, "x")) || 0),
      );
    }
    if (body.classList.contains("ready") && nameEl && !nameEl.classList.contains("gl-name")) {
      const hr = nameEl.getBoundingClientRect();
      if (hr.bottom > 0 && !coarse) {
        const cs = $$(".row > div, .row > span", nameEl);
        cs.forEach((c, i) => {
          const b = c.getBoundingClientRect();
          const d = Math.hypot(mouse.x - (b.left + b.width / 2), (mouse.y - (b.top + b.height / 2)) * 0.7);
          const target = mouse.active ? 300 + 600 * Math.exp(-(d * d) / (2 * 190 * 190)) : 700;
          const w = lerp(weights.get(c) || 700, target, 0.1);
          weights.set(c, w);
          c.style.fontWeight = w.toFixed(0);
          c.style.fontVariationSettings = `"wght" ${w.toFixed(0)}`;
        });
      }
    }
    Lot.tick(t);
  };
  Lot.mount();
}

const Lot = (() => {
  const L = { bid: liveLot.startBid, reserve: liveLot.reserve, end: 0, lead: false, running: false };
  let E: Record<string, any> = {},
    rivalT = 0,
    ob: IntersectionObserver = null;
  const azn = (v) => "AZN " + v.toLocaleString("en-US");
  function feed(t: string, me: boolean) {
    const li = document.createElement("li");
    li.textContent = t;
    if (me) li.className = "me";
    E.feed.prepend(li);
    while (E.feed.children.length > 4) E.feed.lastChild.remove();
  }
  function place(amount: number, me: boolean) {
    if (!L.running) return;
    L.bid += amount;
    L.lead = me;
    if (L.end - performance.now() < 5000) {
      L.end += 8000;
      feed(tr("Extra time, +8 seconds"), false);
    }
    GL && (GL.pulse = me ? 1 : 0.6);
    SFX.coin();
    if (me) buzz(12);
    feed(
      (me ? tr("You") : liveLot.rivals[(Math.random() * liveLot.rivals.length) | 0]) +
        " " +
        tr("bid") +
        " " +
        azn(L.bid),
      me,
    );
    E.bid.textContent = azn(L.bid);
    E.res.style.width = Math.min(100, (L.bid / L.reserve) * 100) + "%";
    E.st.textContent =
      L.bid >= L.reserve
        ? me
          ? tr("Reserve met. You are leading.")
          : tr("Reserve met. Someone else is leading.")
        : me
          ? tr("You are leading. Reserve not met yet.")
          : tr("You have been outbid. Reserve not met yet.");
    blip(me ? 880 : 520);
  }
  function start() {
    Object.assign(L, { bid: liveLot.startBid, lead: false, running: true });
    L.end = performance.now() + liveLot.seconds * 1000;
    E.feed.innerHTML = "";
    E.done.classList.remove("on");
    E.bid.textContent = azn(L.bid);
    E.res.style.width = "60%";
    E.st.textContent = tr("Bidding is open. Reserve not met yet.");
    E.btns.forEach((b) => (b.disabled = false));
    rivalT = performance.now() + 2500;
  }
  return {
    mount() {
      E = {
        bid: $("#lotBid"),
        time: $("#lotTime"),
        box: $("#lotTimeBox"),
        res: $("#lotRes"),
        st: $("#lotStatus"),
        feed: $("#feed"),
        done: $("#lotDone"),
        btns: $$(".bids button"),
      };
      L.running = false;
      E.btns.forEach((b: HTMLButtonElement) => b.addEventListener("click", () => place(+b.dataset.b, true)));
      $("#lotAgain").addEventListener("click", start);
      ob = new IntersectionObserver(
        (es, o) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              start();
              o.disconnect();
            }
          }),
        { threshold: 0.5 },
      );
      ob.observe($("#lot"));
      cleanup.push(() => {
        ob.disconnect();
        L.running = false;
      });
    },
    tick(now: number) {
      if (!L.running) return;
      const left = Math.max(0, L.end - now);
      E.time.textContent = "00:" + String(Math.ceil(left / 1000)).padStart(2, "0");
      E.box.classList.toggle("hot", left < 5000);
      if (now > rivalT) {
        if ((L.lead || Math.random() < 0.4) && L.bid < 2450)
          place([50, 100, 100, 150][(Math.random() * 4) | 0], false);
        rivalT = now + 1800 + Math.random() * 3200;
      }
      if (left <= 0) {
        L.running = false;
        E.btns.forEach((b) => (b.disabled = true));
        const won = L.lead && L.bid >= L.reserve;
        $("#doneT").textContent = won
          ? tr("Your table is booked.")
          : L.lead
            ? tr("Reserve not met.")
            : tr("Sold to another bidder.");
        $("#doneP").textContent = tr(
          won
            ? "Seat 48, Friday 20:00. Final bid " + azn(L.bid) + "."
            : L.lead
              ? "The host keeps the table this time. Bid higher next round."
              : "Final bid " + azn(L.bid) + ". Try a bigger jump.",
        );
        E.done.classList.add("on");
        blip(won ? 1320 : 330, 0.5);
      }
    },
  };
})();
