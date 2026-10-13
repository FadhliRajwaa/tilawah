/* — Varian gambar untuk lightbox. */
import type { CreditEntry } from "./data/credits";

/** Varian responsif — sm untuk ponsel, md/lg untuk desktop. */
export function lightboxSrcs(credit?: CreditEntry) {
  if (!credit) return undefined;
  const out: { src: string; w: number }[] = [];
  for (const key of ["sm", "md", "lg"] as const) {
    const f = credit.files?.[key];
    if (f) out.push({ src: f.webp, w: f.w });
  }
  return out.length ? out : undefined;
}

/** Dimensi varian terbesar — ruang direservasi sebelum gambar tiba. */
export function lightboxSize(credit?: CreditEntry): { width?: number; height?: number } {
  const f = credit?.files?.lg ?? credit?.files?.md ?? credit?.files?.sm;
  return f ? { width: f.w, height: f.h } : {};
}
