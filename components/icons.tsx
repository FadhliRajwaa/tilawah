/* — Ikon SVG bersama.
 *
 * ⚠️ Diekstrak dari duplikasi: `IconPlay` ditulis ulang 3× (audio-dock,
 * surah-head-actions, ayah-actions) dengan path yang byte-identik,
 * `IconClose` 3×, dan `IconZoom` 3×. Itu berarti satu perbaikan pada
 * bentuk ikon harus dikerjakan di tiga tempat — dan cepat atau lambat
 * ketiganya menyimpang (sudah terjadi: `IconClose` punya strokeWidth 1,8
 * di dua tempat dan 1,9 di satu tempat, tanpa alasan).
 *
 * KONVENSI:
 *  · Semua ikon `aria-hidden` — maknanya dibawa oleh `aria-label` pada
 *    tombol pembungkusnya, bukan oleh ikonnya.
 *  · Semua memakai `currentColor` supaya ikut warna teks induknya, dan
 *    bisa berubah keadaan (hover/aktif) tanpa aset terpisah.
 *  · Ukuran diatur lewat `className` dari pemanggil, bukan prop — supaya
 *    tiap tempat bisa memakai ukuran yang sesuai konteksnya.
 *  · `strokeWidth` diseragamkan: 1.7 untuk ikon garis (konsisten dengan
 *    berat teks di sekitarnya), 2 untuk ikon yang perlu lebih tegas.
 */

interface IconProps {
  className?: string;
}

/* ─── Pemutaran ─── */

export function IconPlay({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

export function IconPause({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4.5" height="16" rx="1.2" />
      <rect x="13.5" y="4" width="4.5" height="16" rx="1.2" />
    </svg>
  );
}

export function IconNext({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6 5.5v13a1 1 0 0 0 1.55.83L16 13.6V18a1 1 0 0 0 2 0V6a1 1 0 0 0-2 0v4.4L7.55 4.67A1 1 0 0 0 6 5.5Z" />
    </svg>
  );
}

export function IconPrev({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18 5.5v13a1 1 0 0 1-1.55.83L8 13.6V18a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v4.4l8.45-5.73A1 1 0 0 1 18 5.5Z" />
    </svg>
  );
}

export function IconRepeat({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

/* ─── Aksi ayat ─── */

export function IconBook({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

export function IconBookmark({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ? `i-bm ${className}` : "i-bm"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21 12 16.5 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
    </svg>
  );
}

export function IconCopy({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function IconLink({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/* ─── Umum ─── */

export function IconClose({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      className={className}
      fill="none"
      stroke="currentColor"
      /* 1.7, bukan 1.8/1.9 seperti sebelumnya — diseragamkan dengan ikon
         garis lain supaya beratnya konsisten. */
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconZoom({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      className={className}
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

export function IconUser({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function IconChevron({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function IconSpinner({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

/* ─── Navigasi & chrome ─── */

/** Ikon garis standar: 24×24, stroke 1.7, ujung bulat. */
function Line({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconHome({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M3.5 10.2 12 3.6l8.5 6.6V19a1.6 1.6 0 0 1-1.6 1.6h-4.1v-5.4H9.2v5.4H5.1A1.6 1.6 0 0 1 3.5 19Z" />
    </Line>
  );
}

/** Mushaf terbuka — "Surah" */
export function IconMushaf({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M12 6.4C9.6 4.6 6.4 4.2 3.5 5v13.4c2.9-.8 6.1-.4 8.5 1.4 2.4-1.8 5.6-2.2 8.5-1.4V5c-2.9-.8-6.1-.4-8.5 1.4Z" />
      <path d="M12 6.4v13.4" />
    </Line>
  );
}

/** Tumpukan lembar — "Juz" */
export function IconLayers({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="m12 3.5 8.5 4.6L12 12.7 3.5 8.1Z" />
      <path d="m3.5 12.2 8.5 4.6 8.5-4.6" />
      <path d="m3.5 16.2 8.5 4.6 8.5-4.6" />
    </Line>
  );
}

/** Bulan sabit & bintang — "Ibadah" */
export function IconCrescent({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M15.6 20.1A8.6 8.6 0 1 1 13.9 3.6a6.8 6.8 0 0 0 1.7 16.5Z" />
      <path d="m18.4 6.6.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5Z" />
    </Line>
  );
}

export function IconSun({ className }: IconProps) {
  return (
    <Line className={className}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
    </Line>
  );
}

export function IconMoon({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </Line>
  );
}

export function IconThemeAuto({ className }: IconProps) {
  return (
    <Line className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none" opacity="0.35" />
    </Line>
  );
}

/** Tiga titik — menu opsi */
export function IconMore({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="5.5" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="18.5" cy="12" r="1.7" />
    </svg>
  );
}

export function IconShare({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M12 3.5v11" />
      <path d="m7.8 7.4 4.2-4 4.2 4" />
      <path d="M8 10.5H6.6A1.6 1.6 0 0 0 5 12.1v6.8a1.6 1.6 0 0 0 1.6 1.6h10.8a1.6 1.6 0 0 0 1.6-1.6v-6.8a1.6 1.6 0 0 0-1.6-1.6H16" />
    </Line>
  );
}

/** "Aa" — pengaturan tampilan teks */
export function IconType({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="m3 18 5-12 5 12" />
      <path d="M4.8 13.8h6.4" />
      <path d="M15 11.2a3 3 0 0 1 5.7 1.2V18" />
      <path d="M20.7 14.6c-3.2-.4-5.7.4-5.7 2 0 1 .8 1.6 2 1.6 1.6 0 3-1 3.7-2.6" />
    </Line>
  );
}

export function IconTimer({ className }: IconProps) {
  return (
    <Line className={className}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.4 2.4" />
      <path d="M9.5 2.5h5" />
    </Line>
  );
}

export function IconList({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth="2.6" />
    </Line>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Line>
  );
}

export function IconInfo({ className }: IconProps) {
  return (
    <Line className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6h.01" />
    </Line>
  );
}

export function IconCompass({ className }: IconProps) {
  return (
    <Line className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.6 8.4-2.2 5-5 2.2 2.2-5Z" />
    </Line>
  );
}
