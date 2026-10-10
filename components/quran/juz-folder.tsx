"use client";

/* — Indeks juz berbentuk folder (rare-ui Folder).
 *
 * Tiga folder mewakili tiga kelompok juz (1–10, 11–20, 21–30). Memilih salah
 * satu menampilkan kartu juz di dalam kelompok itu.
 *
 * Catatan pemakaian komponen Folder di sini:
 * - `interactive={false}` → folder jadi ikon dekoratif; klik diterima tombol
 *   pembungkusnya, bukan ditelan folder (perilaku aslinya membuka-tutup flap).
 * - `color="tilawah"` → palet krem + hijau + emas, bukan tema bawaan
 *   hitam/putih/biru.
 * - `size="sm"` + wadah bertinggi tetap → tiga tombol tetap sejajar walau
 *   animasi spring foldernya sedang berjalan.
 */

import { useState } from "react";
import Link from "next/link";
import { Folder } from "@/components/ui/folder";
import type { JuzInfo } from "@/lib/api/juz";
import { useJuzProgress } from "@/lib/store/juz-progress";
import { cn, toArabicNumber } from "@/lib/utils";

interface Kelompok {
  label: string;
  dari: number;
  sampai: number;
}

const KELOMPOK: Kelompok[] = [
  { label: "Juz 1 – 10", dari: 1, sampai: 10 },
  { label: "Juz 11 – 20", dari: 11, sampai: 20 },
  { label: "Juz 21 – 30", dari: 21, sampai: 30 },
];

export function JuzFolder({ list }: { list: JuzInfo[] }) {
  const [aktif, setAktif] = useState(0);
  const done = useJuzProgress();

  const kelompok = KELOMPOK[aktif];
  const isi = list.filter((j) => j.nomor >= kelompok.dari && j.nomor <= kelompok.sampai);

  return (
    <div className="juz-folder">
      {/* pemilih kelompok — tiap tombol berisi satu folder dekoratif */}
      <div className="juz-folder__row">
        {KELOMPOK.map((k, i) => {
          const selesai = list.filter(
            (j) => j.nomor >= k.dari && j.nomor <= k.sampai && done.has(j.nomor),
          ).length;
          return (
            <button
              key={k.label}
              type="button"
              className={cn("juz-folder__pick", aktif === i && "is-active")}
              onClick={() => setAktif(i)}
              aria-pressed={aktif === i}
            >
              <span className="juz-folder__pick-folder" aria-hidden="true">
                {/* Folder dibiarkan interaktif: hover menaikkan kartu, klik
                 * membuka penuh. Klik juga tetap memilih kelompok karena
                 * event-nya naik ke tombol pembungkus. */}
                <Folder color="tilawah" size="sm" fit />
              </span>
              <span className="juz-folder__pick-label">{k.label}</span>
              <span className="juz-folder__pick-count">
                {selesai}/10 selesai
              </span>
            </button>
          );
        })}
      </div>

      {/* daftar juz dalam kelompok terpilih */}
      <div className="juz-folder__grid">
        {isi.map((j) => (
          <Link
            key={j.nomor}
            href={`/juz/${j.nomor}`}
            className={cn("juz-chip", done.has(j.nomor) && "is-done")}
          >
            <span className="juz-chip__num">{j.nomor}</span>
            <span className="juz-chip__body">
              <span className="juz-chip__label">Juz {j.nomor}</span>
              <span className="juz-chip__range">{j.label}</span>
            </span>
            <span className="juz-chip__ar" lang="ar" dir="rtl" aria-hidden="true">
              {toArabicNumber(j.nomor)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
