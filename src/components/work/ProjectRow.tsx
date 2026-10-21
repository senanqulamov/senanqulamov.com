import type { Project } from "@/data/projects";
import type { Translate } from "@/i18n";
import { pad2 } from "@/lib/format";
import { Roll } from "../ui/Roll";

export function ProjectRow({
  project,
  index,
  number,
  t,
}: {
  project: Project;
  index: number;
  number: number;
  t: Translate;
}) {
  return (
    <li className="prow roll-host" data-type={project.type} data-peek={index}>
      <a href={`/work/${project.slug}`} data-cursor={t("View")}>
        <span className="pi">{pad2(number)}</span>
        <span className="pt">
          <Roll text={project.title} />
          {project.liveUrl && <span className="lv">{t("live")}</span>}
        </span>
        <span className="ps">{project.subtitle}</span>
        <span className="pc">{project.client}</span>
        <span className="py">{project.year}</span>
      </a>
    </li>
  );
}
