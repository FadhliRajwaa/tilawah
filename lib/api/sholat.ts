/* — klien API jadwal sholat (myquran.com) — */

import "server-only";
import type { JadwalHarian, Kota } from "@/lib/types";

const BASE = "https://api.myquran.com/v2/sholat";
const WEEK = 60 * 60 * 24 * 7;
const HOUR = 60 * 60;

/**
 * Catatan penting (terverifikasi live):
 * - API ini SELALU membalas HTTP 200 di level transport — error asli ada di body
 *   (`status: false`, `error: 404`). Jangan cek res.ok saja.
 * - `/kota/terdekat` TIDAK ADA (404) — pencarian kota pakai `/kota/cari/{q}`.
 * - `id` kota bertipe string di /kota/semua, tapi int di respons jadwal.
 */

async function getBody<T>(url: string, revalidate: number): Promise<T> {
  const res = await fetch(url, { next: { revalidate } });
  const json = (await res.json()) as {
    status: boolean;
    data?: T;
    message?: string;
    error?: number;
  };
  if (!json.status || json.data === undefined) {
    throw new Error(`myquran: ${json.message ?? `error ${json.error}`}`);
  }
  return json.data;
}

/** Cari kota berdasarkan kata kunci. */
export async function cariKota(q: string): Promise<Kota[]> {
  return getBody<Kota[]>(`${BASE}/kota/cari/${encodeURIComponent(q)}`, WEEK);
}

/** Jadwal harian satu kota — cache 1 jam (berubah harian). */
export async function getJadwalHarian(
  kotaId: string | number,
  y: number,
  m: number,
  d: number,
): Promise<JadwalHarian> {
  const pad = (n: number) => String(n).padStart(2, "0");
  return getBody<{ jadwal: JadwalHarian }>(
    `${BASE}/jadwal/${kotaId}/${y}/${pad(m)}/${pad(d)}`,
    HOUR,
  ).then((d) => d.jadwal);
}

/** Jadwal bulanan satu kota (array) — cache 1 jam. */
export async function getJadwalBulanan(
  kotaId: string | number,
  y: number,
  m: number,
): Promise<JadwalHarian[]> {
  const pad = (n: number) => String(n).padStart(2, "0");
  return getBody<{ jadwal: JadwalHarian[] }>(
    `${BASE}/jadwal/${kotaId}/${y}/${pad(m)}`,
    HOUR,
  ).then((d) => d.jadwal);
}
