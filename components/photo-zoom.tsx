"use client";

/* — Tombol "perbesar gambar" ————————————————————————————————————————
 *
 * Dipakai di tempat yang fotonya TIDAK boleh menelan seluruh area klik:
 * header halaman, header surah, banner, strip pembatas. Di sana ada judul,
 * deskripsi, dan tombol lain di atas foto — kalau seluruh bidang dijadikan
 * tombol, tautan-tautan itu jadi tidak bisa diklik.
 *
 * Jadi bentuknya tombol kecil di sudut: jelas terlihat, tidak berebut, dan
 * tetap bisa dijangkau Tab. Untuk petak galeri yang memang kosong, seluruh
 * bidangnya tetap tombol (lihat components/gallery.tsx).
 */

import { CREDITS } from "@/lib/data/credits";
import { useLightbox } from "./image-lightbox";
import type { ArtVariant } from "./ambient-image";
import { IconZoom } from "./icons";
import { lightboxSize, lightboxSrcs } from "@/lib/lightbox-src";

interface Props {
  variant: ArtVariant;
  caption: string;
  position?: string;
  className?: string;
  /** tampilkan hanya ikon (untuk strip pembatas yang tipis) */
  ringkas?: boolean;
}

export function PhotoZoom({
  variant,
  caption,
  position,
  className,
  ringkas = false,
}: Props) {
  const { buka } = useLightbox();

  /* pakai varian terbesar yang tersedia supaya layar besar dapat detail penuh */
  const credit = CREDITS.find((c) => c.name === variant);
  const besar = credit?.files?.lg?.webp ?? credit?.files?.md?.webp;
  const src = besar ? `/images/${besar}` : `/images/${variant}-lg.webp`;

  return (
    <button
      type="button"
      className={`photo-zoom${ringkas ? " photo-zoom--ringkas" : ""} ${className ?? ""}`.trim()}
      onClick={() => buka({ name: variant, src, ...lightboxSize(credit), srcSet: lightboxSrcs(credit), caption, position, credit })}
      aria-label={`Perbesar gambar: ${caption}`}
      title="Perbesar gambar"
    >
      <IconZoom />
      {!ringkas && <span className="photo-zoom__label">Perbesar</span>}
    </button>
  );
}
