import type { Metadata } from "next";
import { WorkPage } from "@/components/work/WorkPage";
import { getT } from "@/i18n/server";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Work",
  description: "Selected products, platforms, and client systems built by Senan Qulamov.",
  path: "/work",
});

export default async function Page() {
  const { t } = await getT();
  return <WorkPage t={t} />;
}
