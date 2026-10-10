"use client";

/* — Player audio persisten lintas navigasi + pemilih qari real-time.
 *
 * Arsitektur (terverifikasi dari docs Next.js 16 + riset):
 * - Provider ini hidup di root layout → TIDAK remount saat navigasi client-side.
 * - JANGAN taruh di template.tsx (template di-key ulang tiap navigasi).
 * - Satu elemen <audio> tunggal dimiliki provider; komponen lain hanya mengontrol.
 * - State frekuensi tinggi (currentTime, ~4x/detik) TIDAK masuk React state —
 *   ia ditulis langsung ke DOM via ref, agar tidak memicu re-render masif.
 * - Autoplay diblokir tanpa gesture → semua play() dipicu klik pengguna.
 *
 * GANTI QARI REAL-TIME:
 * Track menyimpan SEMUA url qari (`urls: Record<qariId, url>`), bukan satu url.
 * Saat qari diganti, provider menukar `el.src` ke url qari baru dan — bila
 * sebelumnya sedang berputar — memulai ulang dari detik 0 pada AYAT YANG SAMA.
 * Karena queue ikut dibangun ulang, ayat berikutnya juga otomatis memakai
 * qari baru. Tidak perlu reload halaman.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePrefs } from "@/lib/store/prefs";
import type { Ayah } from "@/lib/types";

export interface Track {
  /** kunci unik: `${nomorSurat}:${nomorAyat}` atau `${nomorSurat}:full` */
  key: string;
  /** url untuk qari yang SEDANG dipakai (diturunkan dari `urls`) */
  url: string;
  /** semua url per id qari — inti fitur ganti qari real-time */
  urls: Record<string, string>;
  surahNomor: number;
  surahNama: string;
  ayat: number;
  /** true jika ini audio full-surah (bukan per ayat) */
  full: boolean;
}

interface PlayerState {
  track: Track | null;
  playing: boolean;
  duration: number;
  /** posisi detik — diperbarui via DOM, tidak memicu re-render */
  positionRef: React.RefObject<number>;
  queue: Track[];
  repeat: boolean;
  speed: number;
  error: string | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  /** id qari yang sedang aktif (dari prefs) */
  reciter: string;
}

interface PlayerApi {
  state: PlayerState;
  play: (track: Track, queue?: Track[]) => void;
  toggle: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setRepeat: (v: boolean) => void;
  setSpeed: (v: number) => void;
  /**
   * Ganti qari saat ini. Jika ada track aktif, audio langsung berpindah ke
   * rekaman qari baru dan (bila sedang berputar) mengulang dari awal ayat itu.
   * @returns true bila ada track yang diganti
   */
  changeReciter: (qariId: string) => boolean;
  /** Qari yang tersedia untuk track aktif (hanya yang punya audio) */
  availableReciters: () => string[];
}

const Ctx = createContext<PlayerApi | null>(null);

/** Bangun antrean track per ayat dari daftar ayat surat (semua qari). */
export function buildQueue(
  ayatList: Ayah[],
  surahNomor: number,
  surahNama: string,
  qari: string,
): Track[] {
  return ayatList
    .map((a): Track | null => {
      const urls = a.audio ?? {};
      const url = urls[qari];
      if (!url) return null;
      return {
        key: `${surahNomor}:${a.nomorAyat}`,
        url,
        urls: { ...urls },
        surahNomor,
        surahNama,
        ayat: a.nomorAyat,
        full: false,
      };
    })
    .filter((t): t is Track => t !== null);
}

