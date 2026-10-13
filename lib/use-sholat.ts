"use client";

/* — Hook jadwal sholat: kota tersimpan + jadwal harian + hitung mundur.
 *
 * ⚠️ Diekstrak dari duplikasi antara `components/home/home-prayer.tsx` dan
 * `components/ibadah/sholat-panel.tsx`. Keduanya menyalin hal yang sama
 * (~40 baris): baca kota dari localStorage, ambil jadwal lewat route
 * handler, detak 1 detik, dan cari waktu wajib berikutnya.
 *
 * Yang berbeda hanyalah apa yang ditampilkan. Jadi yang sama tinggal di sini,
 * dan tiap komponen memakai hasilnya sesuai kebutuhan:
 *
 *   · beranda  → hanya lima waktu wajib, tanpa tabel bulanan
 *   · panel    → delapan waktu + tabel bulanan + pemilih kota
 *
 * `now` sengaja di-return sebagai nilai (bukan hanya dipakai internal)
 * supaya pemanggil bisa menampilkan tanggal hari ini tanpa perlu timer
 * sendiri — timer kedua akan berdetak di waktu yang berbeda dari yang
 * pertama, dan tanggalnya bisa terlihat "melompat".
 */

import { useEffect, useMemo, useState } from "react";
import type { JadwalHarian } from "@/lib/types";
import { WAKTU_WAJIB, LABEL_WAKTU } from "@/lib/waktu-sholat";
import { secondsUntil } from "@/lib/utils";

const KEY = "tilawah:kota";

export interface KotaSimpan {
  id: string;
  lokasi: string;
}

/** Baca kota tersimpan. Aman di server (mengembalikan null). */
export function readKota(): KotaSimpan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as KotaSimpan) : null;
  } catch {
    return null;
  }
}

/** Simpan kota pilihan. Gagal senyap kalau storage penuh / private mode. */
export function writeKota(k: KotaSimpan): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(k));
  } catch {
    /* abaikan */
  }
}

export interface WaktuBerikut {
  key: string;
  label: string;
  time: string;
  seconds: number;
}

/**
 * Cari waktu sholat wajib berikutnya dari jadwal hari ini.
 *
 * Kalau semua sudah lewat, hasilnya Subuh BESOK — dan labelnya menyebut
 * "besok" supaya tidak terlihat seperti Subuh hari ini yang salah hitung.
 */
export function hitungWaktuBerikut(jadwal: JadwalHarian, now: Date): WaktuBerikut {
  for (const k of WAKTU_WAJIB) {
    const s = secondsUntil(jadwal[k], now);
    if (s > 0) {
      return { key: k, label: LABEL_WAKTU[k], time: jadwal[k], seconds: s };
    }
  }
  return {
    key: "subuh",
    label: "Subuh (besok)",
    time: jadwal.subuh,
    seconds: secondsUntil(jadwal.subuh, now) + 86400,
  };
}

/** Tanggal lokal dalam format YYYY-MM-DD.
 *
 *  `toISOString()` TIDAK dipakai: ia mengonversi ke UTC, sehingga di WIB
 *  (UTC+7) tanggalnya bisa meleset satu hari untuk waktu sebelum 07:00 —
 *  dan baris "hari ini" di tabel bulanan jadi menyorot tanggal yang salah. */
export function tanggalLokal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

interface Opsi {
  /** Ambil juga jadwal bulanan (dipakai panel, tidak dipakai beranda) */
  bulanan?: boolean;
}

export function useSholat({ bulanan: ambilBulanan = false }: Opsi = {}) {
  const [kota, setKota] = useState<KotaSimpan | null>(null);
  const [jadwal, setJadwal] = useState<JadwalHarian | null>(null);
  const [bulanan, setBulanan] = useState<JadwalHarian[] | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  /* Kota tersimpan — dibaca setelah mount karena localStorage tidak ada
     di server (membacanya saat render akan memicu hydration mismatch). */
  useEffect(() => {
    setKota(readKota());
  }, []);

  /* Ambil jadwal lewat route handler (cache 1 jam di server) */
  useEffect(() => {
    if (!kota) return;
    let cancelled = false;
    setLoading(true);
    setErr(null);

    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();

    const reqs: Promise<unknown>[] = [
      fetch(`/api/sholat?id=${kota.id}&y=${y}&m=${m}&d=${day}`).then((r) => r.json()),
    ];
    if (ambilBulanan) {
      reqs.push(fetch(`/api/sholat?id=${kota.id}&y=${y}&m=${m}`).then((r) => r.json()));
    }

    Promise.all(reqs)
      .then(([h, b]) => {
        if (cancelled) return;
        const harian = h as JadwalHarian;
        if (harian?.subuh) setJadwal(harian);
        else setErr("Jadwal tidak tersedia untuk kota ini.");
        if (ambilBulanan && Array.isArray(b)) setBulanan(b as JadwalHarian[]);
      })
      .catch(() => {
        if (!cancelled) setErr("Gagal memuat jadwal. Periksa koneksi lalu coba lagi.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [kota, ambilBulanan]);

  /* Detak hitung mundur. Satu interval untuk seluruh komponen — bukan satu
     per bagian yang menampilkan waktu. */
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const berikut = useMemo(
    () => (jadwal ? hitungWaktuBerikut(jadwal, new Date(now)) : null),
    [jadwal, now],
  );

  const todayDate = useMemo(() => tanggalLokal(new Date(now)), [now]);

  const pilihKota = (k: KotaSimpan) => {
    setKota(k);
    writeKota(k);
  };

  return { kota, jadwal, bulanan, berikut, now, todayDate, loading, err, pilihKota };
}
