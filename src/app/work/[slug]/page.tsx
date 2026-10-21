import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/project/ProjectPage";
import { projects } from "@/data/projects";
import { getT } from "@/i18n/server";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.subtitle,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.cover ? [project.cover] : [],
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const { t } = await getT();
  return <ProjectPage project={project} t={t} />;
}
