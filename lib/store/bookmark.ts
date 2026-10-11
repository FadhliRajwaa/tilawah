"use client";

/* — Bookmark ayat + riwayat baca terakhir (localStorage).
 *
 * Primitif baca/tulis/sinkronisasi tinggal di `./use-local` — dipakai juga
 * oleh progres juz dan preferensi. Sebelumnya pola yang sama ditulis ulang
 * empat kali, dan tidak semuanya menangani event `storage` lintas tab.
 */

import { useCallback } from "react";
import type { Bookmark, LastRead } from "@/lib/types";
import { readJSON, writeJSON, useLocal, MARKS_CHANGED } from "./use-local";

const KEY_BM = "tilawah:bookmarks";
const KEY_LR = "tilawah:lastread";

/** Saring data rusak: entri tanpa nomor/ayat yang valid dibuang, bukan
 *  membuat seluruh daftar gagal render. */
function parseBookmarks(raw: unknown): Bookmark[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (b): b is Bookmark =>
        !!b &&
        typeof b === "object" &&
        typeof (b as Bookmark).nomor === "number" &&
        typeof (b as Bookmark).ayat === "number",
    )
    .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));
}

function parseLastRead(raw: unknown): LastRead | null {
  if (!raw || typeof raw !== "object") return null;
  const lr = raw as LastRead;
  return typeof lr.nomor === "number" && typeof lr.ayat === "number" ? lr : null;
}

/* ─── Bookmark ─── */

export function getBookmarks(): Bookmark[] {
  return parseBookmarks(readJSON<unknown>(KEY_BM, null));
}

export function isBookmarked(nomor: number, ayat: number): boolean {
  return getBookmarks().some((b) => b.nomor === nomor && b.ayat === ayat);
}

/** Tandai/batalkan satu ayat; mengembalikan keadaan barunya. */
export function toggleBookmark(item: Omit<Bookmark, "ts">): boolean {
  const list = getBookmarks();
  const idx = list.findIndex((b) => b.nomor === item.nomor && b.ayat === item.ayat);

  if (idx >= 0) {
    list.splice(idx, 1);
    writeJSON(KEY_BM, list);
    return false;
  }

  list.unshift({ ...item, ts: Date.now() });
  writeJSON(KEY_BM, list);
  return true;
}

export function removeBookmark(nomor: number, ayat: number): void {
  writeJSON(
    KEY_BM,
    getBookmarks().filter((b) => !(b.nomor === nomor && b.ayat === ayat)),
  );
}

/** Hook: daftar bookmark, ikut ter-update lintas komponen & tab. */
export function useBookmarks(): Bookmark[] {
  return useLocal<Bookmark[]>(KEY_BM, parseBookmarks, []);
}

/* ─── Riwayat baca ─── */

export function getLastRead(): LastRead | null {
  return parseLastRead(readJSON<unknown>(KEY_LR, null));
}

export function setLastRead(item: Omit<LastRead, "ts">): void {
  writeJSON(KEY_LR, { ...item, ts: Date.now() });
}

/** Hook: riwayat baca terakhir + setter.
 *
 *  Setter ditulis dengan `writeJSON` langsung (bukan lewat `useLocalWriter`)
 *  karena bentuk datanya objek tunggal, bukan array — dan karena pemanggil
 *  hanya perlu menulis, tidak perlu membaca kembali. */
export function useLastRead(): [LastRead | null, (i: Omit<LastRead, "ts">) => void] {
  const lr = useLocal<LastRead | null>(KEY_LR, parseLastRead, null, MARKS_CHANGED);
  const save = useCallback((i: Omit<LastRead, "ts">) => setLastRead(i), []);
  return [lr, save];
}
