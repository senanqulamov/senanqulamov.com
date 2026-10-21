import { translate, type Lang } from "@/i18n";

let current: Lang = "en";

export const getLang = () => current;
export const setLang = (lang: Lang) => {
  current = lang;
};

export const tr = (text: string) => translate(current, text);
