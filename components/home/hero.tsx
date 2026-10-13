/* — Hero beranda: sapaan + ayat hari ini + mulai baca.
 *
 * Foto kubah sebagai latar (LCP, preload di layout). Kartu "Ayat hari ini"
 * bergilir harian dari data statis — sama untuk semua pengunjung di hari
 * yang sama, tanpa fetch. Teks Arabnya disalin dari data Kemenag. */

import Link from "@/components/smart-link";
import { HeroIntro } from "./hero-intro";
import { MihrabFrame, OrnamentStar } from "@/components/ornaments";
import { AmbientImage } from "@/components/ambient-image";
import { Orb } from "@/components/orb";
import { PhotoZoom } from "@/components/photo-zoom";
import { AYAT_PILIHAN, ayatHariIni } from "@/lib/data/ayat-pilihan";
import { SURAH } from "@/lib/data/surah";

export function Hero() {
  const a = ayatHariIni();
  const nama = SURAH[a.s - 1].latin;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <AmbientImage
        variant="hero-dome-gold"
        mode="plate"
        intensity={0.85}
        position="center 38%"
        fixed
        priority
      />

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
        <HeroIntro>
          <div>
          <span className="hero__eyebrow hero__anim">
            <OrnamentStar className="hero__eyebrow-star" />
            Mushaf digital Indonesia
          </span>

          <h1 id="hero-title" className="hero__title hero__anim">
            Tilawah, <em>tenang</em> dan lengkap.
          </h1>

          <p className="hero__lede hero__anim">
            Baca Al-Qur&rsquo;an 114 surah dengan teks mushaf, terjemahan Kemenag,
            tafsir per ayat, dan murottal enam qari. Lengkap dengan Asmaul Husna,
            doa harian, dan jadwal sholat.
          </p>

          <div className="hero__actions hero__anim">
            <Link href="/surat/36" className="btn btn--primary">
              Mulai dari Yasin
            </Link>
            <Link href="/surat" className="btn btn--outline btn--on-photo">
              Jelajahi 114 surah
            </Link>
          </div>

          <div className="hero__stats hero__anim">
            <div className="hero__stat">
              <b>114</b>
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
        </HeroIntro>

        <aside className="hero__card" aria-label="Ayat hari ini">
          <span className="hero__card-label">Ayat hari ini</span>
          <p className="hero__card-ar" lang="ar" dir="rtl">
            {a.ar}
          </p>
          <p className="hero__card-tr">&ldquo;{a.id}&rdquo;</p>
          <div className="hero__card-meta">
            <span>
              QS. {nama} : {a.a}
            </span>
            <Link href={`/surat/${a.s}?ayat=${a.a}`} className="section__link">
              Buka →
            </Link>
          </div>
          <p className="hero__card-count">
            {AYAT_PILIHAN.indexOf(a) + 1} dari {AYAT_PILIHAN.length} ayat pilihan — berganti tiap hari
          </p>
        </aside>
      </div>
    </section>
  );
}
