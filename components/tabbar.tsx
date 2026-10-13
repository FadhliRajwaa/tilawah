"use client";

/* — Bilah tab bawah untuk ponsel: Beranda · Surah · Cari · Ibadah · Tersimpan.
 *
 * Menggantikan menu burger: lima tujuan utama selalu satu ketukan, dalam
 * jangkauan jempol, dengan nama yang terlihat (bukan ikon misterius).
 * Sembunyi saat menggulir turun, muncul saat menggulir naik — konten baca
 * dapat layar penuh tanpa kehilangan navigasi. */

import Link from "@/components/smart-link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { IconBookmark, IconCrescent, IconHome, IconMushaf, IconSearch } from "./icons";

const TABS = [
  { href: "/", label: "Beranda", Icon: IconHome },
  { href: "/surat", label: "Surah", Icon: IconMushaf },
  { href: "/cari", label: "Cari", Icon: IconSearch },
  { href: "/ibadah", label: "Ibadah", Icon: IconCrescent },
  { href: "/bookmark", label: "Tersimpan", Icon: IconBookmark },
];

export function Tabbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const kurangGerak = useReducedMotion();
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      /* Sembunyi hanya setelah melewati 240px & bergerak turun jelas;
         ambang 8px mengabaikan goyangan kecil. */
      if (y > 240 && y - lastY.current > 8) setHidden(true);
      else if (lastY.current - y > 8 || y <= 240) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <motion.nav
      className={cn("tabbar", hidden && "is-hidden")}
      aria-label="Navigasi utama"
      /* Tersembunyi = tak terlihat DAN tak terjangkau keyboard. Tanpa ini
         fokus Tab mendarat di tautan di luar layar. */
      inert={hidden}
      animate={{ y: hidden ? 88 : 0 }}
      transition={
        kurangGerak
          ? { duration: 0.01 }
          : { type: "spring", stiffness: 500, damping: 40 }
      }
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn("tabbar__tab", active && "is-active")}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="tabbar__icon" />
            <span className="tabbar__label">{label}</span>
          </Link>
        );
      })}
    </motion.nav>
  );
}
