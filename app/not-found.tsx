import Link from "next/link";
import { OrnamentDivider } from "@/components/ornaments";

export default function NotFound() {
  return (
    <div
      className="container-page"
      style={{
        paddingBlock: "var(--space-9)",
        textAlign: "center",
        maxWidth: "46ch",
      }}
    >
      <p className="surah-head__eyebrow">404</p>
      <h1 className="section__title" style={{ marginTop: "var(--space-3)" }}>
        Halaman tidak ditemukan
      </h1>
      <p className="section__sub" style={{ marginInline: "auto" }}>
        Alamat yang Anda buka tidak tersedia. Surah hanya bernomor 1 sampai 114.
      </p>
      <div style={{ marginBlock: "var(--space-5)" }}>
        <OrnamentDivider className="ornament-divider" />
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/" className="btn btn--primary">
          Ke beranda
        </Link>
        <Link href="/surat" className="btn btn--outline">
          Lihat 114 surah
        </Link>
      </div>
    </div>
  );
}
