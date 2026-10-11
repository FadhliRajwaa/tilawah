import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSurah, getSurahList, getTafsir } from "@/lib/api/equran";
import { SurahReader } from "@/components/quran/surah-reader";
import { ReaderSkeleton } from "@/components/quran/reader-skeleton";
import { SurahHeadActions } from "@/components/quran/surah-head-actions";
import { ReaderHead } from "@/components/reader-head";
import { PageNav } from "@/components/page-nav";
import type { SurahDetail, TafsirItem } from "@/lib/types";

export const revalidate = 86400;

/** Prerender 114 halaman surat saat build (ISR harian). */
export async function generateStaticParams() {
  try {
    const list = await getSurahList();
    return list.map((s) => ({ nomor: String(s.nomor) }));
  } catch {
    // bila API sedang down saat build, fallback: render on-demand
    return [];
  }
}

interface Params {
  params: Promise<{ nomor: string }>;
}

/** Deskripsi dari API memuat tag HTML mentah (<i>, <b>) dan &nbsp; —
 *  bersihkan agar tidak tampil sebagai teks. */
function cleanDeskripsi(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { nomor } = await params;
  const n = Number(nomor);
  if (!Number.isInteger(n) || n < 1 || n > 114) return { title: "Surah tidak ditemukan" };
  try {
    const s = await getSurah(n);
    return {
      title: `Surat ${s.namaLatin} — ${s.jumlahAyat} Ayat, Arab & Terjemahan`,
      description: `Baca Surat ${s.namaLatin} (${s.arti}) ${s.jumlahAyat} ayat lengkap: teks Arab mushaf, terjemahan Kemenag, tafsir per ayat, dan murottal 6 qari.`,
      alternates: { canonical: `/surat/${n}` },
      openGraph: {
        title: `Surat ${s.namaLatin} — Tilawah`,
        description: `${s.jumlahAyat} ayat · ${s.tempatTurun} · ${s.arti}`,
      },
    };
  } catch {
    return { title: `Surat ${n}` };
  }
}

export default async function SurahPage({ params }: Params) {
  const { nomor } = await params;
  const n = Number(nomor);
  if (!Number.isInteger(n) || n < 1 || n > 114) notFound();

  let surah: SurahDetail;
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

  // tafsir dimuat paralel; kegagalan tidak boleh memblokir pembacaan ayat
  let tafsir: TafsirItem[] | null = null;
  try {
    tafsir = await getTafsir(n);
  } catch {
    tafsir = null;
  }

  const isMekah = surah.tempatTurun === "Mekah";

  return (
    <>
      {/* — header surat: marquee mushaf (latar dipaku ke viewport) — */}
      <ReaderHead
        variant="tex-manuscript"
        caption="Manuskrip mushaf — tulisan tangan lama"
        position="center 42%"
        intensity={0.9}
      >
        <p className="reader-head__eyebrow">Surah ke-{surah.nomor}</p>
        <span className="reader-head__name-ar" lang="ar" dir="rtl">
          {surah.nama}
        </span>
        <h1 className="reader-head__name">{surah.namaLatin}</h1>
        <div className="reader-head__meta">
          <span>
            Arti: <b>{surah.arti}</b>
          </span>
          <span>
            <b>{surah.jumlahAyat}</b> ayat
          </span>
          <span>
            Turun di <b>{isMekah ? "Mekah" : "Madinah"}</b>
          </span>
          <span>{isMekah ? "Makkiyah" : "Madaniyah"}</span>
        </div>

        <SurahHeadActions surah={surah} />

        {surah.deskripsi && (
          <p className="reader-head__desc">{cleanDeskripsi(surah.deskripsi)}</p>
        )}
      </ReaderHead>

      {/* — navigasi surat — */}
      <PageNav
        ariaLabel="Navigasi antar surah"
        prev={
          surah.suratSebelumnya
            ? { href: `/surat/${surah.suratSebelumnya.nomor}`, label: surah.suratSebelumnya.namaLatin }
            : null
        }
        next={
          surah.suratSelanjutnya
            ? { href: `/surat/${surah.suratSelanjutnya.nomor}`, label: surah.suratSelanjutnya.namaLatin }
            : null
        }
        indeks={{ href: "/surat", label: "Semua surah" }}
      />

      {/* — reader — */}
      <Suspense fallback={<ReaderSkeleton ayah={5} />}>
        <SurahReader surah={surah} tafsir={tafsir} />
      </Suspense>
    </>
  );
}
