import type { Metadata } from "next";
import { BookmarkList } from "@/components/quran/bookmark-list";
import { PageHead } from "@/components/page-head";

export const metadata: Metadata = {
  title: "Ayat Tersimpan",
  description:
    "Ayat-ayat yang Anda tandai tersimpan di perangkat ini — buka kembali kapan saja untuk dibaca atau didengarkan.",
};

export default function BookmarkPage() {
  return (
    <>
      <PageHead
        eyebrow="Koleksi pribadi"
        title="Ayat Tersimpan"
        desc="Tersimpan aman di perangkat ini — tanpa akun, tanpa server."
        variant="card-reflection"
        caption="Refleksi di air — ketenangan membaca"
        position="center 50%"
        intensity={0.88}
      />

      <div className="container-page section--tight">
        <BookmarkList />
      </div>
    </>
  );
}
