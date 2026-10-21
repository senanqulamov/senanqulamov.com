import type { MetadataRoute } from "next";
import { essays } from "@/data/essays";
import { pages } from "@/data/navigation";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${profile.site}${path}`;
  return [
    ...pages.map((p) => ({
      url: url(p.href),
      changeFrequency: "monthly" as const,
      priority: p.key === "home" ? 1 : 0.7,
    })),
    ...projects.map((p) => ({
      url: url(`/work/${p.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...essays.map((e) => ({ url: url(`/journal/${e.slug}`), lastModified: e.date, priority: 0.6 })),
  ];
}
