/* — Ayat satu juz (Mushaf Standar Indonesia).
 *
 * Batas juz dari `lib/data/juz.ts` (statis, karena API publik memakai Mushaf
 * Madinah yang membagi beberapa batas secara berbeda). Teks ayat dari
 * equran.id per surah, lalu diiris sesuai rentang — memakai cache yang sama
 * dengan halaman surat, jadi tidak ada permintaan tambahan.
 */

import "server-only";
import { getSurah } from "./equran";
import { JUZ } from "@/lib/data/juz";
import type { Ayat } from "@/lib/types";

export async function getJuzAyah(nomor: number): Promise<Ayat[]> {
  const info = JUZ[nomor - 1];
  const detail = await Promise.all(info.rentang.map((r) => getSurah(r.surah)));
  return info.rentang.flatMap((r, i) =>
    detail[i].ayat.filter((a) => a.n >= r.dari && a.n <= r.sampai),
  );
}
