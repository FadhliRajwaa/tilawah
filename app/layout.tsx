import type { Metadata, Viewport } from "next";
import { Fraunces, Amiri_Quran } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { PlayerProvider } from "@/components/player/player-provider";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { AudioDock } from "@/components/player/audio-dock";
import { ThemeScript } from "@/components/theme-script";

/* Catatan: shadcn init sempat menambahkan font Geist (--font-sans) + kelas
 * `font-sans` di <html>. Itu MENIMPA tipografi Tilawah (Fraunces + Switzer),
 * jadi sengaja dihapus. Token --font-sans tetap didefinisikan di globals.css
 * agar komponen shadcn/rare-ui tidak kehilangan variabelnya. */

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const amiriQuran = Amiri_Quran({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-amiri-quran",
  display: "swap",
});

const switzer = localFont({
  src: [
    { path: "../public/fonts/Switzer-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Switzer-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/Switzer-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/Switzer-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-switzer",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "Tilawah — Al-Qur'an Digital 30 Juz, Tafsir Kemenag & Audio 6 Qari",
    template: "%s · Tilawah",
  },
  description:
    "Baca Al-Qur'an 114 surat lengkap: teks Arab mushaf, terjemahan Kemenag, tafsir per ayat, audio murottal 6 qari, Asmaul Husna, doa harian, dan jadwal sholat Indonesia.",
  keywords: [
    "alquran digital",
    "surat yasin",
    "tafsir kemenag",
    "asmaul husna",
    "jadwal sholat",
    "murottal",
    "baca quran online",
  ],
  metadataBase: new URL("https://tilawah.example.com"),
  openGraph: {
    title: "Tilawah — Al-Qur'an Digital",
    description:
      "114 surat lengkap, tafsir Kemenag, audio 6 qari, Asmaul Husna, doa harian, dan jadwal sholat.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5ede1" },
    { media: "(prefers-color-scheme: dark)", color: "#120f0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${switzer.variable} ${amiriQuran.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        {/* hero adalah LCP di beranda — preload agar tidak menunggu CSS selesai */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-dome-gold-md.webp"
          type="image/webp"
          media="(min-width: 700px)"
        />
        <link
          rel="preload"
          as="image"
          href="/images/hero-dome-gold-sm.webp"
          type="image/webp"
          media="(max-width: 699px)"
        />
      </head>
      <body>
        <a href="#konten" className="skip-link">
          Lewati ke konten
        </a>
        <PlayerProvider>
          <SiteNav />
          <main id="konten">{children}</main>
          <SiteFooter />
          <AudioDock />
        </PlayerProvider>
      </body>
    </html>
  );
}
