"use client";

/* — Tafsir Kemenag per ayat, dimuat saat dibuka.
 *
 * Data diambil dari `/api/tafsir/[surah]/[ayat]` — hanya ayat yang diminta
 * yang dikirim ke peramban (±3.000 karakter), bukan seluruh surah. Hasilnya
 * di-cache di memori supaya membuka ayat yang sama tidak mengunduh ulang.
 */

import { useEffect, useState } from "react";
import { Sheet } from "@/components/sheet";

const cache = new Map<string, string | null>();

export function TafsirSheet({
  target,
  onClose,
}: {
  /** null = tertutup; kalau tidak, surah & ayat yang dibuka */
  target: { s: number; n: number; ref: string } | null;
  onClose: () => void;
}) {
  const [teks, setTeks] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const key = target ? `${target.s}:${target.n}` : "";

  useEffect(() => {
    if (!target) return;
    const k = `${target.s}:${target.n}`;
    if (cache.has(k)) {
      setTeks(cache.get(k) ?? null);
      return;
    }
    let batal = false;
    setLoading(true);
    setTeks(null);
    fetch(`/api/tafsir/${target.s}/${target.n}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { teks?: string | null } | null) => {
        cache.set(k, d?.teks ?? null);
        if (!batal) {
          setTeks(d?.teks ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!batal) {
          setTeks(null);
          setLoading(false);
        }
      });
    return () => {
      batal = true;
    };
  }, [target]);

  return (
    <Sheet
      key={key}
      open={target !== null}
      onClose={onClose}
      title="Tafsir Kemenag"
      sub={target?.ref}
    >
      {loading ? (
        <div className="stack-3" aria-hidden="true">
          <div className="skeleton" style={{ height: 14 }} />
          <div className="skeleton" style={{ height: 14 }} />
          <div className="skeleton" style={{ height: 14, width: "62%" }} />
        </div>
      ) : teks ? (
        <>
          <p className="modal__text">{teks}</p>
          <p className="modal__source">Sumber: Tafsir Kemenag RI — via equran.id</p>
        </>
      ) : (
        <p className="t-muted">Tafsir untuk ayat ini belum tersedia.</p>
      )}
    </Sheet>
  );
}
