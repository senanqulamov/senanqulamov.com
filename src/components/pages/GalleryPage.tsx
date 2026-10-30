import { galleryPhotos } from "@/data/gallery";
import type { Translate } from "@/i18n";
import { Footer } from "../shell/Footer";
import { PageHead } from "../ui/PageHead";
import { GalleryImage } from "./GalleryImage";

export function GalleryPage({ t }: { t: Translate }) {
  return (
    <>
      <PageHead
        t={t}
        crumb="Gallery"
        title="Gallery"
        lede="A few frames from the work, the city, and everything in between."
        scene="gallery"
      />
      <section className="gallery" data-s="gallery" aria-label={t("Gallery")}>
        <div className="gallery-wall" id="galleryWall">
          <div className="gallery-grid" id="galleryGrid">
            {galleryPhotos.map((photo, index) => (
              <article className="gallery-card" data-gallery-photo key={photo.src}>
                <button
                  className="gallery-frame"
                  data-gallery-open={index}
                  data-cursor={t("View")}
                  aria-label={`${t("View")}: ${t(photo.caption)}`}
                >
                  <GalleryImage photo={photo} eager={index < 5} />
                </button>
              </article>
            ))}
          </div>
          <div className="gallery-wall-ui" aria-hidden="true">
            <span>{galleryPhotos.length} frames · 2019–2026</span>
            <span className="gallery-wall-progress">
              <span id="galleryProgress" />
            </span>
          </div>
        </div>
      </section>
      <Footer t={t} />
    </>
  );
}
