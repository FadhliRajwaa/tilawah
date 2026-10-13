"use client";

/* — Posisi baca dari ayat yang terlihat di layar.
 *
 * IntersectionObserver mencatat ayat dominan di pita tengah viewport
 * (debounce 800ms), juga saat menggulir biasa — bukan hanya saat audio
 * diputar. Kontrak elemen: `data-ayah="surah:ayat"` di kedua mode baca. */

import { useEffect, useRef } from "react";
import { saveProgress } from "./store/progress";

/** Laporkan ayat yang sedang dibaca. `juz` diisi kalau dari halaman juz. */
export function useReading(surahNomor: number, juz?: number): void {
  const juzRef = useRef(juz);
  juzRef.current = juz;

  useEffect(() => {
    let timer = 0;
    const best = { s: 0, n: 0, ratio: 0 };

    const flush = () => {
      if (best.n > 0) saveProgress(best.s, best.n, juzRef.current);
      best.s = 0;
      best.n = 0;
      best.ratio = 0;
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const pair = (e.target as HTMLElement).dataset.ayah ?? "";
          const m = /^(\d{1,3}):(\d{1,3})$/.exec(pair);
          if (!m) continue;
          /* Ayat DOMINAN menang — bukan yang terakhir terlihat. */
          if (e.intersectionRatio > best.ratio) {
            best.s = Number(m[1]);
            best.n = Number(m[2]);
            best.ratio = e.intersectionRatio;
          }
        }
        if (best.n > 0) {
          window.clearTimeout(timer);
          timer = window.setTimeout(flush, 800);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    document.querySelectorAll("[data-ayah]").forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
    /* surahNomor hanya penanda halaman; pasangan s:n dibaca dari elemen. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
