"use client";

/* — Indeks juz: pemilih kelompok + daftar juz.
 *
 * ⚠️ Rombak dari komponen Folder 3D (593 baris + motion).
 *
 * Alasan: folder yang membuka dengan kartu berhamburan itu menarik sekali
 * dilihat, tapi ia menuntut tiga hal yang tidak cocok untuk halaman indeks:
 *
 *  1. Beban. Setiap folder merender puluhan node SVG + `mix-blend-mode` +
 *     animasi spring. Tiga folder berdampingan = tiga beban itu sekaligus,
 *     untuk sesuatu yang hanya perlu DIKLIK SEKALI.
 *  2. Ruang. Folder butuh kotak setinggi 200px (150px di tablet, 96px di
 *     ponsel) hanya untuk wadahnya — hampir seperempat layar ponsel habis
 *     untuk tiga ikon.
 *  3. Kejelasan. Yang dicari pengunjung adalah "juz berapa", bukan "bentuk
 *     foldernya". Angka besar menjawab itu langsung; animasi tidak.
 *
 * Bentuk barunya: angka rentang sebagai jangkar visual (display, besar),
 * label, dan hitungan selesai. Hierarki tetap ada — kelompok aktif ditandai
 * warna aksen + latar, bukan oleh gerakan.
 */

import { useState } from "react";
import Link from "next/link";
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
      {/* — pemilih kelompok — */}
      <div className="juz-folder__row" role="group" aria-label="Pilih kelompok juz">
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
              <span className="juz-folder__pick-num" aria-hidden="true">
                {k.dari}
                <span>–</span>
                {k.sampai}
              </span>
              <span className="juz-folder__pick-label">{k.label}</span>
              <span className="juz-folder__pick-count">
                {selesai}/10 selesai
              </span>
            </button>
          );
        })}
      </div>

      {/* — daftar juz dalam kelompok terpilih — */}
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
