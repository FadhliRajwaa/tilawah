"use client";

/* — Galeri mosaik: tiap petak bisa DIKLIK → terbuka lightbox.
 *
 * Sebelumnya gambar hanya dekorasi (aria-hidden, tanpa tautan) sehingga
 * pengguna tidak bisa melihat lebih jelas atau mengetahui lisensinya.
 * Sekarang tiap petak adalah <button> nyata: bisa dijangkau Tab, Enter,
 * dan membuka lightbox berisi versi besar + atribusi.
 *
 * Petak besar (wide/tall) tetap didukung agar komposisinya tidak seragam —
 * grid yang semua kartunya sama ukuran adalah tanda layout template.
 *
 * Lightbox-nya sekarang SATU untuk seluruh situs (di root layout), jadi
 * komponen ini tidak lagi merender dialognya sendiri.
 */

import { AmbientImage, type ArtVariant } from "./ambient-image";
import { useLightbox } from "./image-lightbox";
import { CREDITS } from "@/lib/data/credits";
import { IconZoom } from "./icons";

export interface GalleryItem {
  variant: ArtVariant;
  caption: string;
  /** true = petak besar (2 kolom / 2 baris di desktop) */
  wide?: boolean;
  tall?: boolean;
  position?: string;
}

export function Gallery({ items, label }: { items: GalleryItem[]; label?: string }) {
  const { buka } = useLightbox();

  return (
    <div className="mosaic" role="list" aria-label={label ?? "Galeri gambar"}>
      {items.map((it) => {
        const credit = CREDITS.find((c) => c.name === it.variant);
        const besar = credit?.files?.lg?.webp ?? credit?.files?.md?.webp;
        const src = besar ? `/images/${besar}` : `/images/${it.variant}-lg.webp`;
        return (
          <figure
            key={it.variant + it.caption}
            role="listitem"
            className={`mosaic__cell${it.wide ? " is-wide" : ""}${it.tall ? " is-tall" : ""}`}
          >
            <button
              type="button"
              className="mosaic__tap"
              onClick={() =>
                buka({ name: it.variant, src, caption: it.caption, position: it.position, credit })
              }
              aria-label={`Perbesar gambar: ${it.caption}`}
            >
              <AmbientImage
                variant={it.variant}
                mode="clean"
                position={it.position ?? "center"}
              />
              <span className="mosaic__zoom" aria-hidden="true">
                <IconZoom />
              </span>
            </button>
            <figcaption className="mosaic__caption">{it.caption}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
