import type { MetadataRoute } from "next";
import { essays } from "@/data/essays";
import { absoluteUrl } from "@/lib/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = [
    "/",
    "/work",
    "/journal",
    "/services",
    "/start",
    "/credits",
    "/ask",
    "/gallery",
    "/library",
    "/lab",
    "/press",
    "/contact",
  ];
  const url = (path: string) => absoluteUrl(path);
  return [
    ...publicPages.map((path) => ({
      url: url(path),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...projects.map((p) => ({
      url: url(`/work/${p.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...essays.map((e) => ({ url: url(`/journal/${e.slug}`), lastModified: e.date, priority: 0.6 })),
  ];
}
