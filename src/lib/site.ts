import type { Metadata } from "next";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://senanqulamov.com").replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString();
}

const defaultImage = "/opengraph-image";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = defaultImage,
  imageAlt = "Senan Qulamov — engineer, founder, and listener",
  type = "website",
  publishedTime,
}: PageMetadata): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const fullTitle = `${title} | Senan Qulamov`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      images: [{ url: imageUrl, alt: imageAlt }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [imageUrl] },
  };
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
