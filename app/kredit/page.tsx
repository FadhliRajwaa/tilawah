import type { Metadata } from "next";
import Link from "@/components/smart-link";
import { OrnamentDivider } from "@/components/ornaments";
import { CreditThumb } from "@/components/credit-thumb";
import { MaskedTitle } from "@/components/masked-title";
import { CREDITS } from "@/lib/data/credits";

export const metadata: Metadata = {
  title: "Kredit & Lisensi",
  description:
    "Sumber data, gambar, dan lisensi yang digunakan di Tilawah — termasuk atribusi gambar berlisensi Creative Commons dan domain publik.",
};

/** Sumber data, dipisah dari markup supaya menambah satu cukup satu baris. */
const SUMBER: { judul: string; ket: string; href?: string; label?: string }[] = [
  {
    judul: "Teks Al-Qur'an, terjemahan & tafsir",
    ket: "Kementerian Agama RI",
    href: "https://equran.id",
    label: "equran.id",
  },
  { judul: "Audio murottal 6 qari", ket: "CDN equran.id" },
  {
    judul: "Asmaul Husna & doa harian",
    ket: "Islamic API",
    href: "https://islamic-api-zhirrr.vercel.app",
    label: "islamic-api-zhirrr",
  },
  {
    judul: "Jadwal sholat 518 kota",
    ket: "myquran.com",
    href: "https://api.myquran.com",
    label: "myquran.com",
  },
  {
    judul: "Pencarian terjemahan",
    ket: "alquran.cloud",
    href: "https://alquran.cloud",
    label: "alquran.cloud",
  },
  {
    judul: "Font mushaf LPMQ Isep Misbah",
    ket: "Lajnah Pentashihan Mushaf Al-Qur'an, Kemenag RI",
  },
  { judul: "Font Latin", ket: "Fraunces (SIL OFL) · Switzer (Fontshare)" },
];

export default function KreditPage() {
  const credits = CREDITS;

  return (
    <div className="container-narrow" style={{ paddingBlock: "var(--space-6) var(--space-8)" }}>
      {/* Kepala halaman tanpa foto — bentuknya mengikuti .page-head supaya
          tipografi dan ritmenya konsisten dengan halaman lain. */}
      <header className="page-intro">
        <p className="t-eyebrow">Transparansi</p>
        <MaskedTitle as="h1" className="page-intro__title">Kredit &amp; Lisensi</MaskedTitle>
        <p className="page-intro__desc">
          Tilawah berdiri di atas karya orang lain. Berikut sumber data dan gambar
          yang dipakai — lengkap dengan lisensinya.
        </p>
        <div className="page-intro__ornament">
          <OrnamentDivider className="ornament-divider" />
        </div>
      </header>

      {/* — data — */}
      <section aria-labelledby="kredit-data" style={{ marginBottom: "var(--space-8)" }}>
        <h2 id="kredit-data" className="section__title" style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-4)" }}>
          Sumber data
        </h2>
        <ul className="credit-list">
          {SUMBER.map((s) => (
            <li key={s.judul}>
              <strong>{s.judul}</strong>
              {" — "}
              {s.href && s.label ? (
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="link">
                  {s.ket}
                </a>
              ) : (
                s.ket
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* — gambar — */}
      <section aria-labelledby="kredit-gambar">
        <h2
          id="kredit-gambar"
          className="section__title"
          style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}
        >
          Gambar
        </h2>
        <p className="section__sub" style={{ marginBottom: "var(--space-5)" }}>
          Semua gambar dipakai sebagai tekstur latar dengan penyesuaian warna agar
          menyatu dengan tema. Lisensi tercantum per gambar.
        </p>

        {credits.length === 0 ? (
          <div className="empty">
            <p className="empty__title">Data kredit tidak ditemukan</p>
            <p className="empty__desc">
              Modul <code>lib/data/credits.ts</code> belum berisi entri.
            </p>
          </div>
        ) : (
          <div className="credit-grid">
            {credits.map((c) => (
              <article key={c.name} className="credit-card">
                <CreditThumb credit={c} />
                <div className="credit-card__body">
                  <p className="credit-card__note">{c.note}</p>
                  <p className="credit-card__title">{c.title}</p>
                  <p className="credit-card__meta">
                    <span className="credit-badge">{c.license}</span>
                    {c.artist && <span> · {c.artist}</span>}
                  </p>
                  <a
                    className="credit-card__link"
                    href={c.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lihat sumber asli →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="t-xs t-muted" style={{ marginTop: "var(--space-6)", lineHeight: 1.75 }}>
          Gambar berlisensi CC BY dan CC BY-SA di atas memerlukan atribusi — itulah
          halaman ini. Untuk lisensi CC BY-SA, karya turunan (versi yang disesuaikan
          warna dan potongannya di sini) tetap tunduk pada lisensi yang sama.
        </p>
      </section>

      <div style={{ marginTop: "var(--space-8)", textAlign: "center" }}>
        <Link href="/" className="btn btn--outline">
          ← Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
