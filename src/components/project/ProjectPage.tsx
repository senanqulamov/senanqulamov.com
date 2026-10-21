import { projectTypeLabel, projects, type Project } from "@/data/projects";
import type { Translate } from "@/i18n";
import { hostOf, pad2 } from "@/lib/format";
import { Footer } from "../shell/Footer";
import { Arrow } from "../ui/Icons";
import { Roll } from "../ui/Roll";

function BrowserBar({ host, id }: { host: string; id?: string }) {
  return (
    <div className="bw-bar">
      <i />
      <i />
      <i />
      <span id={id}>{host}</span>
    </div>
  );
}

/** Pairs each screen with a feature and a sentence from the story. */
function tourSteps(p: Project) {
  const sentences = [...p.story, p.solution, p.impact]
    .join(" ")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.length > 30);
  return p.images.slice(1, 9).map((src, i) => ({
    src,
    title: p.features[i] || p.subtitle,
    text: sentences[i] || p.summary,
  }));
}

export function ProjectPage({ project: p, t }: { project: Project; t: Translate }) {
  const index = projects.indexOf(p);
  const next = projects[(index + 1) % projects.length];
  const host = hostOf(p);
  const gradient = { background: `linear-gradient(140deg,${p.colors[0]},${p.colors[1]})` };
  const steps = tourSteps(p);
  const cards = [
    ["The problem", p.problem],
    ["The solution", p.solution],
    ["The impact", p.impact],
  ];

  return (
    <>
      <section className="pj-hero" data-s="project">
        <div className="pj-media" id="pjMedia" style={gradient}>
          {p.cover && <img src={p.cover} alt={`${p.title} cover`} decoding="async" />}
        </div>
        <div className="pj-hero-in">
          <div className="crumb">
            <a href="/" className="ul">
              {t("Home")}
            </a>
            <span>/</span>
            <a href="/work" className="ul">
              {t("Work")}
            </a>
            <span>/</span>
            <span>{t(`${pad2(index + 1)} of ${projects.length}`)}</span>
          </div>
          <h1 className="h-xl" id="pjTitle">
            {p.title}
          </h1>
          <p className="pd-sub">{p.subtitle}</p>
        </div>
        <div className="pj-mcover bw" aria-hidden="true">
          <BrowserBar host={host} />
          <div className="pj-mc-v" style={gradient}>
            {p.cover && <img src={p.cover} alt="" loading="lazy" decoding="async" />}
          </div>
        </div>
        <div className="pj-scroll">
          <span className="scroll-cue">
            <i />
          </span>
          {t("Scroll for the story")}
        </div>
      </section>

      <section className="pj-intro" data-s="project">
        <p className="sec-label">
          <b>01</b> {t("Overview")}
        </p>
        <p className="pj-statement" data-scrub>
          {p.summary}
        </p>
      </section>

      <section data-s="project">
        <div className="pj-grid">
          <aside className="pj-side">
            <div>
              <small>{t("Client")}</small>
              {p.client}
            </div>
            <div>
              <small>{t("Year")}</small>
              {p.year}
            </div>
            <div>
              <small>{t("Type")}</small>
              {t(projectTypeLabel[p.type])}
            </div>
            <div>
              <small>{t("Status")}</small>
              {p.status}
            </div>
            <div>
              <small>{t("Role")}</small>
              {p.role}
            </div>
            <div className="btn-row">
              {p.liveUrl && (
                <a className="btn" href={p.liveUrl} target="_blank" rel="noopener" data-cursor={t("Visit")}>
                  <Roll text={t("Open live site")} /> <Arrow />
                </a>
              )}
              {p.githubUrl && (
                <a className="btn ghost" href={p.githubUrl} target="_blank" rel="noopener">
                  <Roll text="GitHub" />
                </a>
              )}
              {!p.liveUrl && !p.githubUrl && (
                <span className="muted">{t("Private product, demo on request")}</span>
              )}
            </div>
          </aside>
          <div className="pj-body">
            <p className="sec-label">
              <b>02</b> {t("The story")}
            </p>
            {p.story.map((paragraph, i) => (
              <p data-lines key={i}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="pj-psi" data-s="project">
        <p className="sec-label">
          <b>03</b> {t("Problem, solution, impact")}
        </p>
        <div className="cards">
          {cards.map(([title, text], k) => (
            <article className="pcd" style={{ "--k": k } as React.CSSProperties} key={title}>
              <div>
                <small>0{k + 1} / 03</small>
                <h3>{t(title)}</h3>
              </div>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {p.metrics.length > 0 && (
        <section data-s="project">
          <div className="metrics line-in fade">
            {p.metrics.map((m) => (
              <div key={m.label}>
                <b>{m.value}</b>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section data-s="project" className="pj-features">
        <p className="sec-label">
          <b>04</b> {t("Features")}
        </p>
        <ul className="pj-feat">
          {p.features.map((f, i) => (
            <li className="fade" key={f}>
              {f}
              <span>{pad2(i + 1)}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="stack-mq" aria-label={`Stack: ${p.tech.join(", ")}`}>
        <div className="in">
          {[...p.tech, ...p.tech, ...p.tech, ...p.tech].map((tech, i) => (
            <span key={i}>{tech}</span>
          ))}
        </div>
      </div>

      {steps.length > 0 && (
        <section className="tour" data-s="tour" id="tour">
          <p className="sec-label">
            <b>05</b> {t("Guided tour")}
          </p>
          <div className="tour-in">
            <div className="tour-stage">
              <div className="bw tour-frame" id="tourFrame" data-cursor={t("Expand")}>
                <BrowserBar host={host} />
                <div className="tour-view" style={gradient}>
                  {steps.map((s, i) => (
                    <img
                      className="tour-img"
                      data-i={i}
                      src={s.src}
                      alt={`${p.title} screen ${i + 1}`}
                      loading={i ? "lazy" : undefined}
                      decoding="async"
                      key={s.src}
                    />
                  ))}
                  <span className="tour-spot" id="tourSpot" />
                </div>
              </div>
              <div className="tour-foot">
                <span id="tourNum">01 / {pad2(steps.length)}</span>
                <div className="tour-dots">
                  {steps.map((s, i) => (
                    <button type="button" data-go={i} aria-label={`Go to step ${i + 1}`} key={s.src} />
                  ))}
                </div>
                <button className="chip" type="button" id="tourOpen">
                  {t("Full screen")}
                </button>
              </div>
            </div>
            <ol className="tour-steps">
              {steps.map((s, i) => (
                <li className="tstep" data-i={i} key={s.src}>
                  <div
                    className="tstep-img bw"
                    role="button"
                    tabIndex={0}
                    aria-label={`Open screen ${i + 1} full screen`}
                  >
                    <BrowserBar host={host} />
                    <div className="ti-v" style={gradient}>
                      <img src={s.src} alt="" loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <span className="tn">
                    {pad2(i + 1)} / {pad2(steps.length)}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {p.note && (
        <section data-s="project">
          <p className="note" data-scrub>
            {p.note}
          </p>
          <p className="muted note-by">{t("A note from Senan")}</p>
        </section>
      )}

      <a className="pj-next" href={`/work/${next.slug}`} data-cursor={t("Next")} data-peek-off>
        <div
          className="nm"
          style={{ background: `linear-gradient(140deg,${next.colors[0]},${next.colors[1]})` }}
        >
          {next.cover && <img src={next.cover} alt={next.title} loading="lazy" decoding="async" />}
        </div>
        <div className="nt">
          <div>
            <small>
              {t("Next project")}, {t(`${pad2(projects.indexOf(next) + 1)} of ${projects.length}`)}
            </small>
            <b>{next.title}</b>
          </div>
        </div>
      </a>
      <Footer t={t} />
    </>
  );
}
