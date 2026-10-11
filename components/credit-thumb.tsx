"use client";

/* — Thumbnail halaman kredit yang bisa diklik.
 *
 * Halaman /kredit adalah server component, sedangkan lightbox butuh konteks
 * klien. Komponen kecil ini jembatannya: gambar kecil yang membuka versi
 * terbesar saat diklik.
 */

import { useLightbox } from "./image-lightbox";
import type { CreditEntry } from "@/lib/data/credits";
import { IconZoom } from "./icons";

export function CreditThumb({ credit }: { credit: CreditEntry }) {
  const { buka } = useLightbox();

  const sm = credit.files.sm?.webp ?? Object.values(credit.files)[0]?.webp;
  const besar = credit.files.lg?.webp ?? credit.files.md?.webp ?? sm;
  if (!sm) return null;

  return (
    <button
      type="button"
      className="credit-card__tap"
      onClick={() =>
        buka({
          name: credit.name,
          src: `/images/${besar}`,
          caption: credit.note || credit.title,
          credit,
        })
      }
      aria-label={`Perbesar gambar: ${credit.note || credit.title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/${sm}`}
        alt=""
        width={320}
        height={180}
        loading="lazy"
        className="credit-card__thumb"
      />
      <span className="credit-card__zoom" aria-hidden="true">
        <IconZoom />
      </span>
    </button>
  );
}
