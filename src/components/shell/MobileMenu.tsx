import { essays } from "@/data/essays";
import { profile } from "@/data/profile";
import { pricing } from "@/data/pricing";
import { projects } from "@/data/projects";
import type { Lang, Translate } from "@/i18n";

const WAVE_FLAT = "M0 24 Q25 24 50 24 T100 24 T150 24 T200 24 T250 24 T300 24 T350 24 T400 24";

/** Phone menu: the dock grows into this sheet. Desktop uses Menu.tsx. */
export function MobileMenu({ t, lang }: { t: Translate; lang: Lang }) {
  const project = projects[0];
  const essay = essays[0];
  const from = Object.values(pricing.services)[0].from.toLocaleString("en-US");
  const chips: [string, string][] = [
    ["Home", "/"],
    ["Ask the Director", "#director"],
    ["Credits", "/credits"],
    ["Gallery", "/gallery"],
    ["Library", "/library"],
    ["Lab", "/lab"],
    ["Press kit", "/press"],
    ["Contact", "/contact"],
  ];
  const greetings: [Lang, string, string][] = [
    ["en", "Hello", "English"],
    ["az", "Salam", "Azərbaycanca"],
    ["ru", "Привет", "Русский"],
  ];
  return (
    <>
      <div className="mm-scrim" id="mmScrim" />
      <section
        className="mm-sheet"
        id="mobileMenu"
        role="dialog"
        aria-modal="true"
        aria-label={t("Menu")}
        aria-hidden="true"
      >
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <linearGradient id="mmWave" x1="0" x2="1">
              <stop offset="0" stopColor="#A8E0FF" />
              <stop offset=".5" stopColor="#B9A7FF" />
              <stop offset="1" stopColor="#FFB79A" />
            </linearGradient>
          </defs>
        </svg>
        <header className="mm-top">
          <i className="mm-grab" />
          <div className="mm-head">
            <span className="mm-orb-wrap">
              <i className="mm-gl-stage" />
              <canvas className="mm-orb" id="mmOrb" width="116" height="116" aria-hidden="true" />
            </span>
            <label className="mm-search">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
                <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                id="mmSearch"
                type="search"
                placeholder={t("Search the site")}
                aria-label={t("Search the site")}
                autoComplete="off"
              />
            </label>
          </div>
          <div className="mm-tabs" role="tablist" aria-label={t("Menu")}>
            <i className="mm-knob" />
            <button role="tab" aria-selected="true" data-mm-tab="pages">
              {t("Pages")}
            </button>
            <button role="tab" aria-selected="false" data-mm-tab="settings">
              {t("Settings")}
            </button>
          </div>
          <ul className="mm-results" id="mmResults" hidden />
        </header>
        <div className="mm-viewport" id="mmViewport">
          <div className="mm-track" id="mmTrack">
            <div className="mm-pane" data-mm-pane="pages">
              <p className="mm-label">{t("What's new")}</p>
              <div className="mm-reel">
                <a className="mm-card mm-edge mm-premiere" href="/start">
                  <small>
                    {t("Premiere")} · {t("Available from November")}
                  </small>
                  <span>
                    <b>{t("Start a project")}</b>
                    <em>
                      {t("From AZN")} {from} →
                    </em>
                  </span>
                </a>
                <a
                  className="mm-card mm-edge mm-photo"
                  href={`/work/${project.slug}`}
                  style={
                    project.cover
                      ? {
                          backgroundImage: `linear-gradient(180deg,rgba(7,8,13,0) 35%,rgba(7,8,13,.85)),url(${project.cover})`,
                        }
                      : undefined
                  }
                >
                  <small>{t("Latest project")}</small>
                  <span>
                    <b>{project.title}</b>
                    <em>{t(project.subtitle)} →</em>
                  </span>
                </a>
                <a className="mm-card mm-edge" href={`/journal/${essay.slug}`}>
                  <small>{t("New essay")}</small>
                  <span>
                    <b>{t(essay.title)}</b>
                    <em>
                      {essay.minutes} {t("minute read")} →
                    </em>
                  </span>
                </a>
              </div>
              <div className="mm-rows">
                <a className="mm-row mm-edge" href="/work" data-k="work">
                  <b>{t("Work")}</b>
                  <small>
                    {t("Latest")} · {project.title}
                  </small>
                </a>
                <a className="mm-row mm-edge" href="/journal" data-k="journal">
                  <b>{t("Journal")}</b>
                  <small>
                    {t("New:")} {t(essay.title)}
                  </small>
                </a>
                <a className="mm-row mm-edge" href="/services" data-k="services">
                  <b>{t("Services")}</b>
                  <small>
                    {t("From AZN")} {from}
                  </small>
                </a>
              </div>
              <div className="mm-chips">
                {chips.map(([name, href]) => (
                  <a key={name} href={href} data-mm-director={href === "#director" ? "" : undefined}>
                    {t(name)}
                  </a>
                ))}
              </div>
            </div>
            <div className="mm-pane" data-mm-pane="settings">
              <p className="mm-label">{t("Appearance")}</p>
              <div className="mm-looks">
                {(["dark", "light", "auto"] as const).map((mode) => (
                  <button key={mode} className="mm-look" data-mm-theme={mode} aria-pressed="false">
                    <span className={`mm-lk mm-lk-${mode}`}>
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="mm-lt">
                      {t(mode === "dark" ? "Dark" : mode === "light" ? "Light" : "Auto")}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mm-label">{t("Language")}</p>
              <div className="mm-langs">
                {greetings.map(([code, hi, name]) => (
                  <button
                    key={code}
                    className="mm-lang"
                    data-mm-lang={code}
                    aria-pressed={code === lang}
                    lang={code}
                  >
                    <b>{hi}</b>
                    <small>{name}</small>
                  </button>
                ))}
              </div>
              <p className="mm-label">{t("Sound and motion")}</p>
              <div className="mm-sm">
                <button className="mm-snd" id="mmSound" aria-pressed="false">
                  <span className="mm-wvw">
                    <svg className="mm-wv" viewBox="0 0 400 48" preserveAspectRatio="none" aria-hidden="true">
                      <path d={WAVE_FLAT} />
                    </svg>
                  </span>
                  <span className="mm-srow">
                    <b>{t("Sound")}</b>
                    <small>{t("Off")}</small>
                  </span>
                </button>
                <button className="mm-mot" id="mmMotion" aria-pressed="true">
                  <span className="mm-mblob" aria-hidden="true" />
                  <span className="mm-srow">
                    <b>{t("Motion")}</b>
                    <small>{t("Full")}</small>
                  </span>
                </button>
              </div>
              <p className="mm-label">{t("About this site")}</p>
              <div className="mm-ab2">
                <article className="mm-about">
                  <span className="mm-aorb" aria-hidden="true" />
                  <small>{t("Portfolio · 2026 edition")}</small>
                  <b>{t("Designed and built by Senan in Baku.")}</b>
                  <p>
                    Next.js · WebGL · GSAP
                    <br />
                    {t("Real-time chrome, rendered on your phone.")}
                  </p>
                </article>
                <div className="mm-contacts">
                  <button data-mm-copy={profile.email} aria-label={profile.email}>
                    <span>{t("Email")}</span>
                    <small>{t("Copy")}</small>
                  </button>
                  <a href={profile.linkedin} target="_blank" rel="noopener">
                    <span>LinkedIn</span>
                    <small>↗</small>
                  </a>
                  <a href={profile.github} target="_blank" rel="noopener">
                    <span>GitHub</span>
                    <small>↗</small>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
