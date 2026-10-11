"use client";

/* — Progres juz (localStorage) — sumber tunggal untuk indeks & reader.
 *
 * Dipakai bersama oleh `components/quran/juz-folder.tsx` (indeks) dan
 * `components/quran/juz-reader.tsx` (reader) supaya keduanya tidak
 * menyimpan salinan logika yang sama.
 *
 * Primitif baca/tulis/sinkronisasi tinggal di `./use-local` — dipakai juga
 * oleh bookmark dan preferensi. */

import { readJSON, writeJSON, useLocal } from "./use-local";

const KEY = "tilawah:juz-progress";

/** Daftar juz selesai. Data rusak disaring, bukan dipercaya: array yang
 *  berisi string (mis. dari versi lama) dibuang, bukan membuat halaman
 *  gagal render. */
function parse(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((n): n is number => typeof n === "number" && Number.isInteger(n));
}

/** Baca daftar juz selesai (untuk pemakaian non-hook). */
export function readJuzProgress(): number[] {
  return parse(readJSON<unknown>(KEY, null));
}

/** Tandai/batalkan satu juz selesai; mengembalikan keadaan barunya. */
export function toggleJuzProgress(nomor: number): boolean {
  const arr = readJuzProgress();
  const ada = arr.includes(nomor);
  const next = ada ? arr.filter((n) => n !== nomor) : [...arr, nomor];
  writeJSON(KEY, next);
  return !ada;
}

/** Hook: himpunan juz selesai, ikut ter-update lintas komponen & tab. */
export function useJuzProgress(): Set<number> {
  const list = useLocal<number[]>(KEY, parse, []);
  /* Set dibangun ulang dari array — bukan disimpan sebagai state terpisah,
     supaya tidak ada dua sumber kebenaran yang bisa berbeda. */
  return new Set(list);
}
