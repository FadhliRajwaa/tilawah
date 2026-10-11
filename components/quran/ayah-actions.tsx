"use client";

/* — Baris aksi ayat: putar · tafsir · tandai · salin · tautan.
 *
 * ⚠️ Diekstrak dari duplikasi antara `ayah-card.tsx` dan `juz-reader.tsx`.
 * Keduanya menulis lima tombol yang sama dengan handler yang sama, hanya
 * berbeda cara memanggil `play()` dan cara menyalin. Yang berbeda itu kini
 * jadi prop; yang sama tinggal di sini.
 *
 * Kenapa ini penting lebih dari sekadar kerapian: kelima tombol ini punya
 * keadaan yang harus konsisten — `is-on` saat ayat sedang diputar, `marked`
 * saat ditandai, dan konfirmasi "Tersalin" yang harus muncul di tombol yang
 * BENAR (bukan di semua tombol sekaligus). Dengan satu implementasi, aturan
 * itu hanya perlu ditulis sekali.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconPlay, IconBook, IconBookmark, IconCopy, IconLink } from "@/components/icons";

/** Salin ke clipboard dengan konfirmasi sementara.
 *
 *  Mengembalikan status `copied` dan fungsi salin — dipakai supaya
 *  konfirmasi "Tersalin" hanya muncul di tombol yang ditekan, bukan di
 *  kelima tombol sekaligus. */
function useCopy(ms = 1600) {
  const [copied, setCopied] = useState<"" | "ayat" | "tautan">("");

  const copy = async (text: string, kind: "ayat" | "tautan") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(""), ms);
    } catch {
      /* clipboard ditolak (izin browser / konteks tidak aman) — abaikan,
         pengguna masih bisa menyalin manual */
    }
  };

  return { copied, copy };
}

interface Props {
  surahNomor: number;
  surahNama: string;
  ayahNomor: number;
  teksArab: string;
  teksIndonesia: string;
  /** true saat ayat ini sedang diputar */
  playing: boolean;
  /** true saat ayat ini tersimpan */
  marked: boolean;
  onPlay: () => void;
  onOpenTafsir: () => void;
  onToggleBookmark: () => void;
}

export function AyahActions({
  surahNomor,
  surahNama,
  ayahNomor,
  teksArab,
  teksIndonesia,
  playing,
  marked,
  onPlay,
  onOpenTafsir,
  onToggleBookmark,
}: Props) {
  const { copied, copy } = useCopy();

  const salinAyat = () =>
    copy(`${teksArab}\n\n${teksIndonesia}\n\n(QS. ${surahNama}: ${ayahNomor})`, "ayat");

  const salinTautan = () =>
    copy(`${window.location.origin}/surat/${surahNomor}?ayat=${ayahNomor}`, "tautan");

  return (
    <footer className="ayah__actions">
      <button
        type="button"
        className={cn("ayah-action", playing && "is-on")}
        onClick={onPlay}
        aria-label={`Putar ayat ${ayahNomor}`}
      >
        <IconPlay className="ayah-action__icon" />
        {playing ? "Diputar" : "Putar"}
      </button>

      <button
        type="button"
        className="ayah-action"
        onClick={onOpenTafsir}
        aria-label={`Buka tafsir ayat ${ayahNomor}`}
      >
        <IconBook className="ayah-action__icon" />
        Tafsir
      </button>

      <button
        type="button"
        className={cn("ayah-action", marked && "is-on")}
        onClick={onToggleBookmark}
        aria-pressed={marked}
        aria-label={marked ? `Hapus penanda ayat ${ayahNomor}` : `Tandai ayat ${ayahNomor}`}
      >
        <IconBookmark className="ayah-action__icon" filled={marked} />
        {marked ? "Ditandai" : "Tandai"}
      </button>

      <button type="button" className="ayah-action" onClick={salinAyat} aria-label="Salin ayat">
        <IconCopy className="ayah-action__icon" />
        {copied === "ayat" ? "Tersalin" : "Salin"}
      </button>

      <button
        type="button"
        className="ayah-action"
        onClick={salinTautan}
        aria-label="Salin tautan ayat"
      >
        <IconLink className="ayah-action__icon" />
        {copied === "tautan" ? "Tersalin" : "Tautan"}
      </button>
    </footer>
  );
}
