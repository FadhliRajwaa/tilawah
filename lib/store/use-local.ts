"use client";

/* — Primitif penyimpanan lokal.
 *
 * Tiga hal yang ditangani di sini, dan alasannya:
 *
 *  1. **localStorage bisa melempar.** Di mode privat Safari dan saat kuota
 *     penuh, `getItem`/`setItem` melempar — bukan mengembalikan null.
 *
 *  2. **Data bisa rusak.** JSON yang tidak valid atau bentuk yang tidak
 *     diharapkan disaring oleh `parse`, bukan dipercaya — satu nilai rusak
 *     tidak boleh membuat halaman gagal render.
 *
 *  3. **Dua jenis sinkronisasi.** Event internal untuk komponen di tab yang
 *     sama, dan event `storage` bawaan peramban untuk tab lain.
 *
 * `useSyncExternalStore` (bukan useState + useEffect): nilai tersimpan
 * langsung dipakai saat hidrasi selesai, tanpa render ganda, dan referensi
 * hasilnya stabil selama isi localStorage tidak berubah — jadi komponen yang
 * bergantung padanya tidak ikut render ulang tanpa alasan.
 */

import { useCallback, useSyncExternalStore } from "react";

/** Event internal: bookmark / progres juz / posisi baca berubah.
 *  Satu event cukup — daftar bookmark jarang ditulis, jadi baca ulang
 *  sesekali tidak terasa. */
export const MARKS_CHANGED = "tilawah:marks-changed";

/** Baca & parse JSON dari localStorage. Mengembalikan `fallback` bila gagal. */
export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
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
    /* storage penuh / private mode */
  }
  window.dispatchEvent(new Event(evt));
}

const memo = new Map<string, { raw: string | null; val: unknown }>();

/**
 * Hook: nilai dari localStorage yang ikut ter-update.
 *
 * @param parse  validasi bentuk data (bukan sekadar transformasi)
 * @param empty  nilai saat kosong / di server — HARUS konstanta modul,
 *               supaya referensinya stabil
 */
export function useLocal<T>(
  key: string,
  parse: (raw: unknown) => T,
  empty: T,
  evt = MARKS_CHANGED,
): T {
  const subscribe = useCallback(
    (cb: () => void) => {
      const onStorage = (e: StorageEvent) => {
        if (e.key === key || e.key === null) cb();
      };
      window.addEventListener(evt, cb);
      window.addEventListener("storage", onStorage);
      return () => {
        window.removeEventListener(evt, cb);
        window.removeEventListener("storage", onStorage);
      };
    },
    [key, evt],
  );

  const getSnapshot = useCallback((): T => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      /* abaikan */
    }
    const m = memo.get(key);
    if (m && m.raw === raw) return m.val as T;
    let val: T = empty;
    if (raw) {
      try {
        val = parse(JSON.parse(raw));
      } catch {
        val = empty;
      }
    }
    memo.set(key, { raw, val });
    return val;
    /* `parse` sengaja tidak masuk dependensi: tiap kunci punya satu parser
       tetap, sedangkan identitas fungsinya bisa berubah tiap render. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, empty]);

  return useSyncExternalStore(subscribe, getSnapshot, () => empty);
}
