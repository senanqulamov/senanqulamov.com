import type { Metadata } from "next";
import { LibraryPage } from "@/components/pages/LibraryPage";
import { getT } from "@/i18n/server";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Library",
  description: "Books and ideas that inform Senan Qulamov’s engineering and product practice.",
  path: "/library",
});

export default async function Page() {
  const { t } = await getT();
  return <LibraryPage t={t} />;
}
