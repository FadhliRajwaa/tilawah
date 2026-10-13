"use client";

/* — Satu ayat: Arab (font mushaf LPMQ) + latin + terjemahan + aksi.
 *
 * Bentuknya LEMBAR, bukan kartu berbingkai: ayat mengalir dipisah nomor
 * berhias (medali) dan jarak — seperti mushaf sungguhan. Tanpa kotak.
 *
 * Preferensi tampilan (latin, terjemahan, ukuran Arab) TIDAK dibaca di
 * sini — mereka diterapkan sebagai atribut di <html> + CSS. Hasilnya kartu
 * selalu merender ketiganya, dan CSS yang menyembunyikan: server tidak
 * perlu tahu pilihan pengguna untuk mengirim HTML yang benar.
 *
 * Tombol putarnya terhubung ke pemutar lewat selector sempit, jadi PLAY
 * pada satu ayat tidak me-render ulang 285 ayat lainnya. */

import { memo } from "react";
import type { Ayat } from "@/lib/types";
import { getPosition, play, sameTrack, seek, toggle, usePlayer } from "@/lib/player";
import { AyahVoiceNote } from "@/components/player/ayah-voice-note";
import { toggleBookmark, useBookmarks } from "@/lib/store/bookmark";
import { toast } from "@/lib/toast";
import { cn, toArabicNumber, truncate } from "@/lib/utils";
import { AyahMedal } from "@/components/ornaments";
import { AyahActions } from "./ayah-actions";

interface Props {
  surahNomor: number;
  surahNama: string;
  ayah: Ayat;
  /** antrean lanjut otomatis (dibangun reader) */
  queue: { s: number; n: number }[];
  isTarget: boolean;
  onOpenTafsir: (n: number) => void;
  /**
   * Awalan id. WAJIB di reader juz (beberapa surah di satu halaman):
   * tanpa itu `ayat-1` muncul berkali-kali dan `getElementById` hanya
   * mengembalikan yang pertama — deep-link menggulir ke ayat yang salah.
   */
  idPrefix?: string;
}

export const AyahCard = memo(function AyahCard({
  surahNomor,
  surahNama,
  ayah,
  queue,
  isTarget,
  onOpenTafsir,
  idPrefix,
}: Props) {
  const track = usePlayer((s) => s.track);
  const playing = usePlayer((s) => s.playing);
  const bookmarks = useBookmarks();

  const playingThis = playing && sameTrack(track, { s: surahNomor, n: ayah.n });
  const marked = bookmarks.some((b) => b.nomor === surahNomor && b.ayat === ayah.n);

  const handlePlay = () => {
    if (playingThis) toggle();
    else play({ s: surahNomor, n: ayah.n }, queue);
  };

  const handleBookmark = () => {
    const now = toggleBookmark({
      nomor: surahNomor,
      ayat: ayah.n,
      namaLatin: surahNama,
      snippet: truncate(ayah.tr, 110),
    });
    if (now) {
      toast(`Ayat ${ayah.n} ditandai`, {
        label: "Batalkan",
        run: () => toggleBookmark({ nomor: surahNomor, ayat: ayah.n, namaLatin: surahNama, snippet: "" }),
      });
    }
  };

  return (
    <article
      id={idPrefix ? `${idPrefix}-${ayah.n}` : `ayat-${surahNomor}-${ayah.n}`}
      className={cn("ayah", playingThis && "is-active", isTarget && "is-target")}
      data-ayah={ayah.n}
    >
      <header className="ayah__head">
        <AyahMedal nomor={ayah.n} />
        <span className="ayah__meta">
          {surahNama} · Ayat {ayah.n}
        </span>
      </header>

      <p className="arabic ayah__arabic" lang="ar" dir="rtl">
        {ayah.ar}
        <span className="ayah__end" aria-hidden="true">
          ‏﴿{toArabicNumber(ayah.n)}﴾
        </span>
      </p>

      <p className="ayah__latin">{ayah.lt}</p>
      <p className="ayah__translation">{ayah.tr}</p>

      <AyahVoiceNote
        s={surahNomor}
        n={ayah.n}
        nama={surahNama}
        queue={queue}
        teksLatin={ayah.lt}
        seed={surahNomor * 1000 + ayah.n}
      />

      <AyahActions
        surahNomor={surahNomor}
        surahNama={surahNama}
        ayahNomor={ayah.n}
        teksArab={ayah.ar}
        teksIndonesia={ayah.tr}
        playing={playingThis}
        marked={marked}
        onPlay={handlePlay}
        onOpenTafsir={() => onOpenTafsir(ayah.n)}
        onToggleBookmark={handleBookmark}
      />
    </article>
  );
});

export { getPosition, seek };
