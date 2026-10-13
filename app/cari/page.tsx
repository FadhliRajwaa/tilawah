import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPanel } from "@/components/quran/search-panel";
import { PageHead } from "@/components/page-head";

export const metadata: Metadata = {
  title: "Cari Ayat — Pencarian Terjemahan Al-Qur'an",
  description:
    "Cari kata dalam terjemahan Indonesia Al-Qur'an — misalnya 'sabar', 'yatim', 'syukur' — lalu langsung menuju ayatnya untuk membaca lengkap dengan tafsir.",
};

export default function CariPage() {
  return (
    <>
      <PageHead
        eyebrow="Pencarian"
        title="Cari dalam Al-Qur'an"
        desc="Pencarian kata pada terjemahan Kemenag. Ketik kata kunci dalam bahasa Indonesia — hasil menampilkan nomor surah dan ayat, siap dibuka."
        variant="tex-lamp"
        caption="Lampu masjid — cahaya yang menerangi pencarian"
        position="center 46%"
        intensity={0.88}
      />

      <div className="container-page section--tight">
        <Suspense>
          <SearchPanel />
        </Suspense>
      </div>
    </>
  );
}
