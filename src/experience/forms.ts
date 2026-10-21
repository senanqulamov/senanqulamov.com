// Floating-label fields: live validation, character counters and error messages.

import { $, $$ } from "./dom";
import { tr } from "./i18n";
import { blip } from "./sound";

export function fieldErr(name: string, msg: string, scope: ParentNode = document) {
  const f = $(`.fl[data-fl="${name}"]`, scope);
  if (!f) return;
  f.classList.remove("err", "valid");
  void f.offsetWidth;
  f.classList.add("err");
  $(".msg", f).textContent = msg;
  blip(220, 0.2);
}
export function initFields(scope: ParentNode) {
  $$(".fl", scope).forEach((f) => {
    const i = $<HTMLInputElement>("input,textarea", f);
    if (!i) return;
    const cnt = $(".cnt", f);
    const chk = () => {
      f.classList.remove("err");
      const v = i.value.trim();
      const ok = i.type === "email" ? /^\S+@\S+\.\S+$/.test(v) : i.required ? v.length > 1 : false;
      f.classList.toggle("valid", ok);
      if (cnt) {
        cnt.textContent = i.value.length + " / " + i.maxLength;
      }
      if (i.tagName === "TEXTAREA") {
        i.style.height = "auto";
        i.style.height = Math.max(150, i.scrollHeight) + "px";
      }
    };
    i.addEventListener("input", chk);
    i.addEventListener("blur", () => {
      if (i.required && !i.value.trim()) fieldErr(f.dataset.fl, tr("This one is needed."), scope);
      else if (i.type === "email" && i.value && !/^\S+@\S+\.\S+$/.test(i.value))
        fieldErr(f.dataset.fl, tr("That email doesn't look complete."), scope);
    });
  });
}
