/* — Data Juz 1–30 mengikuti MUSHAF STANDAR INDONESIA (Kemenag/LPMQ).
 *
 * Batas juz diambil dari `lib/juz-batas.ts` (data statis, karena API publik
 * memakai Mushaf Madinah yang membagi beberapa batas juz secara berbeda).
 * Teks ayat (Arab + latin + terjemahan Kemenag) tetap dari equran.id, diambil
 * per-surah lalu diiris sesuai batas juz — jadi tidak ada permintaan tambahan
 * ke API dan hasilnya konsisten dengan halaman surat.
 */

import "server-only";
import { getSurah, getSurahList } from "./equran";
import { JUZ_BATAS_INDONESIA, getBatasJuz } from "@/lib/juz-batas";
import type { Ayah, SurahDetail } from "@/lib/types";

const WEEK = 60 * 60 * 24 * 7;

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
  /** label ringkas: "Al-Fatihah 1 → Al-Baqarah 141" */
  label: string;
  /** surah unik yang tersentuh juz ini */
  surahList: { nomor: number; namaLatin: string; nama: string; arti: string }[];
}

/** Peta nama latin Indonesia + jumlah ayat, di-cache per proses. */
let surahMetaCache: Map<number, { namaLatin: string; nama: string; jumlahAyat: number }> | null = null;
async function surahMeta(): Promise<Map<number, { namaLatin: string; nama: string; jumlahAyat: number }>> {
  if (surahMetaCache) return surahMetaCache;
  const list = await getSurahList();
  surahMetaCache = new Map(
    list.map((s) => [s.nomor, { namaLatin: s.namaLatin, nama: s.nama, jumlahAyat: s.jumlahAyat }]),
  );
  return surahMetaCache;
}

/** Hitung rentang per surah dari batas (dari → sampai). */
function hitungRentang(
  dari: { surah: number; ayat: number },
  sampai: { surah: number; ayat: number },
  jumlahAyat: (surah: number) => number,
): JuzRange[] {
  const rentang: JuzRange[] = [];
  if (dari.surah === sampai.surah) {
    return [{ surah: dari.surah, dari: dari.ayat, sampai: sampai.ayat }];
  }
  // surah pertama: dari ayat awal sampai akhir surah
  rentang.push({ surah: dari.surah, dari: dari.ayat, sampai: jumlahAyat(dari.surah) });
  // surah di antaranya: penuh
  for (let s = dari.surah + 1; s < sampai.surah; s++) {
    rentang.push({ surah: s, dari: 1, sampai: jumlahAyat(s) });
  }
  // surah terakhir: dari 1 sampai ayat akhir
  rentang.push({ surah: sampai.surah, dari: 1, sampai: sampai.ayat });
  return rentang;
}

/** Info satu juz (rentang per surah + jumlah ayat) — dari tabel Mushaf Indonesia. */
export async function getJuzInfo(nomor: number): Promise<JuzInfo> {
  const batas = getBatasJuz(nomor);
  if (!batas) throw new Error(`juz ${nomor}: di luar 1–30`);

  const meta = await surahMeta();
  const jml = (s: number) => meta.get(s)?.jumlahAyat ?? 0;
  const nama = (s: number) => meta.get(s)?.namaLatin ?? `Surah ${s}`;

  const rentang = hitungRentang(batas.dari, batas.sampai, jml);
  const jumlahAyat = rentang.reduce((a, r) => a + (r.sampai - r.dari + 1), 0);

  return {
    nomor,
    jumlahAyat,
    rentang,
    label: `${nama(batas.dari.surah)} ${batas.dari.ayat} → ${nama(batas.sampai.surah)} ${batas.sampai.ayat}`,
    surahList: rentang.map((r) => ({
      nomor: r.surah,
      namaLatin: nama(r.surah),
      nama: meta.get(r.surah)?.nama ?? "",
      arti: "",
    })),
  };
}

/** Ringkasan 30 juz untuk halaman indeks. */
export async function getJuzList(): Promise<JuzInfo[]> {
  const hasil = await Promise.all(
    JUZ_BATAS_INDONESIA.map((b) => getJuzInfo(b.juz).catch(() => null)),
  );
  return hasil.filter((j): j is JuzInfo => j !== null);
}

export interface JuzAyah extends Ayah {
  surahNomor: number;
  surahNamaLatin: string;
  surahNama: string;
}

/**
 * Ayat-ayat satu juz lengkap (teks Arab + latin + terjemahan Kemenag).
 * Mengambil tiap surah dari cache equran.id lalu mengiris sesuai rentang juz.
 */
export async function getJuzAyah(nomor: number): Promise<JuzAyah[]> {
  const info = await getJuzInfo(nomor);
  const unik = [...new Set(info.rentang.map((r) => r.surah))];

  const detail = await Promise.all(unik.map((n) => getSurah(n).catch(() => null)));
  const byNomor = new Map<number, SurahDetail>();
  detail.forEach((d) => d && byNomor.set(d.nomor, d));

  const hasil: JuzAyah[] = [];
  for (const r of info.rentang) {
    const s = byNomor.get(r.surah);
    if (!s) continue;
    for (let n = r.dari; n <= r.sampai; n++) {
      const a = s.ayat.find((x) => x.nomorAyat === n);
      if (!a) continue;
      hasil.push({
        ...a,
        surahNomor: s.nomor,
        surahNamaLatin: s.namaLatin,
        surahNama: s.nama,
      });
    }
  }
  return hasil;
}

export { WEEK };
