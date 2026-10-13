/* — Qari & alamat murottal.
 *
 * URL audio TIDAK lagi dikirim per ayat dari server. Polanya tetap:
 *
 *   cdn.equran.id/audio-partial/{qari}/{surah:3}{ayat:3}.mp3   (per ayat)
 *   cdn.equran.id/audio-full/{qari}/{surah:3}.mp3              (surah penuh)
 *
 * Terverifikasi untuk 114 surah × 6 qari (6.236 × 6 URL): nol penyimpangan.
 * Mengirimnya dari server berarti 6 URL per ayat masuk ke HTML — untuk
 * Al-Baqarah itu 114.000 karakter yang hanya mengulang pola ini.
 *
 * ponytail: kalau equran.id mengganti struktur CDN, cukup ubah `slug`/`CDN`
 * di sini — semua pemutar mengambil alamat dari fungsi `audioUrl`.
 */

export interface Qari {
  id: string;
  nama: string;
  singkat: string;
  /** nama folder di CDN equran.id */
  slug: string;
}

export const QARI: readonly Qari[] = [
  { id: "01", nama: "Abdullah Al-Juhany", singkat: "Al-Juhany", slug: "Abdullah-Al-Juhany" },
  { id: "02", nama: "Abdul Muhsin Al-Qasim", singkat: "Al-Qasim", slug: "Abdul-Muhsin-Al-Qasim" },
  { id: "03", nama: "Abdurrahman As-Sudais", singkat: "As-Sudais", slug: "Abdurrahman-as-Sudais" },
  { id: "04", nama: "Ibrahim Al-Dossari", singkat: "Al-Dossari", slug: "Ibrahim-Al-Dossari" },
  { id: "05", nama: "Misyari Rasyid Al-Afasi", singkat: "Al-Afasi", slug: "Misyari-Rasyid-Al-Afasi" },
  { id: "06", nama: "Yasser Al-Dosari", singkat: "Yasser", slug: "Yasser-Al-Dosari" },
];

export const QARI_DEFAULT = "05";

const CDN = "https://cdn.equran.id";
const p3 = (n: number) => String(n).padStart(3, "0");

export function qariOf(id: string): Qari {
  return QARI.find((q) => q.id === id) ?? QARI.find((q) => q.id === QARI_DEFAULT)!;
}

/** Alamat murottal. `ayat` 0 = surah penuh. */
export function audioUrl(qari: string, surah: number, ayat: number): string {
  const { slug } = qariOf(qari);
  return ayat > 0
    ? `${CDN}/audio-partial/${slug}/${p3(surah)}${p3(ayat)}.mp3`
    : `${CDN}/audio-full/${slug}/${p3(surah)}.mp3`;
}
