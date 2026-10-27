// Essay reader: focus mode, a progress meter, reading aloud with word highlighting, and sharing a selected quote.

import type { Essay as EssayData } from "@/data/essays";
import { profile } from "@/data/profile";
import { $, $$, clamp } from "../dom";
import { coarse } from "../env";
import { cleanup, GL, lenis, page } from "../state";
import { tr } from "../i18n";
import { copy } from "../ui";
import { SFX } from "../sound";

export const Essay = (() => {
  const synth = window.speechSynthesis || null;
  let blocks: HTMLElement[] = [],
    qi = 0,
    playing = false,
    paused = false,
    rate = 1,
    voice: SpeechSynthesisVoice = null,
    art: HTMLElement = null,
    b: EssayData = null;
  const pickVoice = () => {
    if (!synth) return;
    const vs = synth.getVoices().filter((v) => /^en/i.test(v.lang));
    voice =
      vs.find((v) => /Daniel|Google UK English Male|Arthur|Natural/i.test(v.name)) ||
      vs.find((v) => /en-GB/i.test(v.lang)) ||
      vs[0] ||
      null;
  };
  if (synth) {
    pickVoice();
    synth.addEventListener && synth.addEventListener("voiceschanged", pickVoice);
  }
  function wrapWords(el: HTMLElement) {
    if (el.dataset.wrapped) return;
    el.dataset.wrapped = "1";
    let off = 0;
    const walk = (n) => {
      [...n.childNodes].forEach((c) => {
        if (c.nodeType === 1 && (c as HTMLElement).matches(".drop-word, .drop, .drop-rest, .sr")) {
          const word = (c as HTMLElement).dataset.word;
          if (word) off += word.length;
          return;
        }
        if (c.nodeType === 3) {
          const f = document.createDocumentFragment();
          c.nodeValue.split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) {
              f.appendChild(document.createTextNode(w));
              off += w.length;
              return;
            }
            const s = document.createElement("span");
            s.className = "ww";
            s.dataset.o = String(off);
            s.textContent = w;
            off += w.length;
            f.appendChild(s);
          });
          c.replaceWith(f);
        } else walk(c);
      });
    };
    walk(el);
  }
  function speak(i: number) {
    if (!synth) return;
    qi = i;
    if (qi >= blocks.length) {
      stop();
      return;
    }
    const el = blocks[qi];
    wrapWords(el);
    $$(".reading", art).forEach((x) => x.classList.remove("reading"));
    el.classList.add("reading");
    const top = el.getBoundingClientRect().top + scrollY - innerHeight * 0.32;
    lenis ? lenis.scrollTo(top, { duration: 1.1 }) : scrollTo({ top, behavior: "smooth" });
    const words = $$(".ww", el);
    const u = new SpeechSynthesisUtterance(el.dataset.readText || el.textContent);
    if (voice) u.voice = voice;
    u.rate = rate;
    u.lang = "en-GB";
    u.onboundary = (e) => {
      if (e.name && e.name !== "word") return;
      const o = e.charIndex;
      let hit = null;
      for (const w of words) {
        if (+w.dataset.o <= o) hit = w;
        else break;
      }
      words.forEach((w) => w.classList.toggle("spoken", +w.dataset.o <= o));
      if (hit) hit.classList.add("now");
      setTimeout(() => hit && hit.classList.remove("now"), 220);
      GL && (GL.pulse = 0.22);
    };
    u.onend = () => {
      words.forEach((w) => w.classList.add("spoken"));
      if (playing && !paused) speak(qi + 1);
    };
    synth.speak(u);
    $("#lsWhere").textContent = `Paragraph ${qi + 1} of ${blocks.length}`;
    $("#lsProg").style.transform = `scaleX(${(qi + 1) / blocks.length})`;
  }
  function start() {
    if (!synth) return;
    blocks = $$(
      ":scope > p, :scope > h2, :scope > h3, :scope > blockquote, :scope > ul > li, :scope > ol > li",
      art,
    );
    const r = innerHeight * 0.45;
    let from = blocks.findIndex((x) => x.getBoundingClientRect().bottom > r);
    if (from < 0) from = 0;
    playing = true;
    paused = false;
    $("#listenBar").hidden = false;
    setIcon();
    synth.cancel();
    speak(from);
    SFX.chord();
  }
  function stop() {
    playing = false;
    paused = false;
    synth && synth.cancel();
    $("#listenBar") && ($("#listenBar").hidden = true);
    $$(".reading", art || document).forEach((x) => x.classList.remove("reading"));
  }
  function setIcon() {
    const p = $("#lsIcon");
    if (p) p.setAttribute("d", String(paused ? "M8 5v14l11-7z" : "M7 5h3v14H7zM14 5h3v14h-3z"));
    $("#lsPlay") && $("#lsPlay").setAttribute("aria-label", String(paused ? "Resume" : "Pause"));
  }
  function toggle() {
    if (!playing) return start();
    if (paused) {
      paused = false;
      synth.resume();
      if (!synth.speaking) speak(qi);
    } else {
      paused = true;
      synth.pause();
    }
    setIcon();
  }
  // share a selected quote
  function selShare() {
    const box = $("#selShare");
    const s = getSelection();
    const t = s && String(s).trim();
    if (!t || t.length < 12 || t.length > 300 || !art.contains(s.anchorNode)) {
      box.hidden = true;
      return;
    }
    const r = s.getRangeAt(0).getBoundingClientRect();
    box.hidden = false;
    box.style.left = Math.max(10, Math.min(innerWidth - 260, r.left + r.width / 2 - 120)) + "px";
    box.style.top = r.top - 56 + "px";
    const url = `${profile.site}/journal/${b.slug}`,
      txt = `“${t}” — Senan Qulamov`;
    box.dataset.t = txt;
    $<HTMLAnchorElement>("[data-act=li]", box).href =
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    $<HTMLAnchorElement>("[data-act=x]", box).href =
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(url)}`;
  }
  return {
    mount(post: EssayData) {
      b = post;
      art = $("#essay");
      const bar = $("#readBar"),
        essBar = $("#essBar"),
        essLeft = $("#essLeft"),
        essSec = $("#essSec"),
        links = $$(".toc a"),
        heads = links.map((a) => document.getElementById(a.getAttribute("href").slice(1)));
      const all = $$(":scope > *", art);
      let lastSec = -1;
      if (!synth) $("#listenBtn").hidden = true;
      $("#listenBtn").addEventListener("click", toggle);
      $("#lsPlay").addEventListener("click", toggle);
      $("#lsStop").addEventListener("click", stop);
      $("#lsRate").addEventListener("click", (e) => {
        rate = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : 1;
        (e.currentTarget as HTMLElement).textContent = rate + "×";
        if (playing && !paused) {
          synth.cancel();
          speak(qi);
        }
      });
      const fb = $("#focusBtn");
      const fsaved = localStorage.getItem("sq-focus");
      if (fsaved === "0" || coarse) {
        art.classList.remove("focus");
        fb.setAttribute("aria-pressed", "false");
      }
      fb.addEventListener("click", () => {
        const on = !art.classList.contains("focus");
        art.classList.toggle("focus", on);
        fb.setAttribute("aria-pressed", String(on));
        localStorage.setItem("sq-focus", on ? "1" : "0");
      });
      const mu = () => setTimeout(selShare, 10);
      document.addEventListener("mouseup", mu);
      document.addEventListener("keyup", mu);
      $("#selShare").addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest<HTMLElement>("[data-act=copy]"))
          copy($("#selShare").dataset.t, "Quote copied");
      });
      cleanup.push(() => {
        stop();
        document.removeEventListener("mouseup", mu);
        document.removeEventListener("keyup", mu);
      });
      const tick = () => {
        // The router can replace the journal DOM before the next animation frame.
        // Do not let this page's frame callback touch the new page's missing controls.
        if (!art.isConnected || !bar || !essBar || !essLeft || !essSec) return;
        const r = art.getBoundingClientRect(),
          p = clamp((innerHeight * 0.3 - r.top) / (r.height - innerHeight * 0.5), 0, 1);
        bar.style.transform = `scaleX(${p.toFixed(3)})`;
        essBar.style.transform = `scaleY(${p.toFixed(3)})`;
        const left = Math.max(0, Math.ceil(b.minutes * (1 - p)));
        essLeft.textContent = p > 0.995 ? tr("Finished") : tr(`${left} min left`);
        let a = -1;
        heads.forEach((h, i) => {
          if (h && h.getBoundingClientRect().top < innerHeight * 0.4) a = i;
        });
        links.forEach((l, i) => l.classList.toggle("on", i === a));
        if (a !== lastSec) {
          lastSec = a;
          essSec.textContent = a >= 0 ? links[a].textContent.replace(/^\d+/, "") : "";
          if (a >= 0) {
            GL && (GL.pulse = 0.4);
          }
        }
        if (art.classList.contains("focus") && !playing) {
          const line = innerHeight * 0.42;
          let best = null,
            bd = 1e9;
          for (const el of all) {
            const rr = el.getBoundingClientRect();
            if (rr.bottom < 0 || rr.top > innerHeight) continue;
            const d = rr.top > line ? rr.top - line : rr.bottom < line ? line - rr.bottom : 0;
            if (d < bd) {
              bd = d;
              best = el;
            }
          }
          all.forEach((el) => el.classList.toggle("lit", el === best));
        }
      };
      page.tick = tick;
      cleanup.push(() => {
        if (page?.tick === tick) page.tick = undefined;
      });
    },
  };
})();
