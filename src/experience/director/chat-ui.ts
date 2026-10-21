import type { Lang } from "@/i18n";
// The chat interface used on the Ask page and in the floating panel.

import type { Message } from "./chat";
import { $, $$, esc } from "../dom";
import { gsap, reduce } from "../env";
import { GL } from "../state";
import { copy } from "../ui";
import { SFX } from "../sound";
import { directorSpeak } from "./speak";
import { Voice } from "./voice";
import { MiniFace } from "./mini-face";
import { ChatCore } from "./chat";

const CXT: Record<string, Record<string, string>> = {
  en: {
    ph: "Ask about work, prices or availability",
    send: "Send",
    pop: "Popular questions",
    nw: "New chat",
    von: "Voice on",
    voff: "Voice off",
    think: "Thinking",
    note: "Answers come from this site.",
    voice: "Voice",
    speed: "Speed",
    nov: "No voice for this language on this device.",
    viaTr: "No Azerbaijani voice on this device, so a Turkish voice reads instead.",
    hint: "Try Microsoft Edge or install a voice in your system speech settings.",
    play: "Listen",
    copy: "Copy",
    settings: "Voice settings",
    test: "Test",
  },
  az: {
    ph: "İş, qiymət və ya boş vaxt haqqında soruşun",
    send: "Göndər",
    pop: "Populyar suallar",
    nw: "Yeni söhbət",
    von: "Səs açıq",
    voff: "Səs bağlı",
    think: "Düşünür",
    note: "Cavablar bu saytdan gəlir.",
    voice: "Səs",
    speed: "Sürət",
    nov: "Bu cihazda bu dil üçün səs yoxdur.",
    viaTr: "Bu cihazda Azərbaycan səsi yoxdur, türk səsi oxuyur.",
    hint: "Microsoft Edge-i sınayın və ya sistemin nitq ayarlarından səs quraşdırın.",
    play: "Dinlə",
    copy: "Kopyala",
    settings: "Səs ayarları",
    test: "Yoxla",
  },
  ru: {
    ph: "Спросите о работе, ценах или занятости",
    send: "Отправить",
    pop: "Популярные вопросы",
    nw: "Новый чат",
    von: "Голос вкл.",
    voff: "Голос выкл.",
    think: "Думает",
    note: "Ответы основаны на этом сайте.",
    voice: "Голос",
    speed: "Скорость",
    nov: "На этом устройстве нет голоса для этого языка.",
    viaTr: "На устройстве нет азербайджанского голоса, читает турецкий.",
    hint: "Попробуйте Microsoft Edge или установите голос в системных настройках речи.",
    play: "Слушать",
    copy: "Копировать",
    settings: "Настройки голоса",
    test: "Проверить",
  },
};

