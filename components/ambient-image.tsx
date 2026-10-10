/* — Lapisan gambar dekoratif: dari tekstur halus sampai foto yang tampil jelas.
 *
 * Empat mode pakai:
 *  - "veil"   → tekstur latar (opacity rendah + veil warna) — untuk header & hero
 *  - "plate"  → foto tampil jelas sebagai panel/kartu (opacity tinggi, veil tipis)
 *  - "clean"  → foto apa adanya, tanpa veil (untuk thumbnail & galeri)
 *  - `parallax` → foto bergerak lebih lambat dari halaman (efek kedalaman)
 *
 * ═══ Kenapa `parallax` memakai <img> + ParallaxLayer ═══
 *
 * Versi sebelumnya memakai `background-attachment: fixed`. Dua masalah nyata:
 *  1. **Safari iOS mengabaikannya** (batasan WebKit) — di iPhone efeknya
 *     tidak ada sama sekali.
 *  2. `cover` diukur terhadap VIEWPORT, bukan elemen — di ponsel 390×844,
 *     foto 21:9 jadi lebar 1.969px sehingga hanya ~20% tengah yang terlihat.
 *     Karena itu efeknya lalu dimatikan di ≤700px, dan itulah yang membuat
 *     pengguna melaporkan "fixed tidak jalan di mobile".
 *
 * Sekarang: `<img>` biasa yang digeser dengan `transform: translate3d()`.
 * Bekerja identik di semua peramban, skalanya bisa dikendalikan persis, dan
 * `object-fit: cover` mengukur terhadap ELEMEN (bukan viewport) sehingga
 * foto tetap proporsional di layar sempit.
 */

import type { CSSProperties } from "react";
import { ParallaxLayer } from "./parallax";

export type ArtVariant =
  // hero
  | "hero-dome-gold" | "hero-dome-glass" | "hero-night-gold" | "hero-arch-blue" | "hero-desert-dawn"
  // banner
  | "banner-nabawi" | "banner-kaaba-night" | "banner-prayer" | "banner-tile-blue" | "banner-mostar"
  | "banner-dome-blue" | "banner-tile-geo" | "banner-sunset"
  // kartu
  | "card-dome-mosaic" | "card-lamp-blue" | "card-reflection" | "card-sunset-purple"
  | "card-minaret" | "card-garden" | "card-nabawi-day" | "card-bismillah"
  | "card-quran-illum" | "card-star-tile" | "card-muqarnas"
  | "card-menara-kudus" | "card-menara-minar" | "card-prayer-hall"
  | "card-arch-hall" | "card-tile-green" | "card-desert-road"
  // tekstur
  | "tex-manuscript" | "tex-calligraphy" | "tex-lamp" | "tex-dome-detail"
  | "tex-prayer-hall" | "tex-desert" | "tex-silhouette" | "tex-rock" | "tex-night-dark"
  // pola
  | "divider-zellige" | "divider-star" | "divider-dome" | "divider-mosaic"
  // warisan (nama lama tetap didukung)
  | "hero-mushaf" | "reader-manuscript" | "ibadah-calligraphy" | "ibadah-istiqlal"
  | "divider-tile" | "divider-vine" | "dark-interior";

/** Alias nama lama → nama baru (agar kode lama tetap jalan). */
const ALIAS: Partial<Record<ArtVariant, ArtVariant>> = {
  "hero-mushaf": "hero-dome-gold",
  "reader-manuscript": "tex-manuscript",
  "ibadah-calligraphy": "tex-calligraphy",
  "ibadah-istiqlal": "card-nabawi-day",
  "divider-tile": "divider-zellige",
  "divider-vine": "divider-dome",
  "dark-interior": "tex-night-dark",
};

