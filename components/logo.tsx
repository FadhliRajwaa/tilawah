/* — Logo Tilawah ————————————————————————————————————————————————
 *
 * Konsep: MUSHAF TERBUKA — dua halaman yang melengkung lembut keluar dari
 * tulang buku emas di tengah.
 *
 * Kenapa bentuk ini:
 *   "Tilawah" artinya membaca, jadi lambangnya adalah benda yang dibaca.
 *   Mushaf terbuka langsung terbaca bahkan pada 16px karena siluetnya hanya
 *   tiga bentuk besar. Halaman dibuat melengkung (bukan persegi) agar terasa
 *   lembut dan sesuai sifat mushaf — bukan seperti buku catatan.
 *
 * Warna memakai `currentColor` + `var(--gold)` supaya ikut tema otomatis:
 * hijau tua di mode terang, hijau muda di mode gelap, emas tetap emas.
 *
 * Ukuran kecil: `size="sm"` menebalkan stroke dan menghapus detail, supaya
 * tidak jadi gumpalan pada 16–20px.
 */

interface LogoProps {
  className?: string;
  /** `sm` = untuk 16–22px (favicon, chip); `md` = ukuran nav normal */
  size?: "sm" | "md";
  /** Warna tulang buku. Default mengikuti token emas Tilawah. */
  spineColor?: string;
}

/* Satu halaman mushaf, dipakai dua kali (kanan = cermin dari kiri).
 * `p` = halaman kiri: sisi dalam (dekat tulang) lurus, sisi luar melengkung. */
const PAGE = "M20 12.6C16.6 9.4 10.4 8.6 6.8 10.2v17.4c3.6-1.6 9.8-.8 13.2 2.4Z";

export function Logo({ className, size = "md", spineColor = "var(--gold)" }: LogoProps) {
  const tipis = size === "sm";

  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* — halaman kiri — */}
      <path d={PAGE} fill="currentColor" opacity={tipis ? 0 : 0.15} />
      <path d={PAGE} stroke="currentColor" strokeWidth={tipis ? 2.6 : 1.7} />

      {/* — halaman kanan: cermin dari halaman kiri — */}
      <g transform="translate(40 0) scale(-1 1)">
        <path d={PAGE} fill="currentColor" opacity={tipis ? 0 : 0.15} />
        <path d={PAGE} stroke="currentColor" strokeWidth={tipis ? 2.6 : 1.7} />
      </g>

      {/* — tulang buku emas: mengikat kedua halaman — */}
      <path d="M20 12.6v17.4" stroke={spineColor} strokeWidth={tipis ? 2.6 : 1.7} />

      {/* — lengkung halaman: dua garis tipis di tiap sisi tulang —
           menandakan baris tulisan tanpa harus menggambar huruf */}
      {!tipis && (
        <g stroke="currentColor" strokeWidth="1" opacity="0.42" strokeLinecap="round">
          <path d="M16.4 14.4c-2.4-.6-5-.5-7.1.4" />
          <path d="M16.4 18.2c-2.4-.6-5-.5-7.1.4" />
          <path d="M23.6 14.4c2.4-.6 5-.5 7.1.4" />
          <path d="M23.6 18.2c2.4-.6 5-.5 7.1.4" />
        </g>
      )}
    </svg>
  );
}

/** Versi bulat untuk favicon / avatar — halaman mushaf di dalam lingkaran. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none">
      <circle cx="20" cy="20" r="19" fill="currentColor" />
      <g stroke="var(--paper)" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d={PAGE} />
        <g transform="translate(40 0) scale(-1 1)">
          <path d={PAGE} />
        </g>
      </g>
      <path d="M20 12.6v17.4" stroke="var(--gold)" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}
