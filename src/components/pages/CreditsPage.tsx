import { cv, type CvEntry } from "@/data/cv";
import { profile } from "@/data/profile";
import type { Lang, Translate } from "@/i18n";
import { Footer } from "../shell/Footer";
import { Arrow } from "../ui/Icons";
import { PageHead } from "../ui/PageHead";
import { Roll } from "../ui/Roll";

const sections = ["Profile", "Ventures", "Experience", "Practice", "Education", "Skills", "Contact"];

function Job({ entry, t }: { entry: CvEntry; t: Translate }) {
  return (
    <div className="job fade">
      <div className="when">
        {entry.when}
        {entry.current && (
          <>
            <br />
            <em>{t("Current")}</em>
          </>
        )}
      </div>
      <div>
        <h3>{entry.title}</h3>
        <div className="org">
          {entry.org}, {entry.location}
        </div>
        <p>{entry.text}</p>
        {entry.highlights.length > 0 && (
          <ul>
            {entry.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function CreditsPage({ t, lang }: { t: Translate; lang: Lang }) {
  return (
    <>
      <PageHead
        t={t}
        crumb="Credits"
        title="Full credits"
        lede="Engineer, therapist, team lead and founder. Everything behind the seven scenes, in one place."
        scene="credits"
      >
        <div className="btn-row fade noprint">
          <button className="btn" id="cvPrint">
            <Roll text={t("Download as PDF")} /> <Arrow />
          </button>
          <a className="btn ghost" href={`mailto:${profile.email}`}>
            <Roll text={t("Email me")} />
          </a>
        </div>
      </PageHead>
      <section data-s="credits">
        <div className="cv-stats">
          {cv.stats.map((s) => (
            <div className="glass fade" key={s.label}>
              <b>{s.value}</b>
              <span>{t(s.label)}</span>
            </div>
          ))}
        </div>
        <div className="cv-wrap">
          <nav className="cv-nav noprint" aria-label="CV sections">
            {sections.map((s) => (
              <a href={`#cv-${s.toLowerCase()}`} key={s}>
                {t(s)}
              </a>
            ))}
          </nav>
          <div>
            {lang !== "en" && <p className="l10n-note">{t("The CV details are available in English.")}</p>}
            <div className="cv-sec" id="cv-profile">
              <h2 data-split>{t("Profile")}</h2>
              <p className="fade cv-profile">{t(cv.profile)}</p>
              <div className="cv-kv fade">
                <div>
                  <small>{t("Based in")}</small>
                  {t(profile.city)}
                </div>
                <div>
                  <small>{t("Works")}</small>
                  {t("Onsite and remote")}
                </div>
                <div>
                  <small>{t("Languages")}</small>
                  {t("Azerbaijani, English, Russian")}
                </div>
                <div>
                  <small>{t("Contact")}</small>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </div>
              </div>
            </div>
            <div className="cv-sec" id="cv-ventures">
              <h2 data-split>{t("Ventures")}</h2>
              {cv.ventures.map((e) => (
                <Job entry={e} t={t} key={e.title + e.org} />
              ))}
            </div>
            <div className="cv-sec" id="cv-experience">
              <h2 data-split>{t("Experience")}</h2>
              {cv.experience.map((e) => (
                <Job entry={e} t={t} key={e.title + e.org + e.when} />
              ))}
            </div>
            <div className="cv-sec" id="cv-practice">
              <h2 data-split>{t("Practice")}</h2>
              {cv.practice.map((e) => (
                <Job entry={e} t={t} key={e.title + e.org} />
              ))}
            </div>
            <div className="cv-sec" id="cv-education">
              <h2 data-split>{t("Education and awards")}</h2>
              {cv.education.map((e) => (
                <Job entry={e} t={t} key={e.title + e.org} />
              ))}
            </div>
            <div className="cv-sec" id="cv-skills">
              <h2 data-split>{t("Skills")}</h2>
              <div className="skills">
                {cv.skills.map((g) => (
                  <div className="fade" key={g.group}>
                    <h3>{g.group}</h3>
                    <div className="chips">
                      {g.items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cv-sec" id="cv-contact">
              <h2 data-split>{t("Contact")}</h2>
              <p className="fade">{t("Hiring, collaborating or just curious about a line on this page?")}</p>
              <div className="btn-row fade">
                <a className="btn" href={`mailto:${profile.email}`}>
                  <Roll text={profile.email} />
                </a>
                <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noopener">
                  <Roll text="LinkedIn" />
                </a>
                <a className="btn ghost" href={profile.github} target="_blank" rel="noopener">
                  <Roll text="GitHub" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer t={t} />
    </>
  );
}
