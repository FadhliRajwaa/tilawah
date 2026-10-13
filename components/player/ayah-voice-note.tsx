"use client";

/* — Waveform per ayat, bergaya pesan suara.
 *
 * SELURUH bar digambar sebagai SATU path SVG (ujung bulat dari
 * `stroke-linecap`, bukan dari elemen per bar). Dua path bertumpuk —
 * dasar dan kemajuan — jadi 2 node per ayat (terukur: 166 node untuk Yasin
 * 83 ayat, −96% dari 4.648). Kemajuan ditulis lewat `clip-path`, satu
 * properti pada satu elemen per frame; rAF hanya berjalan saat ayat INI
 * yang berbunyi.
 *
 * Tidak berlangganan status pemutar global (itu me-render ulang 286 kartu
 * tiap ada perubahan). Keaktifan diterima dari kartu induk yang memakai
 * selector sempit. Durasi equran.id tidak menyediakan durasi per ayat —
 * nilainya diestimasi dari panjang transliterasi, lalu ditimpa durasi asli
 * begitu audio ayat itu dimuat.
 */

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { getPosition, play, sameTrack, seek, toggle, usePlayer } from "@/lib/player";
import { IconPause, IconPlay } from "@/components/icons";

const BAR_COUNT = 28;
/* Ruang koordinat SVG — lebar 100, tinggi 20. `preserveAspectRatio="none"`
   meregangkannya mengikuti lebar wadah. */
const VB_W = 100;
const VB_H = 20;
const BAR_W = 2.2;
const GAP = (VB_W - BAR_COUNT * BAR_W) / (BAR_COUNT - 1);

/** Estimasi durasi (detik) dari panjang transliterasi latin. Qari normal
 *  membaca ~9 karakter per detik; cukup dekat supaya label waktu tidak
 *  terasa salah sebelum durasi asli termuat. */
function estimateDuration(teksLatin: string): number {
  return Math.round(Math.min(180, Math.max(3, teksLatin.length / 9)));
}

/** Satu path berisi seluruh bar. Deterministik dari `seed` (xorshift, bukan
 *  Math.random) supaya bentuknya tidak "melompat" saat render ulang. */
function buildWavePath(seed: number): string {
  let s = seed * 2654435761 || 1;
  const parts: string[] = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    /* 0.22–1 — bar terpendek tetap terlihat */
    const h = VB_H * (0.22 + ((Math.abs(s) % 1000) / 1000) * 0.78);
    const x = i * (BAR_W + GAP) + BAR_W / 2;
    const y1 = (VB_H - h) / 2;
    parts.push(`M${x.toFixed(2)} ${y1.toFixed(2)}V${(y1 + h).toFixed(2)}`);
  }
  return parts.join("");
}

interface Props {
  s: number;
  n: number;
  nama: string;
  queue: { s: number; n: number }[];
  teksLatin: string;
  seed: number;
}

export const AyahVoiceNote = memo(function AyahVoiceNote({ s, n, nama, queue, teksLatin, seed }: Props) {
  const isThis = usePlayer((st) => sameTrack(st.track, { s, n }));
  const isPlaying = usePlayer((st) => st.playing && sameTrack(st.track, { s, n }));
  const duration = usePlayer((st) => (sameTrack(st.track, { s, n }) && st.duration > 0 ? st.duration : 0));

  const estimate = useMemo(() => estimateDuration(teksLatin), [teksLatin]);
  /* Path gelombang hanya dirender di klien: 28 segmen × 2 path × 286 ayat
     ≈ 240KB di HTML Al-Baqarah untuk dekorasi yang baru bermakna setelah
     audio diputar. SSR mengirim wadahnya saja. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const wavePath = useMemo(() => (mounted ? buildWavePath(seed) : ""), [mounted, seed]);
  const dur = duration > 0 ? duration : estimate;

  const fillRef = useRef<SVGPathElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  /* RESET saat ayat berhenti aktif — tanpa cabang ini gelombang ayat lama
     tetap terisi penuh seolah masih berbunyi. */
  useEffect(() => {
    if (isThis) return;
    if (fillRef.current) fillRef.current.style.clipPath = "inset(0 100% 0 0)";
    if (headRef.current) {
      headRef.current.style.transform = "translate3d(0cqw, -50%, 0)";
      headRef.current.style.opacity = "0";
    }
    if (timeRef.current) timeRef.current.textContent = "0:00";
  }, [isThis]);

  useEffect(() => {
    if (!isThis) return;
    let raf = 0;
    let lastShown = -1;
    const paint = () => {
      const pos = getPosition();
      const pct = dur > 0 ? Math.min(1, pos / dur) : 0;
      if (fillRef.current) {
        fillRef.current.style.clipPath = `inset(0 ${((1 - pct) * 100).toFixed(2)}% 0 0)`;
      }
      /* `transform`, BUKAN `left`: `left` memaksa hitung ulang tata letak
         60×/detik; `transform` dikerjakan compositor tanpa layout. */
      if (headRef.current) {
        headRef.current.style.transform = `translate3d(${(pct * 100).toFixed(2)}cqw, -50%, 0)`;
        headRef.current.style.opacity = isPlaying || pos > 0 ? "1" : "0";
      }
      if (timeRef.current) {
        const sec = Math.floor(pos);
        if (sec !== lastShown) {
          lastShown = sec;
          timeRef.current.textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
        }
      }
    };
    if (isPlaying) {
      const tick = () => {
        paint();
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else {
      paint();
    }
    return () => cancelAnimationFrame(raf);
  }, [isThis, isPlaying, dur]);

  const handleToggle = () => {
    if (!isThis) play({ s, n }, queue);
    else toggle();
  };

  /* Ketuk gelombang = lompat ke posisi itu — lebih cepat dari slider. */
  const handleSeek = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (!isThis) play({ s, n }, queue);
    seek(ratio * dur);
  };

  return (
    <div className="ayah-note">
      <button
        type="button"
        className="ayah-note__btn"
        onClick={handleToggle}
        aria-label={
          isPlaying ? `Jeda murottal ${nama} ayat ${n}` : `Putar murottal ${nama} ayat ${n}`
        }
      >
        {isPlaying ? (
          <IconPause className="ayah-note__icon" />
        ) : (
          <IconPlay className="ayah-note__icon" />
        )}
      </button>

      <button
        type="button"
        className="ayah-note__wave"
        onClick={handleSeek}
        aria-label={`Posisi murottal ayat ${n} — ketuk untuk melompat`}
        data-playing={isPlaying ? "true" : "false"}
      >
        <svg
          className="ayah-note__svg"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path className="ayah-note__base" d={wavePath} />
          <path className="ayah-note__fill" d={wavePath} ref={fillRef} />
        </svg>
        <span className="ayah-note__head" ref={headRef} aria-hidden="true" />
      </button>

      {/* JANGAN aria-hidden: posisi waktu itu informasi ("sudah 1:23").
          Tanpa aria-live: nilainya berubah tiap detik, membanjiri pembaca
          layar kalau diumumkan. */}
      <span className="ayah-note__time" ref={timeRef}>
        0:00
      </span>
    </div>
  );
});
