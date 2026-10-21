import { $ } from "./dom";
import { coarse } from "./env";
import { tr } from "./i18n";

let toastTimer = 0;

export function toast(text: string) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = tr(text);
  el.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove("on"), 2400);
}

export function copy(text: string, message = "Copied") {
  const write = navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject();
  write.then(
    () => toast(message),
    () => toast("Copy failed. Select the text and copy it manually."),
  );
}

/** A short vibration on phones that support it. */
export function buzz(ms = 8) {
  if (coarse && navigator.vibrate) navigator.vibrate(ms);
}
