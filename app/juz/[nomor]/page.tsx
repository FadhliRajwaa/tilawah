import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getJuzAyah, getJuzInfo } from "@/lib/api/juz";
import { JuzReader } from "@/components/quran/juz-reader";
import { ReaderSkeleton } from "@/components/quran/reader-skeleton";
import { ReaderHead } from "@/components/reader-head";
import { PageNav } from "@/components/page-nav";
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
      {/* — header juz (latar dipaku ke viewport) — */}
      <ReaderHead
        variant="tex-dome-detail"
        caption="Detail kubah — geometri Islam"
        position="center 40%"
        intensity={0.9}
      >
        <p className="reader-head__eyebrow">Pembagian mushaf</p>
        <span className="reader-head__name-ar" lang="ar" dir="rtl" aria-hidden="true">
          {toArabicNumber(n)}
        </span>
        <h1 className="reader-head__name">Juz {n}</h1>
        <div className="reader-head__meta">
          <span>
            <b>{info.jumlahAyat}</b> ayat
          </span>
          <span>
            <b>{info.surahList.length}</b> surah
          </span>
          <span>{info.label}</span>
        </div>
      </ReaderHead>

      {/* — navigasi antar juz — */}
      <PageNav
        ariaLabel="Navigasi antar juz"
        prev={n > 1 ? { href: `/juz/${n - 1}`, label: `Juz ${n - 1}` } : null}
        next={n < 30 ? { href: `/juz/${n + 1}`, label: `Juz ${n + 1}` } : null}
        indeks={{ href: "/juz", label: "Semua juz" }}
      />

      <Suspense fallback={<ReaderSkeleton ayah={6} />}>
        <JuzReader juzNomor={n} ayat={ayat} />
      </Suspense>
    </>
  );
}
