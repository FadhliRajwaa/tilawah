"use client";

/* — Kartu "lanjut baca": muncul hanya jika ada riwayat di perangkat.
 *
 * Dulu seluruh gayanya ditulis inline (display flex, gap, fontSize, dsb.)
 * sehingga tidak bisa ikut tema dan sulit diubah. Sekarang memakai kelas
 * `.resume` + `.card` dari design system.
 */

import Link from "@/components/smart-link";
import { SURAH } from "@/lib/data/surah";
import { resumeHref, useLastRead } from "@/lib/store/progress";
import { timeAgo } from "@/lib/utils";

export function LastReadCard() {
  const lr = useLastRead();
  if (!lr) return null;

  return (
    <section className="section--tight container-page" aria-label="Lanjut baca">
      <div className="card resume">
        <div>
          <p className="resume__label">Lanjut baca</p>
          <p className="resume__title">
            {SURAH[lr.nomor - 1].latin} · Ayat {lr.ayat}
          </p>
          <p className="resume__time">Terakhir dibaca {timeAgo(lr.ts)}</p>
        </div>
        <Link href={resumeHref(lr)} className="btn btn--primary">
          Lanjutkan
        </Link>
      </div>
    </section>
  );
}
