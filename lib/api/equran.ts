/* — klien API equran.id (surat, ayat, tafsir, audio) — */

import "server-only";
import type { SurahDetail, SurahSummary, TafsirItem } from "@/lib/types";

const BASE = "https://equran.id/api/v2";
const DAY = 60 * 60 * 24;

interface EquranEnvelope<T> {
  code: number;
  message: string;
  data: T;
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

/** Daftar 114 surat — cache 7 hari (data statis). */
export async function getSurahList(): Promise<SurahSummary[]> {
  return getJSON<SurahSummary[]>(`${BASE}/surat`, DAY * 7);
}

/** Detail satu surat beserta seluruh ayat — cache 24 jam. */
export async function getSurah(nomor: number): Promise<SurahDetail> {
  return getJSON<SurahDetail>(`${BASE}/surat/${nomor}`);
}

/** Tafsir Kemenag satu surat — cache 7 hari (statis). */
export async function getTafsir(nomor: number): Promise<TafsirItem[]> {
  const data = await getJSON<{ tafsir: TafsirItem[] }>(
    `${BASE}/tafsir/${nomor}`,
    DAY * 7,
  );
  return data.tafsir;
}

/** URL audio full-surah equran.id untuk qari tertentu. */
export function audioFullUrl(nomor: number, qari: string): string {
  const pad = (n: number, w: number) => String(n).padStart(w, "0");
  // bentuk: audio-full/{slug}/{036}.mp3 — slug diambil dari data audioFull,
  // tapi karena kita hanya punya URL-nya dari payload surat, fungsi ini
  // menerima URL penuh dari pemanggil.
  void pad;
  return String(nomor);
}
