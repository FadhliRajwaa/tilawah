/* — klien API ibadah: Asmaul Husna & Doa Harian (islamic-api-zhirrr) — */

import "server-only";
import type { AsmaulHusnaItem, DoaItem } from "@/lib/types";

const BASE = "https://islamic-api-zhirrr.vercel.app/api";
const WEEK = 60 * 60 * 24 * 7;

async function getData<T>(url: string): Promise<T[]> {
  const res = await fetch(url, { next: { revalidate: WEEK } });
  if (!res.ok) throw new Error(`zhirrr ${res.status}: ${url}`);
  const json = (await res.json()) as { data: T[] };
  return json.data;
}

/** 99 Asmaul Husna — latin, Arab, arti Indonesia. Cache 7 hari. */
export async function getAsmaulHusna(): Promise<AsmaulHusnaItem[]> {
  return getData<AsmaulHusnaItem>(`${BASE}/asmaulhusna`);
}

/** 35 doa harian — Arab, latin, terjemahan. Cache 7 hari. */
export async function getDoaHarian(): Promise<DoaItem[]> {
  return getData<DoaItem>(`${BASE}/doaharian`);
}
