// Ask the Director page: the big chrome face beside the chat.

import { $ } from "../dom";
import { cleanup, GL } from "../state";
import { tr } from "../i18n";
import { SFX } from "../sound";
import { Voice } from "../director/voice";
import { ChatCore } from "../director/chat";
import { ChatUI } from "../director/chat-ui";

const Face = (() => {
  const map = { think: "Thinking", speak: "Speaking", listen: "Listening", idle: "Listening" };
  function label(s: string) {
    const el = $("#askState");
    if (el) {
      el.textContent = tr(map[s] || "Listening");
      el.dataset.s = s;
    }
  }
  function syncV() {
    const b = $("#voiceBtn");
    if (!b) return;
    b.hidden = !Voice.ok;
    b.setAttribute("aria-pressed", String(Voice.on));
    b.textContent = tr(Voice.on ? "Voice on" : "Voice off");
  }
  return {
    state(s: string) {
      GL && (GL.face.state = s);
      label(s);
    },
    mount() {
      if (GL) {
        GL.face.on = true;
        GL.face.next = performance.now() + 1500;
      }
      label("idle");
      syncV();
      const off = ChatCore.sub((ev, s) => {
        if (!$("#askState")) {
          off();
          return;
        }
        if (ev === "state") label(s);
      });
      Voice.onChange(syncV);
      $("#voiceBtn") &&
        $("#voiceBtn").addEventListener("click", (e) => {
          e.stopPropagation();
          Voice.set(!Voice.on);
          if (Voice.on) {
            ChatCore.setState("speak");
            Voice.say(
              { en: "Voice on.", az: "Səs açıqdır.", ru: "Голос включён." }[ChatCore.lang],
              ChatCore.lang,
              { onSyl: ChatCore.mouth, onEnd: () => ChatCore.setState("idle") },
            );
          }
        });
      cleanup.push(() => {
        if (GL) GL.face.on = false;
        Voice.stop();
      });
    },
  };
})();

export function mountAsk(view: HTMLElement) {
  Face.mount();
  ChatUI($("#askChat"));
  let poke = 0;
  $("#askStage").addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest<HTMLElement>("button")) return;
    GL && GL.burst();
    if (GL) GL.face.bt = performance.now();
    SFX.glass(poke++);
    ChatCore.poke();
  });
}
