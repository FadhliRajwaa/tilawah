"use client";

/* — bookmark ayat + riwayat baca terakhir (localStorage) — */

import { useCallback, useEffect, useState } from "react";
import type { Bookmark, LastRead } from "@/lib/types";

const KEY_BM = "tilawah:bookmarks";
const KEY_LR = "tilawah:lastread";
const EVT = "tilawah:marks-changed";

function readArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* abaikan */
  }
  window.dispatchEvent(new CustomEvent(EVT));
}

/* — bookmark — */

export function getBookmarks(): Bookmark[] {
  return readArray<Bookmark>(KEY_BM).sort((a, b) => b.ts - a.ts);
}

export function isBookmarked(nomor: number, ayat: number): boolean {
  return readArray<Bookmark>(KEY_BM).some((b) => b.nomor === nomor && b.ayat === ayat);
}

export function toggleBookmark(item: Omit<Bookmark, "ts">): boolean {
  const list = readArray<Bookmark>(KEY_BM);
  const idx = list.findIndex((b) => b.nomor === item.nomor && b.ayat === item.ayat);
  if (idx >= 0) {
    list.splice(idx, 1);
    writeArray(KEY_BM, list);
    return false;
  }
  list.unshift({ ...item, ts: Date.now() });
  writeArray(KEY_BM, list);
  return true;
}

export function removeBookmark(nomor: number, ayat: number): void {
  writeArray(
    KEY_BM,
    readArray<Bookmark>(KEY_BM).filter((b) => !(b.nomor === nomor && b.ayat === ayat)),
  );
}

export function useBookmarks(): Bookmark[] {
  const [list, setList] = useState<Bookmark[]>([]);
  useEffect(() => {
    setList(getBookmarks());
    const onChange = () => setList(getBookmarks());
    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return list;
}

/* — riwayat baca — */

export function getLastRead(): LastRead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY_LR);
    return raw ? (JSON.parse(raw) as LastRead) : null;
  } catch {
    return null;
  }
}

export function setLastRead(item: Omit<LastRead, "ts">): void {
  try {
    localStorage.setItem(KEY_LR, JSON.stringify({ ...item, ts: Date.now() }));
  } catch {
    /* abaikan */
  }
  window.dispatchEvent(new CustomEvent(EVT));
}

export function useLastRead(): [LastRead | null, (i: Omit<LastRead, "ts">) => void] {
  const [lr, setLr] = useState<LastRead | null>(null);
  useEffect(() => {
    setLr(getLastRead());
    const onChange = () => setLr(getLastRead());
    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  const save = useCallback((i: Omit<LastRead, "ts">) => setLastRead(i), []);
  return [lr, save];
}
