import { projects, type ProjectType } from "@/data/projects";
import type { Translate } from "@/i18n";
import { Footer } from "../shell/Footer";
import { PageHead } from "../ui/PageHead";
import { ProjectRow } from "./ProjectRow";

const filters: { key: "all" | ProjectType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Startup", label: "Ventures" },
  { key: "Client", label: "Client work" },
  { key: "Personal", label: "Personal" },
];

export function WorkPage({ t }: { t: Translate }) {
  const count = (key: string) =>
    key === "all" ? projects.length : projects.filter((p) => p.type === key).length;
  return (
    <>
      <PageHead
        t={t}
        crumb="Work"
        title="Selected work"
        lede="Products I founded, platforms I led and systems I shipped for clients since 2021. Open any row to step into its story."
        scene="workpage"
      />
      <section data-s="workpage">
        <div className="filters" role="group" aria-label="Filter projects">
          {filters.map((f) => (
            <button key={f.key} aria-pressed={f.key === "all"} data-f={f.key}>
              {t(f.label)}
              <sup>{count(f.key)}</sup>
            </button>
          ))}
          <span className="sp" />
          <button aria-pressed="false" data-v="space">
            {t("Space")}
          </button>
          <button aria-pressed="true" data-v="list">
            {t("List")}
          </button>
          <button aria-pressed="false" data-v="grid">
            {t("Grid")}
          </button>
        </div>

        <div className="space" id="space" data-s="workspace" hidden>
          <div className="space-sticky" id="spStage" data-cursor={t("Fly")}>
            <div className="sp-hud">
              <span className="sp-idx" id="spIdx" />
              <a className="sp-title" id="spTitle" href={`/work/${projects[0].slug}`}>
                {projects[0].title}
              </a>
              <p className="sp-sub" id="spSub" />
              <span className="sp-meta" id="spMeta" />
            </div>
            <div className="sp-side">
              <span>{t("Scroll to fly through 22 projects. Click a card to open it.")}</span>
              <div className="sp-prog">
                <i id="spBar" />
              </div>
            </div>
          </div>
        </div>

        <ul className="plist" id="plist">
          {projects.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} number={i + 1} t={t} />
          ))}
        </ul>

        <div className="pgrid" id="pgrid" hidden>
          {projects.map((p) => (
            <a
              className="pcard fade"
              data-type={p.type}
              href={`/work/${p.slug}`}
              data-cursor={t("View")}
              key={p.slug}
            >
              <div
                className="pc-img"
                style={{ background: `linear-gradient(140deg,${p.colors[0]},${p.colors[1]})` }}
              >
                <span className="ph">{p.title}</span>
                {p.cover && (
                  <img src={p.cover} alt={`${p.title} screenshot`} loading="lazy" decoding="async" />
                )}
              </div>
              <div className="pc-meta">
                <span>{p.client}</span>
                <span>{p.year}</span>
              </div>
              <h3>{p.title}</h3>
            </a>
          ))}
        </div>
      </section>
      <Footer t={t} />
    </>
  );
}
