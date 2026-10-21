import { essays, type Essay } from "@/data/essays";
import { pages, type PageKey } from "@/data/navigation";
import { projects, type Project } from "@/data/projects";
import { clamp, pad2 } from "./dom";
import { tr } from "./i18n";

export type Route =
  | { k: PageKey }
  | { k: "project"; p: Project; index: number }
  | { k: "post"; b: Essay; index: number }
  | { k: "notfound" };

export function parseRoute(pathname: string): Route {
  const parts = pathname
    .replace(/^\/|\/$/g, "")
    .split("/")
    .filter(Boolean);
  if (!parts.length) return { k: "home" };
  const [first, second] = parts;
  if (first === "work" && second) {
    const index = projects.findIndex((p) => p.slug === second);
    return index < 0 ? { k: "notfound" } : { k: "project", p: projects[index], index };
  }
  if (first === "journal" && second) {
    const index = essays.findIndex((b) => b.slug === second);
    return index < 0 ? { k: "notfound" } : { k: "post", b: essays[index], index };
  }
  if (parts.length === 1 && pages.some((p) => p.key === first && first !== "home"))
    return { k: first as PageKey };
  return { k: "notfound" };
}

/** The menu entry a route belongs to. */
export const sectionOf = (r: Route) => (r.k === "project" ? "work" : r.k === "post" ? "journal" : r.k);

export function titleOf(r: Route) {
  if (r.k === "project") return r.p.title;
  if (r.k === "post") return r.b.title;
  if (r.k === "notfound") return tr("Lost.");
  return tr(pages.find((p) => p.key === r.k)?.title ?? "");
}

export function numberOf(r: Route) {
  const i = pages.findIndex((p) => p.key === sectionOf(r));
  return i < 0 ? "--" : pad2(i + 1);
}

/** A light, readable accent taken from a project's two colors. */
export function tintOf(p: Project) {
  const parse = (hex: string) => {
    const c = [0, 2, 4].map((i) => parseInt(hex.replace("#", "").substr(i, 2), 16) / 255);
    return { c, l: 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2] };
  };
  let { c, l } = parse(p.colors[0]);
  const second = parse(p.colors[1]);
  if (second.l > l) ({ c, l } = second);
  if (l < 0.45) {
    const k = (0.45 - l) / 0.55 + 0.25;
    c = c.map((v) => v + (1 - v) * k);
  }
  return (
    "#" +
    c
      .map((v) =>
        Math.round(clamp(v, 0, 1) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
