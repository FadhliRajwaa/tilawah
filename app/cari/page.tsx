import type { Metadata } from "next";
import { SearchPanel } from "@/components/quran/search-panel";
import { OrnamentDivider } from "@/components/ornaments";
import { AmbientImage } from "@/components/ambient-image";

export const metadata: Metadata = {
  title: "Cari Ayat — Pencarian Terjemahan Al-Qur'an",
  description:
    "Cari kata dalam terjemahan Indonesia Al-Qur'an — misalnya 'sabar', 'yatim', 'syukur' — lalu langsung menuju ayatnya untuk membaca lengkap dengan tafsir.",
};

export default function CariPage() {
  return (
    <>
      <header className="page-head page-head--tall">
        <AmbientImage
          variant="tex-lamp"
          mode="plate"
          intensity={0.5}
          position="center 46%"
        />
        <div className="page-head__veil" aria-hidden="true" />
        <div className="container-page page-head__inner on-ambient">
          <p className="surah-head__eyebrow">Pencarian</p>
          <h1 className="section__title" style={{ fontSize: "var(--text-3xl)", marginTop: "var(--space-3)" }}>
            Cari dalam Al-Qur&rsquo;an
          </h1>
          <p className="section__sub" style={{ maxWidth: "54ch", marginInline: "auto" }}>
            Pencarian kata pada terjemahan Kemenag. Ketik kata kunci dalam bahasa
            Indonesia — hasil menampilkan nomor surah dan ayat, siap dibuka.
          </p>
          <div style={{ marginTop: "var(--space-5)" }}>
            <OrnamentDivider className="ornament-divider" />
          </div>
        </div>
      </header>

      <div className="container-page" style={{ paddingBlock: "var(--space-7)" }}>
        <SearchPanel />
      </div>
    </>
  );
}
