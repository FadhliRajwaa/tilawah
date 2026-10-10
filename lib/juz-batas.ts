/* — Batas 30 juz menurut MUSHAF STANDAR INDONESIA (Kemenag/LPMQ).
 *
 * Mengapa data ini statis (bukan dari API)?
 * Pembagian juz berbeda antar mushaf standar. API publik (alquran.cloud,
 * quran.com) memakai **Mushaf Madinah** (Mujamma' Malik Fahd). Mushaf Standar
 * Indonesia membagi beberapa batas juz secara berbeda — mis. Juz 6 berakhir di
 * Al-Ma'idah 82 (bukan 81), sehingga Juz 7 dimulai dari Al-Ma'idah 83.
 *
 * Perbedaan ini terdokumentasi, termasuk dalam jurnal Kemenag (Jurnal Suhuf,
 * 2017) yang membandingkan rasm Mushaf Indonesia vs Madinah dengan fokus
 * juz 7, 14, dan 24.
 *
 * Karena tidak ada API yang menyediakan pembagian Mushaf Indonesia, tabel ini
 * disimpan sebagai data tetap. Verifikasi: total 6.236 ayat, tanpa celah.
 *
 * Sumber acuan: Mushaf Standar Indonesia (LPMQ Kemenag) — daftar batas juz
 * yang sama dipakai TafsirWeb dan situs-situs Al-Qur'an Indonesia.
 */

export interface BatasJuz {
  /** nomor juz 1–30 */
  juz: number;
  /** surah & ayat awal (inklusif) */
  dari: { surah: number; ayat: number };
  /** surah & ayat akhir (inklusif) */
  sampai: { surah: number; ayat: number };
}

export const JUZ_BATAS_INDONESIA: BatasJuz[] = [
  { juz: 1, dari: { surah: 1, ayat: 1 }, sampai: { surah: 2, ayat: 141 } },
  { juz: 2, dari: { surah: 2, ayat: 142 }, sampai: { surah: 2, ayat: 252 } },
  { juz: 3, dari: { surah: 2, ayat: 253 }, sampai: { surah: 3, ayat: 92 } },
  { juz: 4, dari: { surah: 3, ayat: 93 }, sampai: { surah: 4, ayat: 23 } },
  { juz: 5, dari: { surah: 4, ayat: 24 }, sampai: { surah: 4, ayat: 147 } },
  { juz: 6, dari: { surah: 4, ayat: 148 }, sampai: { surah: 5, ayat: 82 } },
  { juz: 7, dari: { surah: 5, ayat: 83 }, sampai: { surah: 6, ayat: 110 } },
  { juz: 8, dari: { surah: 6, ayat: 111 }, sampai: { surah: 7, ayat: 87 } },
  { juz: 9, dari: { surah: 7, ayat: 88 }, sampai: { surah: 8, ayat: 40 } },
  { juz: 10, dari: { surah: 8, ayat: 41 }, sampai: { surah: 9, ayat: 92 } },
  { juz: 11, dari: { surah: 9, ayat: 93 }, sampai: { surah: 11, ayat: 5 } },
  { juz: 12, dari: { surah: 11, ayat: 6 }, sampai: { surah: 12, ayat: 52 } },
  { juz: 13, dari: { surah: 12, ayat: 53 }, sampai: { surah: 14, ayat: 52 } },
  { juz: 14, dari: { surah: 15, ayat: 1 }, sampai: { surah: 16, ayat: 128 } },
  { juz: 15, dari: { surah: 17, ayat: 1 }, sampai: { surah: 18, ayat: 74 } },
  { juz: 16, dari: { surah: 18, ayat: 75 }, sampai: { surah: 20, ayat: 135 } },
  { juz: 17, dari: { surah: 21, ayat: 1 }, sampai: { surah: 22, ayat: 78 } },
  { juz: 18, dari: { surah: 23, ayat: 1 }, sampai: { surah: 25, ayat: 20 } },
  { juz: 19, dari: { surah: 25, ayat: 21 }, sampai: { surah: 27, ayat: 55 } },
  { juz: 20, dari: { surah: 27, ayat: 56 }, sampai: { surah: 29, ayat: 45 } },
  { juz: 21, dari: { surah: 29, ayat: 46 }, sampai: { surah: 33, ayat: 30 } },
  { juz: 22, dari: { surah: 33, ayat: 31 }, sampai: { surah: 36, ayat: 27 } },
  { juz: 23, dari: { surah: 36, ayat: 28 }, sampai: { surah: 39, ayat: 31 } },
  { juz: 24, dari: { surah: 39, ayat: 32 }, sampai: { surah: 41, ayat: 46 } },
  { juz: 25, dari: { surah: 41, ayat: 47 }, sampai: { surah: 45, ayat: 37 } },
  { juz: 26, dari: { surah: 46, ayat: 1 }, sampai: { surah: 51, ayat: 30 } },
  { juz: 27, dari: { surah: 51, ayat: 31 }, sampai: { surah: 57, ayat: 29 } },
  { juz: 28, dari: { surah: 58, ayat: 1 }, sampai: { surah: 66, ayat: 12 } },
  { juz: 29, dari: { surah: 67, ayat: 1 }, sampai: { surah: 77, ayat: 50 } },
  { juz: 30, dari: { surah: 78, ayat: 1 }, sampai: { surah: 114, ayat: 6 } },
];

export function getBatasJuz(nomor: number): BatasJuz | undefined {
  return JUZ_BATAS_INDONESIA.find((b) => b.juz === nomor);
}

/** Label ringkas dari tabel batas (butuh peta nama surah untuk dirapikan). */
export function labelBatasJuz(b: BatasJuz, namaSurah: (n: number) => string): string {
  return `${namaSurah(b.dari.surah)} ${b.dari.ayat} → ${namaSurah(b.sampai.surah)} ${b.sampai.ayat}`;
}
