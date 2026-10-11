"use client";

/* — Daftar ayat tersimpan + riwayat baca terakhir. */

import Link from "next/link";
import { useBookmarks, useLastRead, removeBookmark } from "@/lib/store/bookmark";
import { timeAgo } from "@/lib/utils";

export function BookmarkList() {
  const list = useBookmarks();
  const [lr] = useLastRead();

  return (
    <>
      {lr && (
        <div className="card resume" style={{ marginBottom: "var(--space-6)" }}>
          <div>
            <p className="resume__label">Terakhir dibaca</p>
            <p className="resume__title">
              {lr.namaLatin} · Ayat {lr.ayat}
            </p>
          </div>
          <Link href={`/surat/${lr.nomor}?ayat=${lr.ayat}`} className="btn btn--outline">
            Lanjutkan membaca
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
          <div className="empty__actions">
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
                <Link href={`/surat/${b.nomor}?ayat=${b.ayat}`} className="bm-item__ref">
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
