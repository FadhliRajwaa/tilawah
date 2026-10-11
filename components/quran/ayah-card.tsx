"use client";

/* — Satu ayat: Arab (font mushaf) + latin opsional + terjemahan + aksi.
 *
 * ⚠️ Bentuknya LEMBAR MUSHAF, bukan kartu berbingkai.
 *
 * Versi lama membungkus tiap ayat dalam kotak putih berbingkai — untuk
 * surah panjang (Al-Baqarah 286 ayat) itu 286 kotak bertumpuk, dan halaman
 * terasa seperti daftar kartu, bukan bacaan. Mushaf sungguhan tidak begitu:
 * ayat mengalir di satu lembar, dipisah nomor dan ruang.
 *
 * Jadi: tanpa kotak, tanpa border. Pemisah antar ayat adalah nomor berhias
 * (medali) dan jarak. Yang tersisa hanya garis rambut tipis di atas baris
 * aksi — dan itu pun setengah transparan.
 *
 * Baris aksinya sendiri sudah diekstrak ke `AyahActions` karena reader juz
 * memakai lima tombol yang sama persis.
 */

import { useMemo, useState } from "react";
import type { Ayah } from "@/lib/types";
import { usePrefs } from "@/lib/store/prefs";
import { usePlayer, type Track } from "@/components/player/player-provider";
import { AyahVoiceNote } from "@/components/player/ayah-voice-note";
import { toggleBookmark, isBookmarked } from "@/lib/store/bookmark";
import { cn, truncate } from "@/lib/utils";
import { AyahMedal } from "@/components/ornaments";
import { AyahActions } from "./ayah-actions";

interface Props {
  surahNomor: number;
  surahNama: string;
  ayah: Ayah;
  queue: Track[];
  isActive: boolean;
  isTarget: boolean;
  onOpenTafsir: (ayah: number) => void;
  /**
   * Keadaan tersimpan dari LUAR. Dipakai reader juz, yang sudah membaca
   * seluruh bookmark lewat satu hook (`useBookmarks`) untuk menghindari
   * 148 pembacaan localStorage per render. Kalau tidak diisi, kartu
   * membaca sendiri saat mount — cukup untuk reader surat.
   */
  markedOverride?: boolean;
  /**
   * Awalan id elemen. WAJIB diisi saat beberapa surah dirender di satu
   * halaman (reader juz) — tanpa itu, `ayat-1` muncul berkali-kali
   * (Al-Fatihah 1, Al-Baqarah 1, …) dan `getElementById` mengembalikan
   * yang PERTAMA. Akibatnya deep-link `?ayat=N` menggulir ke ayat yang
   * salah, dan `aria-labelledby` menunjuk elemen yang keliru.
   *
   * Default kosong = `ayat-N` (reader surat, satu surah saja).
   */
  idPrefix?: string;
}

export function AyahCard({
  surahNomor,
  surahNama,
  ayah,
  queue,
  isActive,
  isTarget,
  onOpenTafsir,
  markedOverride,
  idPrefix,
}: Props) {
  const [prefs] = usePrefs();
  const { play, state } = usePlayer();
  const [markedLocal, setMarkedLocal] = useState(() =>
    typeof window !== "undefined" ? isBookmarked(surahNomor, ayah.nomorAyat) : false,
  );

  /* Sumber kebenaran: prop kalau diberikan, kalau tidak keadaan lokal. */
  const marked = markedOverride ?? markedLocal;

  const audioUrl = ayah.audio?.[prefs.reciter];
  const playingThis =
    isActive && state.track?.ayat === ayah.nomorAyat && state.track?.surahNomor === surahNomor;

  /* Track untuk ayat ini diambil dari `queue` (dibangun reader) supaya
   * objeknya identik dengan yang dipegang player global. Kalau dibangun
   * ulang di sini, `track.key` tetap sama tapi objeknya beda — dan
   * perbandingan di AyahVoiceNote jadi tidak stabil. */
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
    /* Keadaan lokal selalu diperbarui walau prop diberikan — kalau pemanggil
       memakai hook, event store akan menyusul; kalau tidak, ini yang
       membuat tombolnya langsung berubah. */
    setMarkedLocal(now);
  };

  return (
    <article
      id={idPrefix ? `${idPrefix}-${ayah.nomorAyat}` : `ayat-${ayah.nomorAyat}`}
      className={cn("ayah", playingThis && "is-active", isTarget && "is-target")}
      data-ayah={ayah.nomorAyat}
    >
      <header className="ayah__head">
        <AyahMedal nomor={ayah.nomorAyat} />
        <span className="ayah__meta">
          {surahNama} · Ayat {ayah.nomorAyat}
        </span>
      </header>

      <p
        className="arabic ayah__arabic"
        lang="ar"
        dir="rtl"
        style={{ fontSize: `calc(var(--text-arabic) * ${prefs.arabicScale})` }}
      >
        {ayah.teksArab}
      </p>

      {prefs.showLatin && <p className="ayah__latin">{ayah.teksLatin}</p>}

      {prefs.showTranslation && <p className="ayah__translation">{ayah.teksIndonesia}</p>}

      {/* Waveform per ayat — tersambung ke player global, bukan audio sendiri */}
      <AyahVoiceNote
        track={track}
        queue={queue}
        teksLatin={ayah.teksLatin}
        seed={surahNomor * 1000 + ayah.nomorAyat}
      />

      <AyahActions
        surahNomor={surahNomor}
        surahNama={surahNama}
        ayahNomor={ayah.nomorAyat}
        teksArab={ayah.teksArab}
        teksIndonesia={ayah.teksIndonesia}
        playing={playingThis}
        marked={marked}
        onPlay={handlePlay}
        onOpenTafsir={() => onOpenTafsir(ayah.nomorAyat)}
        onToggleBookmark={handleBookmark}
      />
    </article>
  );
}
