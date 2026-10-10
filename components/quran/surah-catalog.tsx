"use client";

/* — Katalog surat: pencarian (nama/nomor/arti) + filter Makkiyah/Madaniyah. — */

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SurahSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "semua" | "Mekah" | "Madinah";

export function SurahCatalog({ list }: { list: SurahSummary[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return list.filter((s) => {
      if (filter !== "semua" && s.tempatTurun !== filter) return false;
      if (!term) return true;
      return (
        s.namaLatin.toLowerCase().includes(term) ||
        s.arti.toLowerCase().includes(term) ||
        String(s.nomor) === term ||
        String(s.nomor).padStart(3, "0") === term
      );
    });
  }, [list, q, filter]);

  return (
    <>
      <div style={{ display: "grid", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        <div className="searchbox">
          <input
            type="search"
            className="searchbox__input"
            placeholder="Cari surah — nama, arti, atau nomor (contoh: yasin, 36, cahaya)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Cari surah"
          />
        </div>
        <div className="filter-row" role="group" aria-label="Filter tempat turun">
          {(["semua", "Mekah", "Madinah"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              className={cn("chip", filter === f && "is-active")}
              style={
                filter === f
                  ? { borderColor: "var(--accent)", color: "var(--accent)", background: "var(--accent-soft)" }
                  : undefined
              }
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f === "semua" ? "Semua" : f === "Mekah" ? "Makkiyah" : "Madaniyah"}
            </button>
          ))}
          <span className="t-xs t-muted" style={{ marginInlineStart: "auto" }}>
            {results.length} surah
          </span>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="empty">
          <p className="empty__title">Tidak ada surah yang cocok</p>
          <p className="empty__desc">
            Coba kata kunci lain — misalnya &ldquo;yasin&rdquo;, &ldquo;cahaya&rdquo;, atau
            nomor surah seperti &ldquo;36&rdquo;.
          </p>
        </div>
      ) : (
        <div className="surah-grid">
          {results.map((s) => (
            <Link key={s.nomor} href={`/surat/${s.nomor}`} className="surah-item">
              <span className="surah-item__num">{s.nomor}</span>
              <span className="surah-item__body">
                <span className="surah-item__name">{s.namaLatin}</span>
                <span className="surah-item__sub">
                  {s.arti} · {s.jumlahAyat} ayat · {s.tempatTurun === "Mekah" ? "Makkiyah" : "Madaniyah"}
                </span>
              </span>
              <span className="surah-item__ar" lang="ar" dir="rtl">
                {s.nama}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
