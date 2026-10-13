import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { AudioDock } from "@/components/player/audio-dock";
import { PlayerPanel } from "@/components/player/player-panel";
import { Tabbar } from "@/components/tabbar";
import { ThemeScript } from "@/components/theme-script";
import { WatercolorBg } from "@/components/watercolor-bg";
import { LightboxProvider } from "@/components/image-lightbox";
import { Toaster } from "@/components/toaster";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

/* Font mushaf standar Indonesia (LPMQ Kemenag). Terverifikasi mencakup
   seluruh 73 karakter yang dipakai teks 114 surah — jadi Amiri tidak lagi
   diperlukan sebagai cadangan. */
const lpmq = localFont({
  src: [{ path: "../public/fonts/LPMQ-Isep-Misbah.woff2", weight: "400", style: "normal" }],
  variable: "--font-lpmq",
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
  metadataBase: new URL("https://www.tilawahsurah.my.id"),
  openGraph: {
    title: "Tilawah — Al-Qur'an Digital",
    description:
      "114 surat lengkap, tafsir Kemenag, audio 6 qari, Asmaul Husna, doa harian, dan jadwal sholat.",
    type: "website",
    locale: "id_ID",
  },
};

/* Bilah status/peramban mengikuti kertas tema, bukan default putih —
   kalau tidak, mode gelap dibuka dengan kilat putih di atasnya. Nilainya
   ditulis ulang oleh skrip tema setiap kali tema berubah (layout + JS). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#061118" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${switzer.variable} ${lpmq.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
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
        <WatercolorBg />
        <a href="#konten" className="skip-link">
          Lewati ke konten
        </a>
        <LightboxProvider>
          <SiteNav />
          <main id="konten">{children}</main>
          <SiteFooter />
          <AudioDock />
          <PlayerPanel />
          <Tabbar />
          <Toaster />
        </LightboxProvider>
      </body>
    </html>
  );
}
