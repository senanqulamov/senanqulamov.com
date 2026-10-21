import { reduce } from "./env";

export const root = document.documentElement;
export const body = document.body;

export const $ = <T extends HTMLElement = HTMLElement>(selector: string, scope: ParentNode = document) =>
  scope.querySelector<T>(selector);

export const $$ = <T extends HTMLElement = HTMLElement>(selector: string, scope: ParentNode = document) => [
  ...scope.querySelectorAll<T>(selector),
];

export const esc = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** Wraps every character in a span so it can be animated on its own. */
export const charSpans = (text: string) =>
  [...text]
    .map((c, i) => `<span class="ch" style="--i:${i}">${c === " " ? "&nbsp;" : esc(c)}</span>`)
    .join("");

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const scrambling = new WeakMap<HTMLElement, number>();

/** Types text into an element through a short burst of random characters. */
export function scramble(el: HTMLElement, text: string, duration = 700) {
  if (reduce) {
    el.textContent = text;
    return;
  }
  const start = performance.now();
  cancelAnimationFrame(scrambling.get(el));
  const step = (now: number) => {
    const k = Math.min(1, (now - start) / duration);
    const n = Math.floor(k * text.length);
    el.textContent = text.slice(0, n) + text.slice(n).replace(/\S/g, () => glyphs[(Math.random() * 62) | 0]);
    if (k < 1) scrambling.set(el, requestAnimationFrame(step));
    else el.textContent = text;
  };
  scrambling.set(el, requestAnimationFrame(step));
}

/** Reads a CSS custom property from the root, for canvas drawing. */
export const cssVar = (name: string, fallback = "") =>
  getComputedStyle(root).getPropertyValue(name).trim() || fallback;

/** next/font gives fonts generated family names, so canvases read them from CSS. */
export const fonts = {
  display: () => `${cssVar("--font-display", "Unbounded")}, "Arial Black", sans-serif`,
  text: () => `${cssVar("--font-text", "Geist")}, Arial, sans-serif`,
};
