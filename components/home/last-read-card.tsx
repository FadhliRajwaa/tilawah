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
import { Reveal } from "@/components/reveal";
import { timeAgo } from "@/lib/utils";

export function LastReadCard() {
  const lr = useLastRead();
  if (!lr) return null;

  return (
    <Reveal as="section" className="section--tight container-page" ariaLabelledby="lanjut-baca" y={16}>
      <div className="card resume" id="lanjut-baca">
        <div>
          <p className="resume__label">Lanjut baca</p>
          <p className="resume__title">
            {SURAH[lr.nomor - 1].latin} · Ayat {lr.ayat}
          </p>
          <p className="resume__time">Terakhir dibaca {timeAgo(lr.ts)}</p>
        </div>
        <Link href={resumeHref(lr)} className="btn btn--primary btn--magnet">
          Lanjutkan
        </Link>
      </div>
    </Reveal>
  );
}
