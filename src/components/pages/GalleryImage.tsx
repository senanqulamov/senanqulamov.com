"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryPhoto } from "@/data/gallery";

const blur =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSIzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjMiIGZpbGw9IiMyMzI0MmYiLz48L3N2Zz4=";

export function GalleryImage({ photo, eager }: { photo: GalleryPhoto; eager: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span
      className={`gallery-image${loaded ? " is-loaded" : ""}`}
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      <span className="gallery-skeleton" aria-hidden="true" />
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(min-width: 1440px) 20vw, (min-width: 1100px) 25vw, (min-width: 768px) 33vw, 50vw"
        priority={eager}
        loading={eager ? undefined : "lazy"}
        placeholder="blur"
        blurDataURL={blur}
        onLoad={() => setLoaded(true)}
      />
    </span>
  );
}
