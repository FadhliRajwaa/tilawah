/* — Ornamen geometris Islami buatan sendiri (SVG Tier B, hallmark).
 * Semua memakai currentColor agar ikut token; tidak ada nilai warna inline.
 */

export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={className} role="presentation" aria-hidden="true">
      <svg viewBox="0 0 200 24" className="ornament-divider" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 12h62" />
        <path d="M138 12h62" />
        <path d="M100 3l9 9-9 9-9-9z" />
        <path d="M100 7.5l4.5 4.5-4.5 4.5-4.5-4.5z" fill="currentColor" stroke="none" opacity="0.55" />
        <circle cx="78" cy="12" r="2.2" fill="currentColor" stroke="none" opacity="0.5" />
        <circle cx="122" cy="12" r="2.2" fill="currentColor" stroke="none" opacity="0.5" />
      </svg>
    </div>
  );
}

export function OrnamentStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="8" y="8" width="24" height="24" transform="rotate(45 20 20)" />
      <rect x="13" y="13" width="14" height="14" transform="rotate(45 20 20)" fill="currentColor" stroke="none" opacity="0.35" />
    </svg>
  );
}

/** Bingkai kaligrafi hero: lengkung mihrab + bintang 8. */
export function MihrabFrame({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 300"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      {/* lengkung mihrab */}
      <path d="M20 292V120C20 65 65 20 120 20s100 45 100 100v172" />
      <path d="M34 292V122c0-48 39-86 86-86s86 38 86 86v170" opacity="0.55" />
      {/* bintang 8 di puncak */}
      <g transform="translate(120 62)" opacity="0.9">
        <rect x="-13" y="-13" width="26" height="26" transform="rotate(45)" />
        <rect x="-13" y="-13" width="26" height="26" />
        <circle r="4" fill="currentColor" stroke="none" opacity="0.6" />
      </g>
      {/* ornamen bawah */}
      <path d="M84 292v-24M156 292v-24" opacity="0.6" />
      <path d="M96 268h48" opacity="0.6" />
    </svg>
  );
}

/** Medali nomor ayat (gold, dekoratif) — bentuk bintang 8 khas mushaf. */
export function AyahMedal({ nomor, className }: { nomor: number; className?: string }) {
  return (
    <span className={className} aria-label={`Ayat ${nomor}`}>
      <svg viewBox="0 0 44 44" className="ayah-medal" aria-hidden="true">
        <rect x="7" y="7" width="30" height="30" transform="rotate(45 22 22)" className="ayah-medal__outer" />
        <rect x="11.5" y="11.5" width="21" height="21" transform="rotate(45 22 22)" className="ayah-medal__inner" />
      </svg>
      <span className="ayah-medal__num">{nomor}</span>
    </span>
  );
}

/** Ornamen sudut mushaf untuk header surat. */
export function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M2 2h20M2 2v20" />
      <path d="M8 8h10M8 8v10" opacity="0.55" />
      <path d="M2 30c8-2 14-8 16-16" opacity="0.7" />
      <circle cx="30" cy="6" r="1.6" fill="currentColor" stroke="none" opacity="0.6" />
      <circle cx="6" cy="30" r="1.6" fill="currentColor" stroke="none" opacity="0.6" />
    </svg>
  );
}
