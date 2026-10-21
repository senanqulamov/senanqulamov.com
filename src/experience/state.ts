import type Lenis from "lenis";
import type { GLApi } from "./gl/engine";
import type { Route } from "./routes";

/** Where the chrome object should be, computed from the section on screen. */
export const scene = { m: 0, u: 0.5, v: 0.46, s: 0.36, dim: 1, join: 0, spin: 0 };

export const mouse = { x: innerWidth / 2, y: innerHeight / 2, active: false };

addEventListener(
  "pointermove",
  (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  },
  { passive: true },
);
addEventListener(
  "touchmove",
  (e) => {
    const t = e.touches[0];
    if (!t) return;
    mouse.x = t.clientX;
    mouse.y = t.clientY;
    mouse.active = true;
  },
  { passive: true },
);

export let GL: GLApi | null = null;
export let lenis: Lenis | null = null;
export let route: Route | null = null;

export const setGL = (value: GLApi | null) => (GL = value);
export const setLenis = (value: Lenis | null) => (lenis = value);
export const setRoute = (value: Route) => (route = value);

export type PageRuntime = {
  sections: HTMLElement[];
  skew: HTMLElement[];
  stacks: HTMLElement[];
  tick?: (dt: number, now: number) => void;
};

export let page: PageRuntime | null = null;
export const setPage = (value: PageRuntime | null) => (page = value);

/** Functions that undo whatever the current page set up. */
export const cleanup: (() => void)[] = [];

export function runCleanup() {
  while (cleanup.length) cleanup.pop()();
}

/** The last place the visitor pressed, used as the origin of transitions. */
export const lastPointer = { x: 0.5, y: 0.5 };
addEventListener(
  "pointerdown",
  (e) => {
    lastPointer.x = e.clientX / innerWidth;
    lastPointer.y = e.clientY / innerHeight;
  },
  true,
);

export type Rect = { l: number; t: number; w: number; h: number; r: number };

/** Rectangle of the element the visitor clicked, used by the project opening. */
export const clicked: { rect: Rect | null } = { rect: null };
