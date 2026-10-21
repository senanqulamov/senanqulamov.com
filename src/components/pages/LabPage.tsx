import { experiments, sketches } from "@/data/lab";
import type { Translate } from "@/i18n";
import { pad2 } from "@/lib/format";
import { Footer } from "../shell/Footer";
import { PageHead } from "../ui/PageHead";

export function LabPage({ t }: { t: Translate }) {
  return (
    <>
      <PageHead
        t={t}
        crumb="Lab"
        title="The lab"
        lede="Working systems you can poke: a database, concurrency, traffic, hashing and caching. Everything runs live in your browser, no backend required."
        scene="lab"
      />
      <section data-s="labx" className="labx">
        <div className="lab-wrap">
          <nav className="lab-nav" aria-label="Experiments">
            {experiments.map((x, i) => (
              <a href={`#x-${x.key}`} key={x.key}>
                <span>{pad2(i + 1)}</span>
                {t(x.title)}
              </a>
            ))}
            <a href="#x-visual">
              <span>{pad2(experiments.length + 1)}</span>
              {t("Visual sketches")}
            </a>
          </nav>
          <div className="lab-main">
            {experiments.map((x, i) => (
              <article className="xp" id={`x-${x.key}`} data-x={x.key} key={x.key}>
                <header className="xp-h">
                  <span className="xp-n">{pad2(i + 1)}</span>
                  <div>
                    <h2>{t(x.title)}</h2>
                    <p>{t(x.text)}</p>
                  </div>
                </header>
                <div className="xp-body" id={`xb-${x.key}`} />
                <p className="xp-prod">
                  <b>{t("How I'd run it for real.")}</b> {x.inProduction}
                </p>
              </article>
            ))}
            <article className="xp" id="x-visual">
              <header className="xp-h">
                <span className="xp-n">{pad2(experiments.length + 1)}</span>
                <div>
                  <h2>{t("Visual sketches")}</h2>
                  <p>{t("Smaller experiments in light, noise, physics and type.")}</p>
                </div>
              </header>
              <div className="lab-grid">
                {sketches.map((s, i) => (
                  <button className="exp glass" data-exp={s.key} data-cursor={t("Run")} key={s.key}>
                    <canvas className="prev" data-prev={s.key} aria-hidden="true" />
                    <small>
                      {t("Sketch")} {i + 1}
                    </small>
                    <div>
                      <h3>{t(s.title)}</h3>
                      <p>{t(s.text)}</p>
                      <span className="chip">{t("Run sketch")}</span>
                    </div>
                  </button>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>
      <Footer t={t} />
    </>
  );
}
