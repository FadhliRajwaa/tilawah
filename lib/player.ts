"use client";

/* — Pemutar murottal: SATU elemen audio untuk seluruh aplikasi.
 *
 * Store eksternal (bukan React Context). Dulu status pemutar hidup di
 * Context, sehingga setiap perubahan — putar, jeda, ganti ayat, durasi
 * termuat — me-render ulang SEMUA komponen pemakainya, termasuk 286 kartu
 * ayat Al-Baqarah. Sekarang tiap komponen berlangganan pada potongan yang
 * ia butuhkan saja (`usePlayer(s => …)`), dan elemen audio dimiliki modul
 * ini, bukan pohon React — jadi ia tidak pernah ikut di-unmount.
 *
 * Yang ditangani di sini:
 *  · antrean per ayat + lanjut otomatis (lintas surah di halaman juz)
 *  · pemanasan berkas ayat berikutnya, supaya jeda antar-ayat nyaris hilang
 *  · ganti qari saat memutar (ayat yang sama diulang dengan rekaman baru)
 *  · ulangi ayat, kecepatan, pengatur waktu tidur
 *  · Media Session: kontrol di layar kunci, notifikasi, dan tombol media
 */

import { useSyncExternalStore } from "react";
import { audioUrl, qariOf } from "./audio";
import { SURAH } from "./data/surah";
import { readPrefs, writePrefs } from "./store/prefs";
import { toast } from "./toast";

/** `n` 0 = audio surah penuh. */
export interface Track {
  s: number;
  n: number;
}

export interface PlayerState {
  track: Track | null;
  queue: readonly Track[];
  playing: boolean;
  /** menunggu data (buffering) — dipakai untuk indikator, bukan untuk logika */
  loading: boolean;
  duration: number;
  repeat: boolean;
  speed: number;
  /** epoch ms kapan pemutar berhenti sendiri; null = tidak aktif */
  sleepAt: number | null;
  error: string | null;
}

const INITIAL: PlayerState = {
  track: null,
  queue: [],
  playing: false,
  loading: false,
  duration: 0,
  repeat: false,
  speed: 1,
  sleepAt: null,
  error: null,
};

let state = INITIAL;
const listeners = new Set<() => void>();

