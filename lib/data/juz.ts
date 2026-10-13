/* — Info 30 juz, dihitung dari tabel batas Mushaf Standar Indonesia + indeks
 * surah statis. Tidak memanggil API sama sekali, jadi aman dipakai di klien
 * (pencarian cepat, bilah baca) maupun server. */

import { JUZ_BATAS_INDONESIA } from "@/lib/juz-batas";
import { SURAH } from "./surah";

export interface JuzRange {
  surah: number;
  dari: number;
  sampai: number;
}

export interface JuzInfo {
  nomor: number;
  jumlahAyat: number;
  /** rentang per surah — satu juz bisa mencakup beberapa surah */
  rentang: JuzRange[];
  /** "Al-Fatihah 1 → Al-Baqarah 141" */
  label: string;
}

export const JUZ: readonly JuzInfo[] = JUZ_BATAS_INDONESIA.map(({ juz, dari, sampai }) => {
  const rentang: JuzRange[] = [];
  for (let s = dari.surah; s <= sampai.surah; s++) {
    rentang.push({
      surah: s,
      dari: s === dari.surah ? dari.ayat : 1,
      sampai: s === sampai.surah ? sampai.ayat : SURAH[s - 1].ayat,
    });
  }
  return {
    nomor: juz,
    jumlahAyat: rentang.reduce((a, r) => a + r.sampai - r.dari + 1, 0),
    rentang,
    label: `${SURAH[dari.surah - 1].latin} ${dari.ayat} → ${SURAH[sampai.surah - 1].latin} ${sampai.ayat}`,
  };
});

/** Juz yang memuat ayat s:n. */
export function juzOf(s: number, n: number): number {
  const j = JUZ.find((j) => j.rentang.some((r) => r.surah === s && n >= r.dari && n <= r.sampai));
  return j?.nomor ?? 1;
}
