import { cookies } from "next/headers";
import { isLang, LANG_COOKIE, translator, type Lang } from ".";

export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(value) ? value : "en";
}

export async function getT() {
  const lang = await getLang();
  return { lang, t: translator(lang) };
}
