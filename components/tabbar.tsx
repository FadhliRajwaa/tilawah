"use client";

/* — Bilah tab bawah untuk ponsel: Beranda · Surah · Cari · Ibadah · Tersimpan.
 *
 * Menggantikan menu burger: lima tujuan utama selalu satu ketukan, dalam
 * jangkauan jempol, dengan nama yang terlihat (bukan ikon misterius).
 * SELALU tampil — auto-hide dihapus karena flicker saat gulir (ambang arah
 * + momentum scroll ponsel memicu hide/show berulang). */

import Link from "@/components/smart-link";
import { usePathname } from "next/navigation";
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
  const kurangGerak = useReducedMotion();

  return (
    <motion.nav
      className="tabbar"
      aria-label="Navigasi utama"
      initial={kurangGerak ? false : { y: 88 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 34 }}
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
            {active && (
              <motion.span
                className="tabbar__pill"
                layoutId="tabbar-pill"
                aria-hidden="true"
                transition={
                  kurangGerak ? { duration: 0.01 } : { type: "spring", stiffness: 500, damping: 38 }
                }
              />
            )}
            <Icon className="tabbar__icon" />
            <span className="tabbar__label">{label}</span>
          </Link>
        );
      })}
    </motion.nav>
  );
}
