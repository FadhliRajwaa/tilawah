"use client";

/* — Bar pemutar audio bawah (persisten). Semua kontrol penting, tanpa keramaian. — */

import { useEffect, useRef, useState } from "react";
import { usePlayer } from "./player-provider";
import { ReciterPicker } from "./reciter-picker";
import { QARI } from "@/lib/types";
import { usePrefs } from "@/lib/store/prefs";
import { cn, pad } from "@/lib/utils";

function IconPlay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}
function IconPause({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <rect x="6" y="4" width="4.5" height="16" rx="1.2" />
      <rect x="13.5" y="4" width="4.5" height="16" rx="1.2" />
    </svg>
  );
}
function IconNext({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M6 5.5v13a1 1 0 0 0 1.55.83L16 13.6V18a1 1 0 0 0 2 0V6a1 1 0 0 0-2 0v4.4L7.55 4.67A1 1 0 0 0 6 5.5Z" />
    </svg>
  );
}
function IconPrev({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18 5.5v13a1 1 0 0 1-1.55.83L8 13.6V18a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v4.4l8.45-5.73A1 1 0 0 1 18 5.5Z" />
    </svg>
  );
}
function IconRepeat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
function IconClose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export function AudioDock() {
  const { state, toggle, next, prev, seek, stop, setRepeat, setSpeed } = usePlayer();
  const [prefs] = usePrefs();
  const [scrubbing, setScrubbing] = useState(false);
  const [uiPos, setUiPos] = useState(0);
  const rafRef = useRef(0);

  const { track, playing, duration, positionRef, repeat, speed, error } = state;

  /* Sinkronisasi posisi untuk UI tanpa membanjiri React state:
     poll ringan 4x/detik hanya saat scrubbing tidak aktif. */
  useEffect(() => {
    if (!track) return;
    const id = window.setInterval(() => {
      if (!scrubbing) setUiPos(positionRef.current);
    }, 250);
    return () => window.clearInterval(id);
  }, [track, scrubbing, positionRef]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  if (!track) return null;

  const pct = duration > 0 ? Math.min(100, (uiPos / duration) * 100) : 0;
  const qari = QARI.find((q) => q.id === prefs.reciter);

  return (
    <div
      className="audio-dock"
      role="region"
      aria-label="Pemutar murottal"
      data-playing={playing ? "true" : "false"}
    >
      <div className="audio-dock__progress" aria-hidden="true">
        <div className="audio-dock__progress-fill" style={{ transform: `scaleX(${pct / 100})` }} />
      </div>

      <div className="audio-dock__inner">
        {/* info track */}
        <div className="audio-dock__meta">
          <span className="audio-dock__badge" aria-hidden="true">
            {track.full ? "Surat" : "Ayat"}
          </span>
          <div className="audio-dock__titles">
            <strong className="audio-dock__surah">{track.surahNama}</strong>
            <span className="audio-dock__sub">
              {track.full ? "Audio penuh" : `Ayat ${track.ayat}`} · {qari?.singkat ?? "Qari"}
            </span>
          </div>
        </div>

        {/* kontrol utama */}
        <div className="audio-dock__controls">
          <button type="button" className="dock-btn" onClick={prev} aria-label="Sebelumnya">
            <IconPrev className="dock-btn__icon" />
          </button>
          <button
            type="button"
            className="dock-btn dock-btn--primary"
            onClick={toggle}
            aria-label={playing ? "Jeda" : "Putar"}
          >
            {playing ? <IconPause className="dock-btn__icon" /> : <IconPlay className="dock-btn__icon" />}
          </button>
          <button type="button" className="dock-btn" onClick={next} aria-label="Berikutnya">
            <IconNext className="dock-btn__icon" />
          </button>
        </div>

        {/* timeline */}
        <div className="audio-dock__timeline">
          <span className="audio-dock__time">{formatTime(uiPos)}</span>
          <input
            type="range"
            min={0}
            max={Math.max(1, Math.floor(duration))}
            value={Math.floor(uiPos)}
            onChange={(e) => {
              setScrubbing(true);
              setUiPos(Number(e.target.value));
            }}
            onPointerUp={(e) => {
              seek(Number((e.target as HTMLInputElement).value));
              setScrubbing(false);
            }}
            onKeyUp={(e) => {
              seek(Number((e.target as HTMLInputElement).value));
              setScrubbing(false);
            }}
            className="audio-dock__range"
            aria-label="Posisi audio"
          />
          <span className="audio-dock__time">{formatTime(duration)}</span>
        </div>

        {/* opsi */}
        <div className="audio-dock__options">
          <button
            type="button"
            className={cn("dock-toggle", repeat && "is-on")}
            onClick={() => setRepeat(!repeat)}
            aria-pressed={repeat}
            aria-label="Ulangi ayat ini"
            title="Ulangi ayat ini"
          >
            <IconRepeat className="dock-btn__icon" />
          </button>

          <select
            className="dock-select"
            value={String(speed)}
            onChange={(e) => setSpeed(Number(e.target.value))}
            aria-label="Kecepatan audio"
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>

          {/* pemilih qari real-time: ganti → ayat ini diulang dgn qari baru */}
          <ReciterPicker variant="dock" />

          <button type="button" className="dock-btn dock-btn--ghost" onClick={stop} aria-label="Tutup pemutar">
            <IconClose className="dock-btn__icon" />
          </button>
        </div>
      </div>

      {error && (
        <p className="audio-dock__error" role="status">
          {error}
        </p>
      )}
    </div>
  );
}

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${pad(s)}`;
}
