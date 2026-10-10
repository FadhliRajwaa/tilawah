/* — Adegan hero: awan + siluet islami, empat lapisan kedalaman ————————
 *
 * Semuanya digambar dengan CSS dan SVG, BUKAN gambar yang diunduh:
 *   · nol byte tambahan (aset 48 MB sudah besar)
 *   · tajam di layar selebar apa pun karena murni vektor
 *   · siluet butuh latar TRANSPARAN — foto tidak punya itu
 *
 * Urutan lapisan dari yang paling jauh ke paling dekat:
 *   awan (0.34)  →  cakrawala masjid (0.20)  →  kafilah (0.08)
 * Angka itu `speed` untuk ParallaxLayer: makin besar, makin lambat bergerak
 * relatif halaman, jadi makin jauh terasa. Angka awan paling besar karena
 * awan memang paling jauh.
 */

import { ParallaxLayer } from "./parallax";

/* ═══ awan ═══
 *
 * Satu awan = tiga ellipse radial yang saling tumpang tindih, lalu di-blur.
 * Bentuknya sengaja tidak simetris supaya tidak terbaca sebagai oval.
 * Geser horizontal lambat (bukan parallax — awan memang bergerak sendiri). */
const CLOUDS = [
  { left: "3%", top: "10%", w: 240, h: 66, dur: 92, delay: 0, op: 0.72, flip: false },
  { left: "36%", top: "5%", w: 320, h: 82, dur: 118, delay: -28, op: 0.6, flip: true },
  { left: "63%", top: "18%", w: 180, h: 52, dur: 76, delay: -54, op: 0.5, flip: false },
  { left: "20%", top: "26%", w: 140, h: 42, dur: 104, delay: -70, op: 0.38, flip: true },
  { left: "79%", top: "9%", w: 210, h: 58, dur: 132, delay: -12, op: 0.44, flip: false },
];

function Clouds() {
  return (
    <div className="scene-clouds">
      {CLOUDS.map((c, i) => (
        <span
          key={i}
          className="scene-cloud"
          style={{
            left: c.left,
            top: c.top,
            width: c.w,
            height: c.h,
            opacity: c.op,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
            transform: c.flip ? "scaleX(-1)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

/* ═══ cakrawala masjid ═══
 *
 * Kubah, menara, dan pohon kurma dalam satu siluet. Digambar dengan bentuk
 * dasar (busur + persegi) supaya tepinya tetap bersih di ukuran kecil. */
function Skyline() {
  return (
    <svg
      className="scene-skyline"
      viewBox="0 0 1200 150"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <g fill="currentColor">
        {/* — kubah utama — */}
        <path d="M300 150V74c0-3 2-5 4-7 22-18 38-40 44-66 1-4 6-4 7 0 6 26 22 48 44 66 2 2 4 4 4 7v76Z" />
        <rect x="352" y="0" width="3" height="12" rx="1.5" />
        {/* — kubah kecil kiri & kanan — */}
        <path d="M196 150V96c0-2 1-4 3-5 14-11 24-26 28-43 1-3 4-3 5 0 4 17 14 32 28 43 2 1 3 3 3 5v54Z" />
        <path d="M470 150V96c0-2 1-4 3-5 14-11 24-26 28-43 1-3 4-3 5 0 4 17 14 32 28 43 2 1 3 3 3 5v54Z" />
        {/* — menara — */}
        <rect x="120" y="52" width="26" height="98" rx="4" />
        <path d="M120 54c0-9 5-16 13-20 8 4 13 11 13 20Z" />
        <rect x="131" y="20" width="4" height="16" rx="2" />
        <rect x="608" y="34" width="26" height="116" rx="4" />
        <path d="M608 36c0-9 5-16 13-20 8 4 13 11 13 20Z" />
        <rect x="619" y="4" width="4" height="16" rx="2" />
        {/* — kurma kiri — */}
        <path d="M60 150V92c0-3 2-5 5-5s5 2 5 5v58Z" />
        <path d="M65 90c-14-6-24-18-26-33 13 3 23 13 28 27ZM65 90c14-6 24-18 26-33-13 3-23 13-28 27ZM65 88c-9-11-12-25-8-38 8 9 12 23 10 36ZM65 88c9-11 12-25 8-38-8 9-12 23-10 36Z" />
        {/* — kurma kanan — */}
        <path d="M700 150V104c0-3 2-5 5-5s5 2 5 5v46Z" />
        <path d="M705 102c-11-5-19-14-21-26 10 2 18 10 22 21ZM705 102c11-5 19-14 21-26-10 2-18 10-22 21Z" />
        {/* — bukit pasir landai, menutup kaki siluet — */}
        <path d="M0 150v-16c120-10 240 6 360 6s240-18 360-18 240 20 360 12l120-8v24Z" opacity="0.75" />
      </g>
    </svg>
  );
}

/* ═══ kafilah ═══
 *
 * Satu unta + dua musafir berjalan. Bentuknya geometris (bukan anatomis)
 * supaya konsisten dengan bahasa visual situs — dan supaya tetap terbaca
 * saat hanya setinggi 40px. */
function Traveler({ x, s, flip }: { x: number; s: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} 0) scale(${flip ? -s : s} ${s})`}>
      <circle cx="0" cy="-30" r="5.5" />
      <path d="M-8 -24h16l3.5 24h-23Z" />
      <path d="M-6 0h3l1 10M6 0h-3l-1 10" strokeWidth="3.4" strokeLinecap="round" fill="none" stroke="currentColor" />
      <path d="M12 -36v46" strokeWidth="2.2" strokeLinecap="round" fill="none" stroke="currentColor" />
    </g>
  );
}

function Camel({ x, s }: { x: number; s: number }) {
  return (
    <g transform={`translate(${x} 0) scale(${s})`}>
      <ellipse cx="0" cy="-18" rx="17" ry="8.5" />
      <path d="M-7 -25c2-9 12-9 14 0Z" />
      <path d="M14 -22c6-7 7-14 5-19" strokeWidth="4.6" strokeLinecap="round" fill="none" stroke="currentColor" />
      <ellipse cx="20" cy="-42" rx="5" ry="3.2" />
      <path d="M19 -45l-3-4M21 -45l3-4" strokeWidth="1.6" strokeLinecap="round" fill="none" stroke="currentColor" />
      <path d="M-11 -10l-2 10M-4 -10l0 10M5 -10l1 10M12 -10l3 10" strokeWidth="3" strokeLinecap="round" fill="none" stroke="currentColor" />
      <path d="M-17 -20c-5 2-7 8-6 14" strokeWidth="2" strokeLinecap="round" fill="none" stroke="currentColor" />
    </g>
  );
}

function Caravan() {
  return (
    <svg
      className="scene-caravan"
      viewBox="0 0 1200 90"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <g fill="currentColor" color="currentColor">
        <Camel x={330} s={1.05} />
        <Traveler x={420} s={1} />
        <Traveler x={466} s={0.86} />
        <Camel x={560} s={0.78} />
        <Traveler x={620} s={0.7} flip />
      </g>
    </svg>
  );
}

/** Seluruh adegan, siap dipasang di dalam `.hero` (atau header lain). */
export function HeroScene() {
  return (
    <>
      <ParallaxLayer speed={0.34} className="scene-layer scene-layer--clouds">
        <Clouds />
      </ParallaxLayer>
      <ParallaxLayer speed={0.2} className="scene-layer scene-layer--skyline">
        <Skyline />
      </ParallaxLayer>
      <ParallaxLayer speed={0.08} className="scene-layer scene-layer--caravan">
        <Caravan />
      </ParallaxLayer>
    </>
  );
}
