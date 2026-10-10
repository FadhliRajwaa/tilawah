/* — Favicon dinamis ————————————————————————————————————————————————
 *
 * Digenerate Next.js saat build memakai `next/og` (ImageResponse), jadi
 * tidak perlu file .ico terpisah dan ikut berubah kalau logo diperbarui.
 *
 * Sengaja dibuat SANGAT sederhana: pada 32px hanya siluet yang terbaca,
 * detail seperti penanda ayat akan jadi noise. Karena itu hanya dua
 * halaman mushaf + tulang buku emas, tanpa isian.
 */

import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#109bda",
          borderRadius: 7,
        }}
      >
        {/* Ikon dibuat 26px dari kotak 32px — hampir memenuhi tepi — supaya
         *  siluetnya tegas. Path-nya versi khusus favicon: halaman lebih
         *  melengkung dan stroke lebih tebal, karena lengkung halus akan
         *  hilang total saat di-render 32px.
         *
         * Warna mengikuti tema "air": latar biru indigo sungai (#109BDA),
         * halaman putih kebiruan, tulang buku tetap emas sebagai satu-satunya
         * aksen hangat. */}
        <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
          <g stroke="#f5fbfe" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 11.6C16 7.6 9.4 6.6 5.4 8.6v19.2c4-2 10.6-1 14.6 3Z" />
            <g transform="translate(40 0) scale(-1 1)">
              <path d="M20 11.6C16 7.6 9.4 6.6 5.4 8.6v19.2c4-2 10.6-1 14.6 3Z" />
            </g>
          </g>
          <path d="M20 11.6v19.2" stroke="#f0d9a0" strokeWidth="3.6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
