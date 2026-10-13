"use client";

/* — Posisi baca: terakhir dibaca + posisi per surah.
 *
 * Dulu "terakhir dibaca" hanya dicatat saat AUDIO diputar, dan ayatnya
 * di-reset ke 1 setiap halaman dibuka — jadi "Lanjut baca" hampir selalu
 * mengirim pengguna ke awal surah. Sekarang posisi diambil dari ayat yang
 * benar-benar sedang terlihat di layar (lihat use-reading.ts).
 */

import { SURAH } from "@/lib/data/surah";
import { MARKS_CHANGED, readJSON, writeJSON, useLocal } from "./use-local";

const KEY_LR = "tilawah:lastread";
const KEY_PG = "tilawah:progress";

export interface LastRead {
  nomor: number;
  ayat: number;
  ts: number;
  /** diisi kalau dibaca dari halaman juz */
  juz?: number;
}

/** surah → [ayat terakhir, waktu] */
export type Progress = Record<string, [number, number]>;

const EMPTY_PG: Progress = {};

const validAyat = (s: unknown, a: unknown) =>
  typeof s === "number" &&
  typeof a === "number" &&
  s >= 1 &&
  s <= 114 &&
  a >= 1 &&
  a <= SURAH[s - 1].ayat;

function parseLR(raw: unknown): LastRead | null {
  if (!raw || typeof raw !== "object") return null;
  const lr = raw as LastRead;
  return validAyat(lr.nomor, lr.ayat) ? lr : null;
}

function parsePG(raw: unknown): Progress {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return EMPTY_PG;
  const out: Progress = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(v) && validAyat(Number(k), v[0]) && typeof v[1] === "number") {
      out[k] = [v[0], v[1]];
    }
  }
  return out;
}

/** Simpan posisi baca. Dipanggil sudah dengan jeda (debounce) oleh pemakai. */
export function saveProgress(nomor: number, ayat: number, juz?: number): void {
  if (!validAyat(nomor, ayat)) return;
  const ts = Date.now();
  const pg = parsePG(readJSON<unknown>(KEY_PG, null));
  writeJSON(KEY_PG, { ...pg, [nomor]: [ayat, ts] }, MARKS_CHANGED);
  writeJSON(KEY_LR, juz ? { nomor, ayat, ts, juz } : { nomor, ayat, ts }, MARKS_CHANGED);
}

export function useLastRead(): LastRead | null {
  return useLocal<LastRead | null>(KEY_LR, parseLR, null, MARKS_CHANGED);
}

export function useProgress(): Progress {
  return useLocal<Progress>(KEY_PG, parsePG, EMPTY_PG, MARKS_CHANGED);
}

/** Tautan "lanjut baca" — kembali ke halaman asal (surah atau juz). */
export function resumeHref(lr: LastRead): string {
  return lr.juz ? `/juz/${lr.juz}?ayat=${lr.nomor}:${lr.ayat}` : `/surat/${lr.nomor}?ayat=${lr.ayat}`;
}
