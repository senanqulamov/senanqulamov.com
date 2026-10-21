import { essays } from "@/data/essays";
import { belief, bidbary, hero, liveLot, marquee, numbers, story, studio } from "@/data/home";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { translate, type Lang, type Translate } from "@/i18n";
import { money } from "@/lib/format";
import { EssayRow } from "../journal/EssayRow";
import { Footer } from "../shell/Footer";
import { Arrow } from "../ui/Icons";
import { Roll } from "../ui/Roll";
import { ProjectRow } from "../work/ProjectRow";

export function HomePage({ t, lang }: { t: Translate; lang: Lang }) {
  const intro = lang === "en" ? hero.intro : translate(lang, "heroIntro");
  return (
    <>
      <section id="hero" data-s="hero">
        <div className="hero-top">
          <span className="tag">{t(hero.status)}</span>
          <span>
            {t(profile.city)} <b data-clock />
          </span>
          <span>{t(hero.edition)}</span>
        </div>
        <div className="hero-intro">
          <p data-lines dangerouslySetInnerHTML={{ __html: intro }} />
          <div className="btn-row">
            <a className="btn" href="/work" data-mag>
              <Roll text={t("See the work")} /> <Arrow />
            </a>
            <a className="btn ghost" href="/contact" data-mag>
              <Roll text={t("Say hello")} />
            </a>
          </div>
        </div>
        <div className="portrait-slot" id="pSlot" data-cursor={t("Hello")}>
          <img alt={profile.portraitAlt} src={profile.portrait} />
          <div className="badge" aria-hidden="true">
            <svg viewBox="0 0 124 124">
              <defs>
                <path id="bp" d="M62,62 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text>
                <textPath href="#bp">{hero.badge}</textPath>
              </text>
            </svg>
            <span className="bc" />
          </div>
          <div className="portrait-cap">
            <span>{t(hero.portraitCaption)}</span>
            <span>{t(hero.portraitHint)}</span>
          </div>
        </div>
        <h1 className="hero-name" id="heroName" aria-label={profile.name}>
          {profile.name.split(" ").map((word) => (
            <span className="row" aria-hidden="true" key={word}>
              {word}
            </span>
          ))}
        </h1>
        <div className="hero-meta">
          <div className="roles">
            {profile.roles.map((r) => (
              <span key={r.title}>
                <b>{t(r.title)}</b> {t(r.place)}
              </span>
            ))}
          </div>
          <div className="scroll-cue">
            <i />
            {t("Scroll to begin")}
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="mq" id="mq">
          {[...marquee, ...marquee].map((word, i) => (
            <span key={i}>{t(word)}</span>
          ))}
        </div>
      </div>

      <section id="belief" data-s="belief">
        <div>
          <p className="sec-label centered">
            <b>01</b> {t("What I believe")}
          </p>
          <p className="belief" id="beliefTxt" data-scrub>
            {t(belief.text)}
          </p>
          <p className="belief-note">{t(belief.note)}</p>
        </div>
      </section>

      <section id="numbers" data-s="belief">
        <div className="nums line-in fade">
          {numbers.map((n) => (
            <div className="num" key={n.label}>
              <b data-count={n.value} data-plus={n.plus ? "" : undefined}>
                0
              </b>
              <span>{t(n.label)}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="story" data-s="story">
        <div className="story-sticky">
          <div className="story-top">
            <span>{t("The story, in seven scenes")}</span>
            <span className="story-prog">
              <i id="sProg" />
            </span>
          </div>
          <div className="track" id="track">
            <div className="panel intro">
              <h2 className="h-xl" data-split>
                {t(story.title)}
              </h2>
              <p>{t(story.intro)}</p>
            </div>
            {story.scenes.map((s, i) => (
              <div className="panel" key={s.title}>
                <div className="yr">{t(s.year)}</div>
                <h3>{t(s.title)}</h3>
                <p>{t(s.text)}</p>
                <span className="scene-n">{t(`Scene ${i + 1} of ${story.scenes.length}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="bidbary" data-s="bidbary">
        <div className="bb-copy">
          <span className="tag">{t(bidbary.tag)}</span>
          <h2 className="h-xl" data-split>
            BidBary
          </h2>
          <p className="bb-lede fade">{t(bidbary.text)}</p>
          <ul className="formats fade">
            {bidbary.formats.map((f) => (
              <li key={f.name}>
                <b>{t(f.name)}</b>
                <span>{t(f.rule)}</span>
              </li>
            ))}
          </ul>
          <div className="btn-row">
            <a
              className="btn"
              href={profile.bidbary}
              target="_blank"
              rel="noopener"
              data-mag
              data-cursor={t("Open")}
            >
              <Roll text={t("Visit bidbary.me")} /> <Arrow />
            </a>
            <a className="btn ghost" href="/work/bidbary">
              <Roll text={t("Case study")} />
            </a>
          </div>
        </div>
        <div className="lot glass fade" id="lot">
          <div className="lot-head">
            <span className="live-dot">
              {t("Live lot")} {liveLot.number}
            </span>
            <span>{t(liveLot.format)}</span>
          </div>
          <h3>{t(liveLot.title)}</h3>
          <span className="muted lot-rules">{t(liveLot.rules)}</span>
          <div className="lot-grid">
            <div className="lot-box">
              <small>{t("Current bid")}</small>
              <b id="lotBid">{money(liveLot.startBid)}</b>
            </div>
            <div className="lot-box" id="lotTimeBox">
              <small>{t("Closes in")}</small>
              <b id="lotTime">00:{liveLot.seconds}</b>
            </div>
          </div>
          <div className="reserve">
            <i id="lotRes" />
          </div>
          <div className="lot-status" id="lotStatus" role="status">
            {t("Bidding opens when the lot is on screen")}
          </div>
          <div className="bids">
            {liveLot.steps.map((step) => (
              <button key={step} data-b={step} disabled>
                +{step}
              </button>
            ))}
          </div>
          <ul className="feed" id="feed" />
          <div className="lot-done" id="lotDone">
            <div>
              <h4 id="doneT">{t("Your table is booked.")}</h4>
              <p id="doneP" />
              <button className="btn" id="lotAgain">
                {t("Run it again")}
              </button>
            </div>
          </div>
          <p className="lot-note">{t("Interface demo. Names and amounts are illustrative.")}</p>
        </div>
      </section>

      <section data-s="work" className="home-work">
        <div className="sec-t">
          <h2 className="h-xl huge" data-split>
            {t("Selected work")}
          </h2>
          <a className="btn ghost" href="/work" data-mag>
            <Roll text={t("All 22 projects")} /> <Arrow />
          </a>
        </div>
        <ul className="plist">
          {projects.slice(0, 6).map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} number={i + 1} t={t} />
          ))}
        </ul>
      </section>

      <section className="studio" data-s="services">
        <h2 className="h-l" data-split>
          {t("Also in the studio")}
        </h2>
        <div className="studio-grid snap-row" data-lenis-prevent-horizontal>
          {studio.map((card) => (
            <a
              className="door-card glass fade"
              href={card.href}
              data-cursor={t("Open")}
              data-tilt
              key={card.href}
            >
              <small>{t(card.kicker)}</small>
              <div>
                <b>{t(card.title)}</b>
                <p>{t(card.text)}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section data-s="ideas" className="home-ideas">
        <div className="sec-t">
          <h2 className="h-l" data-split>
            {t("Latest thinking")}
          </h2>
          <a className="btn ghost" href="/journal">
            <Roll text={t("Open the journal")} /> <Arrow />
          </a>
        </div>
        <ul className="jlist">
          {essays.slice(0, 3).map((e) => (
            <EssayRow key={e.slug} essay={e} t={t} lang={lang} />
          ))}
        </ul>
      </section>
      <Footer t={t} />
    </>
  );
}
