"use client";

/* — Waveform audio per ayat (rare-ui VoiceNote) yang TERSAMBUNG ke player global.
 *
 * Kenapa tidak memakai <VoiceNote src="..."> langsung?
 * VoiceNote bawaan memiliki elemen <audio> sendiri. Kalau dipakai apa adanya di
 * reader, ia akan berbunyi bersamaan dengan player global (dua audio sekaligus).
 * Komponen ini memakai VoiceNote sebagai KULIT tampilan (waveform + aurora),
 * tetapi seluruh kontrol play/pause/seek diarahkan ke player global —
 * satu sumber suara untuk seluruh aplikasi.
 *
 * DUA HAL YANG HARUS DIJAGA DI SINI:
 *
 * 1. BEBAN RENDER. Satu VoiceNote ≈ 80 node DOM (72 bar + aurora). Al-Baqarah
 *    punya 286 ayat; memasang semuanya sekaligus berarti ~23.000 node plus 286
 *    lapisan `mix-blend-mode` — berat sekali. Karena itu komponen ini baru
 *    dipasang saat kartu ayatnya mendekati viewport (IntersectionObserver),
 *    dan tetap terpasang setelahnya.
 *
 * 2. POSISI. `state.positionRef` adalah ref, bukan React state — sengaja, agar
 *    pemutaran tidak memicu re-render 4x/detik di seluruh pohon komponen.
 *    VoiceNote memantau ref itu lewat frame loop-nya sendiri, jadi tidak ada
 *    state per frame di sini.
 *
 * Durasi per ayat tidak disediakan API equran.id. Nilainya diestimasi dari
 * panjang teks latin (stabil per ayat, tidak berubah-ubah antar render), lalu
 * ditimpa durasi asli begitu audio ayat itu termuat di player global.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMotionValue } from "motion/react";
import VoiceNote from "@/components/ui/voice-note";
import { usePlayer, type Track } from "./player-provider";
import { usePrefs } from "@/lib/store/prefs";
import { QARI } from "@/lib/types";

interface Props {
  /** ayat ini */
  track: Track;
  /** antrean seluruh surat/juz untuk auto-advance */
  queue: Track[];
  /** panjang teks latin ayat — dasar estimasi durasi */
  teksLatin: string;
  /** seed waveform agar tiap ayat punya bentuk berbeda tapi tetap konsisten */
  seed: number;
  size?: "sm" | "md";
}

/**
 * Estimasi durasi baca (detik) dari panjang transliterasi latin.
 *
 * Qari pada tempo normal membaca sekitar 9–10 karakter latin per detik.
 * Angka ini hanya placeholder sampai audio ayat tersebut benar-benar dimuat
 * (durasi asli lalu menggantikannya), tapi harus cukup dekat supaya label
 * waktu tidak terasa salah — ayat pendek seperti Al-Ikhlas 1 nyatanya ~2
 * detik, bukan 6.
 */
function estimateDuration(teksLatin: string): number {
  const n = teksLatin.length;
  return Math.round(Math.min(180, Math.max(3, n / 9)));
}

export function AyahVoiceNote({ track, queue, teksLatin, seed, size = "sm" }: Props) {
  const { state, play, toggle, seek } = usePlayer();
  const [prefs] = usePrefs();

  const isThis = state.track?.key === track.key;
  const isPlaying = isThis && state.playing;

  /* — lazy mount: hanya pasang saat kartu mendekati viewport — */
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (live) return;
    const el = hostRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setLive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLive(true);
          io.disconnect();
        }
      },
      // 500px di luar layar: bar sudah siap sebelum pengguna sampai
      { rootMargin: "500px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [live]);

  /* Ayat yang sedang diputar wajib hidup, apa pun posisi scroll-nya —
     kalau tidak, waveform-nya hilang saat pengguna menggulir jauh. */
  const mounted = live || isThis;

  /* — durasi: estimasi stabil → ditimpa durasi asli saat track ini aktif — */
  const estimate = useMemo(() => estimateDuration(teksLatin), [teksLatin]);
  const duration = isThis && state.duration > 0 ? state.duration : estimate;

  const progress = useMotionValue(0);

  /* Ref posisi yang hanya "hidup" saat ayat INI yang diputar.
   *
   * Kalau `state.positionRef` diteruskan apa adanya, SEMUA VoiceNote yang
   * sedang ter-mount akan membaca posisi audio global yang sama — bar ayat
   * lain ikut terisi padahal yang berbunyi cuma satu ayat. Getter ini
   * mengembalikan 0 untuk ayat yang tidak aktif. */
  const posRef = useMemo(
    () => ({
      get current() {
        return isThis ? state.positionRef.current || 0 : 0;
      },
    }),
    [isThis, state.positionRef],
  );

  /* Reset bar saat ayat ini berhenti jadi aktif — kalau tidak, bar ayat lama
     tetap terisi penuh saat pengguna pindah ke ayat lain. */
  useEffect(() => {
    if (!isThis) progress.set(0);
  }, [isThis, progress]);

  const handlePlayingChange = useCallback(
    (next: boolean) => {
      if (next) {
        if (!isThis) play(track, queue);
        else if (!state.playing) toggle();
      } else if (isPlaying) {
        toggle();
      }
    },
    [isThis, isPlaying, play, toggle, track, queue, state.playing],
  );

  const handleSeek = useCallback(
    (seconds: number) => {
      if (!isThis) play(track, queue);
      seek(seconds);
    },
    [isThis, play, track, queue, seek],
  );

  const handleSpeed = useCallback((s: number) => {
    // kecepatan diterapkan ke elemen audio global (milik player)
    const el = document.querySelector("audio");
    if (el) el.playbackRate = s;
  }, []);

  const qariNama = QARI.find((q) => q.id === prefs.reciter)?.singkat ?? "";

  const label = `murottal ${track.surahNama} ayat ${track.ayat} oleh ${qariNama}`;

  return (
    <div className="ayah-note" ref={hostRef} data-ayah-note={track.ayat}>
      {mounted ? (
        <>
          <VoiceNote
            size={size}
            bars={size === "sm" ? 34 : 48}
            seed={seed}
            accent="var(--accent)"
            duration={duration}
            playing={isPlaying}
            onPlayingChange={handlePlayingChange}
            onSpeedChange={handleSpeed}
            seekable
            motionProgress={progress}
            positionRef={posRef}
            onSeek={handleSeek}
            ariaLabel={label}
            className="ayah-note__player"
          />
          <span className="ayah-note__meta">
            {isPlaying ? "Sedang diputar" : "Murottal"} · {qariNama}
          </span>
        </>
      ) : (
        /* placeholder setinggi VoiceNote — supaya tata letak tidak melompat
           saat komponen asli dipasang */
        <span className="ayah-note__placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
