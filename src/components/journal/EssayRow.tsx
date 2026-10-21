import type { Essay } from "@/data/essays";
import { formatDate, type Lang, type Translate } from "@/i18n";

export function EssayRow({ essay, t, lang }: { essay: Essay; t: Translate; lang: Lang }) {
  return (
    <li className="jrow">
      <a href={`/journal/${essay.slug}`} data-cursor={t("Read")}>
        <span className="jd">{formatDate(essay.date, lang)}</span>
        <h3>{essay.title}</h3>
        <p>{essay.excerpt}</p>
        <span className="jm">{t(`${essay.minutes} minute read`)}</span>
      </a>
    </li>
  );
}
