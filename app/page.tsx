import Link from "@/components/smart-link";
import { SURAH } from "@/lib/data/surah";
import { Hero } from "@/components/home/hero";
import { PopularSurah } from "@/components/home/popular-surah";
import { HomePrayer } from "@/components/home/home-prayer";
import { LastReadCard } from "@/components/home/last-read-card";
import { ArtDivider } from "@/components/art-divider";
import { ImageBanner } from "@/components/image-banner";
import { Gallery, type GalleryItem } from "@/components/gallery";
import { AmbientImage } from "@/components/ambient-image";
export const revalidate = 86400;

const POPULER = [
  { nomor: 36, label: "Yasin" },
  { nomor: 67, label: "Al-Mulk" },
  { nomor: 55, label: "Ar-Rahman" },
  { nomor: 56, label: "Al-Waqi'ah" },
  { nomor: 18, label: "Al-Kahf" },
  { nomor: 32, label: "As-Sajdah" },
  { nomor: 2, label: "Al-Baqarah" },
];

/** Mosaik galeri: campuran potret masjid, mushaf, pola, dan suasana. */
const GALERI: GalleryItem[] = [
  { variant: "card-bismillah", caption: "Bismillah — pembuka setiap surah", wide: true, tall: true, position: "center" },
  { variant: "card-menara-kudus", caption: "Masjid Menara Kudus — Indonesia" },
  { variant: "card-dome-mosaic", caption: "Kubah bermotif — geometri tanpa akhir" },
  { variant: "card-lamp-blue", caption: "Lampu masjid" },
  { variant: "card-star-tile", caption: "Ubin bintang delapan" },
  { variant: "card-garden", caption: "Taman islami" },
  { variant: "card-menara-minar", caption: "Masjid saat fajar" },
  { variant: "card-reflection", caption: "Refleksi di air" },
  { variant: "card-prayer-hall", caption: "Ruang sholat" },
  { variant: "card-muqarnas", caption: "Muqarnas" },
  { variant: "card-arch-hall", caption: "Lengkung & arkade" },
  { variant: "card-tile-green", caption: "Masjid di tepi air" },
];

export default function HomePage() {
  const find = (n: number) => SURAH[n - 1];

  return (
    <>
      <Hero />

      {/* — lanjut baca (hanya muncul kalau ada riwayat) — */}
      <LastReadCard />

      {/* — jadwal sholat ringkas — */}
      <HomePrayer />

      {/* — shortcut surah populer — */}
      <section className="section container-page" aria-labelledby="populer-title">
        <div className="section__head">
          <div>
            <h2 id="populer-title" className="section__title">
              Sering dibaca
            </h2>
            <p className="section__sub">
              Surah yang paling banyak dibuka — sekali ketuk langsung tilawah.
            </p>
          </div>
          <Link href="/surat" className="section__link">
            Semua 114 surah →
          </Link>
        </div>
        <PopularSurah items={POPULER.map((p) => ({ ...p, surah: find(p.nomor) }))} />
      </section>

      <ArtDivider variant="divider-zellige" />

      {/* — galeri mosaik: inilah bagian yang "playful" — */}
      <section className="section container-page" aria-labelledby="galeri-title">
        <div className="section__head">
          <div>
            <h2 id="galeri-title" className="section__title">
              Warisan visual Islam
            </h2>
            <p className="section__sub">
              Kaligrafi, geometri, cahaya, dan arsitektur — keindahan yang menemani
              tilawah.
            </p>
          </div>
          <Link href="/kredit" className="section__link">
            Kredit gambar →
          </Link>
        </div>
        <Gallery items={GALERI} label="Galeri warisan visual Islam" />
      </section>

      {/* — banner: mushaf & tafsir — */}
      <ImageBanner
        variant="banner-nabawi"
        eyebrow="Tafsir Kemenag"
        title="Pahami makna setiap ayat"
        desc="Tafsir resmi Kementerian Agama RI tersedia per ayat — buka langsung dari ayat yang sedang dibaca."
        cta={{ href: "/surat/36", label: "Mulai dari Yasin" }}
        height="sm"
        position="center 55%"
        align="left"
      />

      <ArtDivider variant="divider-star" />

      {/* — fitur ibadah ————————————————————————————————————————————
       *
       * ⚠️ Rombak dari grid 4 kartu identik (ikon + judul + deskripsi +
       * "Buka →"), pola yang paling sering muncul di template.
       *
       * Bentuk barunya adalah DAFTAR ARAHAN BERNOMOR — seperti daftar isi
       * dengan penjelasan. Nomornya besar dan rata, judulnya display, dan
       * deskripsinya mengalir di sebelahnya. Empat item ini memang berurutan
       * (dari yang paling sering dibuka), jadi penomoran bukan hiasan —
       * ia menyampaikan urutan.
       *
       * Kuncinya: satu item jadi LEBIH BESAR dari yang lain (Asmaul Husna),
       * supaya ada hierarki. Empat kartu sama besar tidak punya pendapat
       * tentang mana yang penting. */}
      <section className="section container-page" aria-labelledby="fitur-title">
        <div className="section__head">
          <div>
            <h2 id="fitur-title" className="section__title">
              Ibadah harian
            </h2>
            <p className="section__sub">
              Asmaul Husna, doa harian, dan jadwal sholat — semuanya dalam satu tempat.
            </p>
          </div>
        </div>
        <ol className="routes">
          <li className="routes__item routes__item--lead">
            <Link href="/ibadah?tab=asmaulhusna" className="route">
              <span className="route__num" aria-hidden="true">01</span>
              <span className="route__body">
                <span className="route__title">Asmaul Husna</span>
                <span className="route__desc">
                  99 nama Allah — teks Arab, latin, dan arti bahasa Indonesia.
                </span>
              </span>
              <span className="route__go" aria-hidden="true">→</span>
            </Link>
          </li>
          <li className="routes__item">
            <Link href="/ibadah?tab=doa" className="route">
              <span className="route__num" aria-hidden="true">02</span>
              <span className="route__body">
                <span className="route__title">Doa Harian</span>
                <span className="route__desc">
                  35 doa sehari-hari: makan, tidur, perjalanan, dan lainnya.
                </span>
              </span>
              <span className="route__go" aria-hidden="true">→</span>
            </Link>
          </li>
          <li className="routes__item">
            <Link href="/ibadah?tab=sholat" className="route">
              <span className="route__num" aria-hidden="true">03</span>
              <span className="route__body">
                <span className="route__title">Jadwal Sholat</span>
                <span className="route__desc">
                  Waktu sholat akurat untuk kota Anda, lengkap hitung mundur.
                </span>
              </span>
              <span className="route__go" aria-hidden="true">→</span>
            </Link>
          </li>
          <li className="routes__item">
            <Link href="/cari" className="route">
              <span className="route__num" aria-hidden="true">04</span>
              <span className="route__body">
                <span className="route__title">Pencarian Ayat</span>
                <span className="route__desc">
                  Cari kata dalam terjemahan Indonesia, langsung menuju ayatnya.
                </span>
              </span>
              <span className="route__go" aria-hidden="true">→</span>
            </Link>
          </li>
        </ol>
      </section>

    </>
  );
}
