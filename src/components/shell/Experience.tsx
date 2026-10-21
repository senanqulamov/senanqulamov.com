"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Lang } from "@/i18n";

type ExperienceModule = typeof import("@/experience");

/**
 * Starts the WebGL and motion layer once, then tells it whenever a new page has been
 * rendered. Everything visual lives in src/experience; this component only connects it.
 */
export function Experience({ lang }: { lang: Lang }) {
  const router = useRouter();
  const pathname = usePathname();
  const experience = useRef<ExperienceModule | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("@/experience").then((mod) => {
      if (cancelled) return;
      experience.current = mod;
      mod.start(router, lang);
      mod.onRendered(location.pathname);
    });
    return () => {
      cancelled = true;
    };
    // Starts once; later renders are reported by the effect below.
  }, []);

  useEffect(() => {
    experience.current?.onRendered(pathname);
  }, [pathname, lang]);

  return null;
}
