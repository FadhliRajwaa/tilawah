"use client";

/* — Mode mushaf: satu lembar mengalir, bukan daftar kartu.
 *
 * Teks Arab disambung jadi satu paragraf; nomor ayat jadi penanda yang bisa
 * diketuk untuk membuka tafsir. Ketuk teksnya memutar murottal. Dua aksi,
 * dua area ketuk — tanpa tombol yang mengotori lembaran.
 *
 * Server mengirim seluruh teksnya (mode ini butuh semua ayat), tapi TANPA
 * waveform per ayat — `MushafPlayer` di bawah menangani satu ayat aktif.
 */

import { memo } from "react";
import { cn, toArabicNumber } from "@/lib/utils";
import { SURAH } from "@/lib/data/surah";
import type { Ayat } from "@/lib/types";

interface Props {
  ayat: Ayat[];
  /** ayat yang sedang diputar — disorot */
  playingKey?: string | null;
  /** ayat sasaran deep-link — diberi sorot sementara */
  targetN?: number | null;
  /** tampilkan penanda pergantian surah (dipakai reader juz) */
  penandaSurah?: boolean;
  onPlay: (a: Ayat) => void;
  onOpenTafsir: (a: Ayat) => void;
}

export const MushafFlow = memo(function MushafFlow({
  ayat,
  playingKey,
  targetN,
  penandaSurah = false,
  onPlay,
  onOpenTafsir,
}: Props) {
  return (
    <>
      <div className="mushaf-flow arabic" lang="ar" dir="rtl">
        {ayat.map((a, i) => {
          const gantiSurah = penandaSurah && (i === 0 || ayat[i - 1].s !== a.s);
          const key = `${a.s}:${a.n}`;
          const isPlaying = playingKey === key;
          return (
            <span key={key}>
              {gantiSurah && (
                <span className="mushaf-surah-mark" lang="ar" dir="rtl">
                  {SURAH[a.s - 1].ar}
                </span>
              )}
              <span
                className={cn("mushaf-ayah", targetN === a.n && "is-target")}
                id={`m-${a.s}-${a.n}`}
              >
                <button
                  type="button"
                  className={cn("mushaf-ayah__tap", isPlaying && "is-playing")}
                  onClick={() => onPlay(a)}
                  aria-label={`Putar ayat ${a.n}`}
                  title={`Putar ayat ${a.n}`}
                >
                  {a.ar}
                </button>
                <button
                  type="button"
                  className="mushaf-marker"
                  onClick={() => onOpenTafsir(a)}
                  aria-label={`Buka tafsir ayat ${a.n}`}
                  title={`Tafsir ayat ${a.n}`}
                >
                  {toArabicNumber(a.n)}
                </button>
              </span>
            </span>
          );
        })}
      </div>
      <p className="mushaf-hint">
        Ketuk teks ayat untuk memutar murottal · ketuk nomor untuk membuka tafsir
      </p>
    </>
  );
});
