import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJuzAyah } from "@/lib/api/juz";
import { JUZ } from "@/lib/data/juz";
import { Suspense } from "react";
import { Reader } from "@/components/quran/surah-reader";
import { ReaderSkeleton } from "@/components/quran/reader-skeleton";
import { ReaderBar } from "@/components/quran/reader-toolbar";
import { ReaderHead } from "@/components/reader-head";
import { PageNav } from "@/components/page-nav";
import { toArabicNumber } from "@/lib/utils";

export const revalidate = 86400;

/** Prerender 30 halaman juz (ISR harian). Nomornya 1–30, selalu. */
export function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({ nomor: String(i + 1) }));
}

interface Params {
  params: Promise<{ nomor: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { nomor } = await params;
  const n = Number(nomor);
  if (!Number.isInteger(n) || n < 1 || n > 30) return { title: "Juz tidak ditemukan" };
  const info = JUZ[n - 1];
  return {
    title: `Juz ${n} — ${info.jumlahAyat} Ayat, Arab & Terjemahan`,
    description: `Baca Juz ${n} Al-Qur'an lengkap (${info.label}) — ${info.jumlahAyat} ayat dengan teks mushaf, terjemahan Kemenag, tafsir per ayat, dan murottal 6 qari.`,
    alternates: { canonical: `/juz/${n}` },
    openGraph: {
      title: `Juz ${n} — Tilawah`,
      description: `${info.jumlahAyat} ayat · ${info.label}`,
    },
  };
}

export default async function JuzDetailPage({ params }: Params) {
  const { nomor } = await params;
  const n = Number(nomor);
  if (!Number.isInteger(n) || n < 1 || n > 30) notFound();

  const info = JUZ[n - 1];
  let ayat;
  try {
    ayat = await getJuzAyah(n);
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
            <b>{info.rentang.length}</b> surah
          </span>
          <span>{info.label}</span>
        </div>
      </ReaderHead>

      <PageNav
        ariaLabel="Navigasi antar juz"
        prev={n > 1 ? { href: `/juz/${n - 1}`, label: `Juz ${n - 1}` } : null}
        next={n < 30 ? { href: `/juz/${n + 1}`, label: `Juz ${n + 1}` } : null}
        indeks={{ href: "/juz", label: "Semua juz" }}
      />

      <Suspense fallback={<ReaderSkeleton ayah={6} />}>
      <ReaderBar maxAyat={Math.max(...info.rentang.map((r) => r.sampai))} />
      <Reader
        ayat={ayat}
        surahNomor={info.rentang[0].surah}
        juzNomor={n}
        rentang={info.rentang}
      />
      </Suspense>
    </>
  );
}
