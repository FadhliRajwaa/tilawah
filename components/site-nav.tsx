"use client";

/* — Navigasi utama + cari cepat global.
 *
 * Desktop: wordmark · tautan · cari · tema. Ponsel: wordmark · cari · tema,
 * dengan tautan pindah ke bilah tab bawah (tabbar.tsx) — jangkauan jempol,
 * bukan menu burger yang butuh dua ketukan.
 *
 * Cari cepat (Ctrl/⌘+K atau "/") mengerti "36", "2:255", "yasin 9",
 * "kahfi", "juz 30", sampai "ayat kursi" — lihat lib/quick-find.ts. */

import Link from "@/components/smart-link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePrefs } from "@/lib/store/prefs";
import { SURAH } from "@/lib/data/surah";
import { quickFind, type QFResult } from "@/lib/quick-find";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { IconMoon, IconSearch, IconSun, IconThemeAuto } from "./icons";

const LINKS = [
  { href: "/surat", label: "Surah" },
  { href: "/juz", label: "Juz" },
  { href: "/ibadah", label: "Ibadah" },
  { href: "/cari", label: "Cari" },
  { href: "/bookmark", label: "Tersimpan" },
];

function IconTheme({ mode }: { mode: string }) {
  const cls = "nav-icon";
  if (mode === "dark") return <IconMoon className={cls} />;
  if (mode === "auto") return <IconThemeAuto className={cls} />;
  return <IconSun className={cls} />;
}

function labelHasil(r: QFResult): { utama: string; sub: string; href: string } {
  if (r.kind === "surah") {
    const s = SURAH[r.s - 1];
    return { utama: `${r.s}. ${s.latin}`, sub: `${s.arti} · ${s.ayat} ayat`, href: `/surat/${r.s}` };
  }
  if (r.kind === "ayah") {
    const s = SURAH[r.s - 1];
    return { utama: `${s.latin} : ${r.n}`, sub: "Langsung ke ayat", href: `/surat/${r.s}?ayat=${r.n}` };
  }
  if (r.kind === "juz") {
    return { utama: `Juz ${r.n}`, sub: "Buka juz", href: `/juz/${r.n}` };
  }
  return { utama: `Cari “${r.q}”`, sub: "Dalam terjemahan", href: `/cari?q=${encodeURIComponent(r.q)}` };
}

