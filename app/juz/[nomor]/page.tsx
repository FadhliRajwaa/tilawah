import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getJuzAyah, getJuzInfo } from "@/lib/api/juz";
import { JuzReader } from "@/components/quran/juz-reader";
import { AmbientImage } from "@/components/ambient-image";
import { CornerFlourish } from "@/components/ornaments";
import { toArabicNumber } from "@/lib/utils";

export const revalidate = 86400;

/** Prerender 30 halaman juz (ISR harian). */
export async function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({ nomor: String(i + 1) }));
}

interface Params {
  params: Promise<{ nomor: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { nomor } = await params;
  const n = Number(nomor);
  if (!Number.isInteger(n) || n < 1 || n > 30) return { title: "Juz tidak ditemukan" };
  try {
    const info = await getJuzInfo(n);
    return {
      title: `Juz ${n} — ${info.jumlahAyat} Ayat, Arab & Terjemahan`,
      description: `Baca Juz ${n} Al-Qur'an lengkap (${info.label}) — ${info.jumlahAyat} ayat dengan teks mushaf, terjemahan Kemenag, tafsir per ayat, dan murottal 6 qari.`,
      alternates: { canonical: `/juz/${n}` },
      openGraph: {
        title: `Juz ${n} — Tilawah`,
        description: `${info.jumlahAyat} ayat · ${info.label}`,
      },
    };
  } catch {
    return { title: `Juz ${n}` };
  }
}

export default async function JuzDetailPage({ params }: Params) {
  const { nomor } = await params;
  const n = Number(nomor);
  if (!Number.isInteger(n) || n < 1 || n > 30) notFound();

  let info;
  let ayat;
  try {
    [info, ayat] = await Promise.all([getJuzInfo(n), getJuzAyah(n)]);
  } catch {
    return (
      <div className="container-page" style={{ paddingBlock: "var(--space-8)" }}>
        <div className="error-banner" role="alert">
          Gagal memuat Juz {n}. Sumber data sedang tidak dapat diakses — silakan coba
          beberapa saat lagi.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* — header juz — */}
      <header className="surah-head">
        <AmbientImage
          variant="tex-dome-detail"
          mode="plate"
          intensity={0.5}
          position="center 40%"
        />
        <div className="surah-head__veil" aria-hidden="true" />
        <CornerFlourish className="surah-head__corner surah-head__corner--tl" />
        <CornerFlourish className="surah-head__corner surah-head__corner--br" />
        <div className="surah-head__inner container-page on-ambient">
          <p className="surah-head__eyebrow">Pembagian mushaf</p>
          <span className="surah-head__name-ar" lang="ar" dir="rtl" aria-hidden="true">
            {toArabicNumber(n)}
          </span>
          <h1 className="surah-head__name">Juz {n}</h1>
          <div className="surah-head__meta">
            <span>
              <b>{info.jumlahAyat}</b> ayat
            </span>
            <span>
              <b>{info.surahList.length}</b> surah
            </span>
            <span>{info.label}</span>
          </div>
        </div>
      </header>

      {/* — navigasi antar juz — */}
      <nav className="surah-nav container-page" aria-label="Navigasi antar juz">
        {n > 1 ? (
          <Link href={`/juz/${n - 1}`} className="btn btn--outline surah-nav__btn">
            <span aria-hidden="true">←</span>
            <span className="surah-nav__label">Juz {n - 1}</span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        <Link href="/juz" className="section__link surah-nav__mid">
          Semua juz
        </Link>
        {n < 30 ? (
          <Link href={`/juz/${n + 1}`} className="btn btn--outline surah-nav__btn">
            <span className="surah-nav__label">Juz {n + 1}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </nav>

      <Suspense
        fallback={
          <div
            className="container-page skeleton"
            style={{ height: 400, marginTop: 24 }}
            aria-hidden="true"
          />
        }
      >
        <JuzReader juzNomor={n} ayat={ayat} />
      </Suspense>
    </>
  );
}
