import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/project/ProjectPage";
import { projects } from "@/data/projects";
import { getT } from "@/i18n/server";
import { absoluteUrl, createPageMetadata, jsonLd, siteUrl } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return createPageMetadata({
    title: project.title,
    description: project.summary,
    path: `/work/${project.slug}`,
    image: project.cover || "/opengraph-image",
    imageAlt: `${project.title} project screenshot`,
  });
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const { t } = await getT();
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${siteUrl}/work/${project.slug}#creativework`,
    url: absoluteUrl(`/work/${project.slug}`),
    name: project.title,
    description: project.summary,
    author: { "@id": `${siteUrl}/#person` },
    image: project.cover ? absoluteUrl(project.cover) : undefined,
    keywords: project.tech.join(", "),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(projectSchema) }} />
      <ProjectPage project={project} t={t} />
    </>
  );
}
