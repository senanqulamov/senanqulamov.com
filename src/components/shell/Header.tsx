import { headerLinks, pages } from "@/data/navigation";
import { profile } from "@/data/profile";
import type { Lang, Translate } from "@/i18n";
import { Equalizer } from "../ui/Icons";
import { Roll } from "../ui/Roll";

export function Header({ t, lang }: { t: Translate; lang: Lang }) {
  const links = pages.filter((p) => headerLinks.includes(p.key));
  return (
    <header className="hdr" id="hdr">
      <a className="logo" href="/" aria-label={`${profile.name}, ${t("Home")}`}>
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#A8E0FF" />
              <stop offset=".5" stopColor="#B9A7FF" />
              <stop offset="1" stopColor="#FFB79A" />
            </linearGradient>
          </defs>
          <circle className="lg-a" cx="15" cy="20" r="11" fill="none" stroke="url(#lg)" strokeWidth="2" />
          <circle cx="25" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="lt">
          <span>
            {profile.name}
            <small className="av">{t(profile.availability)}</small>
          </span>
        </span>
      </a>

      <div className="pill" aria-label="Current page">
        <span className="pg-n" id="pgN" />
        <span className="pg-t" id="pgT" />
        <nav className="pg-links" aria-label="Main">
          <i className="ind" aria-hidden="true" />
          {links.map((p) => (
            <a key={p.key} href={p.href}>
              <Roll text={t(p.title)} />
            </a>
          ))}
        </nav>
        <i className="pg-prog" id="pgProg" />
      </div>

      <div className="hdr-r">
        <button className="ib hide-m" id="palBtn" aria-label={t("Search")}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <button className="ib lang-btn" id="langBtn" aria-label={t("Language")}>
          <span id="langCode">{lang.toUpperCase()}</span>
        </button>
        <button
          className="tt"
          id="themeBtn"
          role="switch"
          aria-checked="false"
          aria-label={t("Switch to light theme")}
        >
          <span className="tt-ic tt-sun" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4.2" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
              </g>
            </svg>
          </span>
          <span className="tt-ic tt-moon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor" />
            </svg>
          </span>
          <span className="tt-knob" aria-hidden="true" />
        </button>
        <button className="ib hide-m" data-sound aria-pressed="false" aria-label="Sound">
          <Equalizer />
        </button>
        <a className="chip solid talk hide-m" href="/start" data-mag>
          <Roll text={t("Start a project")} />
        </a>
        <button className="burger" id="menuBtn" aria-expanded="false" aria-controls="menu">
          <span className="bt">
            <span>{t("Menu")}</span>
            <span>{t("Close")}</span>
          </span>
          <span className="bl" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>
    </header>
  );
}
