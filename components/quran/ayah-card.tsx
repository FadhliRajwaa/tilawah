"use client";

/* — Kartu satu ayat: Arab (font mushaf) + latin opsional + terjemahan + aksi.
 * Aksi: putar audio, buka tafsir, bookmark, salin, salin tautan.
 */

import { useMemo, useState } from "react";
import type { Ayah } from "@/lib/types";
import { usePrefs } from "@/lib/store/prefs";
import { usePlayer, type Track } from "@/components/player/player-provider";
import { AyahVoiceNote } from "@/components/player/ayah-voice-note";
import { toggleBookmark, isBookmarked } from "@/lib/store/bookmark";
import { cn, truncate } from "@/lib/utils";
import { AyahMedal } from "@/components/ornaments";

function IconPlay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}
function IconBook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}
function IconBookmark({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21 12 16.5 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
    </svg>
  );
}
function IconCopy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function IconLink({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

interface Props {
  surahNomor: number;
  surahNama: string;
  ayah: Ayah;
  queue: Track[];
  isActive: boolean;
  isTarget: boolean;
  onOpenTafsir: (ayah: number) => void;
}

export function AyahCard({
  surahNomor,
  surahNama,
  ayah,
  queue,
  isActive,
  isTarget,
  onOpenTafsir,
}: Props) {
  const [prefs] = usePrefs();
  const { play, state } = usePlayer();
  const [marked, setMarked] = useState(() =>
    typeof window !== "undefined" ? isBookmarked(surahNomor, ayah.nomorAyat) : false,
  );
  const [copied, setCopied] = useState<"" | "ayat" | "tautan">("");

  const audioUrl = ayah.audio?.[prefs.reciter];
  const playingThis = isActive && state.track?.ayat === ayah.nomorAyat && state.track?.surahNomor === surahNomor;

  /* Track untuk ayat ini. Sumbernya `queue` (dibangun reader) supaya objeknya
   * identik dengan yang dipegang player global — kalau dibangun ulang di sini,
   * `track.key` tetap sama tapi objeknya beda dan perbandingan di
   * AyahVoiceNote jadi tidak stabil. */
  const track: Track = useMemo(
    () =>
      queue.find((t) => t.ayat === ayah.nomorAyat && t.surahNomor === surahNomor) ?? {
        key: `${surahNomor}:${ayah.nomorAyat}`,
        url: audioUrl ?? "",
        urls: { ...(ayah.audio ?? {}) },
        surahNomor,
        surahNama,
        ayat: ayah.nomorAyat,
        full: false,
      },
    [queue, ayah.nomorAyat, ayah.audio, audioUrl, surahNomor, surahNama],
  );

  const handlePlay = () => {
    if (!audioUrl) return;
    play(track, queue);
  };

  const handleBookmark = () => {
    const now = toggleBookmark({
      nomor: surahNomor,
      ayat: ayah.nomorAyat,
      namaLatin: surahNama,
      snippet: truncate(ayah.teksIndonesia, 110),
    });
    setMarked(now);
  };

  const handleCopy = async () => {
    const text = `${ayah.teksArab}\n\n${ayah.teksIndonesia}\n\n(QS. ${surahNama}: ${ayah.nomorAyat})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied("ayat");
      window.setTimeout(() => setCopied(""), 1600);
    } catch {
      /* clipboard ditolak */
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/surat/${surahNomor}?ayat=${ayah.nomorAyat}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied("tautan");
      window.setTimeout(() => setCopied(""), 1600);
    } catch {
      /* clipboard ditolak */
    }
  };

  return (
    <article
      id={`ayat-${ayah.nomorAyat}`}
      className={cn("ayah-card", playingThis && "is-active", isTarget && "is-target")}
      data-ayah={ayah.nomorAyat}
    >
      <header className="ayah-card__head">
        <AyahMedal nomor={ayah.nomorAyat} />
        <span className="ayah-card__meta">
          {surahNama} · Ayat {ayah.nomorAyat}
        </span>
      </header>

      <p
        className="arabic ayah-card__arabic"
        lang="ar"
        dir="rtl"
        style={{ fontSize: `calc(var(--text-arabic) * ${prefs.arabicScale})` }}
      >
        {ayah.teksArab}
      </p>

      {prefs.showLatin && <p className="ayah-card__latin">{ayah.teksLatin}</p>}

      {prefs.showTranslation && <p className="ayah-card__translation">{ayah.teksIndonesia}</p>}

      {/* waveform per ayat — tersambung ke player global, bukan audio sendiri */}
      <AyahVoiceNote
        track={track}
        queue={queue}
        teksLatin={ayah.teksLatin}
        seed={surahNomor * 1000 + ayah.nomorAyat}
      />

      <footer className="ayah-card__actions">
        <button
          type="button"
          className={cn("ayah-action", playingThis && "is-on")}
          onClick={handlePlay}
          aria-label={`Putar ayat ${ayah.nomorAyat}`}
        >
          <IconPlay className="ayah-action__icon" />
          {playingThis ? "Diputar" : "Putar"}
        </button>

        <button
          type="button"
          className="ayah-action"
          onClick={() => onOpenTafsir(ayah.nomorAyat)}
          aria-label={`Buka tafsir ayat ${ayah.nomorAyat}`}
        >
          <IconBook className="ayah-action__icon" />
          Tafsir
        </button>

        <button
          type="button"
          className={cn("ayah-action", marked && "is-on")}
          onClick={handleBookmark}
          aria-pressed={marked}
          aria-label={marked ? `Hapus penanda ayat ${ayah.nomorAyat}` : `Tandai ayat ${ayah.nomorAyat}`}
        >
          <IconBookmark className="ayah-action__icon" filled={marked} />
          {marked ? "Ditandai" : "Tandai"}
        </button>

        <button type="button" className="ayah-action" onClick={handleCopy} aria-label="Salin ayat">
          <IconCopy className="ayah-action__icon" />
          {copied === "ayat" ? "Tersalin" : "Salin"}
        </button>

        <button type="button" className="ayah-action" onClick={handleCopyLink} aria-label="Salin tautan ayat">
          <IconLink className="ayah-action__icon" />
          {copied === "tautan" ? "Tersalin" : "Tautan"}
        </button>
      </footer>
    </article>
  );
}
