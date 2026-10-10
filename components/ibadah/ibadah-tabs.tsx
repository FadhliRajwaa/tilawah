"use client";

/* — Tab halaman ibadah: Asmaul Husna · Doa Harian · Jadwal Sholat.
 * Tab awal bisa ditentukan dari ?tab= (deep-link dari beranda).
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { AsmaulHusnaItem, DoaItem } from "@/lib/types";
import { SholatPanel } from "./sholat-panel";
import { cn, toArabicNumber } from "@/lib/utils";

type Tab = "asmaulhusna" | "doa" | "sholat";

const TABS: { id: Tab; label: string }[] = [
  { id: "asmaulhusna", label: "Asmaul Husna" },
  { id: "doa", label: "Doa Harian" },
  { id: "sholat", label: "Jadwal Sholat" },
];

export function IbadahTabs({ asmaul, doa }: { asmaul: AsmaulHusnaItem[]; doa: DoaItem[] }) {
  const searchParams = useSearchParams();
  const initial = (searchParams.get("tab") as Tab | null) ?? "asmaulhusna";
  const [tab, setTab] = useState<Tab>(
    TABS.some((t) => t.id === initial) ? initial : "asmaulhusna",
  );
  const [q, setQ] = useState("");

  /* sinkronkan URL agar bisa dibagikan */
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(null, "", url.toString());
  }, [tab]);

  const term = q.trim().toLowerCase();
  const filteredAsmaul = term
    ? asmaul.filter(
        (a) =>
          a.latin.toLowerCase().includes(term) ||
          a.translation_id.toLowerCase().includes(term) ||
          a.index === term,
      )
    : asmaul;
  const filteredDoa = term
    ? doa.filter(
        (d) =>
          d.title.toLowerCase().includes(term) ||
          d.translation.toLowerCase().includes(term),
      )
    : doa;

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Pilih bagian ibadah">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={cn("tab", tab === t.id && "is-on")}
            onClick={() => {
              setTab(t.id);
              setQ("");
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab !== "sholat" && (
        <div className="searchbox" style={{ marginBottom: "var(--space-5)", maxWidth: 480 }}>
          <input
            type="search"
            className="searchbox__input"
            placeholder={tab === "asmaulhusna" ? "Cari nama — contoh: rahman, sabar" : "Cari doa — contoh: makan, tidur"}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Cari"
          />
        </div>
      )}

      {tab === "asmaulhusna" && (
        <>
          {filteredAsmaul.length === 0 ? (
            <div className="empty">
              <p className="empty__title">Tidak ditemukan</p>
              <p className="empty__desc">
                Coba kata lain — misalnya &ldquo;rahman&rdquo;, &ldquo;malik&rdquo;, atau nomor 1–99.
              </p>
            </div>
          ) : (
            <div className="ah-grid">
              {filteredAsmaul.map((a) => (
                <div key={a.index} className="ah-card">
                  <p className="ah-card__no">{a.index}</p>
                  <p className="ah-card__ar" lang="ar" dir="rtl">
                    {a.arabic}
                  </p>
                  <p className="ah-card__latin">{a.latin}</p>
                  <p className="ah-card__tr">{a.translation_id}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "doa" && (
        <>
          {filteredDoa.length === 0 ? (
            <div className="empty">
              <p className="empty__title">Tidak ditemukan</p>
              <p className="empty__desc">
                Coba kata lain — misalnya &ldquo;makan&rdquo;, &ldquo;tidur&rdquo;, atau
                &ldquo;perjalanan&rdquo;.
              </p>
            </div>
          ) : (
            filteredDoa.map((d, i) => (
              <article key={`${d.title}-${i}`} className="doa-item">
                <h2 className="doa-item__title">{d.title}</h2>
                <p className="arabic doa-item__ar" lang="ar" dir="rtl">
                  {d.arabic}
                </p>
                <p className="doa-item__latin">{d.latin}</p>
                <p className="doa-item__tr">{d.translation}</p>
              </article>
            ))
          )}
        </>
      )}

      {tab === "sholat" && <SholatPanel />}
    </>
  );
}
