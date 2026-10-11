"use client";

/* — Jadwal sholat ringkas di beranda.
 *
 * Logika kota/jadwal/hitung mundur tinggal di `lib/use-sholat.ts` — dipakai
 * bersama panel lengkap di halaman Ibadah. Di sini hanya tampilannya: lima
 * waktu wajib (imsak/terbit/dhuha tidak relevan di ringkasan) + hitung mundur.
 */

import Link from "next/link";
import { WAKTU_WAJIB, LABEL_WAKTU } from "@/lib/waktu-sholat";
import { useSholat } from "@/lib/use-sholat";
import { cn, formatCountdown, hariIndo } from "@/lib/utils";

export function HomePrayer() {
  const { kota, jadwal, berikut, now, loading } = useSholat();

  return (
    <section className="section container-page" aria-labelledby="sholat-title">
      <div className="section__head">
        <div>
          <h2 id="sholat-title" className="section__title">
            Jadwal sholat
          </h2>
          <p className="section__sub">
            {kota ? kota.lokasi : "Pilih kota untuk menampilkan waktu sholat."}
            {jadwal ? ` · ${hariIndo(new Date(now))}, ${jadwal.tanggal}` : ""}
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
          <div className="empty__actions">
            <Link href="/ibadah?tab=sholat" className="btn btn--primary">
              Pilih kota
            </Link>
          </div>
        </div>
      ) : loading && !jadwal ? (
        <div className="skeleton" style={{ height: 140 }} aria-hidden="true" />
      ) : jadwal && berikut ? (
        <div className="stack-4">
          <div className="countdown">
            <p className="countdown__label">Menuju {berikut.label}</p>
            {/* ⚠️ TANPA aria-live: nilai ini berubah setiap detik, dan
                `aria-live` akan membacakan hitung mundur 3.600 kali per jam —
                itu membuat pembaca layar tidak bisa dipakai. Yang dibacakan
                adalah LABEL-nya (waktu sholat berikutnya), bukan detiknya. */}
            <p className="countdown__time">
              {formatCountdown(berikut.seconds)}
            </p>
            <p className="countdown__next">
              Waktu <b>{berikut.time}</b> · {kota.lokasi}
            </p>
          </div>

          <div className="sholat-list">
            {WAKTU_WAJIB.map((k) => (
              <div key={k} className={cn("sholat-row", berikut.key === k && "is-next")}>
                <span className="sholat-row__name">{LABEL_WAKTU[k]}</span>
                <span className="sholat-row__time">{jadwal[k]}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
