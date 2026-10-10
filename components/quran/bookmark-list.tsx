"use client";

/* — Daftar ayat tersimpan + riwayat baca terakhir. — */

import Link from "next/link";
import { useBookmarks, useLastRead, removeBookmark } from "@/lib/store/bookmark";
import { timeAgo } from "@/lib/utils";

export function BookmarkList() {
  const list = useBookmarks();
  const [lr] = useLastRead();

  return (
    <>
      {lr && (
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <p className="t-xs t-muted" style={{ margin: 0, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Terakhir dibaca
          </p>
          <p style={{ margin: "var(--space-1) 0 var(--space-2)", fontWeight: 600 }}>
            {lr.namaLatin} · Ayat {lr.ayat}
          </p>
          <Link href={`/surat/${lr.nomor}?ayat=${lr.ayat}`} className="section__link">
            Lanjutkan membaca →
          </Link>
        </div>
      )}

      {list.length === 0 ? (
        <div className="empty">
          <p className="empty__title">Belum ada ayat tersimpan</p>
          <p className="empty__desc">
            Saat membaca, tekan tombol &ldquo;Tandai&rdquo; pada ayat untuk
            menyimpannya di sini. Tersimpan di perangkat Anda sendiri.
          </p>
          <div style={{ marginTop: "var(--space-4)" }}>
            <Link href="/surat/36" className="btn btn--primary">
              Mulai membaca Yasin
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="t-sm t-muted" style={{ marginBottom: "var(--space-4)" }}>
            {list.length} ayat tersimpan
          </p>
          {list.map((b) => (
            <div key={`${b.nomor}-${b.ayat}`} className="bm-item">
              <div className="bm-item__body">
                <Link
                  href={`/surat/${b.nomor}?ayat=${b.ayat}`}
                  className="bm-item__ref"
                  style={{ textDecoration: "none" }}
                >
                  QS. {b.namaLatin} : {b.ayat}
                </Link>
                <p className="bm-item__snippet">{b.snippet}</p>
                <p className="bm-item__time">Ditandai {timeAgo(b.ts)}</p>
              </div>
              <button
                type="button"
                className="btn btn--outline bm-item__remove"
                onClick={() => removeBookmark(b.nomor, b.ayat)}
                aria-label={`Hapus penanda QS. ${b.namaLatin} ayat ${b.ayat}`}
              >
                Hapus
              </button>
            </div>
          ))}
        </>
      )}
    </>
  );
}
