"use client";

/* — Bilah baca: mode, ukuran Arab, latin/terjemahan, qari, dan lompat ayat.
 *
 * Menulis langsung ke preferensi (tersimpan + diterapkan ke <html>), tanpa
 * state lokal — jadi server tidak perlu tahu pilihan untuk mengirim HTML
 * yang benar. Lengket di bawah nav saat menggulir bacaan panjang.
 */

import { useEffect, useRef, useState } from "react";
import { usePrefs } from "@/lib/store/prefs";
import { setReciter } from "@/lib/player";
import { QARI, qariOf } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { IconCheck, IconChevron, IconType } from "@/components/icons";

/** Tangga ukuran teks Arab. Lima langkah — cukup tanpa berkali-kali tekan. */
const SCALES = [0.85, 1, 1.15, 1.3, 1.5];

export function ReaderBar({ maxAyat }: { maxAyat: number }) {
  const [prefs, updatePrefs] = usePrefs();
  const [qariOpen, setQariOpen] = useState(false);
  const [jump, setJump] = useState("");
  const qariRef = useRef<HTMLDivElement>(null);

  /* Tutup menu qari saat klik di luar atau Esc — tanpa ini menu hanya
     tertutup lewat tombol yang sama. */
  useEffect(() => {
    if (!qariOpen) return;
    const onDown = (e: PointerEvent) => {
      if (qariRef.current && !qariRef.current.contains(e.target as Node)) setQariOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQariOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [qariOpen]);

  /* Halaman baca punya chrome atas kedua (bilah ini) — publikasikan agar
     jangkar ayat tidak tersembunyi di bawahnya. */
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.getPropertyValue("--chrome-top");
    root.style.setProperty("--chrome-top", "calc(var(--nav-h) + var(--bar-h))");
    return () => {
      if (prev) root.style.setProperty("--chrome-top", prev);
      else root.style.removeProperty("--chrome-top");
    };
  }, []);

  const idx = SCALES.findIndex((s) => s >= prefs.arabicScale - 0.001);
  const qari = qariOf(prefs.reciter);

  const goJump = () => {
    const n = Number(jump);
    if (!Number.isInteger(n) || n < 1 || n > maxAyat) return;
    /* Cari di kedua mode. Di juz, ambil ayat pertama surah berjalan yang
       nomornya cocok dari elemen terdekat di viewport. */
    const all = document.querySelectorAll<HTMLElement>("[data-ayah]");
    let el: HTMLElement | null = null;
    for (const c of all) {
      if (c.dataset.ayah?.endsWith(`:${n}`)) {
        el = c;
        break;
      }
    }
    el ??= document.querySelector<HTMLElement>(`[id^="m-"][id$="-${n}"]`);
    el?.scrollIntoView({ block: "center" });
    setJump("");
  };

  return (
    <div className="readerbar" role="toolbar" aria-label="Pengaturan baca">
      <div className="readerbar__inner container-page">
        {/* mode baca */}
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

        {/* ukuran Arab */}
        <div className="stepper" role="group" aria-label="Ukuran teks Arab">
          <button
            type="button"
            className="stepper__btn"
            onClick={() => updatePrefs({ arabicScale: SCALES[Math.max(0, idx - 1)] })}
            disabled={idx <= 0}
            aria-label="Perkecil teks Arab"
          >
            −
          </button>
          <span className="stepper__val" aria-live="polite">
            {Math.round(prefs.arabicScale * 100)}%
          </span>
          <button
            type="button"
            className="stepper__btn"
            onClick={() => updatePrefs({ arabicScale: SCALES[Math.min(SCALES.length - 1, idx + 1)] })}
            disabled={idx >= SCALES.length - 1}
            aria-label="Perbesar teks Arab"
          >
            +
          </button>
        </div>

        {/* latin & terjemahan */}
        <div className="readerbar__toggles" role="group" aria-label="Tampilan teks">
          <button
            type="button"
            className={cn("readerbar__toggle", prefs.showLatin && "is-on")}
            onClick={() => updatePrefs({ showLatin: !prefs.showLatin })}
            aria-pressed={prefs.showLatin}
          >
            Latin
          </button>
          <button
            type="button"
            className={cn("readerbar__toggle", prefs.showTranslation && "is-on")}
            onClick={() => updatePrefs({ showTranslation: !prefs.showTranslation })}
            aria-pressed={prefs.showTranslation}
          >
            Terjemahan
          </button>
        </div>

        {/* qari */}
        <div className="readerbar__qari" ref={qariRef}>
          <button
            type="button"
            className="readerbar__qari-btn"
            onClick={() => setQariOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={qariOpen}
            aria-label={`Qari: ${qari.nama}. Ganti qari`}
          >
            <IconType className="readerbar__qari-icon" />
            <span>{qari.singkat}</span>
            <IconChevron className={cn("readerbar__chev", qariOpen && "is-open")} />
          </button>
          {qariOpen && (
            <div className="readerbar__qari-menu" role="listbox" aria-label="Pilih qari">
              {QARI.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  role="option"
                  aria-selected={q.id === prefs.reciter}
                  className={cn("readerbar__qari-item", q.id === prefs.reciter && "is-active")}
                  onClick={() => {
                    setReciter(q.id);
                    setQariOpen(false);
                  }}
                >
                  <span>{q.nama}</span>
                  {q.id === prefs.reciter && <IconCheck className="readerbar__check" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* lompat ke ayat */}
        <form
          className="readerbar__jump"
          onSubmit={(e) => {
            e.preventDefault();
            goJump();
          }}
        >
          <input
            type="number"
            min={1}
            max={maxAyat}
            value={jump}
            onChange={(e) => setJump(e.target.value)}
            placeholder={`Ayat 1–${maxAyat}`}
            aria-label="Lompat ke ayat"
            className="readerbar__jump-input"
          />
          <button type="submit" className="readerbar__jump-btn">
            Ke ayat
          </button>
        </form>
      </div>
    </div>
  );
}
