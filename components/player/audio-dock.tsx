"use client";

/* — Pemutar desktop: bar bawah persisten. Di ponsel digantikan mini-player
 * (ketuk untuk membuka panel penuh) — lihat player-panel.tsx. */

import { useEffect, useRef, useState } from "react";
import { getPosition, next, prev, seek, setRepeat, setSpeed, stop, toggle, usePlayer } from "@/lib/player";
import { qariOf } from "@/lib/audio";
import { SURAH } from "@/lib/data/surah";
import { usePrefs } from "@/lib/store/prefs";
import { cn, formatTime } from "@/lib/utils";
import { IconPlay, IconPause, IconNext, IconPrev, IconRepeat, IconClose } from "@/components/icons";

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export function AudioDock() {
  const track = usePlayer((s) => s.track);
  const [prefs] = usePrefs();
  const [scrubbing, setScrubbing] = useState(false);
  const [uiPos, setUiPos] = useState(0);
  const rafRef = useRef(0);

  const playing = usePlayer((s) => s.playing);
  const duration = usePlayer((s) => s.duration);
  const repeat = usePlayer((s) => s.repeat);
  const speed = usePlayer((s) => s.speed);
  const error = usePlayer((s) => s.error);

  /* Sinkronisasi posisi untuk UI tanpa membanjiri React state:
     poll ringan 4x/detik hanya saat scrubbing tidak aktif. */
  useEffect(() => {
    if (!track) return;
    const id = window.setInterval(() => {
      if (!scrubbing) setUiPos(getPosition());
    }, 250);
    return () => window.clearInterval(id);
  }, [track, scrubbing]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  if (!track) return null;

  const pct = duration > 0 ? Math.min(100, (uiPos / duration) * 100) : 0;
  const qari = qariOf(prefs.reciter);

  return (
    <div
      className="audio-dock"
      role="region"
      aria-label="Pemutar murottal"
      data-playing={playing ? "true" : "false"}
      data-player-anchor
    >
      <div className="audio-dock__progress" aria-hidden="true">
        <div className="audio-dock__progress-fill" style={{ transform: `scaleX(${pct / 100})` }} />
      </div>

      <div className="audio-dock__inner">
        {/* info track */}
        <div className="audio-dock__meta">
          <span className="audio-dock__badge" aria-hidden="true">
            {track.n === 0 ? "Surat" : "Ayat"}
          </span>
          <div className="audio-dock__titles">
            <strong className="audio-dock__surah">{SURAH[track.s - 1].latin}</strong>
            <span className="audio-dock__sub">
              {track.n === 0 ? "Audio penuh" : `Ayat ${track.n}`} · {qari.singkat}
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

