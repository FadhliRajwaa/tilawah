/* — Hero beranda.
 *
 * Latarnya foto arsitektur Islami dalam mode "plate" — foto tampil jelas,
 * bukan tekstur samar. Keterbacaan teks dijamin oleh dua lapis veil
 * (`.hero__veil` diagonal + `.hero__bg` radial) yang membuat sisi kiri
 * pekat dan sisi kanan terbuka. Jadi foto tetap terlihat sebagai foto,
 * sementara teks tetap lolos AA di atasnya.
 *
 * ⚠️ Yang DIHAPUS dari versi lama: adegan awan + siluet cakrawala + kafilah.
 *
 * Adegan itu digambar dengan CSS dan SVG (nol byte, niatnya baik), tapi
 * hasilnya di layar tidak seperti yang dibayangkan: lima awan blur adalah
 * biaya paint yang nyata, dan siluet cakrawala — setinggi 132px di desktop —
 * terbaca sebagai blok abu-abu datar yang menempel di kaki hero, bukan
 * sebagai kabut di kejauhan. Ia juga menabrak baris statistik sebelum
 * padding-nya diperbaiki.
 *
 * Yang tersisa sekarang: foto, veil, bingkai mihrab emas, orb cahaya, dan
 * konten. Lima lapisan, semuanya punya alasan. Hero yang tenang jauh lebih
 * cocok untuk aplikasi baca daripada hero yang ramai.
 */

import Link from "next/link";
import { MihrabFrame, OrnamentStar } from "@/components/ornaments";
import { AmbientImage } from "@/components/ambient-image";
import { Orb } from "@/components/orb";
import { PhotoZoom } from "@/components/photo-zoom";

export function Hero({ totalSurah }: { totalSurah: number }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      {/* Foto kubah geometris emas — LCP, dimuat lebih dulu, diam saat scroll */}
      <AmbientImage
        variant="hero-dome-gold"
        mode="plate"
        intensity={0.85}
        position="center 38%"
        parallax
        priority
      />

      {/* Orb cahaya — ditunda 1.2s agar tidak berebut LCP */}
      <Orb size={520} color="#109BDA" className="orb-host--hero" delay={1200} />

      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__bg" aria-hidden="true" />
      <MihrabFrame className="hero__frame" />
      <PhotoZoom
        variant="hero-dome-gold"
        caption="Kubah bermotif geometris — keindahan arsitektur Islam"
        position="center 38%"
        className="hero__zoom"
      />

      <div className="hero__inner container-page on-ambient">
        <div>
          <span className="hero__eyebrow">
            <OrnamentStar className="hero__eyebrow-star" />
            Mushaf digital Indonesia
          </span>

          <h1 id="hero-title" className="hero__title">
            Tilawah, <em>tenang</em> dan lengkap.
          </h1>

          <p className="hero__lede">
            Baca Al-Qur&rsquo;an 114 surah dengan teks mushaf, terjemahan Kemenag,
            tafsir per ayat, dan murottal enam qari. Lengkap dengan Asmaul Husna,
            doa harian, dan jadwal sholat.
          </p>

          <div className="hero__actions">
            <Link href="/surat/36" className="btn btn--primary">
              Mulai dari Yasin
            </Link>
            <Link href="/surat" className="btn btn--outline btn--on-photo">
              Jelajahi 114 surah
            </Link>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <b>{totalSurah}</b>
              <span>surah</span>
            </div>
            <div className="hero__stat">
              <b>6.236</b>
              <span>ayat</span>
            </div>
            <div className="hero__stat">
              <b>6</b>
              <span>qari murottal</span>
            </div>
            <div className="hero__stat">
              <b>99</b>
              <span>asmaul husna</span>
            </div>
          </div>
        </div>

        <aside className="hero__card" aria-label="Ayat pilihan">
          <span className="hero__card-label">Ayat pilihan</span>
          <p className="hero__card-ar" lang="ar" dir="rtl">
            وَلَقَدْ يَسَّرْنَا الْقُرْاٰنَ لِلذِّكْرِ فَهَلْ مِنْ مُّدَّكِرٍ
          </p>
          <p className="hero__card-tr">
            &ldquo;Dan sungguh, telah Kami mudahkan Al-Qur&rsquo;an untuk peringatan,
            maka adakah orang yang mau mengambil pelajaran?&rdquo;
          </p>
          <div className="hero__card-meta">
            <span>QS. Al-Qamar : 17</span>
            <Link href="/surat/54?ayat=17" className="section__link">
              Buka →
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
