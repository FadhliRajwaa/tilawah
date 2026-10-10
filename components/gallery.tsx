/* — Galeri mosaik: menampilkan beberapa foto sekaligus dengan span bervariasi.
 * Ini yang membuat halaman terasa kaya gambar, bukan hanya satu hero.
 */

import { AmbientImage, type ArtVariant } from "./ambient-image";

export interface GalleryItem {
  variant: ArtVariant;
  caption: string;
  /** true = petak besar (2 kolom / 2 baris di desktop) */
  wide?: boolean;
  tall?: boolean;
  position?: string;
}

export function Gallery({ items, label }: { items: GalleryItem[]; label?: string }) {
  return (
    <div className="mosaic" role="list" aria-label={label ?? "Galeri gambar"}>
      {items.map((it) => (
        <figure
          key={it.variant + it.caption}
          role="listitem"
          className={`mosaic__cell${it.wide ? " is-wide" : ""}${it.tall ? " is-tall" : ""}`}
        >
          <AmbientImage
            variant={it.variant}
            mode="clean"
            position={it.position ?? "center"}
          />
          <figcaption className="mosaic__caption">{it.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
