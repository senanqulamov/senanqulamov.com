import { Fragment } from "react";
import { bios, pressFacts, talkFormats, talks } from "@/data/press";
import { profile } from "@/data/profile";
import type { Translate } from "@/i18n";
import { Footer } from "../shell/Footer";
import { Field, TextArea } from "../ui/Field";
import { Arrow } from "../ui/Icons";
import { PageHead } from "../ui/PageHead";
import { Roll } from "../ui/Roll";

export function PressPage({ t }: { t: Translate }) {
  return (
    <>
      <PageHead
        t={t}
        crumb="Press kit"
        title="Press kit"
        lede="Bios, photos, talk topics and everything an organizer or journalist needs. Copy what you need, or book a talk below."
        scene="press"
      >
        <div className="btn-row fade">
          <a className="btn" href="#book-talk">
            <Roll text={t("Book a talk")} /> <Arrow />
          </a>
        </div>
      </PageHead>
      <section data-s="press">
        <div className="sec-t flush">
          <h2 className="h-l" data-split>
            {t("Bios")}
          </h2>
        </div>
        {bios.map((b) => (
          <div className="bio glass fade" key={b.length}>
            <header>
              <span>{t(b.length)}</span>
              <button className="chip" data-copy={b.text}>
                {t("Copy")}
              </button>
            </header>
            <p>{b.text}</p>
          </div>
        ))}

        <div className="sec-t">
          <h2 className="h-l" data-split>
            {t("Talk topics")}
          </h2>
        </div>
        <ul className="topics">
          {talks.map((talk) => (
            <li className="fade" key={talk.title}>
              <div>
                <b>{t(talk.title)}</b>
                <p>{t(talk.text)}</p>
              </div>
              <span>{talk.format}</span>
            </li>
          ))}
        </ul>

        <div className="sec-t">
          <h2 className="h-l" data-split>
            {t("Photo and facts")}
          </h2>
        </div>
        <div className="press-photo">
          <figure data-clip>
            <img src={profile.portrait} alt={`Portrait of ${profile.name}, Baku 2025`} loading="lazy" />
          </figure>
          <div className="fade">
            <dl className="facts">
              {pressFacts.map(([label, value]) => (
                <Fragment key={label}>
                  <dt>{t(label)}</dt>
                  <dd>{t(value)}</dd>
                </Fragment>
              ))}
              <dt>{t("Press contact")}</dt>
              <dd>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </dd>
            </dl>
            <div className="btn-row">
              <a className="btn ghost" href={profile.portrait} download="senan-qulamov-portrait.webp">
                <Roll text={t("Download portrait")} />
              </a>
            </div>
          </div>
        </div>

        <div className="sec-t" id="book-talk">
          <h2 className="h-l" data-split>
            {t("Book a talk")}
          </h2>
        </div>
        <form id="talkForm" className="glass fade talk-form" noValidate>
          <div className="two">
            <Field name="event" label={t("Event name")} required />
            <Field name="date" label={t("Date")} type="date" />
          </div>
          <div className="two">
            <Field name="city" label={t("City or online")} />
            <Field name="size" label={t("Audience size")} inputMode="numeric" />
          </div>
          <label className="fl sel">
            <select name="format">
              {talkFormats.map((f) => (
                <option key={f} value={f}>
                  {t(f)}
                </option>
              ))}
            </select>
            <span className="lb">{t("Format")}</span>
            <i className="bar" />
          </label>
          <div className="two">
            <Field name="name" label={t("Your name")} required />
            <Field name="email" label={t("Email")} type="email" required />
          </div>
          <TextArea name="about" label={t("About the event")} max={800} />
          <button className="btn" type="submit">
            {t("Send the invitation")} <span className="bspin" />
            <Arrow />
          </button>
        </form>
      </section>
      <Footer t={t} />
    </>
  );
}
