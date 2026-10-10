"use client";

/* — Panel pencarian terjemahan (alquran.cloud), dengan paginasi + sorotan kata. — */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { SearchMatch } from "@/lib/types";

const SARAN = ["sabar", "syukur", "yatim", "ilmu", "orang tua", "taubat"];

interface ApiResult {
  total: number;
  matches: SearchMatch[];
}

function highlight(text: string, term: string) {
  if (!term) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + term.length)}</mark>
      {text.slice(idx + term.length)}
    </>
  );
}

export function SearchPanel() {
  const [q, setQ] = useState("");
  const [committed, setCommitted] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const LIMIT = 20;

  const run = useCallback(
    (term: string, pageIdx: number) => {
      if (!term.trim()) return;
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setLoading(true);
      setErr(null);
      fetch(`/api/search?q=${encodeURIComponent(term)}&offset=${pageIdx * LIMIT}&limit=${LIMIT}`, {
        signal: ac.signal,
      })
        .then((r) => {
          if (!r.ok) throw new Error(String(r.status));
          return r.json();
        })
        .then((d: ApiResult) => {
          setData(d);
          setLoading(false);
        })
        .catch((e: unknown) => {
          if (e instanceof DOMException && e.name === "AbortError") return;
          setErr("Pencarian gagal. Periksa koneksi lalu coba lagi.");
          setLoading(false);
        });
    },
    [LIMIT],
  );

  useEffect(() => {
    if (committed) run(committed, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committed, page]);

  const submit = (term: string) => {
    setPage(0);
    setCommitted(term);
    if (term === committed) run(term, 0);
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1;

  return (
    <>
      <form
        className="searchbox"
        style={{ maxWidth: 620, marginInline: "auto" }}
        onSubmit={(e) => {
          e.preventDefault();
          submit(q);
        }}
      >
        <input
          type="search"
          className="searchbox__input"
          placeholder="Ketik kata kunci — contoh: sabar"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Kata kunci pencarian"
          autoFocus
        />
        <button type="submit" className="btn btn--primary" disabled={!q.trim()}>
          Cari
        </button>
      </form>

      {!committed && (
        <div className="chip-row" style={{ justifyContent: "center", marginTop: "var(--space-4)" }}>
          {SARAN.map((s) => (
            <button
              key={s}
              type="button"
              className="chip"
              onClick={() => {
                setQ(s);
                submit(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: "var(--space-6)" }}>
        {err && (
          <div className="error-banner" role="alert">
            {err}
          </div>
        )}

        {loading && !data && (
          <div className="stack-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton" style={{ height: 96 }} />
            ))}
          </div>
        )}

        {data && committed && (
          <>
            <p className="t-sm t-muted" style={{ marginBottom: "var(--space-4)" }} role="status">
              {data.total} ayat ditemukan untuk &ldquo;{committed}&rdquo;
              {data.total > LIMIT && ` — halaman ${page + 1} dari ${totalPages}`}
            </p>

            {data.matches.length === 0 ? (
              <div className="empty">
                <p className="empty__title">Tidak ada hasil</p>
                <p className="empty__desc">
                  Coba kata lain yang lebih umum, atau periksa ejaan. Pencarian
                  mencakup seluruh terjemahan Indonesia.
                </p>
              </div>
            ) : (
              <>
                {data.matches.map((m) => (
                  <Link
                    key={`${m.surah}-${m.ayah}`}
                    href={`/surat/${m.surah}?ayat=${m.ayah}`}
                    className="result-item"
                  >
                    <span className="result-item__ref">
                      QS. {m.surahNameLatin} : {m.ayah}
                    </span>
                    <p className="result-item__text">{highlight(m.text, committed)}</p>
                  </Link>
                ))}

                {totalPages > 1 && (
                  <nav
                    aria-label="Navigasi halaman hasil"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "var(--space-3)",
                      marginTop: "var(--space-5)",
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn--outline"
                      disabled={page === 0 || loading}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                    >
                      ← Sebelumnya
                    </button>
                    <span className="t-sm t-muted">
                      {page + 1} / {totalPages}
                    </span>
                    <button
                      type="button"
                      className="btn btn--outline"
                      disabled={page + 1 >= totalPages || loading}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Berikutnya →
                    </button>
                  </nav>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
