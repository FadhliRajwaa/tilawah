"use client";

/* — Panel jadwal sholat lengkap: pemilih kota, hitung mundur, tabel hari
 * ini, dan tabel bulanan.
 *
 * Logika kota/jadwal/hitung mundur tinggal di `lib/use-sholat.ts` — dipakai
 * bersama ringkasan di beranda. Yang khas di sini: pemilih kota dengan
 * pencarian, tabel bulanan, dan delapan waktu (termasuk imsak/terbit/dhuha).
 *
 * Catatan terverifikasi: API myquran TIDAK punya endpoint "kota terdekat"
 * (404) — pencarian kota memakai /kota/cari/{q}.
 */

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { JadwalHarian, Kota } from "@/lib/types";
import { cn, formatCountdown, hariIndo, tanggalHijriah } from "@/lib/utils";
import { WAKTU_SEMUA, WAKTU_WAJIB } from "@/lib/waktu-sholat";
import { useSholat, type KotaSimpan } from "@/lib/use-sholat";
import { AmbientImage } from "@/components/ambient-image";

export function SholatPanel() {
  const { kota, jadwal, bulanan, berikut, now, todayDate, loading, err, pilihKota } =
    useSholat({ bulanan: true });

  const [showBulanan, setShowBulanan] = useState(false);
  const [q, setQ] = useState("");
  const [hasil, setHasil] = useState<Kota[]>([]);
  const [openPicker, setOpenPicker] = useState(false);
  const debounceRef = useRef(0);

  /* ⚠️ Indeks pilihan yang disorot KEYBOARD.
   *
   * Versi sebelumnya hanya bisa dipakai dengan MOUSE: daftar muncul saat
   * mengetik, dan satu-satunya cara memilih adalah mengklik itemnya.
   * Pengguna keyboard tidak punya jalan sama sekali — tombol panah tidak
   * melakukan apa pun, Enter tidak memilih.
   *
   * Sekarang: ArrowDown/ArrowUp menggerakkan `aktif`, Enter memilih, Escape
   * menutup. `aktif` juga dipakai untuk `aria-activedescendant` supaya
   * pembaca layar tahu item mana yang sedang disorot. */
  const [aktif, setAktif] = useState(-1);

  /* Isi kolom pencarian dengan kota tersimpan begitu ia termuat */
  useEffect(() => {
    if (kota) setQ(kota.lokasi);
  }, [kota]);

  /* Cari kota — debounce 300ms, lewat route handler (cache 7 hari) */
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
        .then((data: Kota[]) => {
          setHasil(Array.isArray(data) ? data.slice(0, 20) : []);
          /* Hasil baru → sorotan keyboard kembali ke awal */
          setAktif(-1);
        })
        .catch(() => setHasil([]));
    }, 300);
    return () => window.clearTimeout(debounceRef.current);
  }, [q, openPicker]);

  const pilih = useCallback(
    (k: KotaSimpan) => {
      pilihKota(k);
      setOpenPicker(false);
      setQ(k.lokasi);
      setHasil([]);
    },
    [pilihKota],
  );

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
            onKeyDown={(e) => {
              /* Navigasi keyboard untuk daftar saran. Tanpa ini, satu-satunya
                 cara memilih kota adalah mengklik — pengguna keyboard tidak
                 punya jalan sama sekali. */
              if (!openPicker || hasil.length === 0) return;

              if (e.key === "ArrowDown") {
                e.preventDefault();
                setAktif((i) => (i + 1) % hasil.length);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setAktif((i) => (i <= 0 ? hasil.length - 1 : i - 1));
              } else if (e.key === "Enter" && aktif >= 0) {
                e.preventDefault();
                const k = hasil[aktif];
                if (k) pilih({ id: k.id, lokasi: k.lokasi });
              } else if (e.key === "Escape") {
                setOpenPicker(false);
                setAktif(-1);
              }
            }}
            aria-label="Cari kota"
            aria-expanded={openPicker && hasil.length > 0}
            role="combobox"
            aria-controls="kota-list"
            aria-autocomplete="list"
            /* Memberi tahu pembaca layar item mana yang sedang disorot
               panah — tanpa ini, navigasi panah tidak terdengar. */
            aria-activedescendant={aktif >= 0 ? `kota-opsi-${aktif}` : undefined}
          />
          {openPicker && hasil.length > 0 && (
            <div className="city-picker__list" id="kota-list" role="listbox">
              {hasil.map((k, i) => (
                <button
                  key={k.id}
                  id={`kota-opsi-${i}`}
                  type="button"
                  role="option"
                  aria-selected={kota?.id === k.id}
                  className={cn(
                    "city-picker__item",
                    kota?.id === k.id && "is-active",
                    i === aktif && "is-highlight",
                  )}
                  /* onMouseDown (bukan onClick) supaya tidak kalah oleh blur
                     input yang menutup daftar lebih dulu. */
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pilih({ id: k.id, lokasi: k.lokasi });
                  }}
                  onMouseEnter={() => setAktif(i)}
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
          {/* Kartu masjid — penanda bahwa ini halaman ibadah, bukan daftar biasa */}
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
              <p className="countdown__label">Menuju {berikut?.label}</p>
              {/* ⚠️ TANPA aria-live: nilai ini berubah setiap detik, dan
                `aria-live` akan membacakan hitung mundur 3.600 kali per jam —
                itu membuat pembaca layar tidak bisa dipakai. Yang dibacakan
                adalah LABEL-nya (waktu sholat berikutnya), bukan detiknya. */}
            <p className="countdown__time">
                {berikut ? formatCountdown(berikut.seconds) : "—"}
              </p>
              <p className="countdown__next">
                Waktu <b>{berikut?.time}</b> · {kota.lokasi} · {hariIndo(new Date(now))},{" "}
                {jadwal.tanggal} · {tanggalHijriah(new Date(now))}
              </p>
            </div>

            <div className="sholat-list" style={{ marginBottom: "var(--space-6)" }}>
              {WAKTU_SEMUA.map((w) => {
                const isNext = berikut?.key === w.key;
                const isWajib = (WAKTU_WAJIB as readonly string[]).includes(w.key);
                return (
                  <div key={w.key} className={cn("sholat-row", isNext && "is-next")}>
                    <span className="sholat-row__name">
                      {w.label}
                      {/* Imsak/terbit/dhuha bukan waktu sholat — ditandai titik
                          redup supaya tidak terlihat sama pentingnya. */}
                      {!isWajib && <span className="t-muted"> ·</span>}
                    </span>
                    <span className="sholat-row__time">{jadwal[w.key]}</span>
                  </div>
                );
              })}
            </div>

            {showBulanan && bulanan && (
              <JadwalBulanan rows={bulanan} lokasi={kota.lokasi} todayDate={todayDate} />
            )}
          </>
        )
      )}
    </div>
  );
}

