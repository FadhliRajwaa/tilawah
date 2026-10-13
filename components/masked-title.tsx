"use client";

/* — Judul bermasker: kata naik satu per satu lewat topeng overflow.
 *
 * Versi ringan masked-reveal untuk judul yang TIDAK butuh orkestra penuh
 * (page-head, reader-head, section). Tanpa ScrollTrigger per kata —
 * satu trigger per judul, stagger lewat motion. Untuk hero + section
 * besar yang butuh foto+teks+panel selaras, pakai ScrollOverture.
 *
 * Reduced-motion: teks statis (tak ada yapper). */

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  id?: string;
  /** penunda awal (detik) — untuk koreografi hero */
  delay?: number;
  as?: "h1" | "h2" | "p" | "span";
}

export function MaskedTitle({ children, className, id, delay = 0, as = "h2" }: Props) {
  const kurangGerak = useReducedMotion();
  const teks = typeof children === "string" ? children : null;

  /* Anak bukan string murni (ada <em>/JSX): render biasa + fade. */
  if (teks === null || kurangGerak) {
    return as === "h1" ? (
      <h1 className={className} id={id}>{children}</h1>
    ) : as === "p" ? (
      <p className={className} id={id}>{children}</p>
    ) : as === "span" ? (
      <span className={className} id={id}>{children}</span>
    ) : (
      <h2 className={className} id={id}>{children}</h2>
    );
  }

  const kata = teks.split(/(\s+)/);
  const Tag = as === "h1" ? motion.h1 : as === "p" ? motion.p : as === "span" ? motion.span : motion.h2;

  return (
    <Tag
      className={className ? `${className} masked` : "masked"}
      id={id}
      aria-label={teks}
      initial="sembunyi"
      whileInView="tampil"
      viewport={{ once: true, margin: "-64px" }}
      transition={{ staggerChildren: 0.035, delayChildren: delay }}
    >
      {kata.map((pot, i) =>
        pot.trim() ? (
          <span key={i} className="masked__mask" aria-hidden="true">
            <motion.span
              className="masked__kata"
              variants={{ sembunyi: { y: "110%" }, tampil: { y: "0%" } }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {pot}
            </motion.span>
          </span>
        ) : (
          <span key={i} aria-hidden="true">{pot}</span>
        ),
      )}
    </Tag>
  );
}
