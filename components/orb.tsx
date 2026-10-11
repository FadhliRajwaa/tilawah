/* — Orb dekoratif: cahaya lembut yang mengapung di belakang konten.
 *
 * ⚠️ Rombak dari Fluid Orb WebGL (rare-ui).
 *
 * Versi lama merender shader WebGL penuh — ~200 baris komponen + ~200 baris
 * pengaman performa (deteksi WebGL, cek deviceMemory, cek hardwareConcurrency,
 * cek Save-Data, IntersectionObserver, delay mount). Semua itu untuk sesuatu
 * yang di layar hanya terlihat sebagai **gumpalan cahaya biru yang buram**.
 *
 * Masalahnya bukan sekadar beratnya, tapi ketidakcocokannya dengan tujuan
 * halaman ini. Tilawah adalah aplikasi BACA. Setiap milidetik main thread
 * yang dipakai shader adalah milidetik yang tidak dipakai untuk menggulir
 * dan mengetik. Di ponsel kelas menengah, shader 420px itu terasa: gulir
 * jadi tersendat di halaman yang isinya teks panjang.
 *
 * Yang menggantikannya: dua gradient radial yang di-blur, satu lapisan
 * highlight, dan animasi `transform` yang berjalan di compositor. Hasil
 * visualnya nyaris sama (ia memang cuma gumpalan cahaya), tapi:
 *
 *   · nol JS saat scroll — animasi CSS murni
 *   · nol ketergantungan WebGL
 *   · nol risiko kehilangan konteks GPU
 *   · 400 baris → 60 baris
 *   · tetap hormat pada prefers-reduced-motion
 *
 * API-nya sengaja dipertahankan (`size`, `color`, `className`, `delay`)
 * supaya komponen pemanggil tidak perlu diubah.
 */

interface Props {
  size?: number;
  /** warna orb (hex) — default biru indigo sungai, tema "air" */
  color?: string;
  className?: string;
  /** tunda animasi masuk (ms) agar tidak berebut perhatian dengan LCP */
  delay?: number;
}

export function Orb({ size = 420, color = "#109bda", className, delay = 0 }: Props) {
  return (
    <div
      className={className ? `orb-host ${className}` : "orb-host"}
      style={
        {
          "--orb-size": `${size}px`,
          "--orb-color": color,
          "--orb-delay": `${delay}ms`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <span className="orb-glow" />
    </div>
  );
}
