import type { Metadata } from "next";
import { getJuzList, type JuzInfo } from "@/lib/api/juz";
import { JuzFolder } from "@/components/quran/juz-folder";
import { JuzSummary, JuzNote } from "@/components/quran/juz-summary";
import { AmbientImage } from "@/components/ambient-image";
import { Orb } from "@/components/orb";
import { OrnamentDivider } from "@/components/ornaments";

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
      <header className="page-head page-head--tall">
        <AmbientImage
          variant="hero-arch-blue"
          mode="plate"
          intensity={0.6}
          position="center 42%"
          priority
        />
        <Orb size={440} color="#109BDA" className="orb-host--page" delay={900} />
        <div className="page-head__veil" aria-hidden="true" />
        <div className="container-page page-head__inner on-ambient">
          <p className="surah-head__eyebrow">Pembagian mushaf</p>
          <h1 className="section__title" style={{ fontSize: "var(--text-3xl)", marginTop: "var(--space-3)" }}>
            30 Juz
          </h1>
          <p className="section__sub" style={{ maxWidth: "56ch", marginInline: "auto" }}>
            Al-Qur&rsquo;an dibagi menjadi 30 juz agar mudah dibaca bertahap — satu juz
            per hari menyelesaikan khatam dalam sebulan.
          </p>
          <p className="juz-acuan">Mengikuti Mushaf Standar Indonesia (Kemenag/LPMQ)</p>
          <div style={{ marginTop: "var(--space-5)" }}>
            <OrnamentDivider className="ornament-divider" />
          </div>
        </div>
      </header>

      <div className="container-page" style={{ paddingBlock: "var(--space-7)" }}>
        {error ? (
          <div className="error-banner" role="alert">
            Gagal memuat daftar juz. Sumber data sedang tidak dapat diakses — coba
            muat ulang sebentar lagi.
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
