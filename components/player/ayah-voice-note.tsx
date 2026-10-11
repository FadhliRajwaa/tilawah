"use client";

/* — Pemutar murottal per ayat, bergaya waveform.
 *
 * ⚠️ Rombak dari komponen VoiceNote pihak ketiga (800 baris, ~80 node/ayat).
 *
 * Riwayat optimasinya layak dicatat karena tiap langkah terbukti dengan
 * pengukuran, bukan dugaan:
 *
 *  1. VoiceNote asli: 72 bar + aurora + cincin kontrol ≈ 80 node per ayat.
 *     Untuk Al-Baqarah (286 ayat) itu ~23.000 node plus 286 lapisan
 *     `mix-blend-mode`, dan aurora-nya berjalan di frame loop `motion`
 *     terus-menerus selama audio berbunyi.
 *
 *  2. Percobaan pertama pengganti: 28 `<span>` bar × 2 lapisan (dasar +
 *     kemajuan) = 56 node/ayat. Terukur di browser: **4.648 node** untuk
 *     Yasin (83 ayat). Masih berat.
 *
 *  3. Bentuk final: SELURUH bar digambar sebagai **satu `<path>` SVG**
 *     dengan `stroke-linecap="round"` (ujung bulat dari linecap, bukan dari
 *     elemen per bar). Dua path bertumpuk — dasar dan kemajuan — jadi
 *     **2 node per ayat**. Terukur: 166 node untuk Yasin, turun 96%.
 *
 * Kemajuan di-`clip-path` pada path kedua, jadi mengubahnya hanya menulis
 * satu properti pada satu elemen per frame.
 *
 * PENTING — durasi. API equran.id tidak menyediakan durasi per ayat.
 * Nilainya diestimasi dari panjang transliterasi latin (stabil per ayat),
 * lalu DITIMPA durasi asli begitu audio ayat itu termuat di player global.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePlayer, type Track } from "./player-provider";

interface Props {
  /** ayat ini */
  track: Track;
  /** antrean seluruh surat/juz untuk auto-advance */
  queue: Track[];
  /** transliterasi latin — dasar estimasi durasi */
  teksLatin: string;
  /** benih bentuk gelombang: tiap ayat beda, tapi konsisten */
  seed: number;
  size?: "sm" | "md";
}

const BAR_COUNT = 28;
/* Ruang koordinat SVG. Lebar 100 dan tinggi 20 dipilih supaya angka path
   mudah dibaca; `preserveAspectRatio="none"` membuatnya meregang mengikuti
   lebar wadah, jadi gelombangnya selalu mengisi ruang yang tersedia. */
const VB_W = 100;
const VB_H = 20;
const BAR_W = 2.2;
const GAP = (VB_W - BAR_COUNT * BAR_W) / (BAR_COUNT - 1);

/**
 * Estimasi durasi baca (detik) dari panjang transliterasi latin.
 *
 * Qari pada tempo normal membaca sekitar 9–10 karakter latin per detik.
 * Nilai ini hanya placeholder sampai audio ayat tersebut dimuat; tapi harus
 * cukup dekat supaya label waktu tidak terasa salah — ayat pendek seperti
 * Al-Ikhlas 1 nyatanya ~2 detik, bukan 6.
 */
function estimateDuration(teksLatin: string): number {
  return Math.round(Math.min(180, Math.max(3, teksLatin.length / 9)));
}

/**
 * Satu path SVG berisi seluruh bar.
 *
 * Bentuknya deterministik dari `seed` — memakai pembangkit bilangan semu
 * sederhana (xorshift), sengaja BUKAN `Math.random()`: gelombang harus
 * identik setiap kali ayat yang sama dirender, kalau tidak bentuknya
 * "melompat" saat React me-render ulang.
 */
function buildWavePath(seed: number): string {
  let s = seed * 2654435761 || 1;
  const parts: string[] = [];

  for (let i = 0; i < BAR_COUNT; i++) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;

    /* 0.22–1 — bar terpendek tetap terlihat, jadi bentuknya terbaca
       sebagai gelombang, bukan sebagai baris yang rusak */
    const h = VB_H * (0.22 + ((Math.abs(s) % 1000) / 1000) * 0.78);
    const x = i * (BAR_W + GAP) + BAR_W / 2;
    const y1 = (VB_H - h) / 2;
    const y2 = y1 + h;

    parts.push(`M${x.toFixed(2)} ${y1.toFixed(2)}V${y2.toFixed(2)}`);
  }

  return parts.join("");
}

