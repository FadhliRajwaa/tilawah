import type { MetadataRoute } from "next";

/* Membuat Tilawah bisa "ditambahkan ke layar utama" dan terbuka tanpa bilah
 * peramban — wajar untuk aplikasi yang dibuka setiap hari. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tilawah — Al-Qur'an Digital",
    short_name: "Tilawah",
    description: "114 surah, tafsir Kemenag, murottal 6 qari, dan jadwal sholat.",
    start_url: "/",
    display: "standalone",
    background_color: "#e8f6fb",
    theme_color: "#e8f6fb",
    lang: "id",
    icons: [{ src: "/apple-icon", sizes: "180x180", type: "image/png" }],
  };
}
