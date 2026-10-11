/* — Navigasi prev / tengah / next antar halaman berurutan.
 *
 * ⚠️ Diekstrak dari duplikasi antara `app/surat/[nomor]/page.tsx` dan
 * `app/juz/[nomor]/page.tsx` — keduanya menulis blok nav yang sama (21 baris),
 * hanya berbeda pada label dan tautannya.
 *
 * Pola tiga slot ini penting untuk tata letak: slot kiri dan kanan punya
 * lebar berbeda (nama surah panjang vs pendek), jadi kalau tombol tengah
 * tidak `flex-shrink: 0`, ia akan bergeser ke kiri-kanan setiap navigasi —
 * dan itu membuat halaman terasa tidak stabil.
 */

import Link from "next/link";

interface Props {
  /** Tautan sebelumnya; `null` kalau ini yang pertama */
  prev: { href: string; label: string } | null;
  /** Tautan berikutnya; `null` kalau ini yang terakhir */
  next: { href: string; label: string } | null;
  /** Tautan kembali ke indeks */
  indeks: { href: string; label: string };
  /** Label grup untuk pembaca layar, mis. "Navigasi antar surah" */
  ariaLabel: string;
}

export function PageNav({ prev, next, indeks, ariaLabel }: Props) {
  return (
    <nav className="surah-nav container-page" aria-label={ariaLabel}>
      {prev ? (
        <Link href={prev.href} className="btn btn--outline surah-nav__btn">
          <span aria-hidden="true">←</span>
          <span className="surah-nav__label">{prev.label}</span>
        </Link>
      ) : (
        /* Slot kosong mempertahankan tata letak tiga kolom walau tidak ada
           tautan — tanpa ini tombol tengah melompat ke kiri di halaman
           pertama. */
        <span aria-hidden="true" />
      )}

      <Link href={indeks.href} className="section__link surah-nav__mid">
        {indeks.label}
      </Link>

      {next ? (
        <Link href={next.href} className="btn btn--outline surah-nav__btn">
          <span className="surah-nav__label">{next.label}</span>
          <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
