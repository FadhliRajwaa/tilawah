"use client";

/* — Jadwal sholat ringkas di beranda: pilih kota (disimpan di perangkat),
 * hitung mundur waktu berikutnya. Pola dari riset UX jadwal sholat Indonesia.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { JadwalHarian } from "@/lib/types";
import { cn, formatCountdown, hariIndo, secondsUntil } from "@/lib/utils";

const KEY = "tilawah:kota";

interface KotaSimpan {
  id: string;
  lokasi: string;
}

export function HomePrayer() {
  const [kota, setKota] = useState<KotaSimpan | null>(null);
  const [jadwal, setJadwal] = useState<JadwalHarian | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [loading, setLoading] = useState(false);

  /* kota tersimpan */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setKota(JSON.parse(raw) as KotaSimpan);
    } catch {
      /* abaikan */
    }
  }, []);

  /* ambil jadwal via route handler (cache 1 jam di server) */
  useEffect(() => {
    if (!kota) return;
    let cancelled = false;
    setLoading(true);
    const d = new Date();
    fetch(`/api/sholat?id=${kota.id}&y=${d.getFullYear()}&m=${d.getMonth() + 1}&d=${d.getDate()}`)
      .then((r) => r.json())
      .then((j: JadwalHarian) => {
        if (!cancelled && j?.subuh) setJadwal(j);
      })
      .catch(() => undefined)
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [kota]);

  /* detak hitung mundur */
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const next = useMemo(() => {
    if (!jadwal) return null;
    const order = ["subuh", "dzuhur", "ashar", "maghrib", "isya"] as const;
    const labels: Record<string, string> = {
      subuh: "Subuh",
      dzuhur: "Dzuhur",
      ashar: "Ashar",
      maghrib: "Maghrib",
      isya: "Isya",
    };
    const nowD = new Date(now);
    for (const k of order) {
      const s = secondsUntil(jadwal[k], nowD);
      if (s > 0) return { key: k, label: labels[k], time: jadwal[k], seconds: s };
    }
    return { key: "subuh", label: "Subuh (besok)", time: jadwal.subuh, seconds: secondsUntil(jadwal.subuh, nowD) + 86400 };
  }, [jadwal, now]);

  return (
    <section className="section container-page" aria-labelledby="sholat-title">
      <div className="section__head">
        <div>
          <h2 id="sholat-title" className="section__title">
            Jadwal sholat
          </h2>
          <p className="section__sub">
            {kota ? kota.lokasi : "Pilih kota untuk menampilkan waktu sholat."}
            {jadwal ? ` · ${hariIndo(new Date())}, ${jadwal.tanggal}` : ""}
          </p>
        </div>
        <Link href="/ibadah?tab=sholat" className="section__link">
          Buka halaman ibadah →
        </Link>
      </div>

      {!kota ? (
        <div className="empty">
          <p className="empty__title">Belum ada kota terpilih</p>
          <p className="empty__desc">
            Buka halaman Ibadah → Jadwal Sholat untuk memilih kota Anda (518 kota
            tersedia). Pilihan disimpan di perangkat ini.
          </p>
          <div style={{ marginTop: "var(--space-4)" }}>
            <Link href="/ibadah?tab=sholat" className="btn btn--primary">
              Pilih kota
            </Link>
          </div>
        </div>
      ) : loading && !jadwal ? (
        <div className="skeleton" style={{ height: 140 }} aria-hidden="true" />
      ) : jadwal && next ? (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "var(--space-4)" }}>
          <div className="countdown">
            <p className="countdown__label">Menuju {next.label}</p>
            <p className="countdown__time" aria-live="polite">
              {formatCountdown(next.seconds)}
            </p>
            <p className="countdown__next">
              Waktu <b>{next.time}</b> · {kota.lokasi}
            </p>
          </div>
          <div className="sholat-list">
            {(["subuh", "dzuhur", "ashar", "maghrib", "isya"] as const).map((k) => {
              const labels: Record<string, string> = {
                subuh: "Subuh",
                dzuhur: "Dzuhur",
                ashar: "Ashar",
                maghrib: "Maghrib",
                isya: "Isya",
              };
              return (
                <div key={k} className={cn("sholat-row", next.key === k && "is-next")}>
                  <span className="sholat-row__name">{labels[k]}</span>
                  <span className="sholat-row__time">{jadwal[k]}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
