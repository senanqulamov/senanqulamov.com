import { NotFoundPage } from "@/components/pages/NotFoundPage";
import { getT } from "@/i18n/server";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function NotFound() {
  const { t } = await getT();
  return <NotFoundPage t={t} />;
}
