import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    // Proyek memakai <picture> + srcSet manual untuk gambar di public/,
    // bukan next/image. Daftar ini sengaja dikosongkan.
    remotePatterns: [],
  },
};

/**
 * CATATAN DEPLOY (Vercel) — hasil verifikasi, jangan diubah tanpa alasan:
 *
 * 1. JANGAN tambahkan `output: "export"`. Itu akan mematikan ISR
 *    (144 halaman /surat + /juz) dan 5 route handler API di app/api.
 *
 * 2. Data atribusi gambar TIDAK lagi dibaca lewat `fs` — ia di-import
 *    sebagai modul dari `lib/data/credits.ts` (dihasilkan oleh
 *    `_tilawah-shots/gen-credits.py`). Karena ikut bundle JS, halaman
 *    /kredit aman di platform mana pun, termasuk serverless.
 *
 * 3. `outputFileTracingIncludes` TIDAK ditulis di sini dengan sengaja.
 *    Diuji langsung pada build Next.js 16.4.0 proyek ini:
 *      - tanpa pemanggilan `fs` sama sekali → tidak ada yang perlu di-trace;
 *      - dengan `fs.readFileSync` ber-path statis → @vercel/nft OTOMATIS
 *        men-trace `public/images/credits.json` ke dalam page.js.nft.json
 *        (terbukti: 1 entri muncul tanpa konfigurasi apa pun).
 *    Dokumentasi Next.js juga menyatakan opsi itu hanya untuk kasus ketika
 *    Next.js GAGAL menyertakan berkas, dan TIDAK berlaku untuk halaman
 *    yang fully static. Menulisnya di sini hanya menambah konfigurasi mati.
 */
export default nextConfig;
