// Where the chrome object sits for each kind of section.
import { DIRECTOR_SHAPE } from "./spirit";

// m is the shape: 0 liquid blob, 1 sphere, 2 twisted column, 3 ring, 4 lattice, 5 two drops, 6 the Director.
// u and v are screen positions from 0 to 1, s is size, dim is brightness.
// The values starting with "m" (mu, mv, ms) are used on narrow screens.

export type SceneConfig = {
  m: number;
  u: number;
  v: number;
  s: number;
  mu: number;
  mv: number;
  ms: number;
  dim: number;
};

export const scenes: Record<string, SceneConfig> = {
  hero: { m: 0, u: 0.565, v: 0.7, s: 0.36, mu: 0.3, mv: 0.6, ms: 0.3, dim: 1 },
  belief: { m: 1, u: 0.5, v: 0.5, s: 0.78, mu: 0.5, mv: 0.5, ms: 0.6, dim: 0.7 },
  story: { m: 2, u: 0.5, v: 0.56, s: 0.62, mu: 0.5, mv: 0.72, ms: 0.45, dim: 0.55 },
  bidbary: { m: 3, u: 0.28, v: 0.5, s: 0.72, mu: 0.5, mv: 0.3, ms: 0.55, dim: 0.85 },
  work: { m: 4, u: 0.84, v: 0.5, s: 0.55, mu: 0.78, mv: 0.18, ms: 0.35, dim: 0.6 },
  services: { m: 3, u: 0.86, v: 0.42, s: 0.5, mu: 0.8, mv: 0.16, ms: 0.32, dim: 0.5 },
  ideas: { m: 1, u: 0.12, v: 0.32, s: 0.42, mu: 0.2, mv: 0.18, ms: 0.3, dim: 0.5 },
  workspace: { m: 4, u: 0.9, v: 0.84, s: 0.14, mu: 0.85, mv: 0.88, ms: 0.12, dim: 0.9 },
  workpage: { m: 4, u: 0.84, v: 0.3, s: 0.46, mu: 0.78, mv: 0.16, ms: 0.3, dim: 0.7 },
  page: { m: 0, u: 0.8, v: 0.38, s: 0.48, mu: 0.75, mv: 0.2, ms: 0.32, dim: 0.9 },
  project: { m: 0, u: 0.84, v: 0.3, s: 0.4, mu: 0.78, mv: 0.16, ms: 0.28, dim: 0.75 },
  journal: { m: 1, u: 0.82, v: 0.36, s: 0.5, mu: 0.76, mv: 0.18, ms: 0.3, dim: 0.8 },
  post: { m: 1, u: 0.92, v: 0.5, s: 0.3, mu: 0.9, mv: 0.12, ms: 0.18, dim: 0.35 },
  start: { m: 2, u: 0.86, v: 0.36, s: 0.45, mu: 0.8, mv: 0.16, ms: 0.3, dim: 0.7 },
  credits: { m: 2, u: 0.86, v: 0.4, s: 0.48, mu: 0.8, mv: 0.16, ms: 0.3, dim: 0.65 },
  askface: { m: DIRECTOR_SHAPE, u: 0.25, v: 0.55, s: 0.5, mu: 0.5, mv: 0.4, ms: 0.3, dim: 1 },
  ask: { m: 1, u: 0.84, v: 0.34, s: 0.5, mu: 0.78, mv: 0.18, ms: 0.3, dim: 0.8 },
  library: { m: 0, u: 0.9, v: 0.2, s: 0.28, mu: 0.85, mv: 0.12, ms: 0.2, dim: 0.7 },
  gallery: { m: 1, u: 0.93, v: 0.12, s: 0.1, mu: 0.88, mv: 0.86, ms: 0.06, dim: 0.5 },
  tour: { m: 0, u: 0.96, v: 0.14, s: 0.07, mu: 0.92, mv: 0.1, ms: 0.06, dim: 0.5 },
  labx: { m: 4, u: 0.95, v: 0.9, s: 0.1, mu: 0.92, mv: 0.92, ms: 0.08, dim: 0.55 },
  lab: { m: 4, u: 0.8, v: 0.36, s: 0.52, mu: 0.78, mv: 0.18, ms: 0.32, dim: 0.85 },
  press: { m: 3, u: 0.82, v: 0.34, s: 0.5, mu: 0.78, mv: 0.18, ms: 0.32, dim: 0.8 },
  contact: { m: 5, u: 0.5, v: 0.8, s: 0.45, mu: 0.5, mv: 0.8, ms: 0.34, dim: 0.95 },
  notfound: { m: 5, u: 0.5, v: 0.74, s: 0.46, mu: 0.5, mv: 0.88, ms: 0.26, dim: 1 },
};

/** On phones only these sections keep the object in place; elsewhere it parks in a corner. */
export const keptOnMobile = ["hero", "belief", "bidbary", "askface", "contact", "notfound", "workspace"];

/** The shape the object takes while covering the screen, and how much it spins, per destination. */
export const transitions: Record<string, { cover: number; spin: number }> = {
  home: { cover: 0, spin: 0.8 },
  work: { cover: 1, spin: -1.2 },
  journal: { cover: 1, spin: 0.6 },
  post: { cover: 1, spin: -0.5 },
  project: { cover: 1, spin: -0.5 },
  services: { cover: 0, spin: 1.4 },
  start: { cover: 0, spin: -0.9 },
  credits: { cover: 1, spin: 0.9 },
  ask: { cover: 1, spin: -0.7 },
  library: { cover: 0, spin: 1.1 },
  gallery: { cover: 1, spin: -0.8 },
  lab: { cover: 0, spin: -1.5 },
  press: { cover: 1, spin: 0.7 },
  contact: { cover: 0, spin: -1 },
  notfound: { cover: 1, spin: 2 },
};

/** The shape previewed in the menu for each page. */
export const menuShapes: Record<string, number> = {
  home: 0,
  work: 1,
  journal: 1,
  services: 1,
  start: 2,
  credits: 2,
  ask: 1,
  library: 0,
  gallery: 1,
  lab: 1,
  press: 1,
  contact: 5,
};

export const pageAccents: Record<string, string> = {
  home: "#A8E0FF",
  work: "#A8E0FF",
  journal: "#B9A7FF",
  post: "#B9A7FF",
  services: "#FFB79A",
  start: "#4ade80",
  credits: "#FFB79A",
  ask: "#A8E0FF",
  library: "#FFB79A",
  gallery: "#A8E0FF",
  lab: "#4ade80",
  press: "#B9A7FF",
  contact: "#FFB79A",
  notfound: "#ff5a6e",
};
