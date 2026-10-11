/* — Konstanta waktu sholat.
 *
 * ⚠️ File ini SENGAJA terpisah dari `lib/api/sholat.ts`.
 *
 * `lib/api/sholat.ts` memakai `import "server-only"` karena ia memanggil API
 * myquran dengan kredensial cache Next.js. Kalau konstanta waktu ikut di
 * sana, komponen KLIEN (beranda, panel sholat) tidak bisa mengimpornya —
 * build akan gagal. Dulu itu sebabnya daftar waktu dan peta label ditulis
 * ULANG di dua komponen, dan dua salinan itu harus dijaga sinkron manual.
 *
 * Sekarang satu sumber, bisa dipakai server maupun klien.
 */

/** Urutan tampilan lengkap — termasuk yang bukan waktu sholat wajib. */
export const WAKTU_SEMUA = [
  { key: "imsak", label: "Imsak" },
  { key: "subuh", label: "Subuh" },
  { key: "terbit", label: "Terbit" },
  { key: "dhuha", label: "Dhuha" },
  { key: "dzuhur", label: "Dzuhur" },
  { key: "ashar", label: "Ashar" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isya", label: "Isya" },
] as const;

/** Lima waktu sholat wajib — dipakai untuk hitung mundur.
 *  Imsak, terbit, dan dhuha bukan waktu sholat, jadi tidak dihitung. */
export const WAKTU_WAJIB = ["subuh", "dzuhur", "ashar", "maghrib", "isya"] as const;

export type WaktuWajib = (typeof WAKTU_WAJIB)[number];

/** Nama Indonesia untuk tiap kunci waktu. */
export const LABEL_WAKTU: Record<string, string> = {
  imsak: "Imsak",
  subuh: "Subuh",
  terbit: "Terbit",
  dhuha: "Dhuha",
  dzuhur: "Dzuhur",
  ashar: "Ashar",
  maghrib: "Maghrib",
  isya: "Isya",
};
