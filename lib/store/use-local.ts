"use client";

/* — Primitif penyimpanan lokal.
 *
 * ⚠️ Diekstrak dari duplikasi: pola "baca localStorage + dengarkan event
 * internal + dengarkan event storage lintas tab" ditulis ULANG empat kali
 * (`bookmark.ts`, `juz-progress.ts`, `prefs.ts`, dan inline di komponen
 * sholat). Tiap salinan punya penanganan galat sendiri, dan tidak semuanya
 * menangani `storage` — jadi sinkronisasi antar tab hanya bekerja sebagian.
 *
 * Tiga hal yang ditangani di sini, dan alasannya:
 *
 *  1. **localStorage bisa melempar.** Di mode privat Safari dan saat kuota
 *     penuh, `getItem`/`setItem` melempar — bukan mengembalikan null. Setiap
 *     pemanggilan harus dibungkus, dan itu yang paling sering terlupa.
 *
 *  2. **Data bisa rusak.** JSON yang tidak valid atau bentuk yang tidak
 *     diharapkan (array berisi string padahal angka) harus disaring, bukan
 *     dipercaya. Kalau tidak, satu nilai rusak membuat seluruh halaman gagal
 *     render — padahal cukup diabaikan.
 *
 *  3. **Dua jenis sinkronisasi.** Event internal (`CustomEvent`) untuk
 *     komponen di tab yang sama, dan event `storage` bawaan peramban untuk
 *     tab lain. Keduanya perlu; banyak implementasi hanya memasang satu.
 */

import { useCallback, useEffect, useState } from "react";

/** Nama event internal untuk memberi tahu komponen di tab yang sama. */
export const MARKS_CHANGED = "tilawah:marks-changed";

/** Baca & parse JSON dari localStorage. Mengembalikan `fallback` bila gagal. */
export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Tulis JSON ke localStorage. Gagal senyap — bukan alasan menggagalkan aksi. */
export function writeJSON(key: string, value: unknown, evt = MARKS_CHANGED): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage penuh / private mode — abaikan; keadaan di memori tetap benar */
  }
  window.dispatchEvent(new CustomEvent(evt));
}

/**
 * Hook: nilai dari localStorage yang ikut ter-update.
 *
 * Membaca sekali saat mount (bukan saat render — membaca localStorage di
 * server akan memicu hydration mismatch), lalu mendengarkan event internal
 * dan `storage` dari tab lain.
 *
 * @param key    kunci localStorage
 * @param parse  pengubah dari `unknown` (hasil JSON.parse) ke tipe T;
 *               dipakai untuk MEMVALIDASI bentuk data, bukan hanya
 *               mentransformasi. Kalau data rusak, kembalikan nilai aman.
 * @param empty  nilai awal sebelum mount & saat data tidak ada
 * @param evt    nama event internal (default: `tilawah:marks-changed`)
 */
export function useLocal<T>(
  key: string,
  parse: (raw: unknown) => T,
  empty: T,
  evt = MARKS_CHANGED,
): T {
  const [value, setValue] = useState<T>(empty);

  useEffect(() => {
    const read = () => setValue(parse(readJSON<unknown>(key, null)));
    read();
    window.addEventListener(evt, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(evt, read);
      window.removeEventListener("storage", read);
    };
    /* `parse` sengaja tidak masuk dependensi: ia biasanya fungsi inline di
       pemanggil, sehingga identitasnya berubah tiap render dan efeknya akan
       dipasang-ulang terus-menerus. Yang menentukan kapan harus membaca
       ulang adalah `key` dan `evt`. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, evt]);

  return value;
}

/** Hook: setter yang menulis ke localStorage + memberi tahu komponen lain. */
export function useLocalWriter<T>(key: string, evt = MARKS_CHANGED) {
  return useCallback(
    (value: T) => {
      writeJSON(key, value, evt);
      return value;
    },
    [key, evt],
  );
}
