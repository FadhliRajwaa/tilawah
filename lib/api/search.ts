/* — klien pencarian terjemahan (alquran.cloud) — */

import "server-only";
import type { SearchMatch } from "@/lib/types";

const BASE = "https://api.alquran.cloud/v1";
const DAY = 60 * 60 * 24;

/**
 * Catatan (terverifikasi live):
 * - `count` tidak konsisten: tanpa offset/limit = total; dengan offset/limit = per halaman.
 *   Gunakan `total` saat paginasi.
 * - Match memuat surah.number + numberInSurah + text (terjemahan Indonesia).
 */

interface RawMatch {
  number: number;
  text: string;
  numberInSurah: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
  };
}

export interface SearchResult {
  total: number;
  matches: SearchMatch[];
}

export async function searchTerjemahan(
  query: string,
  offset = 0,
  limit = 20,
): Promise<SearchResult> {
  const q = encodeURIComponent(query.trim());
  const url = `${BASE}/search/${q}/all/id.indonesian?offset=${offset}&limit=${limit}`;
  const res = await fetch(url, { next: { revalidate: DAY } });
  if (!res.ok) throw new Error(`alquran.cloud ${res.status}`);
  const json = (await res.json()) as {
    code: number;
    data: { total?: number; count: number; matches: RawMatch[] };
  };
  if (json.code !== 200) throw new Error("alquran.cloud: respons tidak valid");

  return {
    total: json.data.total ?? json.data.count,
    matches: json.data.matches.map((m) => ({
      surah: m.surah.number,
      surahName: m.surah.name,
      surahNameLatin: m.surah.englishName,
      ayah: m.numberInSurah,
      text: m.text,
    })),
  };
}
