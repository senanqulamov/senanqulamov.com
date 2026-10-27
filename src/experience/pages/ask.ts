// Ask page: the global WebGL object becomes the Director in this stage.
import { $ } from "../dom";
import { cleanup, GL } from "../state";
import { tr } from "../i18n";
import { SFX } from "../sound";
import { ChatCore } from "../director/chat";
import { ChatUI } from "../director/chat-ui";

const labels: Record<string, Record<string, string>> = {
  en: { think: "Thinking…", speak: "Speaking", listen: "Listening", idle: "Listening", happy: "Listening" },
  az: { think: "D\u00fc\u015f\u00fcn\u00fcr…", speak: "Dan\u0131\u015f\u0131r", listen: "Dinl\u0259yir", idle: "Dinl\u0259yir", happy: "Dinl\u0259yir" },
  ru: { think: "\u0414\u0443\u043c\u0430\u0435\u0442…", speak: "\u0413\u043e\u0432\u043e\u0440\u0438\u0442", listen: "\u0421\u043b\u0443\u0448\u0430\u0435\u0442", idle: "\u0421\u043b\u0443\u0448\u0430\u0435\u0442", happy: "\u0421\u043b\u0443\u0448\u0430\u0435\u0442" },
};

export function mountAsk() {
  if (GL) {
    GL.face.on = true;
    GL.face.next = performance.now() + 1500;
  }
  const status = $("#askState"), poke = $("#askPoke");
  let currentState = "idle";
  const renderState = (state: string) => {
    if (!status) return;
    currentState = state;
    status.textContent = labels[ChatCore.lang]?.[state] || labels.en[state] || tr("Listening");
    status.dataset.s = state;
    $("#askStage")?.setAttribute("data-s", state);
  };
  renderState("idle");
  const off = ChatCore.sub((ev, value) => {
    if (!$("#askStage")) return off();
    if (ev === "state") renderState(value);
    if (ev === "lang") renderState(currentState);
    if (ev === "poke" && poke) {
      poke.textContent = value;
      poke.classList.add("show");
      setTimeout(() => poke.classList.remove("show"), 3000);
    }
  });
  cleanup.push(() => { if (GL) GL.face.on = false; off(); });
  ChatUI($("#askChat"));
  let pokes = 0;
  $("#askStage")?.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("button,a,textarea")) return;
    GL?.burst();
    if (GL) GL.face.bt = performance.now();
    SFX.glass(pokes++);
    ChatCore.poke();
  });
}
