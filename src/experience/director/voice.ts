// Speech for the Director. Voices arrive asynchronously in Chromium and Safari.

import { soundOn } from "../sound";

export const Voice = (() => {
  const synth = window.speechSynthesis || null;
  const subs = new Set<(what: string) => void>();
  let all: SpeechSynthesisVoice[] = [];
  let generation = 0;
  const pref: Record<string, string> = JSON.parse(localStorage.getItem("sq-voices") || "{}");
  const stored = localStorage.getItem("sq-voice");
  let on: boolean | null = stored === null ? null : stored === "1";
  let rate = +localStorage.getItem("sq-vrate") || 1;
  let resolveVoices: () => void;
  const voicesReady = new Promise<void>((resolve) => (resolveVoices = resolve));
  const load = () => {
    if (!synth) return;
    all = synth.getVoices();
    subs.forEach((f) => f("voices"));
    if (all.length) resolveVoices();
  };
  if (synth) {
    load();
    synth.addEventListener?.("voiceschanged", load);
    const poll = window.setInterval(() => {
      load();
      if (all.length) clearInterval(poll);
    }, 100);
    window.setTimeout(() => {
      clearInterval(poll);
      load();
      resolveVoices();
    }, 2000);
  } else resolveVoices();

  const score = (v: SpeechSynthesisVoice) =>
    (/natural|neural|online/i.test(v.name) ? 6 : 0) +
    (/google/i.test(v.name) ? 3 : 0) +
    (/microsoft/i.test(v.name) ? 2 : 0) +
    (/daniel|ryan|guy|andrew|brian|christopher|babek|dmitry|pavel|thomas|george|male/i.test(v.name) ? 1 : 0) +
    (v.localService ? 0 : 0.5);
  const list = (lang: string) =>
    all.filter((v) => v.lang?.toLowerCase().startsWith(lang)).sort((a, b) => score(b) - score(a));
  function pick(lang: string): { v: SpeechSynthesisVoice | null; exact: boolean; via?: string } {
    const voices = list(lang);
    const voice = voices.find((v) => v.name === pref[lang]) || voices[0];
    if (voice) return { v: voice, exact: true };
    if (lang === "az") {
      const turkish = list("tr")[0];
      if (turkish) return { v: turkish, exact: false, via: "tr" };
    }
    return { v: null, exact: false };
  }
  const vowels = /[aeiouyÉ™Ä±Ã¶Ã¼Ð°ÐµÑ‘Ð¸Ð¾ÑƒÑ‹ÑÑŽÑ]+/gi;
  const sentences = (text: string) =>
    text
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
      ?.map((s) => s.trim())
      .filter(Boolean) || [];
  const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

  async function say(
    text: string,
    lang: string,
    callbacks: { onSyl?: (v: number) => void; onEnd?: (spoken: boolean) => void; onStart?: () => void } = {},
  ) {
    if (!synth || !api.on) {
      callbacks.onEnd?.(false);
      return false;
    }
    const id = ++generation;
    synth.cancel();
    await voicesReady;
    await pause(70);
    if (id !== generation || !api.on) return false;
    const picked = pick(lang);
    const parts = sentences(text);
    if (!picked.v || !parts.length) {
      callbacks.onEnd?.(false);
      return false;
    }
    callbacks.onStart?.();
    for (const part of parts) {
      const completed = await new Promise<boolean>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(part);
        utterance.voice = picked.v;
        utterance.lang = picked.v.lang;
        utterance.rate = rate;
        utterance.pitch = 0.95;
        let gotBoundary = false;
        const fallback = window.setInterval(() => {
          if (synth.speaking && !gotBoundary) callbacks.onSyl?.(0.45 + Math.random() * 0.45);
        }, 140);
        utterance.onboundary = (event) => {
          if (event.name && event.name !== "word") return;
          gotBoundary = true;
          const word = part.slice(event.charIndex, event.charIndex + (event.charLength || 12)).split(/\s/)[0];
          const count = api.syllables(word),
            duration = Math.max(160, word.length * 62) / rate;
          for (let i = 0; i < count; i++)
            setTimeout(() => callbacks.onSyl?.(0.65 + Math.random() * 0.35), (i * duration) / count);
        };
        utterance.onend = () => {
          clearInterval(fallback);
          resolve(true);
        };
        utterance.onerror = () => {
          clearInterval(fallback);
          resolve(false);
        };
        if (process.env.NODE_ENV === "development")
          console.debug("[Director voice]", picked.v.name, picked.v.lang);
        synth.speak(utterance);
      });
      if (!completed || id !== generation || !api.on) return false;
      await pause(20);
    }
    callbacks.onEnd?.(true);
    return true;
  }

  const api = {
    get ok() {
      return !!synth;
    },
    get on() {
      return on === null ? soundOn : on;
    },
    get rate() {
      return rate;
    },
    ready: () => voicesReady,
    set(value: boolean) {
      on = value;
      localStorage.setItem("sq-voice", value ? "1" : "0");
      if (!value) api.stop();
      subs.forEach((f) => f("on"));
    },
    setRate(value: number) {
      rate = value;
      localStorage.setItem("sq-vrate", String(value));
      subs.forEach((f) => f("rate"));
    },
    setVoice(lang: string, name: string) {
      pref[lang] = name;
      localStorage.setItem("sq-voices", JSON.stringify(pref));
      subs.forEach((f) => f("voice"));
    },
    list,
    pick,
    onChange(f: (what: string) => void) {
      subs.add(f);
      return () => subs.delete(f);
    },
    get speaking() {
      return !!(synth && synth.speaking);
    },
    syllables(word: string) {
      return Math.max(1, (String(word).match(vowels) || []).length);
    },
    say,
    stop() {
      generation++;
      synth?.cancel();
    },
  };
  return api;
})();
