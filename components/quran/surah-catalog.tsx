"use client";

/* — Katalog surat: INDEKS BERTATA HURUF, bukan grid kartu ————————————
 *
 * ⚠️ Kenapa dirombak dari grid kartu
 *
 * Versi sebelumnya adalah 114 kartu identik dalam grid — pola yang paling
 * sering dipakai template, dan untuk 114 item ia justru menyulitkan: mata
 * harus memindai kotak demi kotak. Daftar isi buku yang baik jauh lebih
 * mudah dibaca: nomor rata, nama rata, keterangan rata — mata bisa
 * menelusuri SATU kolom dengan cepat.
 *
 * Jadi bentuknya sekarang seperti indeks di akhir buku:
 *
 *     1   Al-Fatihah        الفاتحة      Pembukaan · 7 ayat
 *     2   Al-Baqarah        البقرة       Sapi · 286 ayat
 *
 * Nomor memakai angka display besar (Fraunces, tabular) supaya bisa dipindai
 * sekilas. Garis rambut memisahkan baris. Nama Arab duduk di kanan — kolom
 * yang rata, bukan tersebar acak seperti di kartu.
 *
 * Pencarian & filter tetap ada, tapi kini menempel di atas indeks sebagai
 * "kepala halaman" yang tenang — bukan kotak besar yang bersaing dengan isi.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SurahSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "semua" | "Mekah" | "Madinah";

const FILTER: { id: Filter; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "Mekah", label: "Makkiyah" },
  { id: "Madinah", label: "Madaniyah" },
];

export function SurahCatalog({ list }: { list: SurahSummary[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return list.filter((s) => {
      if (filter !== "semua" && s.tempatTurun !== filter) return false;
      if (!term) return true;
      return (
        s.namaLatin.toLowerCase().includes(term) ||
        s.arti.toLowerCase().includes(term) ||
        String(s.nomor) === term ||
        String(s.nomor).padStart(3, "0") === term
      );
    });
  }, [list, q, filter]);

  return (
    <div className="index">
      {/* — kepala indeks: pencarian + saringan — */}
      <div className="index__head">
        <div className="searchbox index__search">
          <input
            type="search"
            className="searchbox__input"
            placeholder="Cari nama, arti, atau nomor…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Cari surah"
          />
        </div>
        <div className="index__filters" role="group" aria-label="Saringan tempat turun">
          {FILTER.map((f) => (
            <button
              key={f.id}
              type="button"
              className={cn("index__filter", filter === f.id && "is-on")}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
            >
              {f.label}
            </button>
          ))}
          <span className="index__count" aria-live="polite">
            {results.length} surah
          </span>
        </div>
      </div>

      {/* — indeks — */}
      {results.length === 0 ? (
        <div className="empty">
          <p className="empty__title">Tidak ada surah yang cocok</p>
          <p className="empty__desc">
            Coba kata kunci lain — misalnya &ldquo;yasin&rdquo;, &ldquo;cahaya&rdquo;, atau
            nomor surah seperti &ldquo;36&rdquo;.
          </p>
        </div>
      ) : (
        <ol className="idx" aria-label="Indeks 114 surah">
          {results.map((s) => (
            <li key={s.nomor} className="idx__row">
              <Link href={`/surat/${s.nomor}`} className="idx__link">
                <span className="idx__num">{s.nomor}</span>

                <span className="idx__body">
                  <span className="idx__name">{s.namaLatin}</span>
                  <span className="idx__meta">
                    {s.arti}
                    <span className="idx__dot" aria-hidden="true">·</span>
                    {s.jumlahAyat} ayat
                    <span className="idx__dot" aria-hidden="true">·</span>
                    {s.tempatTurun === "Mekah" ? "Makkiyah" : "Madaniyah"}
                  </span>
                </span>

                <span className="idx__ar" lang="ar" dir="rtl">
                  {s.nama}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
