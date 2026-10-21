import { HomePage } from "@/components/home/HomePage";
import { getT } from "@/i18n/server";

export default async function Page() {
  const { t, lang } = await getT();
  return <HomePage t={t} lang={lang} />;
}
