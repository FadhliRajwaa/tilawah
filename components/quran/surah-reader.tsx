"use client";

/* — Reader: SATU komponen untuk halaman surah maupun juz.
 *
 * Server mengirim semua ayatnya (HTML terisi penuh — teks ada sebelum JS
 * jalan), lalu komponen ini mengatur interaksi: mode baca, deep-link
 * `?ayat=`, posisi baca, tafsir, dan audio.
 *
 * Mode mushaf memakai SELURUH daftar `ayat` apa adanya — untuk juz itu bisa
 * lintas surah, dan `MushafFlow` sudah menangani penandanya. */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Ayat } from "@/lib/types";
import { BASMALAH, SURAH } from "@/lib/data/surah";
import { play, rangeQueue, surahQueue, usePlayer } from "@/lib/player";
import { usePrefs } from "@/lib/store/prefs";
import { useReading } from "@/lib/reading";
import { scrollToEl } from "@/lib/utils";
import { AyahCard } from "./ayah-card";
import { OrnamentDivider } from "@/components/ornaments";
import { MushafFlow } from "./mushaf-flow";
import { TafsirSheet } from "./tafsir-sheet";

interface Rentang {
  surah: number;
  dari: number;
  sampai: number;
}

interface Props {
  /** ayat yang dirender — satu surah, atau satu juz utuh */
  ayat: Ayat[];
  /** surah halaman ini (untuk juz: surah pertama) */
  surahNomor: number;
  /** hanya untuk halaman surah (navigasi surah berikutnya) */
  nextSurah?: { nomor: number; namaLatin: string } | null;
  /** hanya untuk halaman juz */
  juzNomor?: number;
  rentang?: readonly Rentang[];
}

const namaSurah = (s: number): string => SURAH[s - 1].latin;

export function Reader({ ayat, surahNomor, nextSurah, juzNomor, rentang }: Props) {
  const searchParams = useSearchParams();
  const [prefs] = usePrefs();
  const mode = prefs.readMode;
  useReading(surahNomor, juzNomor);

  const track = usePlayer((s) => s.track);
  const playing = usePlayer((s) => s.playing);

  const [tafsir, setTafsir] = useState<{ s: number; n: number; ref: string } | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const scrolledRef = useRef(false);

  const queue = useMemo(
    () => (rentang ? rangeQueue(rentang) : surahQueue(surahNomor)),
    [rentang, surahNomor],
  );

  /* — deep-link `?ayat=` — dibaca di KLIEN supaya halaman tetap statis.
     Bentuknya `5` (surah) atau `2:40` (juz: surah & ayat). */
  useEffect(() => {
    if (scrolledRef.current) return;
    scrolledRef.current = true;
    const raw = searchParams.get("ayat");
    if (!raw) return;
    const m = /^(\d{1,3})(?::(\d{1,3}))?$/.exec(raw);
    if (!m) return;
    const key = m[2] ? `${m[1]}:${m[2]}` : `${surahNomor}:${m[1]}`;
    const [s, n] = key.split(":").map(Number);
    if (!ayat.some((a) => a.s === s && a.n === n)) return;
    setTarget(key);
    /* Tunggu satu frame: kartu dirender bersamaan dengan efek ini. */
    requestAnimationFrame(() => {
      const el =
        document.getElementById(`ayat-${s}-${n}`) ?? document.getElementById(`m-${s}-${n}`);
      if (el) scrollToEl(el);
    });
    const t = window.setTimeout(() => setTarget(null), 2400);
    return () => window.clearTimeout(t);
  }, [searchParams, ayat, surahNomor]);

  const openTafsir = useCallback(
    (a: Ayat) => setTafsir({ s: a.s, n: a.n, ref: `QS. ${namaSurah(a.s)} : ${a.n}` }),
    [],
  );
  const closeTafsir = useCallback(() => setTafsir(null), []);

  const onPlay = useCallback((a: Ayat) => play({ s: a.s, n: a.n }, queue), [queue]);
  const playingKey = playing && track ? `${track.s}:${track.n}` : null;

  const isBasmalahFirst = !juzNomor && surahNomor !== 1 && surahNomor !== 9 && ayat.length > 0;

  return (
    <>
      <div className="container-page">
        {isBasmalahFirst && mode === "ayat" && (
          <div className="basmalah" aria-label="Bismillahirrahmanirrahim">
            <OrnamentDivider className="ornament-divider" />
            <p className="arabic" lang="ar" dir="rtl">
              {BASMALAH}
            </p>
          </div>
        )}

        {mode === "ayat" ? (
          <div className="stack-3">
            {ayat.map((a) => (
              <AyahCard
                key={`${a.s}:${a.n}`}
                surahNomor={a.s}
                surahNama={namaSurah(a.s)}
                ayah={a}
                queue={queue}
                isTarget={target === `${a.s}:${a.n}`}
                onOpenTafsir={() => openTafsir(a)}
                idPrefix={`ayat-${a.s}`}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: "var(--space-6)" }}>
            <MushafFlow
              ayat={ayat}
              penandaSurah={!!juzNomor}
              playingKey={playingKey}
              targetN={target ? Number(target.split(":")[1]) : null}
              onPlay={onPlay}
              onOpenTafsir={openTafsir}
            />
          </div>
        )}

        {mode === "mushaf" && (
          <div className="stack-3" style={{ marginTop: "var(--space-6)" }}>
            <OrnamentDivider className="ornament-divider" />
            {ayat.map((a) => (
              <p key={`${a.s}:${a.n}`} className="ayah__translation">
                <b className="ayah__meta" style={{ marginInlineEnd: 8 }}>
                  {a.n}.
                </b>
                {a.tr}
              </p>
            ))}
          </div>
        )}

        {nextSurah && (
          <nav className="next-surah" aria-label="Surah berikutnya">
            <OrnamentDivider className="ornament-divider" />
            <p className="next-surah__label">Selesai membaca — lanjutkan ke</p>
            <a className="next-surah__link" href={`/surat/${nextSurah.nomor}`}>
              {nextSurah.namaLatin}
              <span aria-hidden="true"> →</span>
            </a>
          </nav>
        )}
      </div>

      <TafsirSheet target={tafsir} onClose={closeTafsir} />
    </>
  );
}
