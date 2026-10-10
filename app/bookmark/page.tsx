import type { Metadata } from "next";
import { BookmarkList } from "@/components/quran/bookmark-list";
import { OrnamentDivider } from "@/components/ornaments";

export const metadata: Metadata = {
  title: "Ayat Tersimpan",
  description:
    "Ayat-ayat yang Anda tandai tersimpan di perangkat ini — buka kembali kapan saja untuk dibaca atau didengarkan.",
};

export default function BookmarkPage() {
  return (
    <div className="container-page" style={{ paddingBlock: "var(--space-8)" }}>
      <header style={{ textAlign: "center", marginBottom: "var(--space-7)" }}>
        <p className="surah-head__eyebrow">Koleksi pribadi</p>
        <h1 className="section__title" style={{ fontSize: "var(--text-3xl)", marginTop: "var(--space-3)" }}>
          Ayat Tersimpan
        </h1>
        <p className="section__sub" style={{ maxWidth: "52ch", marginInline: "auto" }}>
          Tersimpan aman di perangkat ini — tanpa akun, tanpa server.
        </p>
        <div style={{ marginTop: "var(--space-5)" }}>
          <OrnamentDivider className="ornament-divider" />
        </div>
      </header>

      <BookmarkList />
    </div>
  );
}
