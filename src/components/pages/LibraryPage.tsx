import { bookThemes, books, type BookTheme } from "@/data/books";
import type { Translate } from "@/i18n";
import { Footer } from "../shell/Footer";
import { PageHead } from "../ui/PageHead";

/** Small abstract artwork on each cover, one per theme. */
const CoverArt = ({ theme }: { theme: BookTheme }) => <i className={`ca ca-${theme}`} />;

export function LibraryPage({ t }: { t: Translate }) {
  const themes = Object.entries(bookThemes) as [BookTheme, string][];
  return (
    <>
      <PageHead
        t={t}
        crumb="Library"
        title="The library"
        lede="More than 200 books across psychology, engineering, building and leadership. These sixteen are the ones I keep coming back to. Spin the ring, then open a book."
        scene="library"
      />
      <section data-s="library" className="lib">
        <div className="filters" role="group" aria-label="Filter books">
          <button aria-pressed="true" data-bf="all">
            {t("All")}
            <sup>{books.length}</sup>
          </button>
          {themes.map(([key, label]) => (
            <button aria-pressed="false" data-bf={key} key={key}>
              {t(label)}
              <sup>{books.filter((b) => b.theme === key).length}</sup>
            </button>
          ))}
          <span className="sp" />
          <span className="muted small">{t("Drag, scroll or use the arrow keys")}</span>
        </div>

        <div className="lib-stage" id="libStage" data-drag={t("Spin")} data-lenis-prevent>
          <div className="lib-ring" id="libRing">
            {books.map((b, i) => (
              <button
                className="book3d"
                data-bk={i}
                data-t={b.theme}
                style={{ "--c": b.color } as React.CSSProperties}
                aria-label={`${b.title} by ${b.author}`}
                key={b.title}
              >
                <span className="bk-f bk-front">
                  <span className="bk-cover">
                    <CoverArt theme={b.theme} />
                    <span className="bk-th">{t(bookThemes[b.theme])}</span>
                    <b>{b.title}</b>
                    <small>{b.author}</small>
                  </span>
                  <span className="bk-inside">
                    <small>{t("Why it is on the shelf")}</small>
                    <span>{b.why}</span>
                  </span>
                </span>
                <span className="bk-f bk-back" />
                <span className="bk-f bk-spine">
                  <b>{b.title}</b>
                </span>
                <span className="bk-f bk-pages" />
                <span className="bk-f bk-top" />
                <span className="bk-f bk-bottom" />
                <span className="bk-shadow" />
              </button>
            ))}
          </div>
          <div className="lib-floor" />
        </div>

        <div className="lib-mob" id="libMob" data-lenis-prevent-horizontal>
          {books.map((b, i) => (
            <button
              className="mbook"
              data-bk={i}
              data-t={b.theme}
              style={{ "--c": b.color } as React.CSSProperties}
              aria-label={`${b.title} by ${b.author}. Tap to read why it is on the shelf`}
              key={b.title}
            >
              <span className="mb-in">
                <span className="mb-front">
                  <CoverArt theme={b.theme} />
                  <span className="bk-th">{t(bookThemes[b.theme])}</span>
                  <b>{b.title}</b>
                  <small>
                    {b.author}, {b.year}
                  </small>
                </span>
                <span className="mb-back">
                  <small>{t("Why it is on the shelf")}</small>
                  <span>{b.why}</span>
                  {b.quote && <em>“{b.quote}”</em>}
                </span>
              </span>
            </button>
          ))}
        </div>
        <p className="lib-mob-hint muted">{t("Swipe through the shelf. Tap a book to turn it over.")}</p>
        <div className="lib-detail" id="libDetail" aria-live="polite" />
        <div className="lib-nav">
          <button className="chip" id="libPrev">
            {t("Previous book")}
          </button>
          <span className="muted" id="libCount" />
          <button className="chip" id="libNext">
            {t("Next book")}
          </button>
        </div>
      </section>

      <section data-s="library">
        <div className="sec-t">
          <h2 className="h-l" data-split>
            {t("Lines I underlined")}
          </h2>
        </div>
        <div className="quotes snap-row" data-lenis-prevent-horizontal>
          {books
            .filter((b) => b.quote)
            .map((b) => (
              <blockquote className="q fade" key={b.title}>
                <p>{b.quote}</p>
                <cite>
                  {b.title}, {b.author}
                </cite>
              </blockquote>
            ))}
        </div>
      </section>
      <Footer t={t} />
    </>
  );
}
