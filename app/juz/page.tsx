import type { Metadata } from "next";
import { JUZ } from "@/lib/data/juz";
import { JuzFolder } from "@/components/quran/juz-folder";
import { JuzSummary, JuzNote } from "@/components/quran/juz-summary";
import { PageHead } from "@/components/page-head";

export const metadata: Metadata = {
  title: "30 Juz Al-Qur'an",
  description:
    "Indeks 30 juz Al-Qur'an lengkap: rentang surah, jumlah ayat, dan tautan langsung untuk membaca tiap juz dengan terjemahan Kemenag, tafsir, dan murottal.",
};

export default function JuzPage() {
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
        <JuzSummary list={JUZ} />
        <JuzNote />
        <JuzFolder list={JUZ} />
      </div>
    </>
  );
}
