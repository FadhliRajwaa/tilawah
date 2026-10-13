"use client";

/* — Bookmark ayat (localStorage). */

import type { Bookmark } from "@/lib/types";
import { readJSON, writeJSON, useLocal } from "./use-local";

const KEY = "tilawah:bookmarks";
const EMPTY: Bookmark[] = [];

/** Saring data rusak: entri tanpa nomor/ayat yang valid dibuang. */
function parse(raw: unknown): Bookmark[] {
  if (!Array.isArray(raw)) return EMPTY;
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

export function getBookmarks(): Bookmark[] {
  return parse(readJSON<unknown>(KEY, null));
}

/** Tandai/batalkan satu ayat; mengembalikan keadaan barunya. */
export function toggleBookmark(item: Omit<Bookmark, "ts">): boolean {
  const list = getBookmarks();
  const idx = list.findIndex((b) => b.nomor === item.nomor && b.ayat === item.ayat);
  if (idx >= 0) {
    list.splice(idx, 1);
    writeJSON(KEY, list);
    return false;
  }
  writeJSON(KEY, [{ ...item, ts: Date.now() }, ...list]);
  return true;
}

/** Hapus; mengembalikan entri yang dihapus supaya bisa dibatalkan. */
export function removeBookmark(nomor: number, ayat: number): Bookmark | null {
  const list = getBookmarks();
  const gone = list.find((b) => b.nomor === nomor && b.ayat === ayat) ?? null;
  writeJSON(
    KEY,
    list.filter((b) => b !== gone),
  );
  return gone;
}

/** Kembalikan entri yang baru dihapus — waktu aslinya dipertahankan,
 *  jadi urutannya di daftar tidak berubah. */
export function restoreBookmark(b: Bookmark): void {
  const list = getBookmarks().filter((x) => !(x.nomor === b.nomor && x.ayat === b.ayat));
  writeJSON(KEY, parse([...list, b]));
}

/** Hook: daftar bookmark, ikut ter-update lintas komponen & tab. */
export function useBookmarks(): Bookmark[] {
  return useLocal<Bookmark[]>(KEY, parse, EMPTY);
}
