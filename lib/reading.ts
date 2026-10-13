"use client";

/* — Posisi baca dari ayat yang terlihat di layar.
 *
 * Dulu posisi hanya dicatat saat audio diputar — jadi "Lanjut baca" hampir
 * selalu mengirim ke awal surah. Sekarang IntersectionObserver mencatat ayat
 * yang dominan di viewport (debounce 800ms), juga saat menggulir biasa.
 */

import { useEffect, useRef } from "react";
import { saveProgress } from "./store/progress";

const ratioOf = (r: IntersectionObserverEntry): number => r.intersectionRatio;

/** Laporkan ayat yang sedang dibaca. `juz` diisi kalau dari halaman juz. */
export function useReading(surahNomor: number, juz?: number): void {
  const juzRef = useRef(juz);
  juzRef.current = juz;

  useEffect(() => {
    let pending = 0;
    let timer = 0;
    const best = { n: 0, ratio: 0 };

    const flush = () => {
      if (best.n > 0) saveProgress(surahNomor, best.n, juzRef.current);
      best.n = 0;
      best.ratio = 0;
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const n = Number((e.target as HTMLElement).dataset.ayah ?? 0);
          const r = ratioOf(e);
          /* Ayat DOMINAN menang — bukan yang terakhir terlihat. Tanpa ini,
             ayat kecil di tepi viewport mengalahkan ayat yang sedang dibaca. */
          if (n > 0 && r > best.ratio) {
            best.n = n;
            best.ratio = r;
          }
        }
        pending = best.n;
        if (pending > 0) {
          window.clearTimeout(timer);
          timer = window.setTimeout(flush, 800);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    /* Root margin menyempit ke pita tengah layar: ayat TERLIHAT saja tidak
       cukup — ia harus berada di zona baca. */
    document.querySelectorAll("[data-ayah]").forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [surahNomor]);
}
