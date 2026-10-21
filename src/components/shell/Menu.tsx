import { Fragment } from "react";
import { pages } from "@/data/navigation";
import { now, profile } from "@/data/profile";
import { languages, type Lang, type Translate } from "@/i18n";
import { Equalizer } from "../ui/Icons";
import { Roll, SplitChars } from "../ui/Roll";

export function Menu({ t, lang }: { t: Translate; lang: Lang }) {
  return (
    <div id="menu" role="dialog" aria-modal="true" aria-label={t("Menu")}>
      <div className="m-panel" id="mPanel" aria-hidden="true" />
      <div className="m-big" id="mBig" aria-hidden="true">
        <div className="mbt" id="mBigT" />
      </div>
      <ul className="m-list" id="mList">
        {pages.map((p, i) => (
          <li key={p.key}>
            <a href={p.href} data-k={p.key}>
              <span className="mi-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="mi-t" aria-label={t(p.title)}>
                <SplitChars text={t(p.title)} />
                <svg className="mi-ar" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              <span className="mi-d">{t(p.description)}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="m-side">
        <div className="m-card" id="mCard" aria-hidden="true">
          <div className="m-card-in" id="mCardIn" />
          <div className="m-card-cap">
            <span id="mCardN">01</span>
            <span id="mCardT">{t("Home")}</span>
          </div>
        </div>
        <p className="m-preview" id="mPreview" aria-live="polite">
          {t("Where to next?")}
        </p>
        <dl className="m-now">
          {now.map(([label, value]) => (
            <Fragment key={label}>
              <dt>{t(label)}</dt>
              <dd>{t(value)}</dd>
            </Fragment>
          ))}
        </dl>
        <div className="m-row">
          <button className="chip" id="mTheme">
            {t("Theme:")} <span data-theme-label />
          </button>
          <button className="chip" data-sound aria-pressed="false">
            <Equalizer />
            <span data-sound-label>{t("Sound off")}</span>
          </button>
          <button className="chip" data-open-palette>
            {t("Search")} <span className="kbd">⌘K</span>
          </button>
        </div>
        <div className="m-row m-langs" role="group" aria-label={t("Language")}>
          {languages.map((l) => (
            <button
              key={l.code}
              className="chip"
              data-lang={l.code}
              lang={l.code}
              aria-pressed={l.code === lang}
            >
              {l.name}
            </button>
          ))}
          <button className="chip" id="fxBtn" aria-pressed="false">
            {t("Reduce effects")}
          </button>
        </div>
        <div className="m-foot">
          <a href={`mailto:${profile.email}`}>
            <Roll text={profile.email} />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener">
            <Roll text="LinkedIn" />
          </a>
          <a href={profile.github} target="_blank" rel="noopener">
            <Roll text="GitHub" />
          </a>
          <span data-clock />
        </div>
      </div>
    </div>
  );
}
