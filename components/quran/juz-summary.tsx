"use client";

/* — Ringkasan progres + catatan acuan mushaf di halaman indeks juz.
 *
 * Dulu berkas ini juga memuat grid 30 kartu juz. Grid itu kini digantikan
 * `JuzFolder` (pengelompokan 3 × 10 dengan komponen Folder) supaya daftar
 * juz tidak tampil dua kali di halaman yang sama.
 */

import type { JuzInfo } from "@/lib/api/juz";
import { useJuzProgress } from "@/lib/store/juz-progress";

export function JuzSummary({ list }: { list: JuzInfo[] }) {
  const done = useJuzProgress();
  const totalAyat = list.reduce((a, j) => a + j.jumlahAyat, 0);
  const sudah = list.filter((j) => done.has(j.nomor)).length;

  return (
    <div className="juz-summary">
      <div className="juz-summary__item">
        <b>{list.length}</b>
        <span>juz</span>
      </div>
      <div className="juz-summary__item">
        <b>{totalAyat.toLocaleString("id-ID")}</b>
        <span>ayat</span>
      </div>
      <div className="juz-summary__item">
        <b>{sudah}</b>
        <span>sudah dibaca</span>
      </div>
      <div className="juz-summary__bar" aria-hidden="true">
        <span style={{ transform: `scaleX(${list.length ? sudah / list.length : 0})` }} />
      </div>
    </div>
  );
}

export function JuzNote() {
  return (
    <aside className="juz-note" aria-label="Catatan pembagian juz">
      <p className="juz-note__title">Tentang pembagian juz di halaman ini</p>
      <p className="juz-note__body">
        Pembagian mengikuti <b>Mushaf Standar Indonesia</b> (Kemenag/LPMQ) — sama
        dengan mushaf yang dicetak dan dipakai di masjid serta pesantren Indonesia.
        Mushaf Madinah membagi beberapa batas juz sedikit berbeda; contohnya{" "}
        <b>Juz 6</b> di sini berakhir di <b>Al-Ma&rsquo;idah 82</b>, sedangkan versi
        Madinah berakhir di Al-Ma&rsquo;idah 81. Totalnya tetap sama:{" "}
        <b>30 juz, 6.236 ayat</b>.
      </p>
      <p className="juz-note__body" style={{ marginTop: "var(--space-2)" }}>
        <b>Juz 1</b> dimulai dari <b>Al-Fatihah</b> (7 ayat) lalu berlanjut ke{" "}
        <b>Al-Baqarah 1–141</b> — 148 ayat. Juz ini juga disebut{" "}
        <i>Juz Alif Lam Mim</i>, diambil dari ayat pertama Al-Baqarah.
      </p>
    </aside>
  );
}
