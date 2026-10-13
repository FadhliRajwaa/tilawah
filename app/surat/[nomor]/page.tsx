import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSurah } from "@/lib/api/equran";
import { SURAH, surahMeta } from "@/lib/data/surah";
import { Suspense } from "react";
import { Reader } from "@/components/quran/surah-reader";
import { ReaderSkeleton } from "@/components/quran/reader-skeleton";
import { ReaderBar } from "@/components/quran/reader-toolbar";
import { SurahHeadActions } from "@/components/quran/surah-head-actions";
import { ReaderHead } from "@/components/reader-head";
import { PageNav } from "@/components/page-nav";

export const revalidate = 86400;

/** Prerender 114 halaman surat saat build (ISR harian). Tanpa fetch —
 *  nomornya 1–114, selalu. */
export function generateStaticParams() {
  return SURAH.map((s) => ({ nomor: String(s.n) }));
}

interface Params {
  params: Promise<{ nomor: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { nomor } = await params;
  const n = Number(nomor);
  if (!Number.isInteger(n) || n < 1 || n > 114) return { title: "Surah tidak ditemukan" };
  const m = surahMeta(n);
  return {
    title: `Surat ${m.latin} — ${m.ayat} Ayat, Arab & Terjemahan`,
    description: `Baca Surat ${m.latin} (${m.arti}) ${m.ayat} ayat lengkap: teks Arab mushaf, terjemahan Kemenag, tafsir per ayat, dan murottal 6 qari.`,
    alternates: { canonical: `/surat/${n}` },
    openGraph: {
      title: `Surat ${m.latin} — Tilawah`,
      description: `${m.ayat} ayat · ${m.mk ? "Makkiyah" : "Madaniyah"} · ${m.arti}`,
    },
  };
}

export default async function SurahPage({ params }: Params) {
  const { nomor } = await params;
  const n = Number(nomor);
  if (!Number.isInteger(n) || n < 1 || n > 114) notFound();

  let surah;
  try {
    surah = await getSurah(n);
  } catch {
    return (
      <div className="container-page" style={{ paddingBlock: "var(--space-8)" }}>
        <div className="error-banner" role="alert">
          Gagal memuat Surat {n}. Sumber data sedang tidak dapat diakses — silakan
          coba beberapa saat lagi.
        </div>
      </div>
    );
  }

  const meta = surahMeta(n);
  const nextSurah = n < 114 ? { nomor: n + 1, namaLatin: surahMeta(n + 1).latin } : null;

  return (
    <>
      <ReaderHead
        variant="tex-manuscript"
        caption="Manuskrip mushaf — tulisan tangan lama"
        position="center 42%"
        intensity={0.9}
      >
        <p className="reader-head__eyebrow">Surah ke-{surah.nomor}</p>
        <span className="reader-head__name-ar" lang="ar" dir="rtl">
          {meta.ar}
        </span>
        <h1 className="reader-head__name">{surah.namaLatin}</h1>
        <div className="reader-head__meta">
          <span>
            Arti: <b>{surah.arti}</b>
          </span>
          <span>
            <b>{surah.jumlahAyat}</b> ayat
          </span>
          <span>{meta.mk ? "Makkiyah" : "Madaniyah"}</span>
        </div>

        <SurahHeadActions surah={surah} />
      </ReaderHead>

      <PageNav
        ariaLabel="Navigasi antar surah"
        prev={n > 1 ? { href: `/surat/${n - 1}`, label: surahMeta(n - 1).latin } : null}
        next={nextSurah ? { href: `/surat/${n + 1}`, label: nextSurah.namaLatin } : null}
        indeks={{ href: "/surat", label: "Semua surah" }}
      />

      <Suspense fallback={<ReaderSkeleton ayah={5} />}>
      <ReaderBar maxAyat={surah.jumlahAyat} />
      <Reader
        ayat={surah.ayat}
        surahNomor={surah.nomor}
        nextSurah={nextSurah}
      />
      </Suspense>
    </>
  );
}
