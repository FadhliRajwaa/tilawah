/* — Footer: ajakan + tautan + atribusi.
 *
 * Tanpa foto latar: CTA penutup bergambar dihapus — ia duplikat dengan banner
 * penutup beranda ("Satu ayat hari ini…") yang muncul tepat di atasnya di
 * halaman utama, dan di halaman lain ia memuat gambar besar hanya untuk dua
 * tombol. Ajakan satu baris + tombol cukup. */

import Link from "@/components/smart-link";
import { Logo } from "./logo";

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
      {/* — ajakan penutup — */}
      <div className="foot-cta container-page">
        <p className="foot-cta__title">
          Satu ayat hari ini lebih baik daripada seribu nanti.
        </p>
        <div className="foot-cta__actions">
          <Link href="/surat/36" className="btn btn--primary">
            Baca Yasin
          </Link>
          <Link href="/surat" className="btn btn--outline">
            Semua surah
          </Link>
        </div>
      </div>

      {/* — wordmark + kolom tautan — */}
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

      {/* — atribusi — */}
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
