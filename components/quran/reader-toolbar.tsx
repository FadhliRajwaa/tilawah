"use client";

/* — Toolbar pengaturan baca.
 *
 * ⚠️ Diekstrak dari duplikasi antara `surah-reader.tsx` dan `juz-reader.tsx`.
 * Keduanya menulis blok yang identik — 71 baris yang sama persis, hanya
 * berbeda komentar. Itu berarti setiap perubahan pengaturan baca harus
 * dikerjakan dua kali, dan cepat atau lambat keduanya akan berbeda tanpa
 * ada yang menyadarinya.
 *
 * Sekarang satu komponen, satu sumber kebenaran. Reader surat dan reader juz
 * memanggilnya dengan prop yang sama karena keduanya memang membaca hal yang
 * sama — preferensi pengguna.
 *
 * Semua kontrol menulis ke `usePrefs()`, jadi pilihannya langsung tersimpan
 * dan berlaku di seluruh situs (bukan per halaman).
 */

import { usePrefs } from "@/lib/store/prefs";
import { cn } from "@/lib/utils";

/** Tangga ukuran teks Arab. Lima langkah — cukup untuk menyesuaikan tanpa
 *  membuat pengguna harus menekan tombol berkali-kali. */
const SCALES = [0.85, 1, 1.15, 1.3, 1.5];

export function ReaderToolbar() {
  const [prefs, updatePrefs] = usePrefs();

  /* Cari indeks skala terdekat. Toleransi 0.001 karena nilai dari
     localStorage bisa tersimpan sebagai 1.1500000000000001. */
  const idx = SCALES.findIndex((s) => s >= prefs.arabicScale - 0.001);

  return (
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
            onClick={() => updatePrefs({ arabicScale: SCALES[Math.max(0, idx - 1)] })}
            disabled={idx <= 0}
            aria-label="Perkecil ukuran teks Arab"
          >
            −
          </button>
          <span className="stepper__val" aria-live="polite">
            {Math.round(prefs.arabicScale * 100)}%
          </span>
          <button
            type="button"
            className="stepper__btn"
            onClick={() =>
              updatePrefs({ arabicScale: SCALES[Math.min(SCALES.length - 1, idx + 1)] })
            }
            disabled={idx >= SCALES.length - 1}
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
  );
}