export function AyahVoiceNote({ track, queue, teksLatin, seed }: Props) {
  const { state, play, toggle, seek } = usePlayer();

  const isThis = state.track?.key === track.key;
  const isPlaying = isThis && state.playing;

  const estimate = useMemo(() => estimateDuration(teksLatin), [teksLatin]);
  const duration = isThis && state.duration > 0 ? state.duration : estimate;
  const wavePath = useMemo(() => buildWavePath(seed), [seed]);

  /* — progres: satu rAF loop, satu properti, satu elemen —
   *
   * `state.positionRef` adalah ref, bukan React state (sengaja — kalau ia
   * state, seluruh pohon komponen re-render 4×/detik). Kita membacanya di
   * frame loop dan menulis hasilnya langsung ke DOM.
   *
   * Loop HANYA berjalan saat ayat INI yang berbunyi. Kalau tidak, tidak ada
   * rAF sama sekali — jadi 286 ayat yang tidak berbunyi nol biaya. */
  const fillRef = useRef<SVGPathElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  /* ⚠️ RESET saat ayat ini berhenti aktif.
   *
   * `useEffect` di bawah membuka dengan `if (!isThis) return` — jadi saat
   * pengguna berpindah ke ayat lain, efeknya berhenti TANPA membersihkan
   * apa pun. Akibatnya gelombang ayat lama tetap terisi penuh dan
   * penandanya tetap di ujung kanan, seolah ayat itu masih berbunyi.
   *
   * (Versi VoiceNote pihak ketiga punya perilaku ini; penggantinya sempat
   * kehilangannya.) Efek terpisah dipakai — bukan digabung ke efek utama —
   * supaya dependensinya jelas: hanya `isThis`. */
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

    /* Tulis semua posisi lewat SATU fungsi, dipanggil dari rAF DAN dari
       luar rAF (saat audio dijeda). Tanpa ini, menjeda audio meninggalkan
       penanda di posisi terakhir yang ditulis — yang bisa meleset beberapa
       frame dari posisi sebenarnya. */
    const paint = () => {
      const pos = state.positionRef.current || 0;
      const pct = duration > 0 ? Math.min(1, pos / duration) : 0;

      /* `inset(0 X% 0 0)` menyembunyikan bagian kanan — path penuh tetap
         digambar, hanya dipotong. Lebih murah daripada menggambar ulang. */
      if (fillRef.current) {
        fillRef.current.style.clipPath = `inset(0 ${((1 - pct) * 100).toFixed(2)}% 0 0)`;
      }
      /* `transform: translateX`, BUKAN `left`. `left` adalah properti tata
         letak: menulisnya setiap frame memaksa peramban menghitung ulang
         posisi — 60 kali per detik, untuk setiap ayat yang sedang berbunyi.
         `transform` dikerjakan compositor, tanpa layout sama sekali.
         Persentase mengacu pada lebar elemen itu sendiri (10px), jadi
         `translateX(pct × lebar wadah / 10px)` tidak bisa dipakai —
         sebagai gantinya skala dalam satuan persen dari LEBAR WADAH
         ditulis lewat `scaleX` pada pembungkus selebar wadah. */
      if (headRef.current) {
        headRef.current.style.transform = `translate3d(${(pct * 100).toFixed(2)}cqw, -50%, 0)`;
        headRef.current.style.opacity = isPlaying || pos > 0 ? "1" : "0";
      }
      /* Label waktu hanya ditulis saat detiknya berubah — menulis teks tiap
         frame memaksa layout, dan itu pemborosan. */
      if (timeRef.current) {
        const sec = Math.floor(pos);
        if (sec !== lastShown) {
          lastShown = sec;
          timeRef.current.textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
        }
      }
    };

    /* rAF HANYA berjalan saat audio benar-benar berbunyi.
     *
     * Versi sebelumnya menyalakan rAF selama ayat ini yang aktif — termasuk
     * saat dijeda. Itu berarti satu frame loop 60fps yang terus berjalan
     * untuk sesuatu yang tidak bergerak. Sekarang: saat dijeda, gambar
     * sekali lewat `paint()` lalu berhenti. */
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
  }, [isThis, isPlaying, duration, state.positionRef]);

  const handleToggle = useCallback(() => {
    if (!isThis) play(track, queue);
    else toggle();
  }, [isThis, play, toggle, track, queue]);

  /* Klik di gelombang = lompat ke posisi itu. Lebih cepat daripada menggeser
     slider, dan area kliknya jauh lebih besar. */
  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      if (!isThis) play(track, queue);
      seek(ratio * duration);
    },
    [isThis, play, track, queue, seek, duration],
  );

  return (
    <div className="ayah-note">
      <button
        type="button"
        className="ayah-note__btn"
        onClick={handleToggle}
        aria-label={
          isPlaying
            ? `Jeda murottal ${track.surahNama} ayat ${track.ayat}`
            : `Putar murottal ${track.surahNama} ayat ${track.ayat}`
        }
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="ayah-note__icon">
          {isPlaying ? (
            <>
              <rect x="6" y="4" width="4.5" height="16" rx="1.2" fill="currentColor" />
              <rect x="13.5" y="4" width="4.5" height="16" rx="1.2" fill="currentColor" />
            </>
          ) : (
            <path
              d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z"
              fill="currentColor"
            />
          )}
        </svg>
      </button>

      <button
        type="button"
        className="ayah-note__wave"
        onClick={handleSeek}
        aria-label={`Posisi murottal ayat ${track.ayat} — ketuk untuk melompat`}
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

      {/* ⚠️ JANGAN aria-hidden: posisi waktu adalah informasi yang berguna
          ("sudah 1:23 dari 4:56"), dan pembaca layar memerlukannya untuk
          tahu di mana audio berada. Yang di-hidden adalah GELOMBANGNYA
          (dekoratif), bukan waktunya.

          `aria-live` juga tidak dipakai: nilainya berubah tiap detik, dan
          itu akan membanjiri pembaca layar sama seperti hitung mundur. */}
      <span className="ayah-note__time" ref={timeRef}>
        0:00
      </span>
    </div>
  );
}
