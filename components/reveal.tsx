"use client";

/* — Reveal: konten memudar + naik saat masuk viewport, sekali saja.
 *
 * Ponsel: fade+rise 16px (scrub + Lenis mati di ponsel — orkestra
 * ScrollTrigger tak ada gunanya di sana). Desktop: naik 24px + blur
 * lembut 6px yang larut (rasa sinematik Apple, murah: blur kecil,
 * sekali jalan, compositor).
 *
 * Reduced-motion: div biasa, konten langsung tampil. */

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "span" | "li" | "p";
  id?: string;
  ariaLabelledby?: string;
  /** blur awal (px) — default 6 desktop, 0 ponsel (atur via y kecil) */
  blur?: number;
}

export function Reveal({ children, delay = 0, y = 16, className, as = "div", id, ariaLabelledby, blur = 6 }: Props) {
  const kurangGerak = useReducedMotion();
  if (kurangGerak) return <div className={className} id={id} aria-labelledby={ariaLabelledby}>{children}</div>;
  const Tag =
    as === "section"
      ? motion.section
      : as === "span"
        ? motion.span
        : as === "li"
          ? motion.li
          : as === "p"
            ? motion.p
            : motion.div;
  const ponsel = typeof window !== "undefined" && window.matchMedia("(pointer: coarse) and (hover: none)").matches;
  const blurAwal = ponsel ? 0 : blur;
  return (
    <Tag
      className={className}
      id={id}
      aria-labelledby={ariaLabelledby}
      initial={{ opacity: 0, y, filter: blurAwal ? `blur(${blurAwal}px)` : undefined }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
