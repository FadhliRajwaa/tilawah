"use client";

/* — Nav N1b (canonical: wordmark kiri · link tengah · aksi kanan).
 * Dipilih sadar, bukan default N1a — halaman punya 5 destinasi nyata.
 * Mobile: menu disclosure dengan target sentuh 44px.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrefs } from "@/lib/store/prefs";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const LINKS = [
  { href: "/surat", label: "Surah" },
  { href: "/juz", label: "Juz" },
  { href: "/ibadah", label: "Ibadah" },
  { href: "/cari", label: "Cari" },
  { href: "/bookmark", label: "Tersimpan" },
];

function IconTheme({ mode }: { mode: string }) {
  if (mode === "dark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    );
  }
  if (mode === "auto") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18" />
        <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" stroke="none" opacity="0.35" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
    </svg>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const [prefs, updatePrefs] = usePrefs();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const cycleTheme = () => {
    const order: Array<typeof prefs.theme> = ["auto", "light", "dark"];
    const idx = order.indexOf(prefs.theme);
    updatePrefs({ theme: order[(idx + 1) % order.length] });
  };

  const themeLabel =
    prefs.theme === "auto" ? "Tema: ikut sistem" : prefs.theme === "dark" ? "Tema: gelap" : "Tema: terang";

  return (
    <header className={cn("site-nav", scrolled && "is-scrolled")}>
      <div className="site-nav__inner container-page">
        <Link href="/" className="wordmark" aria-label="Tilawah — beranda">
          <Logo className="wordmark__mark" />
          <span className="wordmark__text">Tilawah</span>
        </Link>

        <nav className="site-nav__links" aria-label="Navigasi utama">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn("nav-link", active && "is-active")}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-nav__actions">
          <button
            type="button"
            className="nav-iconbtn"
            onClick={cycleTheme}
            aria-label={themeLabel}
            title={themeLabel}
          >
            <IconTheme mode={prefs.theme} />
          </button>
          <Link href="/surat/36" className="nav-cta">
            Yasin
          </Link>
          <button
            type="button"
            className="nav-burger"
            aria-expanded={open}
            aria-controls="nav-mobile"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav-burger__bar" />
            <span className="nav-burger__bar" />
          </button>
        </div>
      </div>

      {open && (
        <nav id="nav-mobile" className="site-nav__mobile" aria-label="Navigasi seluler">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-mobile-link">
              {l.label}
            </Link>
          ))}
          <Link href="/surat/36" className="nav-mobile-link nav-mobile-link--accent">
            Baca Yasin
          </Link>
        </nav>
      )}
    </header>
  );
}
