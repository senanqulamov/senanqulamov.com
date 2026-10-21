import az from "./az";
import ru from "./ru";

export type Lang = "en" | "az" | "ru";

export const languages: { code: Lang; name: string }[] = [
  { code: "en", name: "English" },
  { code: "az", name: "Azərbaycanca" },
  { code: "ru", name: "Русский" },
];

export const LANG_COOKIE = "lang";

const dictionaries: Record<Exclude<Lang, "en">, Record<string, string>> = { az, ru };

// Sentences that contain numbers or names are matched by pattern instead of by key.
const patterns: [RegExp, Record<"az" | "ru", string>][] = [
  [/^Scene (\d) of (\d)$/, { az: "Səhnə $1 / $2", ru: "Сцена $1 из $2" }],
  [/^Service (\d) of (\d)$/, { az: "Xidmət $1 / $2", ru: "Услуга $1 из $2" }],
  [/^Experiment (\d)$/, { az: "Eksperiment $1", ru: "Эксперимент $1" }],
  [/^(\d+) minute read$/, { az: "$1 dəqiqəlik oxu", ru: "$1 мин чтения" }],
  [/^Essay (\d) of (\d)$/, { az: "Esse $1 / $2", ru: "Эссе $1 из $2" }],
  [/^(\d+) of (\d+)$/, { az: "$1 / $2", ru: "$1 из $2" }],
  [/^from AZN ([\d,]+)$/, { az: "AZN $1-dən", ru: "от AZN $1" }],
  [/^AZN ([\d,]+) \/ month$/, { az: "AZN $1 / ay", ru: "AZN $1 / мес" }],
  [/^AZN ([\d,]+) \/ session$/, { az: "AZN $1 / sessiya", ru: "AZN $1 / сессия" }],
  [/^\+AZN ([\d,]+) \/ month$/, { az: "+AZN $1 / ay", ru: "+AZN $1 / мес" }],
  [/^(\d+) books$/, { az: "$1 kitab", ru: "$1 книг" }],
  [/^(\d+) min left$/, { az: "$1 dəq qaldı", ru: "Осталось $1 мин" }],
  [
    /^Seat 48, Friday 20:00\. Final bid (.+)\.$/,
    { az: "48-ci yer, cümə 20:00. Son təklif $1.", ru: "Место 48, пятница 20:00. Финальная ставка $1." },
  ],
  [
    /^Final bid (.+)\. Try a bigger jump\.$/,
    { az: "Son təklif $1. Daha böyük addım at.", ru: "Финальная ставка $1. Попробуйте ставку крупнее." },
  ],
  [/^Baku (\d\d:\d\d)(.*)$/, { az: "Bakı $1$2", ru: "Баку $1$2" }],
  [/^(\d+) to (\d+) weeks$/, { az: "$1-$2 həftə", ru: "$1–$2 недель" }],
  [/^Under AZN ([\d,]+)$/, { az: "AZN $1-dən az", ru: "До AZN $1" }],
  [/^Over AZN ([\d,]+)$/, { az: "AZN $1-dən çox", ru: "Более AZN $1" }],
  [/^AZN ([\d,]+) to ([\d,]+)$/, { az: "AZN $1 – $2", ru: "AZN $1 – $2" }],
];

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "az" || value === "ru";
}

/** Translates English text. Unknown text is returned unchanged. */
export function translate(lang: Lang, text: string): string {
  if (lang === "en" || !text) return text;
  const key = text.trim();
  const hit = dictionaries[lang][key];
  if (hit) return text.replace(key, hit);
  if (key.startsWith("Good for: ")) {
    return `${dictionaries[lang]["Good for:"]} ${translate(lang, key.slice(10))}`;
  }
  for (const [pattern, out] of patterns) {
    if (pattern.test(key)) return key.replace(pattern, out[lang]);
  }
  return text;
}

export type Translate = (text: string) => string;

export const translator =
  (lang: Lang): Translate =>
  (text) =>
    translate(lang, text);

export const locales: Record<Lang, string> = { en: "en-GB", az: "az-Latn-AZ", ru: "ru-RU" };

export function formatDate(iso: string, lang: Lang) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(locales[lang], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