export function ChatUI(host: HTMLElement, { compact = false } = {}) {
  const T = () => CXT[ChatCore.lang] || CXT.en;
  host.innerHTML = `<div class="cx${compact ? " cx-compact" : ""}" data-lenis-prevent>
    <div class="cx-top"><div class="cx-langs" role="group" aria-label="Chat language">${["en", "az", "ru"].map((l) => `<button type="button" data-cl="${l}">${l.toUpperCase()}</button>`).join("")}</div><button type="button" class="cx-voice" aria-pressed="false"></button><button type="button" class="cx-gear" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="16" cy="7" r="2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="10" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="1.7"/></svg></button><button type="button" class="cx-new"></button></div>
    <div class="cx-set" hidden><label><span class="cx-set-v"></span><select class="cx-vsel"></select></label><label><span class="cx-set-s"></span><input type="range" class="cx-rate" min="0.8" max="1.3" step="0.05"></label><button type="button" class="chip cx-test"></button><p class="cx-vnote"></p></div>
    <div class="cx-log" aria-live="polite"></div>
    <div class="cx-follow"></div>
    <form class="cx-form"><textarea rows="1" enterkeyhint="send" aria-label="Message"></textarea><button class="cx-send" type="submit" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></form>
    <p class="cx-note"></p></div>`;
  const $h = <T extends HTMLElement = HTMLElement>(s: string) => $<T>(s, host),
    log = $h(".cx-log"),
    fol = $h(".cx-follow"),
    ta = $h<HTMLTextAreaElement>("textarea"),
    send = $h<HTMLButtonElement>(".cx-send"),
    vb = $h(".cx-voice"),
    set = $h(".cx-set"),
    sel = $h<HTMLSelectElement>(".cx-vsel");
  const chrome = () => {
    const t = T();
    ta.placeholder = t.ph;
    send.setAttribute("aria-label", String(t.send));
    $h(".cx-new").textContent = t.nw;
    $h(".cx-note").textContent = t.note;
    $h(".cx-gear").setAttribute("aria-label", String(t.settings));
    $h(".cx-set-v").textContent = t.voice;
    $h(".cx-set-s").textContent = t.speed;
    $h(".cx-test").textContent = t.test;
    $$("[data-cl]", host).forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.cl === ChatCore.lang)),
    );
    syncVoice();
    fillVoices();
  };
  function fillVoices() {
    const L = ChatCore.lang,
      vs = Voice.list(L),
      pk = Voice.pick(L);
    sel.innerHTML =
      vs
        .map(
          (v) =>
            `<option value="${esc(v.name)}"${pk.v && pk.v.name === v.name ? " selected" : ""}>${esc(v.name.replace(/Microsoft |Google |Online |\(Natural\)/g, "").trim())}${/natural|neural/i.test(v.name) ? " ★" : ""}</option>`,
        )
        .join("") || `<option>—</option>`;
    sel.disabled = !vs.length;
    $h<HTMLInputElement>(".cx-rate").value = String(Voice.rate);
    const t = T();
    $h(".cx-vnote").textContent = pk.v
      ? pk.via === "tr"
        ? t.viaTr + " " + t.hint
        : ""
      : t.nov + " " + t.hint;
  }
  function syncVoice() {
    const t = T(),
      on = Voice.on && Voice.ok;
    vb.setAttribute("aria-pressed", String(on));
    vb.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/>${on ? '<path class="w1" d="M16 8.5a5 5 0 0 1 0 7"/><path class="w2" d="M18.5 6a8.5 8.5 0 0 1 0 12"/>' : '<path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="1.6"/>'}</svg><span>${on ? t.von : t.voff}</span>`;
    vb.hidden = !Voice.ok;
    $h(".cx-gear").hidden = !Voice.ok;
  }
  const bubble = (m: Message) => {
    const d = document.createElement("div");
    const t = T();
    if (m.who === "me") {
      d.className = "cx-m me";
      d.innerHTML = `<div class="cx-b">${esc(m.q)}</div>`;
      return d;
    }
    const a = m.a;
    d.className = "cx-m bot";
    d.innerHTML = `<span class="cx-av" aria-hidden="true"></span><div class="cx-b"><div class="cx-t"></div>${a.list ? `<ul>${a.list.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}${a.acts ? `<div class="cx-acts">${a.acts.map((x) => (x[1].startsWith("copy:") ? `<button type="button" data-copy="${esc(x[1].slice(5))}">${esc(x[0])}</button>` : `<a href="${esc(x[1])}"${/^(https?:|mailto:)/.test(x[1]) ? ' target="_blank" rel="noopener"' : ""}>${esc(x[0])}</a>`)).join("")}</div>` : ""}<div class="cx-tools"><button type="button" class="cx-play" aria-label="${esc(t.play)}"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></button><button type="button" class="cx-copy" aria-label="${esc(t.copy)}"><svg viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 15V6a1 1 0 0 1 1-1h9" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button></div></div>`;
    const tt = $(".cx-t", d);
    if (m.fresh && !reduce) {
      directorSpeak(tt, esc(a.say));
      m.fresh = false;
      {
        gsap.from($$("li,.cx-acts > *", d), {
          opacity: 0,
          y: 8,
          duration: 0.5,
          stagger: 0.06,
          delay: Math.min(2.5, a.say.split(" ").length * 0.038),
        });
      }
    } else tt.textContent = a.say;
    $$("[data-copy]", d).forEach((b) => b.addEventListener("click", () => copy(b.dataset.copy)));
    $(".cx-copy", d).addEventListener("click", () =>
      copy(a.say + (a.list ? "\n- " + a.list.join("\n- ") : ""), "Copied"),
    );
    $(".cx-play", d).addEventListener("click", () => {
      if (!Voice.on) Voice.set(true);
      ChatCore.setState("speak");
      Voice.say(ChatCore.spokenText(a), a.lang || ChatCore.lang, {
        onSyl: ChatCore.mouth,
        onEnd: () => ChatCore.setState("idle"),
      });
    });
    return d;
  };
  const typing = () => {
    const d = document.createElement("div");
    d.className = "cx-m bot cx-typing";
    d.innerHTML = `<span class="cx-av" aria-hidden="true"></span><div class="cx-b"><span class="typing"><i></i><i></i><i></i></span><small>${T().think}</small></div>`;
    return d;
  };
  const scroll = () => {
    log.scrollTo({ top: log.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  };
  const follow = () => {
    const f = ChatCore.follow();
    fol.innerHTML = f.map((x) => `<button type="button" data-id="${x.id}">${esc(x.q)}</button>`).join("");
    if (!reduce)
      gsap.from(fol.children, {
        opacity: 0,
        y: 10,
        scale: 0.9,
        duration: 0.45,
        stagger: 0.06,
        ease: "back.out(2)",
      });
  };
  const welcome = () => {
    if (ChatCore.hist.length > 1) return "";
    return `<div class="cx-welcome"><p>${T().pop}</p><div class="cx-cards">${ChatCore.popular()
      .map((x) => `<button type="button" data-id="${x.id}">${esc(x.q)}</button>`)
      .join("")}</div></div>`;
  };
  function full() {
    log.innerHTML = "";
    ChatCore.hist.forEach((m) => log.appendChild(bubble(m)));
    log.insertAdjacentHTML("beforeend", welcome());
    if (ChatCore.hist.length > 1) follow();
    else fol.innerHTML = "";
    log.scrollTop = log.scrollHeight;
  }
  chrome();
  Voice.onChange(() => {
    if (host.isConnected) {
      syncVoice();
      fillVoices();
    }
  });
  const off = ChatCore.sub((ev, m) => {
    if (!host.isConnected) {
      off();
      return;
    }
    if (ev === "msg") {
      $$(".cx-welcome,.cx-typing", log).forEach((x) => x.remove());
      fol.innerHTML = "";
      log.appendChild(bubble(m));
      if (m.who === "me") log.appendChild(typing());
      else follow();
      scroll();
    }
    if (ev === "clear") full();
    if (ev === "lang") {
      chrome();
      const w = $(".cx-welcome", log);
      if (w) {
        w.outerHTML = welcome();
      }
      if (fol.children.length) follow();
    }
  });
  log.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const b = t.closest<HTMLElement>("[data-id]");
    if (b) ChatCore.ask(b.textContent, b.dataset.id);
    const a = t.closest<HTMLElement>('a[href^="/"]');
    if (a) host.dispatchEvent(new CustomEvent("navigate"));
  });
  fol.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("button");
    if (b) ChatCore.ask(b.textContent, b.dataset.id);
  });
  $$("[data-cl]", host).forEach((b) =>
    b.addEventListener("click", () => {
      ChatCore.setLang(b.dataset.cl as Lang);
      SFX.tick();
      MiniFace.nod(0.8);
    }),
  );
  const grow = () => {
    ta.style.height = "auto";
    ta.style.height = Math.min(140, ta.scrollHeight) + "px";
    send.disabled = !ta.value.trim();
  };
  ta.addEventListener("input", () => {
    grow();
    ChatCore.setState(ta.value ? "listen" : "idle");
    MiniFace.lookAt(ta);
    if (Math.random() < 0.4) MiniFace.nod(0.35);
    GL && (GL.face.state = ta.value ? "listen" : "idle");
  });
  ta.addEventListener("focus", () => {
    MiniFace.lookAt(ta);
    if (ta.value) ChatCore.setState("listen");
  });
  ta.addEventListener("blur", () => {
    if (!ChatCore.busy) ChatCore.setState("idle");
  });
  ta.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      $h<HTMLFormElement>(".cx-form").requestSubmit();
    }
  });
  $h(".cx-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = ta.value;
    if (!q.trim()) return;
    ta.value = "";
    grow();
    send.classList.remove("fly");
    void send.offsetWidth;
    send.classList.add("fly");
    ChatCore.ask(q);
  });
  vb.addEventListener("click", () => {
    Voice.set(!Voice.on);
    if (Voice.on) {
      ChatCore.setState("speak");
      Voice.say({ en: "Voice on.", az: "Səs açıqdır.", ru: "Голос включён." }[ChatCore.lang], ChatCore.lang, {
        onSyl: ChatCore.mouth,
        onEnd: () => ChatCore.setState("idle"),
      });
    }
  });
  $h(".cx-gear").addEventListener("click", (e) => {
    const o = set.hidden;
    set.hidden = !o;
    (e.currentTarget as HTMLElement).setAttribute("aria-expanded", String(o));
    if (o) {
      fillVoices();
      if (!reduce)
        gsap.from(set, { height: 0, opacity: 0, duration: 0.4, ease: "expo.out", clearProps: "height" });
    }
  });
  sel.addEventListener("change", () => Voice.setVoice(ChatCore.lang, sel.value));
  $h<HTMLInputElement>(".cx-rate").addEventListener("input", (e) =>
    Voice.setRate(+(e.target as HTMLInputElement).value),
  );
  $h(".cx-test").addEventListener("click", () => {
    if (!Voice.on) Voice.set(true);
    ChatCore.setState("speak");
    Voice.say(
      { en: "Hello, I'm the Director.", az: "Salam, mən Rejissoram.", ru: "Здравствуйте, я Режиссёр." }[
        ChatCore.lang
      ],
      ChatCore.lang,
      { onSyl: ChatCore.mouth, onEnd: () => ChatCore.setState("idle") },
    );
  });
  $h(".cx-new").addEventListener("click", () => {
    if (!reduce) {
      gsap.to(log.children, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        stagger: 0.02,
        onComplete: () => ChatCore.clear(),
      });
    } else ChatCore.clear();
  });
  ChatCore.greet();
  full();
  return {
    focus() {
      ta.focus({ preventScroll: true });
    },
    el: host,
  };
}
