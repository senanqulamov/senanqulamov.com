// Speech for the Director. Picks the best voice the device has for English, Azerbaijani or Russian and reports syllables so the mouth can move with the words.

import { soundOn } from "../sound";

export const Voice = (() => {
  const synth = window.speechSynthesis || null;
  const subs = new Set<(what: string) => void>();
  let all: SpeechSynthesisVoice[] = [];
  const pref: Record<string, string> = JSON.parse(localStorage.getItem("sq-voices") || "{}");
  const stored = localStorage.getItem("sq-voice");
  let on: boolean | null = stored === null ? null : stored === "1";
  let rate = +localStorage.getItem("sq-vrate") || 1;
  const load = () => {
    if (!synth) return;
    all = synth.getVoices();
    subs.forEach((f) => f("voices"));
  };
  if (synth) {
    load();
    synth.addEventListener && synth.addEventListener("voiceschanged", load);
    setTimeout(load, 800);
  }
  const score = (v: SpeechSynthesisVoice) =>
    (/natural|neural|online/i.test(v.name) ? 6 : 0) +
    (/google/i.test(v.name) ? 3 : 0) +
    (/microsoft/i.test(v.name) ? 2 : 0) +
    (/daniel|ryan|guy|andrew|brian|christopher|babek|dmitry|pavel|thomas|george|male/i.test(v.name) ? 1 : 0) +
    (v.localService ? 0 : 0.5);
  function list(L: string) {
    const code = L;
    let vs = all.filter((v) => v.lang && v.lang.toLowerCase().startsWith(code));
    return vs.sort((a, b) => score(b) - score(a));
  }
  function pick(L: string): { v: SpeechSynthesisVoice | null; exact: boolean; via?: string } {
    const vs = list(L);
    const want = pref[L];
    const v = vs.find((x) => x.name === want) || vs[0];
    if (v) return { v, exact: true };
    if (L === "az") {
      const tr = list("tr")[0];
      if (tr) return { v: tr, exact: false, via: "tr" };
    }
    return { v: null, exact: false };
  }
  const vowels = /[aeiouyəıöüаеёиоуыэюя]+/gi;
  return {
    get ok() {
      return !!synth;
    },
    get on() {
      return on === null ? soundOn : on;
    },
    get rate() {
      return rate;
    },
    set(v: boolean) {
      on = v;
      localStorage.setItem("sq-voice", v ? "1" : "0");
      if (!v) this.stop();
      subs.forEach((f) => f("on"));
    },
    setRate(r: number) {
      rate = r;
      localStorage.setItem("sq-vrate", String(r));
      subs.forEach((f) => f("rate"));
    },
    setVoice(L: string, name: string) {
      pref[L] = name;
      localStorage.setItem("sq-voices", JSON.stringify(pref));
      subs.forEach((f) => f("voice"));
    },
    list,
    pick,
    onChange(f: (what: string) => void) {
      subs.add(f);
    },
    get speaking() {
      return !!(synth && synth.speaking);
    },
    syllables(w: string) {
      return Math.max(1, (String(w).match(vowels) || []).length);
    },
    say(
      text: string,
      L: string,
      {
        onSyl,
        onEnd,
        onStart,
      }: { onSyl?: (v: number) => void; onEnd?: (spoken: boolean) => void; onStart?: () => void } = {},
    ) {
      if (!synth || !this.on) {
        onEnd && onEnd(false);
        return false;
      }
      const p = pick(L);
      if (!p.v) {
        onEnd && onEnd(false);
        return false;
      }
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.voice = p.v;
      u.lang = p.v.lang;
      u.rate = rate;
      u.pitch = 0.95;
      let got = false;
      const fallbackIv = setInterval(() => {
        if (synth.speaking && !got) onSyl && onSyl(0.45 + Math.random() * 0.45);
      }, 140);
      u.onboundary = (e) => {
        if (e.name && e.name !== "word") return;
        got = true;
        const w = text.slice(e.charIndex, e.charIndex + (e.charLength || 12)).split(/\s/)[0];
        const n = this.syllables(w),
          dur = Math.max(160, w.length * 62) / rate;
        for (let k = 0; k < n; k++)
          setTimeout(() => onSyl && onSyl(0.65 + Math.random() * 0.35), (k * dur) / n);
      };
      u.onstart = () => onStart && onStart();
      u.onend = u.onerror = () => {
        clearInterval(fallbackIv);
        onEnd && onEnd(true);
      };
      synth.speak(u);
      return true;
    },
    stop() {
      synth && synth.cancel();
    },
  };
})();
