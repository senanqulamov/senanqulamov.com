import { booking, pricing } from "@/data/pricing";
import { profile } from "@/data/profile";
import { locales, type Lang, type Translate } from "@/i18n";
import { money, unitLabel } from "@/lib/format";
import { Footer } from "../shell/Footer";
import { Field, TextArea } from "../ui/Field";
import { Arrow } from "../ui/Icons";
import { PageHead } from "../ui/PageHead";

const steps = ["The idea", "The cut", "Extras", "Schedule", "The call", "The producer"];

function Option({
  type,
  name,
  value,
  title,
  text,
  tag,
}: {
  type: "checkbox" | "radio";
  name: string;
  value: string;
  title: string;
  text: string;
  tag?: string;
}) {
  return (
    <label className="opt">
      <input type={type} name={name} value={value} />
      <span>
        <i className="ck" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M3.5 8.5 6.5 11.5 12.5 5" fill="none" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </i>
        <b>{title}</b>
        <small>{text}</small>
        {tag && <em>{tag}</em>}
      </span>
    </label>
  );
}

/** The next working days that can be booked for an intro call. */
function bookableDays() {
  const days: Date[] = [];
  const today = new Date();
  for (let k = 1; days.length < booking.days && k < 30; k++) {
    const d = new Date(today);
    d.setDate(today.getDate() + k);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(d);
  }
  return days;
}

