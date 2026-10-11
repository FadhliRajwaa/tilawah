"use client";

/* — Reader surat.
 *
 * ⚠️ Rombak: toolbar, baris aksi ayat, modal tafsir, dan mode mushaf
 * diekstrak ke komponen bersama karena reader juz memakai keempatnya
 * secara identik. File ini sekarang hanya berisi hal yang KHAS reader
 * surat: deep-link `?ayat=N` dan basmalah.
 *
 * Catatan deep-link: `?ayat=N` dibaca di KLIEN, bukan di server. Kalau
 * dibaca di server, halaman surat jadi dinamis dan kehilangan SSG — dan
 * 114 halaman ter-prerender itu justru keunggulan utama proyek ini.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Ayah, SurahDetail, TafsirItem } from "@/lib/types";
import { usePrefs } from "@/lib/store/prefs";
import { setLastRead } from "@/lib/store/bookmark";
import { usePlayer, buildQueue } from "@/components/player/player-provider";
import { AyahCard } from "./ayah-card";
import { OrnamentDivider } from "@/components/ornaments";
import { ReaderToolbar } from "./reader-toolbar";
import { TafsirModal } from "./tafsir-modal";
import { MushafFlow } from "./mushaf-flow";

interface Props {
  surah: SurahDetail;
  tafsir: TafsirItem[] | null;
}

export function SurahReader({ surah, tafsir }: Props) {
  const [prefs] = usePrefs();
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
    if (!initialAyah || scrolledRef.current) return;
    scrolledRef.current = true;
    setTargetAyah(initialAyah);

    /* Ayat bisa berada di mode per-ayat (`ayat-N`) atau mode mushaf
       (`mushaf-N`) — cari keduanya karena mode baca tidak diketahui di sini. */
    const el =
      document.getElementById(`ayat-${initialAyah}`) ??
      document.getElementById(`mushaf-${initialAyah}`);
    if (el) {
      /* Hormati permintaan kurangi gerak. `scroll-behavior: auto` di CSS
         tidak menolong di sini karena opsi `behavior` di JS MENANG atas
         CSS — jadi pemeriksaannya harus eksplisit. */
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
      window.setTimeout(() => setTargetAyah(null), 2400);
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

  const tafsirText = tafsirAyah
    ? (tafsir?.find((t) => t.ayat === tafsirAyah)?.teks ?? null)
    : null;

  /* Surah 1 (Al-Fatihah) sudah memuat basmalah sebagai ayat pertama, dan
     surah 9 (At-Taubah) tidak dibuka dengan basmalah. */
  const isBasmalahFirst = surah.nomor !== 1 && surah.nomor !== 9 && surah.ayat.length > 0;

  return (
    <>
      <ReaderToolbar />

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
            <MushafFlow
              ayat={surah.ayat}
              playingKey={
                state.playing && state.track?.surahNomor === surah.nomor
                  ? String(state.track.ayat)
                  : null
              }
              targetAyah={targetAyah}
              onPlay={(a) => {
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
              onOpenTafsir={(a) => setTafsirAyah(a.nomorAyat)}
            />
          </div>
        )}

        {/* Terjemahan terpisah di mode mushaf — teks Arab tetap bersih
            tanpa sisipan Indonesia yang memutus alurnya. */}
        {prefs.readMode === "mushaf" && prefs.showTranslation && (
          <div className="stack-3" style={{ marginTop: "var(--space-6)" }}>
            <OrnamentDivider className="ornament-divider" />
            {surah.ayat.map((a) => (
              <p key={a.nomorAyat} className="ayah__translation">
                <b className="ayah__meta" style={{ marginInlineEnd: 8 }}>
                  {a.nomorAyat}.
                </b>
                {a.teksIndonesia}
              </p>
            ))}
          </div>
        )}
      </div>

      <TafsirModal
        open={tafsirAyah !== null}
        title="Tafsir Kemenag"
        reference={tafsirAyah ? `QS. ${surah.namaLatin} : ${tafsirAyah}` : ""}
        text={tafsirText}
        loading={false}
        onClose={closeTafsir}
      />
    </>
  );
}
