import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EssayPage } from "@/components/journal/EssayPage";
import { essays } from "@/data/essays";
import { getT } from "@/i18n/server";
import { loadEssay } from "@/lib/essays";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return essays.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const essay = essays.find((e) => e.slug === slug);
  if (!essay) return {};
  return {
    title: essay.title,
    description: essay.excerpt,
    alternates: { canonical: `/journal/${essay.slug}` },
    openGraph: { type: "article", title: essay.title, description: essay.excerpt, publishedTime: essay.date },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const essay = essays.find((e) => e.slug === slug);
  if (!essay) notFound();
  const [{ t, lang }, { html, toc }] = await Promise.all([getT(), loadEssay(essay.slug)]);
  return <EssayPage essay={essay} html={html} toc={toc} t={t} lang={lang} />;
}