/** Bangun track audio full-surah (semua qari). */
export function buildFullTrack(
  audioFull: Record<string, string>,
  surahNomor: number,
  surahNama: string,
  qari: string,
): Track | null {
  const url = audioFull?.[qari];
  if (!url) return null;
  return {
    key: `${surahNomor}:full`,
    url,
    urls: { ...audioFull },
    surahNomor,
    surahNama,
    ayat: 0,
    full: true,
  };
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const positionRef = useRef(0);
  const queueRef = useRef<Track[]>([]);
  const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [prefs, updatePrefs] = usePrefs();

  const repeatRef = useRef(repeat);
  repeatRef.current = repeat;
  const trackRef = useRef<Track | null>(null);
  trackRef.current = track;

  /* — pasang event listener pada elemen audio (sekali) — */
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => {
      positionRef.current = el.currentTime;
    };
    const onMeta = () => setDuration(el.duration || 0);
    const onPlay = () => {
      setPlaying(true);
      setError(null);
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      if (repeatRef.current) {
        el.currentTime = 0;
        void el.play();
        return;
      }
      const q = queueRef.current;
      const cur = trackRef.current;
      if (!cur || q.length === 0) {
        setPlaying(false);
        return;
      }
      const idx = q.findIndex((t) => t.key === cur.key);
      const nextTrack = idx >= 0 ? q[idx + 1] : undefined;
      if (nextTrack) {
        playTrack(nextTrack);
      } else {
        setPlaying(false);
      }
    };
    const onError = () => {
      setError("Audio gagal dimuat. Periksa koneksi lalu coba lagi.");
      setPlaying(false);
    };

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* — sinkronisasi kecepatan — */
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  const playTrack = useCallback((t: Track) => {
    const el = audioRef.current;
    if (!el) return;
    setError(null);
    if (trackRef.current?.key !== t.key || el.src !== t.url) {
      el.src = t.url;
      el.load();
      setTrack(t);
      setDuration(0);
      positionRef.current = 0;
    }
    void el.play().catch(() => {
      setPlaying(false);
    });
  }, []);

  /** Muat track tanpa memutar (dipakai saat ganti qari sambil jeda). */
  const loadTrack = useCallback((t: Track) => {
    const el = audioRef.current;
    if (!el) return;
    el.src = t.url;
    el.load();
    setTrack(t);
    setDuration(0);
    positionRef.current = 0;
  }, []);

  /**
   * Ganti qari real-time: tukar url pada track aktif + seluruh queue,
   * lalu putar ulang dari awal ayat yang sama.
   */
  const changeReciter = useCallback(
    (qariId: string): boolean => {
      const cur = trackRef.current;

      // queue ikut dibangun ulang agar auto-advance memakai qari baru
      queueRef.current = queueRef.current.map((t) => {
        const nextUrl = t.urls?.[qariId];
        return nextUrl ? { ...t, url: nextUrl } : t;
      });

      if (!cur) {
        // belum ada track — cukup simpan preferensi, tidak ada yang diputar
        updatePrefs({ reciter: qariId });
        return false;
      }

      const nextUrl = cur.urls?.[qariId];
      if (!nextUrl) {
        // qari ini tidak punya rekaman untuk ayat tersebut
        setError("Qari ini belum punya rekaman untuk ayat ini.");
        return false;
      }

      const wasPlaying = playing || (!audioRef.current?.paused && !!audioRef.current?.src);
      const nextTrack: Track = { ...cur, url: nextUrl };
      updatePrefs({ reciter: qariId });

      if (wasPlaying) {
        // sedang berputar → lanjutkan otomatis dengan qari baru, dari detik 0
        playTrack(nextTrack);
      } else {
        // sedang jeda → muat rekaman baru, tetap jeda
        loadTrack(nextTrack);
      }
      return true;
    },
    [playing, playTrack, loadTrack, updatePrefs],
  );

  const availableReciters = useCallback((): string[] => {
    const cur = trackRef.current;
    if (!cur?.urls) return [];
    return Object.keys(cur.urls);
  }, []);

  const api = useMemo<PlayerApi>(
    () => ({
      state: {
        track,
        playing,
        duration,
        positionRef,
        queue: queueRef.current,
        repeat,
        speed,
        error,
        audioRef,
        reciter: prefs.reciter,
      },
      play: (t, queue) => {
        if (queue) queueRef.current = queue;
        playTrack(t);
      },
      toggle: () => {
        const el = audioRef.current;
        if (!el || !trackRef.current) return;
        if (el.paused) {
          void el.play().catch(() => setPlaying(false));
        } else {
          el.pause();
        }
      },
      stop: () => {
        const el = audioRef.current;
        if (!el) return;
        el.pause();
        el.removeAttribute("src");
        el.load();
        setTrack(null);
        setPlaying(false);
        setDuration(0);
        positionRef.current = 0;
        queueRef.current = [];
      },
      next: () => {
        const q = queueRef.current;
        const cur = trackRef.current;
        if (!cur) return;
        const idx = q.findIndex((t) => t.key === cur.key);
        const t = idx >= 0 ? q[idx + 1] : undefined;
        if (t) playTrack(t);
      },
      prev: () => {
        const q = queueRef.current;
        const cur = trackRef.current;
        if (!cur) return;
        const el = audioRef.current;
        if (el && el.currentTime > 3) {
          el.currentTime = 0;
          return;
        }
        const idx = q.findIndex((t) => t.key === cur.key);
        const t = idx > 0 ? q[idx - 1] : undefined;
        if (t) playTrack(t);
      },
      seek: (seconds) => {
        const el = audioRef.current;
        if (!el) return;
        el.currentTime = Math.max(0, Math.min(seconds, el.duration || seconds));
        positionRef.current = el.currentTime;
      },
      setRepeat: (v) => setRepeat(v),
      setSpeed: (v) => setSpeedState(v),
      changeReciter,
      availableReciters,
    }),
    [track, playing, duration, repeat, speed, error, prefs.reciter, playTrack, changeReciter, availableReciters],
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      {/* Elemen audio tunggal — milik provider, tidak pernah di-unmount. */}
      <audio ref={audioRef} preload="metadata" />
    </Ctx.Provider>
  );
}

export function usePlayer(): PlayerApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer harus dipakai di dalam <PlayerProvider>");
  return ctx;
}