const RATIO: Record<string, [number, number]> = {
  "hero-dome-gold": [21, 9], "hero-dome-glass": [21, 9], "hero-night-gold": [21, 9],
  "hero-arch-blue": [21, 9], "hero-desert-dawn": [21, 9],
  "banner-nabawi": [16, 6], "banner-kaaba-night": [16, 6], "banner-prayer": [16, 6],
  "banner-tile-blue": [16, 6], "banner-mostar": [16, 6],
  "card-dome-mosaic": [4, 3], "card-lamp-blue": [4, 3], "card-reflection": [4, 3],
  "card-sunset-purple": [4, 3], "card-minaret": [4, 3], "card-garden": [4, 3],
  "card-nabawi-day": [4, 3], "card-bismillah": [4, 3], "card-quran-illum": [4, 3],
  "card-star-tile": [4, 3], "card-muqarnas": [4, 3],
  "card-menara-kudus": [4, 3], "card-menara-minar": [4, 3], "card-prayer-hall": [4, 3],
  "card-arch-hall": [4, 3], "card-tile-green": [4, 3], "card-desert-road": [4, 3],
  "banner-dome-blue": [16, 6], "banner-tile-geo": [16, 6], "banner-sunset": [16, 6],
  "tex-manuscript": [21, 9], "tex-calligraphy": [21, 9], "tex-lamp": [21, 9],
  "tex-dome-detail": [21, 9], "tex-prayer-hall": [21, 9], "tex-desert": [21, 9],
  "tex-silhouette": [21, 9], "tex-rock": [21, 9], "tex-night-dark": [21, 9],
  "divider-zellige": [24, 1], "divider-star": [24, 1], "divider-dome": [24, 1],
  "divider-mosaic": [24, 1],
};

interface Props {
  variant: ArtVariant;
  /** 0–1. veil: tekstur halus (0.08–0.2) · plate: foto jelas (0.75–1) */
  intensity?: number;
  position?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  fade?: "bottom" | "sides" | "top" | "none";
  /** "veil" (default) = tekstur; "plate" = foto sebagai panel; "clean" = tanpa perlakuan */
  mode?: "veil" | "plate" | "clean";
  /**
   * Foto bergerak lebih lambat dari halaman (efek kedalaman).
   * `true` = 0.6 (nyaris diam, untuk latar) · angka = kecepatan sendiri.
   */
  parallax?: boolean | number;
}

export function AmbientImage({
  variant,
  intensity,
  position = "center",
  priority = false,
  className = "",
  style,
  fade = "none",
  mode = "veil",
  parallax = false,
}: Props) {
  const v = (ALIAS[variant] ?? variant) as string;
  const [rw, rh] = RATIO[v] ?? [16, 9];
  const opacity = intensity ?? (mode === "plate" ? 1 : mode === "clean" ? 1 : 0.12);

  const mask =
    fade === "bottom"
      ? "linear-gradient(to bottom, #000 0%, #000 34%, transparent 100%)"
      : fade === "top"
        ? "linear-gradient(to top, #000 0%, #000 34%, transparent 100%)"
        : fade === "sides"
          ? "linear-gradient(to right, transparent 0%, #000 16%, #000 84%, transparent 100%)"
          : undefined;

  const img = (
    <picture
      className={`ambient ambient--${mode} ${className}`.trim()}
      style={
        {
          "--ambient-opacity": opacity,
          ...(mask ? { "--ambient-mask": mask } : null),
          ...style,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      {/* `sizes` menentukan varian mana yang diunduh browser.
       *
       * Sebelumnya tertulis `..., 1900px` untuk semua layar ≥1300px — itu
       * membuat browser di desktop selalu memilih varian lg (rata-rata 264 KB
       * per gambar) padahal gambar ini dirender sebagai latar/tekstur, bukan
       * elemen tajam. Terukur: beranda desktop menarik 1.650 KB gambar,
       * sedangkan mobile hanya 342 KB.
       *
       * Sekarang: layar sempit ambil sm (45 KB), layar sedang & besar ambil
       * md (139 KB). Varian lg tetap tersedia untuk layar sangat lebar /
       * kepadatan piksel tinggi (retina) lewat media `min-resolution`. */}
      <source
        type="image/webp"
        srcSet={`/images/${v}-sm.webp 700w, /images/${v}-md.webp 1300w, /images/${v}-lg.webp 1900w`}
        sizes="(max-width: 700px) 100vw, (min-resolution: 2dppx) and (min-width: 1300px) 1900px, 1300px"
      />
      <img
        src={`/images/${v}-md.jpg`}
        srcSet={`/images/${v}-sm.jpg 700w, /images/${v}-md.jpg 1300w, /images/${v}-lg.jpg 1900w`}
        sizes="(max-width: 700px) 100vw, (min-resolution: 2dppx) and (min-width: 1300px) 1900px, 1300px"
        alt=""
        width={rw * 100}
        height={rh * 100}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        style={{ objectPosition: position }}
      />
    </picture>
  );

  /* — mode kedalaman: gambar digeser lebih lambat dari halaman — */
  if (parallax) {
    const speed = parallax === true ? 0.6 : parallax;
    return (
      <ParallaxLayer speed={speed} className="ambient--px-host">
        <span className="ambient--px-shift">{img}</span>
      </ParallaxLayer>
    );
  }

  return img;
}
