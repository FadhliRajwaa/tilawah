"use client";

/* — Deret chip surah populer: masuk stagger (Apple: sekunder mengikuti
 * primer 60–90ms), keluar stagger juga. layout = chip bergeser halus
 * saat daftar berubah, bukan teleport. */

import { motion, useReducedMotion } from "motion/react";
import Link from "@/components/smart-link";
import type { SurahMeta } from "@/lib/data/surah";

interface Item {
  nomor: number;
  label: string;
  surah?: SurahMeta;
}

export function PopularSurah({ items }: { items: Item[] }) {
  const kurangGerak = useReducedMotion();
  if (kurangGerak) {
    return (
      <div className="chip-row">
        {items.map((it) => (
          <Link key={it.nomor} href={`/surat/${it.nomor}`} className="chip">
            {it.label}
            <b>{it.surah ? `${it.surah.ayat} ayat` : `#${it.nomor}`}</b>
          </Link>
        ))}
      </div>
    );
  }
  return (
    <motion.div
      className="chip-row"
      initial="sembunyi"
      whileInView="tampil"
      viewport={{ once: true, margin: "-48px" }}
      transition={{ staggerChildren: 0.06 }}
    >
      {items.map((it) => (
        <motion.span
          key={it.nomor}
          variants={{
            sembunyi: { opacity: 0, y: 12, scale: 0.96 },
            tampil: { opacity: 1, y: 0, scale: 1 },
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href={`/surat/${it.nomor}`} className="chip">
            {it.label}
            <b>{it.surah ? `${it.surah.ayat} ayat` : `#${it.nomor}`}</b>
          </Link>
        </motion.span>
      ))}
    </motion.div>
  );
}
