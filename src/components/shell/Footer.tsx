import { now, profile } from "@/data/profile";
import type { Translate } from "@/i18n";
import { Arrow } from "../ui/Icons";
import { Roll } from "../ui/Roll";

const columns: { title: string; links: [string, string][] }[] = [
  {
    title: "Pages",
    links: [
      ["Work", "/work"],
      ["Journal", "/journal"],
      ["Services", "/services"],
      ["Credits", "/credits"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Also in the studio",
    links: [
      ["Ask the Director", "/ask"],
      ["Library", "/library"],
      ["Lab", "/lab"],
      ["Press kit", "/press"],
      ["Start a project", "/start"],
    ],
  },
];

export function Footer({ t }: { t: Translate }) {
  return (
    <footer className="foot">
      <div className="foot-cta">
        <h2 className="h-xl" data-split>
          {t("Let's make the next one.")}
        </h2>
        <div className="btn-row flush">
          <a className="btn" href="/start" data-mag>
            <Roll text={t("Start a project")} /> <Arrow />
          </a>
          <a className="btn ghost" href={`mailto:${profile.email}`} data-mag>
            <Roll text={t("Write an email")} />
          </a>
        </div>
      </div>
      <div className="foot-cols">
        {columns.map((col) => (
          <div key={col.title}>
            <b>{t(col.title)}</b>
            {col.links.map(([label, href]) => (
              <a key={href} href={href}>
                <Roll text={t(label)} />
              </a>
            ))}
          </div>
        ))}
        <div>
          <b>{t("Elsewhere")}</b>
          <a href={profile.linkedin} target="_blank" rel="noopener">
            <Roll text="LinkedIn" />
          </a>
          <a href={profile.github} target="_blank" rel="noopener">
            <Roll text="GitHub" />
          </a>
          <a href={profile.bidbary} target="_blank" rel="noopener">
            <Roll text="BidBary" />
          </a>
          <a href={`mailto:${profile.email}`}>
            <Roll text={profile.email} />
          </a>
        </div>
        <div>
          <b>{t("Now")}</b>
          {now.slice(0, 3).map(([label, value]) => (
            <span className="foot-now" key={label}>
              <span className="muted">{t(label)}</span> {t(value)}
            </span>
          ))}
        </div>
      </div>
      <div className="foot-sig" aria-hidden="true" data-skew>
        {profile.name}
      </div>
      <div className="foot-bot">
        <span>© 2026 {profile.name}</span>
        <span data-clock />
        <span>
          {t("Press")} <span className="kbd">⌘K</span> {t("to jump anywhere")}
        </span>
        <a href="#top" data-top>
          {t("Back to the top")}
        </a>
      </div>
    </footer>
  );
}