export function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [prefs, updatePrefs] = usePrefs();
  const [scrolled, setScrolled] = useState(false);
  const [qfOpen, setQfOpen] = useState(false);
  const [qf, setQf] = useState("");
  const [qfAktif, setQfAktif] = useState(0);
  const qfInputRef = useRef<HTMLInputElement>(null);
  const qfDlgRef = useRef<HTMLDivElement>(null);
  /* Fokus kembali ke pemicu saat dialog ditutup — tanpa ini pengguna
     keyboard kehilangan posisi setelah menutup cari. */
  const qfBackTo = useRef<HTMLElement | null>(null);
  const linksRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bukaQf = () => {
    if (document.activeElement instanceof HTMLElement) {
      qfBackTo.current = document.activeElement;
    }
    setQfOpen(true);
  };

  /* Ctrl/⌘+K atau "/" membuka cari — kecuali sedang mengetik di field. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement;
      if ((e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        bukaQf();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* Dialog modal sungguhan: jebak Tab di dalam, Esc menutup dari mana saja,
     fokus dikembalikan ke pemicu. Tanpa ini Tab lari ke konten belakang
     yang masih bisa difokus. */
  useEffect(() => {
    if (!qfOpen) return;
    setQf("");
    setQfAktif(0);
    window.setTimeout(() => qfInputRef.current?.focus(), 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setQfOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const root = qfDlgRef.current;
      if (!root) return;
      const items = [...root.querySelectorAll<HTMLElement>("input, button")].filter(
        (el) => !el.hasAttribute("disabled"),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      qfBackTo.current?.focus?.();
      qfBackTo.current = null;
    };
  }, [qfOpen]);

  useEffect(() => setQfOpen(false), [pathname]);

  const hasil = quickFind(qf, SURAH);

  const bukaHasil = (r: QFResult) => {
    setQfOpen(false);
    router.push(labelHasil(r).href);
  };

  /* Ukur tautan aktif lalu geser pil ke posisinya. Diukur dari DOM, bukan
   * dihitung dari indeks — lebar label berbeda-beda ("Cari" vs "Tersimpan"),
   * jadi perhitungan indeks selalu meleset beberapa piksel. */
  useEffect(() => {
    const host = linksRef.current;
    if (!host) return;
    const measure = () => {
      const active = host.querySelector<HTMLElement>(".nav-link.is-active");
      if (!active) {
        setPill(null);
        return;
      }
      setPill({ x: active.offsetLeft, w: active.offsetWidth });
    };
    measure();
    /* ukuran font web bisa berubah setelah font selesai dimuat */
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, [pathname]);

  const cycleTheme = () => {
    const order: Array<typeof prefs.theme> = ["auto", "light", "dark"];
    const idx = order.indexOf(prefs.theme);
    updatePrefs({ theme: order[(idx + 1) % order.length] });
  };

  const themeLabel =
    prefs.theme === "auto" ? "Tema: ikut sistem" : prefs.theme === "dark" ? "Tema: gelap" : "Tema: terang";

  return (
    <>
      <header
        className={cn("site-nav", scrolled && "is-scrolled")}
        style={{ viewTransitionName: "site-nav" }}
      >
      <div className="site-nav__inner container-page">
        <Link href="/" className="wordmark" aria-label="Tilawah — beranda">
          <Logo className="wordmark__mark" />
          <span className="wordmark__text">Tilawah</span>
        </Link>

        <nav className="site-nav__links" aria-label="Navigasi utama" ref={linksRef}>
          {pill && (
            <span
              className="nav-link__pill"
              aria-hidden="true"
              style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
            />
          )}
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
              className="nav-searchbtn"
              onClick={() => bukaQf()}
              aria-label="Cari cepat (Ctrl K)"
              title="Cari cepat (Ctrl+K)"
            >
              <IconSearch className="nav-icon" />
              <span className="nav-searchbtn__hint" aria-hidden="true">
                Cari…
              </span>
              <kbd className="nav-searchbtn__kbd" aria-hidden="true">
                /
              </kbd>
            </button>
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
          </div>
        </div>
      </header>

      {qfOpen && (
        <div className="qf-backdrop" onClick={() => setQfOpen(false)}>
          <div
            ref={qfDlgRef}
            className="qf"
            role="dialog"
            aria-modal="true"
            aria-label="Cari cepat"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="qf__box">
              <IconSearch className="qf__icon" />
              <input
                ref={qfInputRef}
                type="text"
                className="qf__input"
                placeholder="Nomor, 2:255, nama surah, juz…"
                value={qf}
                onChange={(e) => {
                  setQf(e.target.value);
                  setQfAktif(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setQfAktif((v) => Math.min(hasil.length - 1, v + 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setQfAktif((v) => Math.max(0, v - 1));
                  } else if (e.key === "Enter" && hasil[qfAktif]) {
                    bukaHasil(hasil[qfAktif]);
                  } else if (e.key === "Escape") {
                    setQfOpen(false);
                  }
                }}
                role="combobox"
                aria-expanded={hasil.length > 0}
                aria-controls="qf-list"
                aria-activedescendant={hasil.length > 0 ? `qf-opsi-${qfAktif}` : undefined}
                aria-label="Cari surah, ayat, atau juz"
              />
              <button
                type="button"
                className="qf__esc"
                onClick={() => setQfOpen(false)}
                aria-label="Tutup pencarian"
              >
                Esc
              </button>
            </div>
            {hasil.length > 0 && (
              <div className="qf__list" id="qf-list" role="listbox" aria-label="Hasil">
                {hasil.map((r, idx) => {
                  const h = labelHasil(r);
                  return (
                    <button
                      key={h.href}
                      id={`qf-opsi-${idx}`}
                      type="button"
                      role="option"
                      aria-selected={idx === qfAktif}
                      className={cn("qf__item", idx === qfAktif && "is-highlight")}
                      onMouseEnter={() => setQfAktif(idx)}
                      onClick={() => bukaHasil(r)}
                    >
                      <span className="qf__utama">{h.utama}</span>
                      <span className="qf__sub">{h.sub}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {qf.trim() && hasil.length === 0 && (
              <p className="qf__empty">
                Tidak cocok — coba &ldquo;36&rdquo;, &ldquo;2:255&rdquo;, &ldquo;yasin&rdquo;, atau &ldquo;juz 30&rdquo;.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
