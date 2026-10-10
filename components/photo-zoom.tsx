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

interface Props {
  variant: ArtVariant;
  caption: string;
  position?: string;
  className?: string;
  /** tampilkan hanya ikon (untuk strip pembatas yang tipis) */
  ringkas?: boolean;
}

function IconZoom() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" />
    </svg>
  );
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
      onClick={() => buka({ name: variant, src, caption, position, credit })}
      aria-label={`Perbesar gambar: ${caption}`}
      title="Perbesar gambar"
    >
      <IconZoom />
      {!ringkas && <span className="photo-zoom__label">Perbesar</span>}
    </button>
  );
}
