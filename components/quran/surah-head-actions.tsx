"use client";

/* — Aksi di header surat: putar surah penuh.
 *
 * Qari dipilih di bilah baca (tersimpan sebagai preferensi) — tidak perlu
 * pemilih kedua di sini. Tombol ini hanya memulai/menjeda audio penuh.
 */

import type { SurahDetail } from "@/lib/types";
import { usePrefs } from "@/lib/store/prefs";
import { play, toggle, usePlayer } from "@/lib/player";
import { qariOf } from "@/lib/audio";
import { IconPlay, IconPause } from "@/components/icons";

export function SurahHeadActions({ surah }: { surah: SurahDetail }) {
  const [prefs] = usePrefs();
  const playing = usePlayer((s) => s.playing);
  const track = usePlayer((s) => s.track);

  const isThisSurahPlaying = playing && track?.s === surah.nomor && track?.n === 0;
  const isThisSurahLoaded = !!track && track.s === surah.nomor && track.n === 0;

  const playFull = () => {
    if (isThisSurahLoaded) {
      toggle();
      return;
    }
    play({ s: surah.nomor, n: 0 });
  };

  const qariName = qariOf(prefs.reciter).singkat;

  return (
    <div className="reader-head__actions">
      <button
        type="button"
        className="btn btn--primary"
        onClick={playFull}
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
    </div>
  );
}
