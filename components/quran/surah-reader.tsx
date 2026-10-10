"use client";

/* — Reader surat: toolbar preferensi baca, mode per-ayat ↔ mushaf kontinu,
 * modal tafsir Kemenag, dan pelacakan ayat aktif dari player.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Ayah, SurahDetail, TafsirItem } from "@/lib/types";
import { usePrefs } from "@/lib/store/prefs";
import { setLastRead } from "@/lib/store/bookmark";
import { usePlayer, buildQueue } from "@/components/player/player-provider";
import { AyahCard } from "./ayah-card";
import { OrnamentDivider } from "@/components/ornaments";
import { cn, toArabicNumber } from "@/lib/utils";

const SCALES = [0.85, 1, 1.15, 1.3, 1.5];

interface Props {
  surah: SurahDetail;
  tafsir: TafsirItem[] | null;
}

export function SurahReader({ surah, tafsir }: Props) {
  const [prefs, updatePrefs] = usePrefs();
  const { state, play } = usePlayer();
  const searchParams = useSearchParams();
  const [tafsirAyah, setTafsirAyah] = useState<number | null>(null);
  const [targetAyah, setTargetAyah] = useState<number | null>(null);
  const scrolledRef = useRef(false);

  /* — ayat sasaran dari ?ayat= (deep-link) — */
  const initialAyah = useMemo(() => {
    const raw = searchParams.get("ayat");
    if (!raw) return undefined;
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1 || n > surah.jumlahAyat) return undefined;
    return n;
  }, [searchParams, surah.jumlahAyat]);

  const queue = useMemo(
    () => buildQueue(surah.ayat, surah.nomor, surah.namaLatin, prefs.reciter),
    [surah.ayat, surah.nomor, surah.namaLatin, prefs.reciter],
  );

  /* — deep-link: gulir ke ayat dari ?ayat= — */
  useEffect(() => {
    if (initialAyah && !scrolledRef.current) {
      scrolledRef.current = true;
      setTargetAyah(initialAyah);
      const el =
        document.getElementById(`ayat-${initialAyah}`) ??
        document.getElementById(`mushaf-${initialAyah}`);
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        window.setTimeout(() => setTargetAyah(null), 2400);
      }
    }
  }, [initialAyah]);

  /* — simpan riwayat baca (saat mount & saat ayat aktif berubah) — */
  useEffect(() => {
    setLastRead({
      nomor: surah.nomor,
      ayat: state.track?.surahNomor === surah.nomor ? state.track.ayat : 1,
      namaLatin: surah.namaLatin,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.track?.ayat, surah.nomor]);

  const openTafsir = useCallback((n: number) => setTafsirAyah(n), []);
  const closeTafsir = useCallback(() => setTafsirAyah(null), []);

  /* — Esc menutup modal + kunci scroll saat modal terbuka — */
  useEffect(() => {
    if (tafsirAyah === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTafsir();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [tafsirAyah, closeTafsir]);

  const tafsirText = tafsirAyah
    ? tafsir?.find((t) => t.ayat === tafsirAyah)?.teks ?? null
    : null;

  const isBasmalahFirst =
    surah.nomor !== 1 && surah.nomor !== 9 && surah.ayat.length > 0;

  return (
    <>
      {/* — toolbar baca — */}
      <div className="reader-toolbar container-page" role="toolbar" aria-label="Pengaturan tampilan">
        <div className="reader-toolbar__group">
          <span className="reader-toolbar__label">Mode</span>
          <div className="segmented" role="group" aria-label="Mode baca">
            <button
              type="button"
              className={cn("segmented__btn", prefs.readMode === "ayat" && "is-on")}
              onClick={() => updatePrefs({ readMode: "ayat" })}
              aria-pressed={prefs.readMode === "ayat"}
            >
              Per ayat
            </button>
            <button
              type="button"
              className={cn("segmented__btn", prefs.readMode === "mushaf" && "is-on")}
              onClick={() => updatePrefs({ readMode: "mushaf" })}
              aria-pressed={prefs.readMode === "mushaf"}
            >
              Mushaf
            </button>
          </div>
        </div>

        <div className="reader-toolbar__group">
          <span className="reader-toolbar__label">Ukuran Arab</span>
          <div className="stepper">
            <button
              type="button"
              className="stepper__btn"
              onClick={() => {
                const i = SCALES.findIndex((s) => s >= prefs.arabicScale - 0.001);
                updatePrefs({ arabicScale: SCALES[Math.max(0, i - 1)] });
              }}
              aria-label="Perkecil ukuran teks Arab"
            >
              −
            </button>
            <span className="stepper__val">{Math.round(prefs.arabicScale * 100)}%</span>
            <button
              type="button"
              className="stepper__btn"
              onClick={() => {
                const i = SCALES.findIndex((s) => s >= prefs.arabicScale - 0.001);
                updatePrefs({ arabicScale: SCALES[Math.min(SCALES.length - 1, i + 1)] });
              }}
              aria-label="Perbesar ukuran teks Arab"
            >
              +
            </button>
          </div>
        </div>

        <div className="reader-toolbar__group">
          <button
            type="button"
            className={cn("btn btn--outline", prefs.showLatin && "is-on")}
            onClick={() => updatePrefs({ showLatin: !prefs.showLatin })}
            aria-pressed={prefs.showLatin}
          >
            Latin
          </button>
          <button
            type="button"
            className={cn("btn btn--outline", prefs.showTranslation && "is-on")}
            onClick={() => updatePrefs({ showTranslation: !prefs.showTranslation })}
            aria-pressed={prefs.showTranslation}
          >
            Terjemahan
          </button>
        </div>
      </div>

      {/* — konten ayat — */}
      <div className="container-page">
        {isBasmalahFirst && prefs.readMode === "ayat" && (
          <div className="basmalah" aria-label="Bismillahirrahmanirrahim">
            <OrnamentDivider className="ornament-divider" />
            <p className="arabic" lang="ar" dir="rtl">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
          </div>
        )}

        {prefs.readMode === "ayat" ? (
          <div className="stack-3 fade-rise">
            {surah.ayat.map((a: Ayah) => (
              <AyahCard
                key={a.nomorAyat}
                surahNomor={surah.nomor}
                surahNama={surah.namaLatin}
                ayah={a}
                queue={queue}
                isActive={state.track?.surahNomor === surah.nomor && state.playing}
                isTarget={targetAyah === a.nomorAyat}
                onOpenTafsir={openTafsir}
              />
            ))}
          </div>
        ) : (
          <div className="card fade-rise" style={{ padding: "var(--space-6)" }}>
            <div className="mushaf-flow arabic" lang="ar" dir="rtl">
              {surah.ayat.map((a) => {
                const playingThis =
                  state.playing &&
                  state.track?.surahNomor === surah.nomor &&
                  state.track?.ayat === a.nomorAyat;
                return (
                  <span
                    key={a.nomorAyat}
                    className={cn("mushaf-ayah", targetAyah === a.nomorAyat && "is-target")}
                    id={`mushaf-${a.nomorAyat}`}
                  >
                    <button
                      type="button"
                      className={cn("mushaf-ayah__tap", playingThis && "is-playing")}
                      onClick={() => {
                        const url = a.audio?.[prefs.reciter];
                        if (!url) return;
                        play(
                          {
                            key: `${surah.nomor}:${a.nomorAyat}`,
                            url,
                            urls: { ...(a.audio ?? {}) },
                            surahNomor: surah.nomor,
                            surahNama: surah.namaLatin,
                            ayat: a.nomorAyat,
                            full: false,
                          },
                          queue,
                        );
                      }}
                      aria-label={`Putar ayat ${a.nomorAyat}`}
                      title={`Putar ayat ${a.nomorAyat}`}
                    >
                      {a.teksArab}
                    </button>
                    <button
                      type="button"
                      className="mushaf-marker"
                      onClick={() => setTafsirAyah(a.nomorAyat)}
                      aria-label={`Buka tafsir ayat ${a.nomorAyat}`}
                      title={`Tafsir ayat ${a.nomorAyat}`}
                    >
                      {toArabicNumber(a.nomorAyat)}
                    </button>
                  </span>
                );
              })}
            </div>
            <p className="mushaf-hint">
              Ketuk teks ayat untuk memutar murottal · ketuk nomor untuk membuka tafsir
            </p>
          </div>
        )}

        {prefs.readMode === "mushaf" && prefs.showTranslation && (
          <div className="stack-3" style={{ marginTop: "var(--space-6)" }}>
            <OrnamentDivider className="ornament-divider" />
            {surah.ayat.map((a) => (
              <p key={a.nomorAyat} className="ayah-card__translation">
                <b className="ayah-card__meta" style={{ marginRight: 8 }}>
                  {a.nomorAyat}.
                </b>
                {a.teksIndonesia}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* — modal tafsir — */}
      {tafsirAyah !== null && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeTafsir();
          }}
        >
          <div className="modal" role="dialog" aria-modal="true" aria-label={`Tafsir ayat ${tafsirAyah}`}>
            <div className="modal__head">
              <div>
                <h2 className="modal__title">Tafsir Kemenag</h2>
                <p className="modal__ref" style={{ marginBottom: 0 }}>
                  QS. {surah.namaLatin} : {tafsirAyah}
                </p>
              </div>
              <button type="button" className="modal__close" onClick={closeTafsir} aria-label="Tutup tafsir">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="modal__body">
              {tafsirText ? (
                <p className="modal__text">{tafsirText}</p>
              ) : (
                <p className="t-muted">Tafsir untuk ayat ini belum tersedia.</p>
              )}
              <p className="modal__source">
                Sumber: Tafsir Kemenag RI — diambil melalui equran.id
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
