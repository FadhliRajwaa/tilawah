"use client";

/* — Kartu "lanjut baca": muncul hanya jika ada riwayat di perangkat.
 *
 * Dulu seluruh gayanya ditulis inline (display flex, gap, fontSize, dsb.)
 * sehingga tidak bisa ikut tema dan sulit diubah. Sekarang memakai kelas
 * `.resume` + `.card` dari design system.
 */

import Link from "next/link";
import { useLastRead } from "@/lib/store/bookmark";
import { timeAgo } from "@/lib/utils";

export function LastReadCard() {
  const [lr] = useLastRead();
  if (!lr) return null;

  return (
    <section className="section--tight container-page" aria-label="Lanjut baca">
      <div className="card resume">
        <div>
          <p className="resume__label">Lanjut baca</p>
          <p className="resume__title">
            {lr.namaLatin} · Ayat {lr.ayat}
          </p>
          <p className="resume__time">Terakhir dibaca {timeAgo(lr.ts)}</p>
        </div>
        <Link href={`/surat/${lr.nomor}?ayat=${lr.ayat}`} className="btn btn--primary">
          Lanjutkan
        </Link>
      </div>
    </section>
  );
}
