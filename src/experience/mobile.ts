// Phone keyboard state is shared by the dock and every form surface.
import { body, $ } from "./dom";
const phone = () => innerWidth <= 820;
let timer = 0;
const sync = () => {
  if (!phone()) return;
  const active = document.activeElement as HTMLElement | null;
  const editable = !!active?.matches("input,textarea,select,[contenteditable=true]");
  body.classList.toggle("keyboard-open", editable);
};
addEventListener("focusin", () => { clearTimeout(timer); sync(); });
addEventListener("focusout", () => { clearTimeout(timer); timer = window.setTimeout(sync, 120); });
visualViewport?.addEventListener("resize", () => {
  if (!phone()) return;
  body.classList.toggle("keyboard-open", innerHeight - visualViewport.height > 120);
});
if (phone()) $("#palIn").setAttribute("placeholder", "Search pages and projects");
