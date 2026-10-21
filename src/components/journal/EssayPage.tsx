import { essays, type Essay } from "@/data/essays";
import { profile } from "@/data/profile";
import { formatDate, type Lang, type Translate } from "@/i18n";
import { pad2 } from "@/lib/format";
import type { TocEntry } from "@/lib/markdown";
import { Footer } from "../shell/Footer";
import { CloseIcon } from "../ui/Icons";
import { Roll } from "../ui/Roll";

type Props = { essay: Essay; html: string; toc: TocEntry[]; t: Translate; lang: Lang };

export function EssayPage({ essay, html, toc, t, lang }: Props) {
  const index = essays.indexOf(essay);
  const next = essays[(index + 1) % essays.length];
  const url = `${profile.site}/journal/${essay.slug}`;
  return (
    <>
      <div className="read-bar" id="readBar" />
      <section className="ess-head" data-s="post">
        <div className="page-head bare">
          <div className="crumb">
            <a href="/">{t("Home")}</a>
            <span>/</span>
            <a href="/journal">{t("Journal")}</a>
            <span>/</span>
            <span>{t(`Essay ${index + 1} of ${essays.length}`)}</span>
          </div>
        </div>
        <div className="ess-kicker">
          {essay.tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
          <span>{formatDate(essay.date, lang)}</span>
          <span>{t(`${essay.minutes} minute read`)}</span>
        </div>
        <h1 className="ess-title" data-split>
          {essay.title}
        </h1>
        <p className="ess-stand fade">{essay.excerpt}</p>
        <div className="ess-by fade">
          <img src={profile.portrait} alt="" />
          <div>
            <b>{profile.name}</b>
            <span>{t("Engineer, founder, seven years a therapist")}</span>
          </div>
          <div className="ess-ctrl">
            <button className="chip" id="listenBtn" type="button">
              <svg viewBox="0 0 24 24" width="14" aria-hidden="true">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>{" "}
              {t("Listen")}
            </button>
            <button className="chip" id="focusBtn" type="button" aria-pressed="true">
              {t("Focus mode")}
            </button>
            <button className="chip" data-copy={url}>
              {t("Copy link")}
            </button>
          </div>
        </div>
      </section>

      <section data-s="post">
        {lang !== "en" && <p className="l10n-note">{t("This essay is available in English.")}</p>}
        <div className="ess-wrap">
          <nav className="toc" aria-label={t("In this essay")}>
            {toc.length > 0 && (
              <>
                <b>{t("In this essay")}</b>
                {toc.map((entry, i) => (
                  <a href={`#${entry.id}`} key={entry.id}>
                    <span>{pad2(i + 1)}</span>
                    {entry.title}
                  </a>
                ))}
              </>
            )}
          </nav>
          <article className="prose ess focus" id="essay" dangerouslySetInnerHTML={{ __html: html }} />
          <aside className="ess-side" aria-hidden="true">
            <div className="ess-meter">
              <b id="essLeft">{t(`${essay.minutes} min left`)}</b>
              <span id="essSec" />
              <i className="em-bar">
                <i id="essBar" />
              </i>
            </div>
          </aside>
        </div>
        <div className="ess-end">
          <span className="tag">{t("You reached the end")}</span>
          <h2 className="h-l">{t("Thanks for reading.")}</h2>
          <p className="muted">{t("If this was useful, pass it on, or tell me what you think.")}</p>
          <div className="btn-row centered">
            <a
              className="btn"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener"
            >
              <Roll text={t("Share on LinkedIn")} />
            </a>
            <button className="btn ghost" data-copy={url}>
              <Roll text={t("Copy link")} />
            </button>
            <a
              className="btn ghost"
              href={`mailto:${profile.email}?subject=${encodeURIComponent(`About: ${essay.title}`)}`}
            >
              <Roll text={t("Email Senan")} />
            </a>
          </div>
        </div>
        <a className="next" href={`/journal/${next.slug}`} data-cursor={t("Read")}>
          <small>{t("Next essay")}</small>
          <b>{next.title}</b>
        </a>
      </section>

      <div className="listen-bar glass" id="listenBar" hidden>
        <button className="ib" id="lsPlay" aria-label="Pause">
          <svg viewBox="0 0 24 24">
            <path id="lsIcon" d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" />
          </svg>
        </button>
        <div className="ls-mid">
          <b>{t("Listening")}</b>
          <span id="lsWhere" />
          <i className="ls-prog">
            <i id="lsProg" />
          </i>
        </div>
        <button className="chip" id="lsRate">
          1×
        </button>
        <button className="ib" id="lsStop" aria-label="Stop listening">
          <CloseIcon />
        </button>
      </div>
      <div className="sel-share" id="selShare" hidden>
        <button type="button" data-act="copy">
          {t("Copy quote")}
        </button>
        <a data-act="li" target="_blank" rel="noopener">
          LinkedIn
        </a>
        <a data-act="x" target="_blank" rel="noopener">
          X
        </a>
      </div>
      <Footer t={t} />
    </>
  );
}
