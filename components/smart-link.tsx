"use client";

/* — Tautan cerdas: hemat 4 MB prefetch di halaman katalog.
 *
 * Masalah: katalog /surat memuat 114 tautan. Next.js mem-prefetch rute yang
 * tautannya masuk viewport — setiap halaman surah kini membawa ±1 MB payload
 * (teks ayat + payload RSC). Menggulir seluruh katalog memicu ~135 prefetch
 * (~4,3 MB terukur). Untuk tautan ke surah/juz BERAT, prefetch dimatikan;
 * pengguna yang mengarahkan kursor/menyentuh tetap memicu prefetch manual.
 * Tautan ringan (/, /ibadah, /cari, …) memakai prefetch bawaan.
 */

import NextLink, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

/** Segmen pertama rute — prefetch dinyalakan hanya kalau ringan. */
const RINGAN = new Set(["", "ibadah", "cari", "bookmark", "kredit"]);

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: React.ReactNode;
  };

function berat(href: LinkProps["href"]): boolean {
  const path = typeof href === "string" ? href : href.pathname ?? "/";
  const seg = path.split("/")[1] ?? "";
  return !RINGAN.has(seg);
}

export default function Link({ prefetch, onMouseEnter, onTouchStart, ...rest }: Props) {
  const router = useRouter();
  const href = rest.href ?? "/";
  const off = prefetch === undefined && berat(href);

  const hangatkan = () => {
    router.prefetch(typeof href === "string" ? href : href.toString());
  };
  const onEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    if (off) hangatkan();
    onMouseEnter?.(e);
  };
  const onTouch = (e: React.TouchEvent<HTMLAnchorElement>) => {
    if (off) hangatkan();
    onTouchStart?.(e);
  };

  return (
    <NextLink
      prefetch={off ? false : prefetch}
      onMouseEnter={onEnter}
      onTouchStart={onTouch}
      {...rest}
    />
  );
}
