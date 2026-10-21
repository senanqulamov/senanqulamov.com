import { NotFoundPage } from "@/components/pages/NotFoundPage";
import { getT } from "@/i18n/server";

export default async function NotFound() {
  const { t } = await getT();
  return <NotFoundPage t={t} />;
}
