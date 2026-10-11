import Link from "next/link";
import { OrnamentDivider } from "@/components/ornaments";

/* — Halaman 404.
 *
 * Bentuknya mengikuti kepala halaman biasa (eyebrow → judul → deskripsi →
 * ornamen → aksi) supaya terasa seperti bagian dari situs, bukan layar
 * galat yang ditempel. Dua jalan keluar ditawarkan: beranda dan katalog —
 * pengguna yang tersesat hampir selalu ingin salah satu dari keduanya.
 */

export default function NotFound() {
  return (
    <div className="container-narrow">
      <div className="page-intro" style={{ paddingBlock: "var(--space-9)" }}>
        <p className="t-eyebrow">404</p>
        <h1 className="page-intro__title">Halaman tidak ditemukan</h1>
        <p className="page-intro__desc">
          Alamat yang Anda buka tidak tersedia. Surah hanya bernomor 1 sampai 114,
          dan juz 1 sampai 30.
        </p>
        <div className="page-intro__ornament">
          <OrnamentDivider className="ornament-divider" />
        </div>
        <div className="row" style={{ justifyContent: "center", marginTop: "var(--space-4)" }}>
          <Link href="/" className="btn btn--primary">
            Ke beranda
          </Link>
          <Link href="/surat" className="btn btn--outline">
            Lihat 114 surah
          </Link>
        </div>
      </div>
    </div>
  );
}
