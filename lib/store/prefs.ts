"use client";

/* — Preferensi pengguna (localStorage + sinkron lintas komponen & tab).
 *
 * Preferensi TAMPILAN tidak dibaca komponen sama sekali. Mereka diterapkan
 * sebagai atribut di `<html>` (lihat `applyPrefs` dan theme-script.tsx):
 *
 *   data-theme="dark"        tema
 *   data-latin="0"           sembunyikan transliterasi
 *   data-tr="0"              sembunyikan terjemahan
 *   data-mode="mushaf"       mode baca
 *   --arabic-scale: 1.15     ukuran teks Arab
 *
 * CSS yang menyembunyikan/menampilkan. Hasilnya: halaman baca bisa dirender
 * PENUH di server (ayatnya ada di HTML), dan saat dibuka langsung tampil
 * sesuai pilihan — tanpa kedipan, tanpa menunggu React membaca localStorage.
 */

import { useCallback, useSyncExternalStore } from "react";
import { PREFS_DEFAULT, type Prefs } from "@/lib/types";

const KEY = "tilawah:prefs";
const EVT = "tilawah:prefs-changed";

let cache: Prefs | null = null;

function parse(raw: string | null): Prefs {
  if (!raw) return PREFS_DEFAULT;
  try {
    const p = { ...PREFS_DEFAULT, ...(JSON.parse(raw) as Partial<Prefs>) };
    /* nilai rusak dari versi lama tidak boleh membuat teks Arab 0px */
    if (!(p.arabicScale >= 0.7 && p.arabicScale <= 2)) p.arabicScale = 1;
    return p;
  } catch {
    return PREFS_DEFAULT;
  }
}

export function readPrefs(): Prefs {
  if (typeof window === "undefined") return PREFS_DEFAULT;
  if (!cache) {
    try {
      cache = parse(localStorage.getItem(KEY));
    } catch {
      cache = PREFS_DEFAULT;
    }
  }
  return cache;
}

/** Terapkan preferensi tampilan ke `<html>`. Logikanya HARUS sama dengan
 *  skrip inline di theme-script.tsx — itu versi sebelum-React dari fungsi ini. */
export function applyPrefs(p: Prefs): void {
  const el = document.documentElement;
  const dark =
    p.theme === "dark" ||
    (p.theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  el.dataset.theme = dark ? "dark" : "light";
  el.dataset.themeMode = p.theme;
  el.dataset.latin = p.showLatin ? "1" : "0";
  el.dataset.tr = p.showTranslation ? "1" : "0";
  el.dataset.mode = p.readMode;
  el.style.setProperty("--arabic-scale", String(p.arabicScale));
  /* Warna bilah status/peramban mengikuti tema yang DIPILIH, bukan tema
     sistem — kalau tidak, mode gelap manual di ponsel bertema terang
     menghasilkan bilah putih di atas halaman gelap. */
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((m) => (m.content = dark ? "#061118" : "#e8f6fb"));
}

export function writePrefs(patch: Partial<Prefs>): Prefs {
  const prev = readPrefs();
  const next = { ...prev, ...patch };
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage penuh / private mode — keadaan di memori tetap berlaku */
  }
  /* Ganti tema tanpa membuat SEMUA transisi warna menyala bersamaan
     (terlihat seperti halaman "meleleh"). Transisi dimatikan untuk satu
     frame, lalu dipulihkan. */
  const themeChanged = patch.theme !== undefined && patch.theme !== prev.theme;
  if (themeChanged) document.documentElement.classList.add("no-motion");
  applyPrefs(next);
  if (themeChanged) {
    void document.documentElement.offsetHeight;
    requestAnimationFrame(() => document.documentElement.classList.remove("no-motion"));
  }
  window.dispatchEvent(new Event(EVT));
  return next;
}

function subscribe(cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    cache = null;
    applyPrefs(readPrefs());
    cb();
  };
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onScheme = () => applyPrefs(readPrefs());
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", onStorage);
  mq.addEventListener("change", onScheme);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", onStorage);
    mq.removeEventListener("change", onScheme);
  };
}

/** Hook preferensi. Di server & saat hidrasi mengembalikan default; setelah
 *  itu nilai tersimpan — tanpa efek ganda dan tanpa render ulang berantai. */
export function usePrefs(): [Prefs, (patch: Partial<Prefs>) => void] {
  const prefs = useSyncExternalStore(subscribe, readPrefs, () => PREFS_DEFAULT);
  const update = useCallback((patch: Partial<Prefs>) => {
    writePrefs(patch);
  }, []);
  return [prefs, update];
}
