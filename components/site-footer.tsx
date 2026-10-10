/* — Footer Ft1 (mast-headed): wordmark + tagline satu band, link kecil di samping. */

import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner container-page">
        <div className="site-footer__brand">
          <div className="site-footer__mark">
            <Logo className="footer-star" />
            <span className="site-footer__wordmark">Tilawah</span>
          </div>
          <p className="site-footer__tagline">
            Al-Qur&rsquo;an digital — 114 surat, tafsir Kemenag, murottal 6 qari,
            ibadah harian.
          </p>
        </div>

        <nav className="site-footer__links" aria-label="Tautan footer">
          <Link href="/surat">Surah</Link>
          <Link href="/ibadah">Ibadah</Link>
          <Link href="/cari">Cari</Link>
          <Link href="/bookmark">Tersimpan</Link>
          <Link href="/kredit">Kredit</Link>
        </nav>
      </div>

      <div className="site-footer__meta container-page">
        <p>
          Teks Al-Qur&rsquo;an &amp; terjemahan Kemenag via{" "}
          <a href="https://equran.id" rel="noopener noreferrer" target="_blank">
            equran.id
          </a>
          {" · "}tafsir Kemenag{" "}
          {" · "}audio 6 qari{" "}
          {" · "}jadwal sholat{" "}
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
