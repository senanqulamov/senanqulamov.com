import { contactDoors } from "@/data/home";
import { profile } from "@/data/profile";
import type { Translate } from "@/i18n";
import { Footer } from "../shell/Footer";

export function ContactPage({ t }: { t: Translate }) {
  return (
    <>
      <section className="page-head centered" data-s="contact">
        <div className="crumb">
          <a href="/">{t("Home")}</a>
          <span>/</span>
          <span>{t("Contact")}</span>
        </div>
        <h1 className="h-xl ct-big" data-split>
          {t("Let's make the next one.")}
        </h1>
        <p className="lede fade">
          {t(
            "Investors, partners, event organizers and stages looking for a speaker. Pick your door, or just write.",
          )}
        </p>
        <div className="mail-wrap fade">
          <a className="mail" href={`mailto:${profile.email}`} data-mag data-cursor={t("Write")}>
            {profile.email}
          </a>
        </div>
        <div className="c-sub fade">
          <button className="chip" data-copy={profile.email}>
            {t("Copy email")}
          </button>
          <a className="chip" href={profile.phoneHref}>
            {profile.phone}
          </a>
          <a className="chip" href={profile.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
          <a className="chip" href={profile.github} target="_blank" rel="noopener">
            GitHub
          </a>
          <span className="chip" data-clock />
        </div>
      </section>
      <section data-s="contact">
        <div className="doors">
          {contactDoors.map((d) => (
            <a
              className="door fade"
              href={d.href ?? `mailto:${profile.email}?subject=${encodeURIComponent(d.subject)}`}
              key={d.title}
            >
              <b>{t(d.title)}</b>
              <span>{t(d.text)}</span>
            </a>
          ))}
        </div>
      </section>
      <Footer t={t} />
    </>
  );
}