function set(patch: Partial<PlayerState>): void {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Pilih potongan status. Kembalikan nilai primitif atau objek dari `state`
 *  apa adanya — objek baru setiap panggilan akan memicu render tanpa henti. */
export function usePlayer<T>(sel: (s: PlayerState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => sel(state),
    () => sel(INITIAL),
  );
}

export const getPlayer = (): PlayerState => state;
export const sameTrack = (a: Track | null, b: Track | null): boolean =>
  !!a && !!b && a.s === b.s && a.n === b.n;
export const trackKey = (t: Track): string => `${t.s}:${t.n}`;

/* ─── elemen audio ─── */

let el: HTMLAudioElement | null = null;
let warmed = "";

function audio(): HTMLAudioElement {
  if (el) return el;
  const a = new Audio();
  a.preload = "auto";

  a.addEventListener("play", () => set({ playing: true, error: null }));
  a.addEventListener("pause", () => set({ playing: false }));
  a.addEventListener("waiting", () => set({ loading: true }));
  a.addEventListener("playing", () => {
    set({ loading: false });
    warmNext();
  });
  a.addEventListener("canplay", () => set({ loading: false }));
  a.addEventListener("durationchange", () =>
    set({ duration: Number.isFinite(a.duration) ? a.duration : 0 }),
  );
  a.addEventListener("timeupdate", onTime);
  a.addEventListener("ended", onEnded);
  a.addEventListener("error", () => {
    if (!a.getAttribute("src")) return;
    set({ playing: false, loading: false, error: "Audio gagal dimuat. Periksa koneksi lalu coba lagi." });
  });

  el = a;
  return a;
}

export const getPosition = (): number => el?.currentTime ?? 0;

let lastPosSync = 0;
function onTime(): void {
  const a = el;
  if (!a) return;
  if (state.sleepAt && Date.now() >= state.sleepAt) {
    a.pause();
    set({ sleepAt: null });
    toast("Pemutar berhenti — waktu tidur tercapai");
  }
  /* Posisi untuk layar kunci — cukup sekali per detik */
  const now = performance.now();
  if (now - lastPosSync > 1000 && "mediaSession" in navigator && a.duration > 0) {
    lastPosSync = now;
    try {
      navigator.mediaSession.setPositionState({
        duration: a.duration,
        playbackRate: a.playbackRate,
        position: Math.min(a.currentTime, a.duration),
      });
    } catch {
      /* beberapa peramban menolak nilai di tepi durasi — abaikan */
    }
  }
}

function onEnded(): void {
  const a = audio();
  if (state.repeat) {
    a.currentTime = 0;
    void a.play();
    return;
  }
  const nxt = neighbour(1);
  if (nxt && readPrefs().autoAdvance) {
    play(nxt);
    return;
  }
  set({ playing: false });
  if (state.track && !nxt && state.track.n > 0) {
    toast(`Selesai — ${SURAH[state.track.s - 1].latin}`);
  }
}

function neighbour(dir: 1 | -1): Track | null {
  const t = state.track;
  if (!t) return null;
  const i = state.queue.findIndex((q) => sameTrack(q, t));
  return i < 0 ? null : (state.queue[i + dir] ?? null);
}

/** Panaskan berkas ayat berikutnya ke cache HTTP supaya pergantian ayat
 *  hampir tanpa jeda. `no-cors` karena CDN tidak mengirim header CORS —
 *  respons buram tetap tersimpan di cache. Dilewati saat mode hemat data. */
function warmNext(): void {
  const nxt = neighbour(1);
  if (!nxt) return;
  const url = audioUrl(readPrefs().reciter, nxt.s, nxt.n);
  if (url === warmed) return;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return;
  warmed = url;
  fetch(url, { mode: "no-cors", priority: "low" } as RequestInit).catch(() => {});
}

/* ─── Media Session (layar kunci, notifikasi, tombol media) ─── */

let sessionBound = false;

function updateSession(t: Track): void {
  if (!("mediaSession" in navigator)) return;
  const ms = navigator.mediaSession;
  const s = SURAH[t.s - 1];
  ms.metadata = new MediaMetadata({
    title: t.n > 0 ? `${s.latin} · Ayat ${t.n}` : `${s.latin} — surah penuh`,
    artist: qariOf(readPrefs().reciter).nama,
    album: "Tilawah",
    artwork: [{ src: "/apple-icon", sizes: "180x180", type: "image/png" }],
  });
  if (sessionBound) return;
  sessionBound = true;
  const on = (action: MediaSessionAction, fn: MediaSessionActionHandler) => {
    try {
      ms.setActionHandler(action, fn);
    } catch {
      /* aksi tidak didukung peramban ini */
    }
  };
  on("play", () => void audio().play());
  on("pause", () => audio().pause());
  on("previoustrack", () => prev());
  on("nexttrack", () => next());
  on("stop", () => stop());
  on("seekto", (d) => d.seekTime != null && seek(d.seekTime));
}

/* ─── aksi ─── */

/** Putar satu track. `queue` (opsional) mengganti antrean lanjut otomatis. */
export function play(t: Track, queue?: readonly Track[]): void {
  const a = audio();
  const url = audioUrl(readPrefs().reciter, t.s, t.n);
  const patch: Partial<PlayerState> = { error: null };
  if (queue) patch.queue = queue;
  if (!sameTrack(state.track, t) || a.src !== url) {
    a.src = url;
    patch.track = t;
    patch.duration = 0;
    patch.loading = true;
  }
  set(patch);
  a.playbackRate = state.speed;
  a.play().catch((e: unknown) => {
    /* AbortError = src diganti sebelum sempat diputar (pengguna mengetuk
       ayat lain dengan cepat). Itu bukan galat. */
    if (e instanceof DOMException && e.name === "AbortError") return;
    set({ playing: false, loading: false });
  });
  updateSession(t);
}

export function toggle(): void {
  const a = el;
  if (!a || !state.track) return;
  if (a.paused) void a.play().catch(() => set({ playing: false }));
  else a.pause();
}

export function next(): void {
  const t = neighbour(1);
  if (t) play(t);
}

export function prev(): void {
  const a = el;
  if (a && a.currentTime > 3) {
    a.currentTime = 0;
    return;
  }
  const t = neighbour(-1);
  if (t) play(t);
}

export function seek(sec: number): void {
  const a = el;
  if (!a || !state.track) return;
  a.currentTime = Math.max(0, Math.min(sec, a.duration || sec));
}

export function stop(): void {
  const a = el;
  if (a) {
    a.pause();
    a.removeAttribute("src");
    a.load();
  }
  set({ ...INITIAL, speed: state.speed });
  if ("mediaSession" in navigator) navigator.mediaSession.metadata = null;
}

export function setRepeat(v: boolean): void {
  set({ repeat: v });
}

export function setSpeed(v: number): void {
  if (el) el.playbackRate = v;
  set({ speed: v });
}

/** Menit sampai berhenti; 0 mematikan pengatur waktu. */
export function setSleep(min: number): void {
  set({ sleepAt: min > 0 ? Date.now() + min * 60_000 : null });
}

/** Ganti qari. Kalau sedang memutar, ayat yang sama diulang dengan rekaman
 *  qari baru; kalau dijeda, rekaman baru dimuat tanpa diputar. */
export function setReciter(id: string): void {
  writePrefs({ reciter: id });
  const t = state.track;
  if (!t) return;
  const wasPlaying = state.playing;
  const a = audio();
  a.src = audioUrl(id, t.s, t.n);
  warmed = "";
  set({ duration: 0, loading: wasPlaying });
  if (wasPlaying) void a.play().catch(() => set({ playing: false }));
  updateSession(t);
}

/* ─── antrean ─── */

/** Semua ayat satu surah, dari `dari` sampai akhir. */
export function surahQueue(s: number, dari = 1): Track[] {
  const total = SURAH[s - 1].ayat;
  return Array.from({ length: total - dari + 1 }, (_, i) => ({ s, n: dari + i }));
}

/** Ayat-ayat satu juz (bisa lintas surah). */
export function rangeQueue(rentang: readonly { surah: number; dari: number; sampai: number }[]): Track[] {
  return rentang.flatMap((r) =>
    Array.from({ length: r.sampai - r.dari + 1 }, (_, i) => ({ s: r.surah, n: r.dari + i })),
  );
}
