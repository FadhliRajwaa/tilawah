"use client";

/* — Tab halaman ibadah: Asmaul Husna · Doa Harian · Jadwal Sholat.
 * Tab awal bisa ditentukan dari ?tab= (deep-link dari beranda).
 *
 * Pencarian di sini menyaring di KLIEN (bukan lewat API) karena datanya
 * sudah ada di halaman — 99 nama dan ~35 doa muat di memori, dan hasil
 * instan jauh lebih enak daripada menunggu jaringan untuk setiap ketikan.
 */

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { AsmaulHusnaItem, DoaItem } from "@/lib/types";
import { SholatPanel } from "./sholat-panel";
import { cn } from "@/lib/utils";

type Tab = "asmaulhusna" | "doa" | "sholat";

const TABS: { id: Tab; label: string }[] = [
  { id: "asmaulhusna", label: "Asmaul Husna" },
  { id: "doa", label: "Doa Harian" },
  { id: "sholat", label: "Jadwal Sholat" },
];

const PLACEHOLDER: Record<Exclude<Tab, "sholat">, string> = {
  asmaulhusna: "Cari nama — contoh: rahman, sabar",
  doa: "Cari doa — contoh: makan, tidur",
};

const KOSONG: Record<Exclude<Tab, "sholat">, string> = {
  asmaulhusna: "Coba kata lain — misalnya “rahman”, “malik”, atau nomor 1–99.",
  doa: "Coba kata lain — misalnya “makan”, “tidur”, atau “perjalanan”.",
};

export function IbadahTabs({ asmaul, doa }: { asmaul: AsmaulHusnaItem[]; doa: DoaItem[] }) {
  const searchParams = useSearchParams();
  const initial = searchParams.get("tab") as Tab | null;
  const [tab, setTab] = useState<Tab>(
    TABS.some((t) => t.id === initial) ? (initial as Tab) : "asmaulhusna",
  );
  const [q, setQ] = useState("");

  /* Sinkronkan URL agar tab bisa dibagikan. `replaceState` dipakai supaya
     tidak menumpuk riwayat setiap kali tab diklik. */
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
        (d) => d.title.toLowerCase().includes(term) || d.translation.toLowerCase().includes(term),
      )
    : doa;

  return (
    <>
      {/* ⚠️ role="tablist" MENGHARUSKAN pasangan role="tabpanel" dengan
          `aria-labelledby` yang menunjuk balik ke tabnya. Tanpa itu,
          pembaca layar mengumumkan "tab, 1 dari 3" tapi tidak pernah
          memberi tahu isi mana yang tampil — kontrak ARIA-nya setengah
          jadi, dan itu lebih membingungkan daripada tidak memakai role
          sama sekali.

          Sekarang tiap tab punya id, dan wadah isinya (di bawah) punya
          role="tabpanel" + aria-labelledby. */}
      <div className="tabs" role="tablist" aria-label="Pilih bagian ibadah">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            /* Tab yang tidak aktif tidak boleh masuk urutan Tab — panah yang
               berpindah antar tab, sesuai pola WAI-ARIA untuk tablist. */
            tabIndex={tab === t.id ? 0 : -1}
            className={cn("tab", tab === t.id && "is-on")}
            onClick={() => {
              setTab(t.id);
              setQ("");
            }}
            onKeyDown={(e) => {
              /* Panah kiri/kanan berpindah tab (pola tablist WAI-ARIA).
                 Fokus mengikuti supaya pembaca layar mengumumkan tab baru. */
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const i = TABS.findIndex((x) => x.id === tab);
              const n = (i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length;
              setTab(TABS[n].id);
              setQ("");
              document.getElementById(`tab-${TABS[n].id}`)?.focus();
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        /* tabIndex=0 membuat panel bisa difokus — diperlukan kalau isinya
           tidak punya elemen fokusable sendiri (mis. daftar doa murni). */
        tabIndex={0}
        className="tab-panel"
      >
      {tab !== "sholat" && (
        <div className="searchbox" style={{ marginBottom: "var(--space-5)", maxWidth: 480 }}>
          <input
            type="search"
            className="searchbox__input"
            placeholder={PLACEHOLDER[tab]}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Cari"
          />
        </div>
      )}

      {tab === "asmaulhusna" &&
        (filteredAsmaul.length === 0 ? (
          <div className="empty">
            <p className="empty__title">Tidak ditemukan</p>
            <p className="empty__desc">{KOSONG.asmaulhusna}</p>
          </div>
        ) : (
          /* Daftar bernomor: nomor di medali, nama Arab jadi fokus, latin
             dan arti sebagai pendamping. Di layar lebar mengalir dua kolom. */
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
        ))}

      {tab === "doa" &&
        (filteredDoa.length === 0 ? (
          <div className="empty">
            <p className="empty__title">Tidak ditemukan</p>
            <p className="empty__desc">{KOSONG.doa}</p>
          </div>
        ) : (
          /* Tiap doa adalah "halaman kecil": judul sebagai kepala, teks Arab
             sebagai badan, dipisah garis rambut — sama seperti lembar mushaf. */
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
        ))}

      {tab === "sholat" && <SholatPanel />}
      </div>
    </>
  );
}
