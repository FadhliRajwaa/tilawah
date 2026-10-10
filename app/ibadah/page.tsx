import type { Metadata } from "next";
import { Suspense } from "react";
import { getAsmaulHusna, getDoaHarian } from "@/lib/api/ibadah";
import { IbadahTabs } from "@/components/ibadah/ibadah-tabs";
import { OrnamentDivider } from "@/components/ornaments";
import { AmbientImage } from "@/components/ambient-image";
import { Gallery } from "@/components/gallery";
import type { AsmaulHusnaItem, DoaItem } from "@/lib/types";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Ibadah Harian — Asmaul Husna, Doa & Jadwal Sholat",
  description:
    "99 Asmaul Husna lengkap dengan arti, 35 doa harian, dan jadwal sholat 518 kota Indonesia dengan hitung mundur waktu sholat berikutnya.",
};

export default async function IbadahPage() {
  let asmaul: AsmaulHusnaItem[] = [];
  let doa: DoaItem[] = [];

  const [a, d] = await Promise.allSettled([getAsmaulHusna(), getDoaHarian()]);
  if (a.status === "fulfilled") asmaul = a.value;
  if (d.status === "fulfilled") doa = d.value;

  return (
    <>
      {/* — header bergambar: kaligrafi tampil sebagai latar jelas — */}
      <header className="page-head page-head--tall">
        <AmbientImage
          variant="tex-calligraphy"
          mode="plate"
          intensity={0.72}
          position="center 44%"
        />
        <div className="page-head__veil" aria-hidden="true" />
        <div className="container-page page-head__inner on-ambient">
          <p className="surah-head__eyebrow">Amalan harian</p>
          <h1 className="section__title" style={{ fontSize: "var(--text-3xl)", marginTop: "var(--space-3)" }}>
            Ibadah
          </h1>
          <p className="section__sub" style={{ maxWidth: "52ch", marginInline: "auto" }}>
            Asmaul Husna, doa sehari-hari, dan jadwal sholat — semuanya dalam satu
            tempat, tanpa gangguan.
          </p>
          <div style={{ marginTop: "var(--space-5)" }}>
            <OrnamentDivider className="ornament-divider" />
          </div>
        </div>
      </header>

      <div className="container-page" style={{ paddingBlock: "var(--space-7)" }}>
        <Suspense fallback={<div className="skeleton" style={{ height: 320 }} aria-hidden="true" />}>
          <IbadahTabs asmaul={asmaul} doa={doa} />
        </Suspense>
      </div>

      {/* — galeri: cahaya & arsitektur — */}
      <section className="section container-page" aria-labelledby="galeri-ibadah">
        <div className="section__head">
          <div>
            <h2 id="galeri-ibadah" className="section__title">
              Rumah-rumah Allah
            </h2>
            <p className="section__sub">
              Cahaya, geometri, dan ketenangan — pengingat tempat suci di seluruh dunia.
            </p>
          </div>
        </div>
        <Gallery
          items={[
            { variant: "card-lamp-blue", caption: "Lampu masjid", tall: true },
            { variant: "banner-kaaba-night", caption: "Kaaba, Makkah", wide: true },
            { variant: "card-nabawi-day", caption: "Masjid Nabawi, Madinah" },
            { variant: "card-sunset-purple", caption: "Senja di masjid" },
            { variant: "card-prayer-hall", caption: "Ruang sholat" },
            { variant: "banner-mostar", caption: "Masjid di tepi sungai", wide: true },
            { variant: "card-dome-mosaic", caption: "Kubah bermotif" },
            { variant: "card-menara-minar", caption: "Menara saat fajar" },
            { variant: "card-desert-road", caption: "Gurun saat terbit" },
            { variant: "banner-sunset", caption: "Senja di menara", wide: true },
          ]}
          label="Galeri rumah-rumah Allah"
        />
      </section>
    </>
  );
}