/* ─── Tabel bulanan — komponen terpisah yang di-memo ───
 *
 * 270 sel (31 hari × 9 kolom). Kalau tabel ini ikut dirender ulang setiap
 * detik (karena `now` di hook berdetak 1 detik untuk hitung mundur), React
 * harus merekonsiliasi 270 elemen 60 kali per menit — dan itu terasa sebagai
 * ketukan di perangkat lambat.
 *
 * Dengan `memo`, ia hanya dirender ulang saat `todayDate` benar-benar
 * berubah (sekali sehari) atau saat datanya berganti. */
const JadwalBulanan = memo(function JadwalBulanan({
  rows,
  lokasi,
  todayDate,
}: {
  rows: JadwalHarian[];
  lokasi: string;
  todayDate: string;
}) {
  return (
    <div className="table-scroll">
      <table className="table">
        <caption>Jadwal {lokasi} — bulan ini</caption>
        <thead>
          <tr>
            <th>Tanggal</th>
            {WAKTU_SEMUA.map((w) => (
              <th key={w.key} style={{ textAlign: "end" }}>
                {w.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.date} className={cn(row.date === todayDate && "is-today")}>
              <td>{row.tanggal}</td>
              {WAKTU_SEMUA.map((w) => (
                <td key={w.key} className="is-num">
                  {row[w.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
