/* — tipe data bersama untuk seluruh aplikasi — */

/** equran.id — daftar surat */
export interface SurahSummary {
  nomor: number;
  nama: string; // Arab
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string; // "Mekah" | "Madinah"
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>; // { "01": url, ... }
}

/** equran.id — ayat di dalam surat */
export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>; // 6 qari
}

export interface SurahDetail extends SurahSummary {
  ayat: Ayah[];
  suratSelanjutnya?: SurahNav;
  suratSebelumnya?: SurahNav;
}

export interface SurahNav {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
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

/* — 6 qari resmi equran.id — */
export const QARI: { id: string; nama: string; singkat: string }[] = [
  { id: "01", nama: "Abdullah Al-Juhany", singkat: "Al-Juhany" },
  { id: "02", nama: "Abdul Muhsin Al-Qasim", singkat: "Al-Qasim" },
  { id: "03", nama: "Abdurrahman As-Sudais", singkat: "As-Sudais" },
  { id: "04", nama: "Ibrahim Al-Dossari", singkat: "Al-Dossari" },
  { id: "05", nama: "Misyari Rasyid Al-Afasi", singkat: "Al-Afasi" },
  { id: "06", nama: "Yasser Al-Dosari", singkat: "Yasser" },
];

export const QARI_DEFAULT = "05";

/** Preferensi pengguna */
export interface Prefs {
  theme: "light" | "dark" | "auto";
  arabicScale: number; // 1 = normal
  showLatin: boolean;
  showTranslation: boolean;
  reciter: string; // id qari
  autoAdvance: boolean;
  readMode: "ayat" | "mushaf";
}

export const PREFS_DEFAULT: Prefs = {
  theme: "auto",
  arabicScale: 1,
  showLatin: true,
  showTranslation: true,
  reciter: QARI_DEFAULT,
  autoAdvance: true,
  readMode: "ayat",
};

/** Bookmark & riwayat */
export interface Bookmark {
  nomor: number;
  ayat: number;
  namaLatin: string;
  snippet: string;
  ts: number;
}

export interface LastRead {
  nomor: number;
  ayat: number;
  namaLatin: string;
  ts: number;
}
