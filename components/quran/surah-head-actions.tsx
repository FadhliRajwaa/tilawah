"use client";

/* — Aksi di header surat: pemilih qari (sebelum memutar) + putar audio penuh
 * + lompat ke ayat tertentu.
 *
 * Alur "pilih qari dulu, baru putar": qari dipilih di sini, tersimpan ke
 * preferensi, lalu tombol "Putar surat penuh" memakai qari tersebut.
 * Jika qari diganti saat sedang berputar, pemilih di dock yang menangani.
 */

import { useState } from "react";
import type { SurahDetail } from "@/lib/types";
import { usePrefs } from "@/lib/store/prefs";
import { usePlayer, buildFullTrack } from "@/components/player/player-provider";
import { ReciterPicker } from "@/components/player/reciter-picker";
import { QARI } from "@/lib/types";
import { IconPlay, IconPause } from "@/components/icons";

export function SurahHeadActions({ surah }: { surah: SurahDetail }) {
  const [prefs] = usePrefs();
  const { play, toggle, state } = usePlayer();
  const [ayatTarget, setAyatTarget] = useState("");

  const isThisSurahPlaying =
    state.playing && state.track?.surahNomor === surah.nomor;
  const isThisSurahLoaded =
    !!state.track && state.track.surahNomor === surah.nomor && state.track.full;

  const playFull = () => {
    // sudah memutar surat ini → tombol jadi jeda/lanjut
    if (isThisSurahLoaded) {
      toggle();
      return;
    }
    const t = buildFullTrack(surah.audioFull, surah.nomor, surah.namaLatin, prefs.reciter);
    if (!t) return;
    play(t);
  };

  const jump = () => {
    const n = Number(ayatTarget);
    if (!Number.isInteger(n) || n < 1 || n > surah.jumlahAyat) return;
    const el = document.getElementById(`ayat-${n}`) ?? document.getElementById(`mushaf-${n}`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    setAyatTarget("");
  };

  const qariName = QARI.find((q) => q.id === prefs.reciter)?.singkat ?? "qari terpilih";

  return (
    <div className="reader-head__actions">
      {/* pilih qari SEBELUM memutar */}
      <ReciterPicker variant="panel" />

      <button
        type="button"
        className="btn btn--primary"
        onClick={playFull}
        disabled={!surah.audioFull?.[prefs.reciter]}
        aria-label={
          isThisSurahPlaying
            ? `Jeda murottal ${surah.namaLatin}`
            : `Putar surat penuh dibacakan ${qariName}`
        }
      >
        {isThisSurahPlaying ? <IconPause className="btn__icon" /> : <IconPlay className="btn__icon" />}
        {isThisSurahPlaying
          ? "Jeda"
          : isThisSurahLoaded
            ? "Lanjutkan"
            : `Putar penuh — ${qariName}`}
      </button>

      <form
        className="jump-form"
        onSubmit={(e) => {
          e.preventDefault();
          jump();
        }}
      >
        <input
          type="number"
          min={1}
          max={surah.jumlahAyat}
          value={ayatTarget}
          onChange={(e) => setAyatTarget(e.target.value)}
          placeholder={`Ke ayat… (1–${surah.jumlahAyat})`}
          className="searchbox__input jump-form__input"
          aria-label="Lompat ke nomor ayat"
        />
        <button type="submit" className="btn btn--outline">
          Lompat
        </button>
      </form>
    </div>
  );
}
