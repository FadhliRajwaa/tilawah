"use client";

/* — preferensi pengguna (localStorage + event lintas komponen) — */

import { useCallback, useEffect, useState } from "react";
import { PREFS_DEFAULT, type Prefs } from "@/lib/types";

const KEY = "tilawah:prefs";
const EVT = "tilawah:prefs-changed";

function read(): Prefs {
  if (typeof window === "undefined") return PREFS_DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return PREFS_DEFAULT;
    return { ...PREFS_DEFAULT, ...(JSON.parse(raw) as Partial<Prefs>) };
  } catch {
    return PREFS_DEFAULT;
  }
}

export function writePrefs(patch: Partial<Prefs>): Prefs {
  const next = { ...read(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage penuh / private mode — abaikan */
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: next }));
  applyTheme(next.theme);
  return next;
}

/** Terapkan tema ke <html data-theme>. "auto" mengikuti prefers-color-scheme. */
export function applyTheme(theme: Prefs["theme"]): void {
  if (typeof document === "undefined") return;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = theme === "dark" || (theme === "auto" && prefersDark);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.documentElement.dataset.themeMode = theme;
}

export function usePrefs(): [Prefs, (patch: Partial<Prefs>) => void] {
  const [prefs, setPrefs] = useState<Prefs>(PREFS_DEFAULT);

  useEffect(() => {
    setPrefs(read());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<Prefs>).detail;
      setPrefs(detail ?? read());
    };
    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const update = useCallback((patch: Partial<Prefs>) => {
    setPrefs(writePrefs(patch));
  }, []);

  return [prefs, update];
}
