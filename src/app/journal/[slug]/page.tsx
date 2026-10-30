import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EssayPage } from "@/components/journal/EssayPage";
import { essays } from "@/data/essays";
import { getT } from "@/i18n/server";
import { loadEssay } from "@/lib/essays";
import { absoluteUrl, createPageMetadata, jsonLd, siteUrl } from "@/lib/site";
import { profile } from "@/data/profile";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return essays.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const essay = essays.find((e) => e.slug === slug);
  if (!essay) return {};
  return createPageMetadata({
    title: essay.title,
    description: essay.excerpt,
    path: `/journal/${essay.slug}`,
    type: "article",
    publishedTime: essay.date,
    image: profile.portrait,
    imageAlt: profile.portraitAlt,
  });
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const essay = essays.find((e) => e.slug === slug);
  if (!essay) notFound();
  const [{ t, lang }, { html, toc }] = await Promise.all([getT(), loadEssay(essay.slug)]);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteUrl}/journal/${essay.slug}#article`,
    mainEntityOfPage: absoluteUrl(`/journal/${essay.slug}`),
    headline: essay.title,
    description: essay.excerpt,
    datePublished: essay.date,
    author: { "@id": `${siteUrl}/#person` },
    publisher: { "@id": `${siteUrl}/#website` },
    image: profile.portraitUrl,
    keywords: essay.tags,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }} />
      <EssayPage essay={essay} html={html} toc={toc} t={t} lang={lang} />
    </>
  );
}
