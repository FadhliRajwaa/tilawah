import type { Metadata } from "next";
import { Suspense } from "react";
import { getAsmaulHusna, getDoaHarian } from "@/lib/api/ibadah";
import { IbadahTabs } from "@/components/ibadah/ibadah-tabs";
import { PageHead } from "@/components/page-head";
import { Gallery } from "@/components/gallery";
import { Reveal } from "@/components/reveal";
import { MaskedTitle } from "@/components/masked-title";
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
      <PageHead
        eyebrow="Amalan harian"
        title="Ibadah"
        desc="Asmaul Husna, doa sehari-hari, dan jadwal sholat — semuanya dalam satu tempat, tanpa gangguan."
        variant="tex-calligraphy"
        caption="Kaligrafi Islam"
        position="center 44%"
        intensity={0.9}
      />

      <div className="container-page section--tight">
        <Suspense fallback={<div className="skeleton" style={{ height: 320 }} aria-hidden="true" />}>
          <IbadahTabs asmaul={asmaul} doa={doa} />
        </Suspense>
      </div>

      {/* — galeri: cahaya & arsitektur — */}
      <Reveal as="section" className="section container-page" ariaLabelledby="galeri-ibadah" y={24}>
        <div className="section__head">
          <div>
            <MaskedTitle as="h2" className="section__title" id="galeri-ibadah">Rumah-rumah Allah</MaskedTitle>
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
      </Reveal>
    </>
  );
}
