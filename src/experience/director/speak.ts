// Reveals an answer word by word while the chrome object pulses, as if it were speaking.

import { reduce } from "../env";
import { GL } from "../state";
import { SFX } from "../sound";

export function directorSpeak(el: HTMLElement, html: string) {
  // reveal the answer word by word while the object pulses
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const words: HTMLElement[] = [];
  const walk = (n: Node) => {
    [...n.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.nodeValue.split(/(\s+)/).forEach((w) => {
          if (/^\s+$/.test(w) || !w) {
            frag.appendChild(document.createTextNode(w));
            return;
          }
          const s = document.createElement("span");
          s.className = "w";
          s.textContent = w;
          words.push(s);
          frag.appendChild(s);
        });
        c.replaceWith(frag);
      } else walk(c);
    });
  };
  walk(tmp);
  el.innerHTML = "";
  el.append(...tmp.childNodes);
  words.forEach((w) => (w.style.opacity = "0"));
  if (reduce) {
    words.forEach((w) => (w.style.opacity = "1"));
    return;
  }
  words.forEach((w, i) =>
    setTimeout(() => {
      w.style.opacity = "1";
      if (GL && i % 2 === 0) GL.pulse = 0.32;
      if (i % 3 === 0) SFX.tone(420 + Math.random() * 180, { d: 0.06, peak: 0.008 });
    }, i * 38),
  );
}
