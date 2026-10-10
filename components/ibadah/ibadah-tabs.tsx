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
            /* ⚠️ Rombak: kartu kotak → medali bernomor.
             *
             * Versi lama adalah 99 kotak identik berisi empat baris teks
             * bertumpuk. Bentuk itu datar dan melelahkan dipindai.
             *
             * Sekarang tiap nama adalah satu baris dalam daftar bernomor:
             * nomor di medali bundar, nama Arab besar sebagai fokus, latin
             * dan arti sebagai pendamping. Nomor ganjil diberi latar sangat
             * tipis supaya mata bisa mengikuti baris — teknik "zebra" khas
             * tabel cetak, bukan hiasan.
             *
             * Di layar lebar ia mengalir dua kolom: 99 nama jadi 50 baris,
             * tidak perlu menggulir panjang. */
            <ol className="asma" aria-label="99 Asmaul Husna">
              {filteredAsmaul.map((a) => (
                <li key={a.index} className="asma__item">
                  <span className="asma__no" aria-hidden="true">
                    {a.index}
                  </span>
                  <span className="asma__body">
                    <span className="asma__ar" lang="ar" dir="rtl">
                      {a.arabic}
                    </span>
                    <span className="asma__latin">{a.latin}</span>
                    <span className="asma__tr">{a.translation_id}</span>
                  </span>
                </li>
              ))}
            </ol>
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
            /* Doa: tiap doa adalah satu "halaman kecil" dengan judul sebagai
             * kepala dan teks Arab sebagai badan. Tanpa kotak — dipisah
             * garis rambut, sama seperti lembar mushaf di halaman baca. */
            <div className="doa-list">
              {filteredDoa.map((d, i) => (
                <article key={`${d.title}-${i}`} className="doa">
                  <h2 className="doa__title">{d.title}</h2>
                  <p className="arabic doa__ar" lang="ar" dir="rtl">
                    {d.arabic}
                  </p>
                  <p className="doa__latin">{d.latin}</p>
                  <p className="doa__tr">{d.translation}</p>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "sholat" && <SholatPanel />}
    </>
  );
}
