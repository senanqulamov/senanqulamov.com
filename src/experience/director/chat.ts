// One conversation with the Director, shared by the Ask page and the floating panel and kept for the browser session.

import type { Lang } from "@/i18n";
import type { Answer } from "@/data/assistant";
import { Brain } from "@/data/assistant";
import { reduce } from "../env";
import { GL } from "../state";
import { getLang } from "../i18n";
import { Voice } from "./voice";
import { MiniFace } from "./mini-face";

export type Message = { who: "me" | "bot"; q?: string; a?: Answer; t: number; fresh?: boolean };

export const ChatCore = (() => {
  let hist: Message[] = JSON.parse(sessionStorage.getItem("sq-chat2") || "[]");
  const subs = new Set<(ev: string, m?: any) => void>();
  let busy = false;
  let lang = sessionStorage.getItem("sq-chatlang") as Lang | null;
  let manualLang = false;
  const asked = new Set(hist.filter((m) => m.who === "bot").map((m) => m.a.id));
  const save = () => sessionStorage.setItem("sq-chat2", JSON.stringify(hist.slice(-40)));
  const emit = (ev: string, m?: any) => subs.forEach((f) => f(ev, m));
  function setState(s: string) {
    GL && (GL.face.state = s);
    MiniFace.state(s);
    emit("state", s);
  }
  function mouth(v: number) {
    GL && (GL.face.mouth = Math.max(GL.face.mouth, v));
    MiniFace.mouth(v);
  }
  const L = (): Lang => lang || getLang();
  function spokenText(a: Answer) {
    return a.say + (a.list ? ". " + a.list.join(". ") : "");
  }
  function reply(a: Answer) {
    asked.add(a.id);
    const m: Message = { who: "bot", a, t: Date.now(), fresh: true };
    hist.push(m);
    save();
    setState("speak");
    emit("msg", m);
    void Voice.say(spokenText(a), a.lang || L(), { onSyl: mouth, onEnd: () => setState("idle") });
    busy = false;
  }
  return {
    get hist() {
      return hist;
    },
    get busy() {
      return busy;
    },
    get lang() {
      return L();
    },
    sub(f: (ev: string, m?: any) => void) {
      subs.add(f);
      return () => subs.delete(f);
    },
    setState,
    mouth,
    spokenText,
    setLang(l: Lang, manual = false) {
      Voice.stop();
      setState("idle");
      lang = l;
      manualLang ||= manual;
      sessionStorage.setItem("sq-chatlang", l);
      emit("lang", l);
    },
    setSiteLang(l: Lang) {
      if (!manualLang) this.setLang(l);
    },
    follow() {
      const last = [...hist].reverse().find((m) => m.who === "bot");
      return Brain.follow(last ? last.a.id : "greet", L(), asked);
    },
    popular() {
      return Brain.popular(L());
    },
    greet() {
      if (!hist.length) reply({ ...Brain.answerId("greet", L()) });
    },
    ask(q: string, id?: string) {
      q = (q || "").trim();
      if (!q || busy) return;
      busy = true;
      const m: Message = { who: "me", q, t: Date.now() };
      hist.push(m);
      save();
      emit("msg", m);
      setState("think");
      MiniFace.nod(0.6);
      setTimeout(
        () => {
          const a = id ? Brain.answerId(id, L()) : Brain.answer(q, L());
          if (a.lang && a.lang !== L() && !id) this.setLang(a.lang);
          reply(a);
        },
        reduce ? 60 : 700 + Math.random() * 500,
      );
    },
    poke() {
      const lines: Record<Lang, string[]> = {
        en: [
          "That tickles. Ask me something about Senan's work.",
          "I'm awake, I promise. Try asking about BidBary.",
          "I follow your cursor, in case you hadn't noticed.",
        ],
        az: [
          "Qıdıqlanıram. Senanın işi haqqında nəsə soruşun.",
          "Oyağam, söz verirəm. BidBary haqqında soruşun.",
          "Kursorunuzu izləyirəm, fərq etmisinizsə.",
        ],
        ru: [
          "Щекотно. Спросите что-нибудь о работе Сенана.",
          "Я не сплю, честно. Спросите про BidBary.",
          "Я слежу за вашим курсором, если вы не заметили.",
        ],
      };
      const P = lines[L()];
      MiniFace.poke();
      reply({ say: P[(Math.random() * P.length) | 0], id: "greet", lang: L() });
    },
    clear() {
      hist = [];
      asked.clear();
      save();
      Voice.stop();
      emit("clear");
      this.greet();
    },
  };
})();
