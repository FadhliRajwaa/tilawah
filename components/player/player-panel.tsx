"use client";

/* — Pemutar ponsel: mini-player + panel penuh.
 *
 * Mini-player (selalu terlihat saat ada audio): judul, putar/jeda, tutup.
 * Diketuk → panel penuh: gelombang besar, scrubber, prev/next, ulangi,
 * kecepatan, qari, pengatur tidur. Di desktop file ini tidak tampil —
 * dock bawah (audio-dock.tsx) yang dipakai.
 *
 * Mini-player juga jangkar view-transition "player" di ponsel, supaya
 * pemutar tidak ikut memudar saat pindah halaman (seperti nav & dock). */

import { useEffect, useState } from "react";
import {
  getPosition,
  next,
  play,
  prev,
  seek,
  setRepeat,
  setSleep,
  setSpeed,
  stop,
  toggle,
  usePlayer,
} from "@/lib/player";
import { QARI } from "@/lib/audio";
import { usePrefs } from "@/lib/store/prefs";
import { SURAH } from "@/lib/data/surah";
import { cn, formatTime } from "@/lib/utils";
import { Sheet } from "@/components/sheet";
import { AyahVoiceNote } from "./ayah-voice-note";
import {
  IconCheck,
  IconChevron,
  IconClose,
  IconNext,
  IconPause,
  IconPlay,
  IconPrev,
  IconRepeat,
  IconTimer,
} from "@/components/icons";

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
const SLEEPS = [0, 5, 10, 15, 30, 60];

export function PlayerPanel() {
  const track = usePlayer((s) => s.track);
  const playing = usePlayer((s) => s.playing);
  const [open, setOpen] = useState(false);
  const [prefs, updatePrefs] = usePrefs();

  if (!track) return null;
  const nama = SURAH[track.s - 1].latin;

  return (
    <>
      {/* — mini-player — */}
      <div
        className="mini-player"
        role="region"
        aria-label="Pemutar murottal"
        style={{ viewTransitionName: "player" }}
      >
        <div className="audio-dock__progress" aria-hidden="true">
          <MiniProgress />
        </div>
        <button type="button" className="mini-player__body" onClick={() => setOpen(true)} aria-label={`Buka pemutar — ${nama}${track.n > 0 ? ` ayat ${track.n}` : ""}`}>
          <span className="mini-player__titles">
            <strong className="mini-player__surah">{nama}</strong>
            <span className="mini-player__sub">
              {track.n > 0 ? `Ayat ${track.n}` : "Surah penuh"}
            </span>
          </span>
          <span className="mini-player__chev" aria-hidden="true">
            <IconChevron className="mini-player__chev-icon" />
          </span>
        </button>
        <button
          type="button"
          className="dock-btn dock-btn--primary mini-player__play"
          onClick={toggle}
          aria-label={playing ? "Jeda" : "Putar"}
        >
          {playing ? <IconPause className="dock-btn__icon" /> : <IconPlay className="dock-btn__icon" />}
        </button>
        <button type="button" className="dock-btn mini-player__close" onClick={stop} aria-label="Tutup pemutar">
          <IconClose className="dock-btn__icon" />
        </button>
      </div>

      {/* — panel penuh — */}
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={nama}
        sub={track.n > 0 ? `Ayat ${track.n} · ${QARI.find((q) => q.id === prefs.reciter)?.nama}` : "Surah penuh"}
      >
        <PanelBody
          onPickAyat={(n) => {
            play({ s: track.s, n });
          }}
        />
      </Sheet>
    </>
  );
}

