"use client";

/* — Reveal: konten memudar + naik saat masuk viewport.
 * Sekali saja (once); reduced-motion render div biasa. */

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
}

export function Reveal({ children, delay = 0, y = 16, className, as = "div", id, ariaLabelledby }: Props) {
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
  return (
    <Tag
      className={className}
      id={id}
      aria-labelledby={ariaLabelledby}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
