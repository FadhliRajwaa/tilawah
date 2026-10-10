import type { Metadata } from "next";
import { getSurahList } from "@/lib/api/equran";
import { SurahCatalog } from "@/components/quran/surah-catalog";
import { PageHead } from "@/components/page-head";
import { Gallery } from "@/components/gallery";
import type { SurahSummary } from "@/lib/types";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "114 Surah Al-Qur'an",
  description:
    "Daftar lengkap 114 surah Al-Qur'an: nama Arab, arti, jumlah ayat, dan tempat turun. Buka surah untuk membaca dengan terjemahan Kemenag dan tafsir.",
};

export default async function SurahIndexPage() {
  let list: SurahSummary[] = [];
  let error = false;
  try {
    list = await getSurahList();
  } catch {
    error = true;
  }

  return (
    <>
      <PageHead
        eyebrow="Katalog"
        title="114 Surah"
        desc="Seluruh Al-Qur'an — 30 juz, 114 surah, 6.236 ayat. Pilih surah untuk membaca dengan teks mushaf, terjemahan Kemenag, dan tafsir per ayat."
        variant="hero-dome-glass"
        caption="Kubah kaca bermotif geometris"
        position="center 40%"
        intensity={0.9}
        priority
      />

      <div className="container-page section--tight">
        {error ? (
          <div className="error-banner" role="alert">
            Gagal memuat daftar surah. Server sumber data sedang tidak dapat diakses —
            coba muat ulang halaman sebentar lagi.
          </div>
        ) : (
          <SurahCatalog list={list} />
        )}
      </div>

      {/* — galeri penutup: keindahan mushaf & geometri — */}
      <section className="section container-page" aria-labelledby="galeri-katalog">
        <div className="section__head">
          <div>
            <h2 id="galeri-katalog" className="section__title">
              Keindahan yang menemani
            </h2>
            <p className="section__sub">
              Kaligrafi, iluminasi mushaf, dan geometri Islam — warisan yang tetap hidup.
            </p>
          </div>
        </div>
        <Gallery
          items={[
            { variant: "card-bismillah", caption: "Bismillah", tall: true },
            { variant: "card-star-tile", caption: "Geometri bintang" },
            { variant: "card-dome-mosaic", caption: "Kubah bermotif" },
            { variant: "card-quran-illum", caption: "Mushaf iluminasi" },
            { variant: "card-arch-hall", caption: "Lengkung arkade" },
            { variant: "card-muqarnas", caption: "Muqarnas" },
            { variant: "card-garden", caption: "Taman islami" },
          ]}
          label="Galeri keindahan islami"
        />
      </section>
    </>
  );
}
