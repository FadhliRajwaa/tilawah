"use client";

/* — Galeri mosaik: foto bisa DIKLIK → terbuka lightbox.
 *
 * Sebelumnya gambar hanya dekorasi (aria-hidden, tanpa tautan) sehingga
 * pengguna tidak bisa melihat lebih jelas atau mengetahui lisensinya.
 * Sekarang tiap petak adalah <button> nyata: bisa dijangkau Tab, Enter,
 * dan membuka lightbox berisi versi besar + atribusi.
 *
 * Petak besar (wide/tall) tetap didukung agar komposisinya tidak seragam —
 * grid yang semua kartunya sama ukuran adalah tanda layout template.
 */

import { AmbientImage, type ArtVariant } from "./ambient-image";
import { ImageLightbox, useLightbox, type LightboxImage } from "./image-lightbox";
import { CREDITS } from "@/lib/data/credits";

export interface GalleryItem {
  variant: ArtVariant;
  caption: string;
  /** true = petak besar (2 kolom / 2 baris di desktop) */
  wide?: boolean;
  tall?: boolean;
  position?: string;
}

const creditOf = (name: string) => CREDITS.find((c) => c.name === name);

export function Gallery({ items, label }: { items: GalleryItem[]; label?: string }) {
  const { image, buka, tutup } = useLightbox();

  return (
    <>
      <div className="mosaic" role="list" aria-label={label ?? "Galeri gambar"}>
        {items.map((it) => {
          const credit = creditOf(it.variant);
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
                onClick={() => buka({ name: it.variant, src, caption: it.caption, position: it.position, credit })}
                aria-label={`Perbesar gambar: ${it.caption}`}
              >
                <AmbientImage
                  variant={it.variant}
                  mode="clean"
                  position={it.position ?? "center"}
                />
                <span className="mosaic__zoom" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" />
                  </svg>
                </span>
              </button>
              <figcaption className="mosaic__caption">{it.caption}</figcaption>
            </figure>
          );
        })}
      </div>

      <ImageLightbox image={image} onClose={tutup} />
    </>
  );
}
