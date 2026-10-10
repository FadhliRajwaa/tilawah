import type { Metadata } from "next";
import { getJuzList, type JuzInfo } from "@/lib/api/juz";
import { JuzFolder } from "@/components/quran/juz-folder";
import { JuzSummary, JuzNote } from "@/components/quran/juz-summary";
import { PageHead } from "@/components/page-head";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "30 Juz Al-Qur'an",
  description:
    "Indeks 30 juz Al-Qur'an lengkap: rentang surah, jumlah ayat, dan tautan langsung untuk membaca tiap juz dengan terjemahan Kemenag, tafsir, dan murottal.",
};

export default async function JuzPage() {
  let list: JuzInfo[] = [];
  let error = false;
  try {
    list = await getJuzList();
  } catch {
    error = true;
  }

  return (
    <>
      <PageHead
        eyebrow="Pembagian mushaf"
        title="30 Juz"
        desc="Al-Qur'an dibagi menjadi 30 juz agar mudah dibaca bertahap — satu juz per hari menyelesaikan khatam dalam sebulan."
        variant="hero-arch-blue"
        caption="Lengkung arkade masjid"
        position="center 42%"
        intensity={0.9}
        orb
        priority
      >
        <p className="juz-acuan">Mengikuti Mushaf Standar Indonesia (Kemenag/LPMQ)</p>
      </PageHead>

      <div className="container-page section--tight">
        {error ? (
          <div className="error-banner" role="alert">
            Gagal memuat daftar juz. Sumber data sedang tidak dapat diakses — coba
            muat ulang halaman sebentar lagi.
          </div>
        ) : list.length === 0 ? (
          <div className="empty">
            <p className="empty__title">Daftar juz kosong</p>
            <p className="empty__desc">
              Data juz belum tersedia. Coba muat ulang halaman sebentar lagi.
            </p>
          </div>
        ) : (
          <>
            <JuzSummary list={list} />
            <JuzNote />
            <JuzFolder list={list} />
          </>
        )}
      </div>
    </>
  );
}
