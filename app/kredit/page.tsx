import type { Metadata } from "next";
import Link from "next/link";
import { OrnamentDivider } from "@/components/ornaments";
import { CREDITS } from "@/lib/data/credits";

export const metadata: Metadata = {
  title: "Kredit & Lisensi",
  description:
    "Sumber data, gambar, dan lisensi yang digunakan di Tilawah — termasuk atribusi gambar berlisensi Creative Commons dan domain publik.",
};

export default function KreditPage() {
  const credits = CREDITS;

  return (
    <div className="container-page" style={{ paddingBlock: "var(--space-8)", maxWidth: "62rem" }}>
      <header style={{ textAlign: "center", marginBottom: "var(--space-7)" }}>
        <p className="surah-head__eyebrow">Transparansi</p>
        <h1 className="section__title" style={{ fontSize: "var(--text-3xl)", marginTop: "var(--space-3)" }}>
          Kredit &amp; Lisensi
        </h1>
        <p className="section__sub" style={{ maxInlineSize: "56ch", marginInline: "auto" }}>
          Tilawah berdiri di atas karya orang lain. Berikut sumber data dan gambar
          yang dipakai — lengkap dengan lisensinya.
        </p>
        <div style={{ marginTop: "var(--space-5)" }}>
          <OrnamentDivider className="ornament-divider" />
        </div>
      </header>

      {/* — data — */}
      <section aria-labelledby="kredit-data" style={{ marginBottom: "var(--space-8)" }}>
        <h2 id="kredit-data" className="section__title" style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-4)" }}>
          Sumber data
        </h2>
        <ul className="credit-list">
          <li>
            <strong>Teks Al-Qur&rsquo;an, terjemahan &amp; tafsir</strong> — Kementerian
            Agama RI, diakses melalui{" "}
            <a href="https://equran.id" target="_blank" rel="noopener noreferrer">
              equran.id
            </a>
            .
          </li>
          <li>
            <strong>Audio murottal 6 qari</strong> — CDN equran.id.
          </li>
          <li>
            <strong>Asmaul Husna &amp; doa harian</strong> —{" "}
            <a href="https://islamic-api-zhirrr.vercel.app" target="_blank" rel="noopener noreferrer">
              Islamic API
            </a>
            .
          </li>
          <li>
            <strong>Jadwal sholat 518 kota</strong> —{" "}
            <a href="https://api.myquran.com" target="_blank" rel="noopener noreferrer">
              myquran.com
            </a>
            .
          </li>
          <li>
            <strong>Pencarian terjemahan</strong> —{" "}
            <a href="https://alquran.cloud" target="_blank" rel="noopener noreferrer">
              alquran.cloud
            </a>
            .
          </li>
          <li>
            <strong>Font mushaf LPMQ Isep Misbah</strong> — Lajnah Pentashihan Mushaf
            Al-Qur&rsquo;an, Kemenag RI.
          </li>
          <li>
            <strong>Font Latin</strong> — Fraunces (SIL Open Font License) · Switzer
            (Fontshare, gratis untuk penggunaan komersial).
          </li>
        </ul>
      </section>

      {/* — gambar — */}
      <section aria-labelledby="kredit-gambar">
        <h2 id="kredit-gambar" className="section__title" style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>
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
              Berkas <code>public/images/credits.json</code> belum tersedia.
            </p>
          </div>
        ) : (
          <div className="credit-grid">
            {credits.map((c) => (
              <article key={c.name} className="credit-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/${c.files.sm?.webp ?? Object.values(c.files)[0].webp}`}
                  alt=""
                  width={320}
                  height={180}
                  loading="lazy"
                  className="credit-card__thumb"
                />
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
