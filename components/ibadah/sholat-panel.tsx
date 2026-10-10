"use client";

/* — Panel jadwal sholat: pilih kota (pencarian), hitung mundur, tabel hari ini
 * + tabel bulanan. Catatan terverifikasi: API myquran TIDAK punya endpoint
 * "kota terdekat" (404) — pencarian kota memakai /kota/cari/{q}.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { JadwalHarian, Kota } from "@/lib/types";
import { cn, formatCountdown, hariIndo, secondsUntil } from "@/lib/utils";
import { AmbientImage } from "@/components/ambient-image";

const KEY = "tilawah:kota";
const WAKTU = [
  { key: "imsak", label: "Imsak" },
  { key: "subuh", label: "Subuh" },
  { key: "terbit", label: "Terbit" },
  { key: "dhuha", label: "Dhuha" },
  { key: "dzuhur", label: "Dzuhur" },
  { key: "ashar", label: "Ashar" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isya", label: "Isya" },
] as const;
const WAKTU_WAJIB = ["subuh", "dzuhur", "ashar", "maghrib", "isya"] as const;

interface KotaSimpan {
  id: string;
  lokasi: string;
}

export function SholatPanel() {
  const [kota, setKota] = useState<KotaSimpan | null>(null);
  const [jadwal, setJadwal] = useState<JadwalHarian | null>(null);
  const [bulanan, setBulanan] = useState<JadwalHarian[] | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [showBulanan, setShowBulanan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  /* pencarian kota */
  const [q, setQ] = useState("");
  const [hasil, setHasil] = useState<Kota[]>([]);
  const [openPicker, setOpenPicker] = useState(false);
  const debounceRef = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setKota(JSON.parse(raw) as KotaSimpan);
    } catch {
      /* abaikan */
    }
  }, []);

  const pilihKota = useCallback((k: KotaSimpan) => {
    setKota(k);
    setOpenPicker(false);
    setQ(k.lokasi);
    try {
      localStorage.setItem(KEY, JSON.stringify(k));
    } catch {
      /* abaikan */
    }
  }, []);

  /* cari kota (debounce 300ms, lewat route handler) */
  useEffect(() => {
    if (!openPicker) return;
    const term = q.trim();
    if (term.length < 3) {
      setHasil([]);
      return;
    }
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetch(`/api/sholat/kota?q=${encodeURIComponent(term)}`)
        .then((r) => r.json())
        .then((data: Kota[]) => setHasil(Array.isArray(data) ? data.slice(0, 20) : []))
        .catch(() => setHasil([]));
    }, 300);
    return () => window.clearTimeout(debounceRef.current);
  }, [q, openPicker]);

  /* ambil jadwal harian + bulanan */
  useEffect(() => {
    if (!kota) return;
    let cancelled = false;
    setLoading(true);
    setErr(null);
    const d = new Date();
    Promise.all([
      fetch(`/api/sholat?id=${kota.id}&y=${d.getFullYear()}&m=${d.getMonth() + 1}&d=${d.getDate()}`).then((r) => r.json()),
      fetch(`/api/sholat/bulanan?id=${kota.id}&y=${d.getFullYear()}&m=${d.getMonth() + 1}`).then((r) => r.json()),
    ])
      .then(([h, b]) => {
        if (cancelled) return;
        if (h?.subuh) setJadwal(h as JadwalHarian);
        else setErr("Jadwal tidak tersedia untuk kota ini.");
        if (Array.isArray(b)) setBulanan(b as JadwalHarian[]);
      })
      .catch(() => {
        if (!cancelled) setErr("Gagal memuat jadwal. Periksa koneksi lalu coba lagi.");
      })
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
    const nowD = new Date(now);
    for (const k of WAKTU_WAJIB) {
      const s = secondsUntil(jadwal[k], nowD);
      if (s > 0) {
        const label = WAKTU.find((w) => w.key === k)?.label ?? k;
        return { key: k, label, time: jadwal[k], seconds: s };
      }
    }
    return {
      key: "subuh" as const,
      label: "Subuh (besok)",
      time: jadwal.subuh,
      seconds: secondsUntil(jadwal.subuh, nowD) + 86400,
    };
  }, [jadwal, now]);

  const todayDate = new Date().toISOString().slice(0, 10);

  return (
    <div>
      {/* — pemilih kota — */}
      <div className="sholat-head">
        <div className="city-picker">
          <input
            type="text"
            className="searchbox__input"
            placeholder="Cari kota — contoh: jakarta, surabaya, bandung"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpenPicker(true);
            }}
            onFocus={() => setOpenPicker(true)}
            onBlur={() => window.setTimeout(() => setOpenPicker(false), 180)}
            aria-label="Cari kota"
            aria-expanded={openPicker && hasil.length > 0}
            role="combobox"
            aria-controls="kota-list"
          />
          {openPicker && hasil.length > 0 && (
            <div className="city-picker__list" id="kota-list" role="listbox">
              {hasil.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  role="option"
                  aria-selected={kota?.id === k.id}
                  className={cn("city-picker__item", kota?.id === k.id && "is-active")}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pilihKota({ id: k.id, lokasi: k.lokasi });
                  }}
                >
                  {k.lokasi}
                </button>
              ))}
            </div>
          )}
        </div>

        {kota && (
          <button
            type="button"
            className={cn("btn btn--outline", showBulanan && "is-on")}
            onClick={() => setShowBulanan((v) => !v)}
            aria-pressed={showBulanan}
          >
            {showBulanan ? "Sembunyikan tabel bulanan" : "Tabel bulanan"}
          </button>
        )}
      </div>

      {err && (
        <div className="error-banner" role="alert" style={{ marginBottom: "var(--space-4)" }}>
          {err}
        </div>
      )}

      {!kota ? (
        <>
          {/* kartu masjid — penanda bahwa ini halaman ibadah, bukan daftar biasa */}
          <div className="mosque-card" style={{ marginBottom: "var(--space-4)" }}>
            <AmbientImage variant="ibadah-istiqlal" intensity={0.5} position="center 55%" />
            <div className="mosque-card__veil" aria-hidden="true" />
            <div className="mosque-card__body">
              <p className="mosque-card__label">Masjid Istiqlal · Jakarta</p>
              <p className="mosque-card__name">Waktu sholat, akurat untuk kota Anda</p>
            </div>
          </div>
          <div className="empty">
            <p className="empty__title">Pilih kota Anda</p>
            <p className="empty__desc">
              518 kota &amp; kabupaten Indonesia tersedia. Ketik minimal 3 huruf pada
              kolom di atas, lalu pilih dari daftar.
            </p>
          </div>
        </>
      ) : loading && !jadwal ? (
        <div className="skeleton" style={{ height: 180 }} aria-hidden="true" />
      ) : (
        jadwal && (
          <>
            <div className="countdown" style={{ marginBottom: "var(--space-5)" }}>
              <p className="countdown__label">Menuju {next?.label}</p>
              <p className="countdown__time" aria-live="polite">
                {next ? formatCountdown(next.seconds) : "—"}
              </p>
              <p className="countdown__next">
                Waktu <b>{next?.time}</b> · {kota.lokasi} ·{" "}
                {hariIndo(new Date())}, {jadwal.tanggal}
              </p>
            </div>

            <div className="sholat-list" style={{ marginBottom: "var(--space-6)" }}>
              {WAKTU.map((w) => {
                const isNext = next?.key === w.key;
                const isWajib = (WAKTU_WAJIB as readonly string[]).includes(w.key);
                return (
                  <div key={w.key} className={cn("sholat-row", isNext && "is-next")}>
                    <span className="sholat-row__name">
                      {w.label}
                      {!isWajib && <span className="t-muted"> ·</span>}
                    </span>
                    <span className="sholat-row__time">{jadwal[w.key]}</span>
                  </div>
                );
              })}
            </div>

            {showBulanan && bulanan && (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "var(--text-sm)",
                    minWidth: 620,
                  }}
                >
                  <caption className="t-sm t-muted" style={{ textAlign: "left", paddingBottom: 8 }}>
                    Jadwal {kota.lokasi} — bulan ini
                  </caption>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: "1px solid var(--rule)" }}>Tanggal</th>
                      {WAKTU.map((w) => (
                        <th
                          key={w.key}
                          style={{ textAlign: "right", padding: "8px 10px", borderBottom: "1px solid var(--rule)", whiteSpace: "nowrap" }}
                        >
                          {w.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bulanan.map((row) => {
                      const isToday = row.date === todayDate;
                      return (
                        <tr
                          key={row.date}
                          style={isToday ? { background: "var(--accent-soft)" } : undefined}
                        >
                          <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--rule-2)", whiteSpace: "nowrap", fontWeight: isToday ? 600 : 400 }}>
                            {row.tanggal}
                          </td>
                          {WAKTU.map((w) => (
                            <td
                              key={w.key}
                              style={{
                                padding: "7px 10px",
                                borderBottom: "1px solid var(--rule-2)",
                                textAlign: "right",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              {row[w.key]}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
