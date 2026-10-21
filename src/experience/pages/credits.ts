// Credits: the CV section navigation and printing to PDF.

import { $, $$ } from "../dom";
import { page } from "../state";

export function mountCredits(view: HTMLElement) {
  $("#cvPrint").addEventListener("click", () => {
    $$(".fade").forEach((e) => e.classList.add("in"));
    setTimeout(() => window.print(), 100);
  });
  const links = $$(".cv-nav a"),
    secs = links.map((a) => document.getElementById(a.getAttribute("href").slice(1)));
  page.tick = () => {
    let a = 0;
    secs.forEach((s, i) => {
      if (s.getBoundingClientRect().top < innerHeight * 0.4) a = i;
    });
    links.forEach((l, i) => l.classList.toggle("on", i === a));
  };
}
