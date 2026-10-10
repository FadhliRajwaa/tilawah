"use client";

/* — Kartu "lanjut baca": muncul hanya jika ada riwayat di perangkat. — */

import Link from "next/link";
import { useLastRead } from "@/lib/store/bookmark";
import { timeAgo } from "@/lib/utils";

export function LastReadCard() {
  const [lr] = useLastRead();
  if (!lr) return null;

  return (
    <section className="section--tight container-page" aria-label="Lanjut baca">
      <div className="card" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }}>
        <div>
          <p className="t-xs t-muted" style={{ margin: 0, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Lanjut baca
          </p>
          <p style={{ margin: "var(--space-1) 0 0", fontSize: "var(--text-lg)", fontWeight: 600 }}>
            {lr.namaLatin} · Ayat {lr.ayat}
          </p>
          <p className="t-xs t-muted" style={{ margin: "var(--space-1) 0 0" }}>
            Terakhir dibaca {timeAgo(lr.ts)}
          </p>
        </div>
        <Link href={`/surat/${lr.nomor}?ayat=${lr.ayat}`} className="btn btn--primary">
          Lanjutkan
        </Link>
      </div>
    </section>
  );
}
