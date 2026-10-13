/* — tipe data bersama untuk seluruh aplikasi — */

import { QARI_DEFAULT } from "./audio";

/** Satu ayat seperti yang dikirim ke klien.
 *
 *  Kunci sengaja pendek: daftar ini ikut ter-serialisasi di payload halaman
 *  (286 kali untuk Al-Baqarah), jadi `teksIndonesia` × 286 itu nyata.
 *  URL audio TIDAK ikut — diturunkan dari pola CDN (lihat lib/audio.ts). */
export interface Ayat {
  /** nomor surah */
  s: number;
  /** nomor ayat dalam surah */
  n: number;
  /** teks Arab (rasm Kemenag) */
  ar: string;
  /** transliterasi latin */
  lt: string;
  /** terjemahan Kemenag */
  tr: string;
}

/** Satu surah lengkap untuk halaman baca. */
export interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  arti: string;
  makkiyah: boolean;
  ayat: Ayat[];
}

/** equran.id — tafsir */
export interface TafsirItem {
  ayat: number;
  teks: string;
}

/** Zhirrr — asmaul husna */
export interface AsmaulHusnaItem {
  index: string;
  latin: string;
  arabic: string;
  translation_id: string;
  translation_en: string;
}

/** Zhirrr — doa harian */
export interface DoaItem {
  title: string;
  arabic: string;
  latin: string;
  translation: string;
}

/** myquran — jadwal sholat */
export interface JadwalHarian {
  tanggal: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  date: string;
}

export interface Kota {
  id: string;
  lokasi: string;
}

/** alquran.cloud — hasil pencarian */
export interface SearchMatch {
  surah: number;
  surahName: string;
  surahNameLatin: string;
  ayah: number;
  text: string;
}

/** Preferensi pengguna.
 *
 *  Yang memengaruhi TAMPILAN (tema, latin, terjemahan, mode, ukuran Arab)
 *  diterapkan sebagai atribut di `<html>` oleh skrip inline sebelum paint —
 *  jadi halaman yang dirender di server langsung tampil sesuai pilihan,
 *  tanpa kedipan dan tanpa satu pun komponen perlu membaca preferensi. */
export interface Prefs {
  theme: "light" | "dark" | "auto";
  arabicScale: number;
  showLatin: boolean;
  showTranslation: boolean;
  readMode: "ayat" | "mushaf";
  reciter: string;
  /** lanjut ke ayat berikutnya saat satu ayat selesai */
  autoAdvance: boolean;
  /** gulir otomatis mengikuti ayat yang sedang dibacakan */
  follow: boolean;
}

export const PREFS_DEFAULT: Prefs = {
  theme: "auto",
  arabicScale: 1,
  showLatin: true,
  showTranslation: true,
  readMode: "ayat",
  reciter: QARI_DEFAULT,
  autoAdvance: true,
  follow: true,
};

/** Bookmark ayat */
export interface Bookmark {
  nomor: number;
  ayat: number;
  namaLatin: string;
  snippet: string;
  ts: number;
}
