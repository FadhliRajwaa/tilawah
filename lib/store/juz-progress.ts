"use client";

/* — progres juz (localStorage) — sumber tunggal untuk indeks & reader.
 *
 * Dipakai bersama oleh `components/quran/juz-index.tsx` dan
 * `components/quran/juz-folder.tsx` supaya keduanya tidak menyimpan salinan
 * hook yang sama. Ikut ter-update saat pengguna menandai juz selesai di
 * halaman reader (`tilawah:marks-changed`) atau dari tab lain (`storage`).
 */

import { useEffect, useState } from "react";

const KEY = "tilawah:juz-progress";
const EVT = "tilawah:marks-changed";

/** Baca daftar juz selesai dari localStorage (tahan terhadap data rusak). */
export function readJuzProgress(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === "number") : [];
  } catch {
    return [];
  }
}

/** Tandai/batalkan satu juz selesai; mengembalikan keadaan barunya. */
export function toggleJuzProgress(nomor: number): boolean {
  const arr = readJuzProgress();
  const ada = arr.includes(nomor);
  const next = ada ? arr.filter((n) => n !== nomor) : [...arr, nomor];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage penuh / private mode — abaikan */
  }
  window.dispatchEvent(new CustomEvent(EVT));
  return !ada;
}

export function useJuzProgress(): Set<number> {
  const [done, setDone] = useState<Set<number>>(new Set());

  useEffect(() => {
    const read = () => setDone(new Set(readJuzProgress()));
    read();
    window.addEventListener(EVT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(EVT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  return done;
}
