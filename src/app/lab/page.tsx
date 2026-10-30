import type { Metadata } from "next";
import { LabPage } from "@/components/pages/LabPage";
import { getT } from "@/i18n/server";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Lab",
  description:
    "Interactive engineering experiments by Senan Qulamov, from databases to concurrency and caching.",
  path: "/lab",
});

export default async function Page() {
  const { t } = await getT();
  return <LabPage t={t} />;
}