export function StartPage({ t, lang }: { t: Translate; lang: Lang }) {
  const locale = locales[lang];
  const percent = (m: number) =>
    m === 1 ? t("Base price") : `${m > 1 ? "+" : "−"}${Math.round(Math.abs(m - 1) * 100)}%`;
  return (
    <>
      <PageHead
        t={t}
        crumb="Start a project"
        title="Start a production"
        lede="Five short scenes. Pick what you need, see an honest estimate as you go, and send the brief straight to me."
        scene="start"
      />
      <section data-s="start">
        <div className="st-wrap">
          <form id="stForm" noValidate>
            <div className="st-steps" id="stSteps">
              {steps.map((s, i) => (
                <button type="button" data-go={i} className={i ? "" : "on"} key={s}>
                  {t(`${i + 1}. ${s}`)}
                </button>
              ))}
            </div>
            <div className="st-prog">
              <i id="stProg" />
            </div>

            <div className="st-scene on" data-sc="0">
              <h2>{t("What are we making?")}</h2>
              <p>{t("Choose one or more.")}</p>
              <div className="opts">
                {Object.entries(pricing.services).map(([key, s]) => (
                  <Option
                    key={key}
                    type="checkbox"
                    name="svc"
                    value={key}
                    title={t(s.name)}
                    text={t(s.description)}
                    tag={t((s.unit ? "" : "from ") + money(s.from) + unitLabel(s.unit))}
                  />
                ))}
              </div>
            </div>

            <div className="st-scene" data-sc="1">
              <h2>{t("How big is the production?")}</h2>
              <p>{t("The cut sets the scope and the polish.")}</p>
              <div className="opts">
                {Object.entries(pricing.packages).map(([key, p]) => (
                  <Option
                    key={key}
                    type="radio"
                    name="pkg"
                    value={key}
                    title={t(`${p.label}: ${p.name}`)}
                    text={t(p.description)}
                    tag={p.multiplier === 1 ? t("Base price") : `×${p.multiplier}`}
                  />
                ))}
              </div>
            </div>

            <div className="st-scene" data-sc="2">
              <h2>{t("Any extras?")}</h2>
              <p>{t("Optional. Add what matters to you.")}</p>
              <div className="opts">
                {Object.entries(pricing.addons).map(([key, a]) => (
                  <Option
                    key={key}
                    type="checkbox"
                    name="add"
                    value={key}
                    title={t(a.name)}
                    text={t(a.description)}
                    tag={t("+" + money(a.price) + unitLabel(a.unit))}
                  />
                ))}
              </div>
            </div>

            <div className="st-scene" data-sc="3">
              <h2>{t("When do you need it?")}</h2>
              <p>{t("Speed changes the price.")}</p>
              <div className="opts">
                {Object.entries(pricing.timeline).map(([key, tl]) => (
                  <Option
                    key={key}
                    type="radio"
                    name="time"
                    value={key}
                    title={t(tl.name)}
                    text={t(tl.description)}
                    tag={percent(tl.multiplier)}
                  />
                ))}
              </div>
              <p className="st-sub">{t("Your budget range")}</p>
              <div className="opts">
                {pricing.budgets.map((b) => (
                  <Option key={b} type="radio" name="budget" value={b} title={t(b)} text="" />
                ))}
              </div>
            </div>

            <div className="st-scene" data-sc="4">
              <h2>{t("When shall we talk?")}</h2>
              <p>{t("Pick a slot for a 30 minute intro call. Baku time, GMT+4. The call is optional.")}</p>
              <div className="slots-days" id="stDays" data-lenis-prevent-horizontal>
                {bookableDays().map((d) => (
                  <button type="button" data-day={d.toISOString().slice(0, 10)} key={d.toISOString()}>
                    <small>{d.toLocaleDateString(locale, { weekday: "short" })}</small>
                    {d.getDate()} {d.toLocaleDateString(locale, { month: "short" })}
                  </button>
                ))}
              </div>
              <div className="slots-times" id="stTimes">
                {booking.slots.map((s) => (
                  <button type="button" data-time={s} key={s}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="st-sub" id="stSlot">
                {t("No slot picked yet.")}
              </p>
            </div>

            <div className="st-scene" data-sc="5">
              <h2>{t("Who is producing?")}</h2>
              <p>{t("So I can send you a proper proposal.")}</p>
              <div className="two">
                <Field name="name" label={t("Your name")} autoComplete="name" required />
                <Field name="company" label={t("Company")} autoComplete="organization" />
              </div>
              <div className="two">
                <Field name="email" label={t("Email")} type="email" autoComplete="email" required />
                <Field name="phone" label={t("Phone or WhatsApp")} type="tel" autoComplete="tel" />
              </div>
              <TextArea
                name="story"
                label={t("Tell me the story: what, for whom, and what success looks like")}
                max={1200}
              />
              <p className="st-sub" id="stErr" role="alert" />
            </div>

            <div className="st-nav">
              <button type="button" className="btn ghost" id="stPrev" disabled>
                {t("Back")}
              </button>
              <button type="button" className="btn" id="stNext">
                <span className="st-next-label">{t("Next scene")}</span> <Arrow />
              </button>
            </div>
          </form>

          <aside className="est glass" id="est" aria-live="polite">
            <div className="en">
              <span>{t("Estimate")}</span>
              <span>Nº 048</span>
            </div>
            <div className="tot" id="stTotal">
              AZN 0
            </div>
            <div className="rng" id="stRange" />
            <ul id="stLines">
              <li className="empty">{t("Choose what we are making to see the estimate.")}</li>
            </ul>
            <dl>
              <dt>{t("Timeline")}</dt>
              <dd id="stWeeks">-</dd>
              <dt>{t("Recurring")}</dt>
              <dd id="stMonthly">-</dd>
              <dt>{t("Intro call")}</dt>
              <dd id="stCall">-</dd>
            </dl>
            <button className="btn wide" id="stSend">
              {t("Send the brief")} <span className="bspin" />
              <Arrow />
            </button>
            <p className="fine">
              {t("An estimate, not a quote. You will get a written proposal within a few days.")}
            </p>
          </aside>
        </div>

        <div className="est-bar" id="estBar" aria-hidden="true">
          <div>
            <small>{t("Estimate")}</small>
            <b id="ebTotal">AZN 0</b>
            <span id="ebWeeks" />
          </div>
          <button className="btn" type="button" id="ebGo">
            {t("Next scene")}
          </button>
        </div>

        <div className="wrap-done" id="stDone" hidden>
          <span className="tag">{t("That's a wrap")}</span>
          <h2 className="h-xl">{t("Your brief is ready to send.")}</h2>
          <p className="lede" id="stDoneText">
            {t(
              "Your email app should open with everything filled in. If it did not, copy the brief and send it to",
            )}{" "}
            {profile.email}.
          </p>
          <div className="btn-row centered">
            <button className="btn" id="stCopy">
              {t("Copy the brief")}
            </button>
            <a className="btn ghost" id="stMail" href="#">
              {t("Open email again")}
            </a>
            <button className="btn ghost" id="stAgain">
              {t("Start another")}
            </button>
          </div>
        </div>
      </section>

      <section data-s="start">
        <div className="sec-t">
          <h2 className="h-l" data-split>
            {t("Starting points")}
          </h2>
          <p className="muted">{t("Honest numbers, before the first call.")}</p>
        </div>
        <div className="table-scroll fade" data-lenis-prevent-horizontal>
          <table className="ptable">
            <thead>
              <tr>
                <th>{t("Service")}</th>
                <th>{t("Starts from")}</th>
                <th>{t("Typical timeline")}</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(pricing.services).map((s) => (
                <tr key={s.name}>
                  <td>{t(s.name)}</td>
                  <td>{t((s.unit ? "" : "from ") + money(s.from) + unitLabel(s.unit))}</td>
                  <td>{s.weeks ? t(`${s.weeks[0]} to ${s.weeks[1]} weeks`) : t("Ongoing")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">
          {t("All prices in AZN, excluding VAT. Final pricing follows a short discovery call.")}
        </p>
      </section>
      <Footer t={t} />
    </>
  );
}
