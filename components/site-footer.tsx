/* — Footer: mast-headed, tiga lapis.
 *
 * Lapis 1 — ajakan menutup halaman (foto diam + ajakan membaca), memberi
 *           akhir yang disengaja, bukan sekadar berhenti.
 * Lapis 2 — wordmark + kolom tautan yang dikelompokkan menurut tujuan
 *           (Jelajah / Ibadah / Tentang), bukan satu baris panjang.
 * Lapis 3 — atribusi & lisensi, kecil dan tenang.
 */

import Link from "next/link";
import { Logo } from "./logo";
import { AmbientImage } from "./ambient-image";
import { PhotoZoom } from "./photo-zoom";

const KOLOM = [
  {
    judul: "Jelajah",
    tautan: [
      { href: "/surat", label: "114 Surah" },
      { href: "/juz", label: "30 Juz" },
      { href: "/cari", label: "Cari ayat" },
    ],
  },
  {
    judul: "Ibadah",
    tautan: [
      { href: "/ibadah?tab=asmaulhusna", label: "Asmaul Husna" },
      { href: "/ibadah?tab=doa", label: "Doa harian" },
      { href: "/ibadah?tab=sholat", label: "Jadwal sholat" },
    ],
  },
  {
    judul: "Tentang",
    tautan: [
      { href: "/bookmark", label: "Ayat tersimpan" },
      { href: "/kredit", label: "Kredit & lisensi" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      {/* — lapis 1: ajakan penutup — */}
      <section className="foot-cta" aria-labelledby="foot-cta-title">
        <AmbientImage
          variant="hero-night-gold"
          mode="plate"
          intensity={0.7}
          position="center 45%"
          parallax
        />
        <div className="foot-cta__veil" aria-hidden="true" />
        <PhotoZoom
          variant="hero-night-gold"
          caption="Masjid saat malam — cahaya keemasan"
          position="center 45%"
          className="foot-cta__zoom"
        />
        <div className="foot-cta__inner container-page">
          <p className="foot-cta__eyebrow">Sebelum menutup</p>
          <h2 id="foot-cta-title" className="foot-cta__title">
            Satu ayat hari ini lebih baik daripada seribu nanti.
          </h2>
          <div className="foot-cta__actions">
            <Link href="/surat/36" className="btn btn--primary">
              Baca Yasin
            </Link>
            <Link href="/surat" className="btn btn--outline">
              Semua surah
            </Link>
          </div>
        </div>
      </section>

      {/* — lapis 2: wordmark + kolom tautan — */}
      <div className="site-footer__inner container-page">
        <div className="site-footer__brand">
          <div className="site-footer__mark">
            <Logo className="footer-star" />
            <span className="site-footer__wordmark">Tilawah</span>
          </div>
          <p className="site-footer__tagline">
            Al-Qur&rsquo;an digital — 114 surat, tafsir Kemenag, murottal 6 qari,
            ibadah harian. Dibuat untuk menemani tilawah setiap hari.
          </p>
        </div>

        <nav className="site-footer__cols" aria-label="Tautan footer">
          {KOLOM.map((k) => (
            <div key={k.judul} className="foot-col">
              <h3 className="foot-col__title">{k.judul}</h3>
              <ul className="foot-col__list">
                {k.tautan.map((t) => (
                  <li key={t.href}>
                    <Link href={t.href}>{t.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* — lapis 3: atribusi — */}
      <div className="site-footer__meta container-page">
        <p>
          Teks Al-Qur&rsquo;an &amp; terjemahan Kemenag via{" "}
          <a href="https://equran.id" rel="noopener noreferrer" target="_blank">
            equran.id
          </a>
          {" · "}tafsir Kemenag{" · "}audio 6 qari{" · "}jadwal sholat{" "}
          <a href="https://myquran.com" rel="noopener noreferrer" target="_blank">
            myquran.com
          </a>
          {" · "}font mushaf LPMQ Isep Misbah (Kemenag).
        </p>
        <p className="site-footer__license">
          Konten suci — mohon laporkan kekeliruan teks. Dibuat untuk memudahkan
          tilawah harian.
        </p>
      </div>
    </footer>
  );
}
