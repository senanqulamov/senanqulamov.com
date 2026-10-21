import { projects } from "@/data/projects";
import { engagementModels, faq, processSteps, services } from "@/data/services";
import type { Translate } from "@/i18n";
import { Footer } from "../shell/Footer";
import { Arrow } from "../ui/Icons";
import { PageHead } from "../ui/PageHead";
import { Roll } from "../ui/Roll";

export function ServicesPage({ t }: { t: Translate }) {
  return (
    <>
      <PageHead
        t={t}
        crumb="Services"
        title="What I can do"
        lede="Engineering, leadership and a trained ear. Pick one service or combine them into a single engagement."
        scene="services"
      >
        <div className="btn-row fade">
          <a className="btn" href="/start" data-mag>
            <Roll text={t("Start a project")} /> <Arrow />
          </a>
          <a className="btn ghost" href="/work">
            <Roll text={t("See the work")} />
          </a>
        </div>
      </PageHead>

      <section data-s="services">
        <div className="stack">
          {services.map((s, k) => {
            const href =
              s.link ?? (s.estimateServices.length ? `/start?svc=${s.estimateServices.join(",")}` : "/start");
            return (
              <article className="scard" style={{ "--k": k } as React.CSSProperties} key={s.key}>
                <div>
                  <span className="sn">{t(`Service ${k + 1} of ${services.length}`)}</span>
                  <h3>{t(s.title)}</h3>
                  <p>{t(s.description)}</p>
                  <p className="good">{t(`Good for: ${s.goodFor}`)}</p>
                  {s.relatedProjects.length > 0 && (
                    <div className="rel">
                      {s.relatedProjects.map((slug) => {
                        const index = projects.findIndex((p) => p.slug === slug);
                        if (index < 0) return null;
                        return (
                          <a href={`/work/${slug}`} data-peek={index} key={slug}>
                            {projects[index].title}
                          </a>
                        );
                      })}
                    </div>
                  )}
                  <div className="btn-row">
                    <a className="btn ghost" href={href}>
                      <Roll text={t(s.link ? "See talk topics" : "Ask about this")} /> <Arrow />
                    </a>
                  </div>
                </div>
                <ul>
                  {s.includes.map((item) => (
                    <li key={item}>{t(item)}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section data-s="services">
        <div className="sec-t">
          <h2 className="h-l" data-split>
            {t("Three ways to work together")}
          </h2>
        </div>
        <div className="ways">
          {engagementModels.map((w) => (
            <div className="way glass fade" data-tilt key={w.letter}>
              <i>{w.letter}</i>
              <b>{t(w.title)}</b>
              <p>{t(w.text)}</p>
            </div>
          ))}
        </div>
        <p className="muted fade spaced">
          {t(
            "Pricing depends on scope. Tell me what you need and you will get a clear proposal within a few days.",
          )}
        </p>

        <div className="sec-t">
          <h2 className="h-l" data-split>
            {t("How a project runs")}
          </h2>
        </div>
        <div className="process">
          {processSteps.map((s) => (
            <div className="step line-in fade" key={s.title}>
              <b>{t(s.title)}</b>
              <p>{t(s.text)}</p>
            </div>
          ))}
        </div>

        <div className="sec-t">
          <h2 className="h-l" data-split>
            {t("Before we start")}
          </h2>
        </div>
        <ul className="acc">
          {faq.map((f, i) => (
            <li className="fade" key={f.question}>
              <button aria-expanded="false" aria-controls={`fq${i}`}>
                <b>{t(f.question)}</b>
                <i className="pm" aria-hidden="true" />
              </button>
              <div className="body" id={`fq${i}`}>
                <div>
                  <p>{t(f.answer)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <Footer t={t} />
    </>
  );
}
