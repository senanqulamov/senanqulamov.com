import { pricing } from "@/data/pricing";

/** "AZN 4,500" */
export const money = (value: number) => `${pricing.currency} ${Math.round(value).toLocaleString("en-US")}`;

export const unitLabel = (unit?: "month" | "session") =>
  unit === "month" ? " / month" : unit === "session" ? " / session" : "";

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** The domain shown in the fake browser bar above a project's screens. */
export function hostOf(project: { liveUrl: string; slug: string }) {
  try {
    return project.liveUrl ? new URL(project.liveUrl).host : `${project.slug}.app`;
  } catch {
    return project.slug;
  }
}