/** Bilah kemajuan mini — ditulis langsung ke DOM, tanpa state React. */
function MiniProgress() {
  const track = usePlayer((s) => s.track);
  const duration = usePlayer((s) => s.duration);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref || !track) return;
    let raf = 0;
    const tick = () => {
      const d = duration || 0;
      const pct = d > 0 ? Math.min(1, getPosition() / d) : 0;
      ref.style.transform = `scaleX(${pct})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, track]);

  return <div className="audio-dock__progress-fill" ref={setRef} />;
}

function PanelBody({ onPickAyat }: { onPickAyat: (n: number) => void }) {
  const track = usePlayer((s) => s.track);
  const playing = usePlayer((s) => s.playing);
  const duration = usePlayer((s) => s.duration);
  const repeat = usePlayer((s) => s.repeat);
  const speed = usePlayer((s) => s.speed);
  const sleepAt = usePlayer((s) => s.sleepAt);
  const [prefs, updatePrefs] = usePrefs();
  const [uiPos, setUiPos] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [qariOpen, setQariOpen] = useState(false);
  const [sleepOpen, setSleepOpen] = useState(false);

  useEffect(() => {
    if (!track) return;
    const id = window.setInterval(() => {
      if (!scrubbing) setUiPos(getPosition());
    }, 250);
    return () => window.clearInterval(id);
  }, [track, scrubbing]);

  if (!track) return null;
  const total = SURAH[track.s - 1].ayat;
  const sleepLeft =
    sleepAt != null ? Math.max(0, Math.round((sleepAt - Date.now()) / 60000)) : null;

  return (
    <div className="ppanel">
      {/* gelombang + waktu */}
      {track.n > 0 ? (
        <AyahVoiceNote s={track.s} n={track.n} nama={SURAH[track.s - 1].latin} queue={[]} teksLatin="" seed={track.s * 1000 + track.n} />
      ) : (
        <div className="ppanel__timeline">
          <span className="audio-dock__time">{formatTime(uiPos)}</span>
          <input
            type="range"
            min={0}
            max={Math.max(1, Math.floor(duration))}
            value={Math.floor(Math.min(uiPos, duration || 0))}
            onChange={(e) => {
              setScrubbing(true);
              setUiPos(Number(e.target.value));
            }}
            onPointerUp={(e) => {
              seek(Number((e.target as HTMLInputElement).value));
              setScrubbing(false);
            }}
            className="audio-dock__range ppanel__range"
            aria-label="Posisi audio"
          />
          <span className="audio-dock__time">{formatTime(duration)}</span>
        </div>
      )}

      {/* kontrol utama */}
      <div className="ppanel__controls">
        <button type="button" className="dock-btn" onClick={prev} aria-label="Ayat sebelumnya">
          <IconPrev className="dock-btn__icon" />
        </button>
        <button
          type="button"
          className="dock-btn dock-btn--primary ppanel__play"
          onClick={toggle}
          aria-label={playing ? "Jeda" : "Putar"}
        >
          {playing ? <IconPause className="dock-btn__icon" /> : <IconPlay className="dock-btn__icon" />}
        </button>
        <button type="button" className="dock-btn" onClick={next} aria-label="Ayat berikutnya">
          <IconNext className="dock-btn__icon" />
        </button>
      </div>

      {/* opsi: ulangi · kecepatan · tidur */}
      <div className="ppanel__row" role="group" aria-label="Opsi putar">
        <button
          type="button"
          className={cn("dock-toggle", repeat && "is-on")}
          onClick={() => setRepeat(!repeat)}
          aria-pressed={repeat}
          aria-label="Ulangi"
          title="Ulangi"
        >
          <IconRepeat className="dock-btn__icon" />
        </button>
        <div className="segmented" role="group" aria-label="Kecepatan">
          {SPEEDS.map((v) => (
            <button
              key={v}
              type="button"
              className={cn("segmented__btn", speed === v && "is-on")}
              onClick={() => setSpeed(v)}
              aria-pressed={speed === v}
            >
              {v}×
            </button>
          ))}
        </div>
        <button
          type="button"
          className={cn("dock-toggle", sleepLeft != null && "is-on")}
          onClick={() => setSleepOpen((v) => !v)}
          aria-expanded={sleepOpen}
          aria-label={sleepLeft != null ? `Pewaktu tidur ${sleepLeft} menit — ubah` : "Pewaktu tidur"}
          title="Pewaktu tidur"
        >
          <IconTimer className="dock-btn__icon" />
        </button>
      </div>
      {sleepOpen && (
        <div className="segmented ppanel__sleep" role="group" aria-label="Pewaktu tidur">
          {SLEEPS.map((m) => (
            <button
              key={m}
              type="button"
              className={cn(
                "segmented__btn",
                (m === 0 ? sleepLeft == null : sleepLeft === m) && "is-on",
              )}
              onClick={() => {
                setSleep(m);
                setSleepOpen(false);
              }}
              aria-pressed={m === 0 ? sleepLeft == null : sleepLeft === m}
            >
              {m === 0 ? "Mati" : `${m}m`}
            </button>
          ))}
        </div>
      )}
      {sleepLeft != null && !sleepOpen && (
        <p className="ppanel__sleep-note">Berhenti dalam ±{sleepLeft} menit</p>
      )}

      {/* qari */}
      <div className="ppanel__qari">
        <button
          type="button"
          className="ppanel__qari-btn"
          onClick={() => setQariOpen((v) => !v)}
          aria-expanded={qariOpen}
          aria-label="Pilih qari"
        >
          <span className="ppanel__qari-name">
            {QARI.find((q) => q.id === prefs.reciter)?.nama}
          </span>
          <IconChevron className={cn("readerbar__chev", qariOpen && "is-open")} />
        </button>
        {qariOpen && (
          <div className="ppanel__qari-list" role="listbox" aria-label="Daftar qari">
            {QARI.map((q) => (
              <button
                key={q.id}
                type="button"
                role="option"
                aria-selected={q.id === prefs.reciter}
                className={cn("ppanel__qari-item", q.id === prefs.reciter && "is-active")}
                onClick={() => {
                  updatePrefs({ reciter: q.id });
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

      {/* daftar ayat surah ini */}
      {track.n > 0 && (
        <div className="ppanel__ayat">
          <p className="ppanel__ayat-label">Ayat surah ini</p>
          <div className="ppanel__ayat-grid" role="list">
            {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                role="listitem"
                className={cn("ppanel__ayat-btn", n === track.n && "is-active")}
                onClick={() => onPickAyat(n)}
                aria-label={`Putar ayat ${n}`}
                aria-current={n === track.n || undefined}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
