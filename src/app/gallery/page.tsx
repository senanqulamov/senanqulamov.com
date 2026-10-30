import type { Metadata } from "next";
import { GalleryPage } from "@/components/pages/GalleryPage";
import { galleryPhotos } from "@/data/gallery";
import { getT } from "@/i18n/server";
import { absoluteUrl, createPageMetadata, jsonLd } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Gallery",
  description: "Life, work, Baku and events through the lens of Senan Qulamov.",
  path: "/gallery",
  image: galleryPhotos[0].src,
  imageAlt: galleryPhotos[0].alt,
});

export default async function Page() {
  const { t } = await getT();
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Senan Qulamov — Gallery",
    url: absoluteUrl("/gallery"),
    image: galleryPhotos
      .filter((photo) => !photo.placeholder)
      .map((photo) => ({
        "@type": "ImageObject",
        contentUrl: absoluteUrl(photo.src),
        caption: photo.caption,
        description: photo.alt,
      })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <GalleryPage t={t} />
    </>
  );
}
