/* — Hero beranda: foto arsitektur islami sebagai latar + kartu ayat pilihan.
 * Foto memakai mode "plate" (tampil jelas) dengan veil gradien yang menjamin
 * teks tetap lolos kontras AA — bukan tekstur samar.
 */

import Link from "next/link";
import { MihrabFrame, OrnamentStar } from "@/components/ornaments";
import { AmbientImage } from "@/components/ambient-image";
import { Orb } from "@/components/orb";

export function Hero({ totalSurah }: { totalSurah: number }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      {/* foto kubah geometris emas — LCP, priority */}
      <AmbientImage
        variant="hero-dome-gold"
        mode="plate"
        intensity={0.85}
        position="center 38%"
        priority
      />
      {/* Fluid Orb — aksen hidup, mount ditunda 1.2s agar tidak berebut LCP */}
      <Orb size={520} color="#125c35" className="orb-host--hero" delay={1200} />
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__bg" aria-hidden="true" />
      <MihrabFrame className="hero__frame" />

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
            <Link href="/surat" className="btn btn--outline">
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
