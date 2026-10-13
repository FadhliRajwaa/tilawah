/* — klien API equran.id (ayat & tafsir) — */

import "server-only";
import type { Ayat, SurahDetail, TafsirItem } from "@/lib/types";

const BASE = "https://equran.id/api/v2";
const DAY = 60 * 60 * 24;

interface EquranEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

interface RawSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  ayat: { nomorAyat: number; teksArab: string; teksLatin: string; teksIndonesia: string }[];
}

async function getJSON<T>(url: string, revalidate = DAY): Promise<T> {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`equran.id ${res.status}: ${url}`);
  }
  const json = (await res.json()) as EquranEnvelope<T>;
  if (json.code !== 200) {
    throw new Error(`equran.id error ${json.code}: ${json.message}`);
  }
  return json.data;
}

/** Deskripsi dari API memuat tag HTML mentah (<i>, <br>) dan entitas. */
function cleanDeskripsi(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function getRaw(nomor: number): Promise<RawSurah> {
  return getJSON<RawSurah>(`${BASE}/surat/${nomor}`);
}

/** Satu surah untuk halaman baca — cache 24 jam.
 *
 *  Yang SENGAJA dibuang dari respons API sebelum sampai ke klien:
 *   · `audio` per ayat (6 URL × jumlah ayat) — diturunkan dari pola CDN
 *   · `audioFull` — idem
 *   · `deskripsi` — dimuat terpisah saat "Tentang surah" dibuka
 *  Untuk Al-Baqarah, ketiganya ±125.000 karakter di setiap kunjungan. */
export async function getSurah(nomor: number): Promise<SurahDetail> {
  const d = await getRaw(nomor);
  return {
    nomor: d.nomor,
    nama: d.nama,
    namaLatin: d.namaLatin,
    jumlahAyat: d.jumlahAyat,
    arti: d.arti,
    makkiyah: d.tempatTurun === "Mekah",
    ayat: d.ayat.map(
      (a): Ayat => ({ s: d.nomor, n: a.nomorAyat, ar: a.teksArab, lt: a.teksLatin, tr: a.teksIndonesia }),
    ),
  };
}

/** Deskripsi surah (teks bersih). Memakai cache fetch yang sama dengan
 *  `getSurah`, jadi tidak menambah permintaan ke equran.id. */
export async function getDeskripsi(nomor: number): Promise<string> {
  return cleanDeskripsi((await getRaw(nomor)).deskripsi ?? "");
}

/** Tafsir Kemenag satu surat — cache 7 hari (statis). */
export async function getTafsir(nomor: number): Promise<TafsirItem[]> {
  const data = await getJSON<{ tafsir: TafsirItem[] }>(`${BASE}/tafsir/${nomor}`, DAY * 7);
  return data.tafsir;
}
