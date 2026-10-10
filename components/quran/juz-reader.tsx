"use client";

/* — Reader Juz: menampilkan ayat satu juz penuh, yang bisa mencakup
 * beberapa surah sekaligus. Setiap pergantian surah diberi penanda jelas.
 *
 * Fitur sama dengan reader surat: mode per-ayat ↔ mushaf, pengaturan ukuran
 * Arab, latin/terjemahan, tafsir modal, audio 6 qari, bookmark, salin, tautan.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { TafsirItem } from "@/lib/types";
import type { JuzAyah } from "@/lib/api/juz";
import { usePrefs } from "@/lib/store/prefs";
import { setLastRead, toggleBookmark, isBookmarked } from "@/lib/store/bookmark";
import { readJuzProgress, toggleJuzProgress } from "@/lib/store/juz-progress";
import { usePlayer, type Track } from "@/components/player/player-provider";
import { AyahVoiceNote } from "@/components/player/ayah-voice-note";
import { AyahMedal, OrnamentDivider } from "@/components/ornaments";
import { cn, toArabicNumber } from "@/lib/utils";

const SCALES = [0.85, 1, 1.15, 1.3, 1.5];

function IconPlay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}
function IconBook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}
function IconBookmark({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21 12 16.5 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
    </svg>
  );
}
function IconCopy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function IconLink({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/**
 * Penanda surah di dalam juz.
 *
 * Ada dua keadaan yang harus dibedakan:
 * - `lanjutan` = juz ini MULAI di tengah surah (mis. Juz 6 mulai An-Nisa' 148,
 *   Juz 22 mulai Al-Ahzab 31). Labelnya harus jelas "lanjutan ayat …", bukan
 *   seolah juz ini memuat surah itu dari awal.
 * - bukan lanjutan = juz mulai tepat di ayat 1 surah (mis. Juz 14 mulai Al-Hijr 1).
 */
function SurahDivider({
  nomor,
  namaLatin,
  nama,
  mulaiAyat,
  lanjutan,
}: {
  nomor: number;
  namaLatin: string;
  nama: string;
  mulaiAyat: number;
  lanjutan: boolean;
}) {
  return (
    <div className="juz-surah-divider">
      <OrnamentDivider className="ornament-divider" />
      <div className="juz-surah-divider__body">
        {lanjutan && (
          <span className="juz-surah-divider__tag">Lanjutan</span>
        )}
        <span className="juz-surah-divider__ar" lang="ar" dir="rtl">
          {nama}
        </span>
        <Link href={`/surat/${nomor}`} className="juz-surah-divider__name">
          {namaLatin}
          <span aria-hidden="true"> →</span>
        </Link>
        {lanjutan ? (
          <span className="juz-surah-divider__arti">
            dimulai dari ayat {mulaiAyat}
          </span>
        ) : (
          <span className="juz-surah-divider__arti">dari ayat 1</span>
        )}
      </div>
    </div>
  );
}

interface Props {
  juzNomor: number;
  ayat: JuzAyah[];
}

export function JuzReader({ juzNomor, ayat }: Props) {
  const [prefs, updatePrefs] = usePrefs();
  const { state, play } = usePlayer();
  const [tafsir, setTafsir] = useState<{ surah: number; ayat: number; teks: string | null; loading: boolean } | null>(null);
  const [copied, setCopied] = useState<string>("");
  const savedRef = useRef(false);

  /* queue audio seluruh juz — otomatis lanjut lintas surah */
  const queue = useMemo<Track[]>(
    () =>
      ayat
        .map((a): Track | null => {
          const url = a.audio?.[prefs.reciter];
          if (!url) return null;
          return {
            key: `${a.surahNomor}:${a.nomorAyat}`,
            url,
            urls: { ...(a.audio ?? {}) },
            surahNomor: a.surahNomor,
            surahNama: a.surahNamaLatin,
            ayat: a.nomorAyat,
            full: false,
          };
        })
        .filter((t): t is Track => t !== null),
    [ayat, prefs.reciter],
  );

  /* Catat riwayat baca.
   *
   * CATATAN: juz TIDAK langsung ditandai "selesai" saat dibuka — dulu begitu,
   * akibatnya juz yang cuma diklik sekali langsung berlabel selesai (dan itu
   * menyesatkan). Sekarang progres dicatat sebagai "terakhir dibaca" saja;
   * tanda selesai diberikan pengguna lewat tombol di akhir halaman. */
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    const first = ayat[0];
    if (first) {
      setLastRead({ nomor: first.surahNomor, ayat: first.nomorAyat, namaLatin: first.surahNamaLatin });
    }
    try {
      // simpan juz yang sedang dibaca (untuk "lanjut baca"), bukan sebagai selesai
      localStorage.setItem(
        "tilawah:juz-terakhir",
        JSON.stringify({ nomor: juzNomor, ayat: first?.nomorAyat ?? 1, ts: Date.now() }),
      );
    } catch {
      /* abaikan */
    }
  }, [ayat, juzNomor]);

  /** Tandai juz ini selesai dibaca (dipanggil dari tombol di akhir halaman). */
  const [selesai, setSelesai] = useState(false);
  useEffect(() => {
    setSelesai(readJuzProgress().includes(juzNomor));
  }, [juzNomor]);

  const toggleSelesai = () => setSelesai(toggleJuzProgress(juzNomor));

  const openTafsir = useCallback((surah: number, nomorAyat: number) => {
    setTafsir({ surah, ayat: nomorAyat, teks: null, loading: true });
    fetch(`/api/tafsir/${surah}`)
      .then((r) => r.json())
      .then((d: { tafsir?: TafsirItem[] }) => {
        const teks = d.tafsir?.find((t) => t.ayat === nomorAyat)?.teks ?? null;
        setTafsir({ surah, ayat: nomorAyat, teks, loading: false });
      })
      .catch(() => setTafsir({ surah, ayat: nomorAyat, teks: null, loading: false }));
  }, []);

  const closeTafsir = useCallback(() => setTafsir(null), []);

  useEffect(() => {
    if (!tafsir) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeTafsir();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [tafsir, closeTafsir]);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(""), 1600);
    } catch {
      /* ditolak */
    }
  };

  const namaSurah = (n: number) => ayat.find((a) => a.surahNomor === n)?.surahNamaLatin ?? "";

  return (
    <>
      {/* toolbar */}
      <div className="reader-toolbar container-page" role="toolbar" aria-label="Pengaturan tampilan">
        <div className="reader-toolbar__group">
          <span className="reader-toolbar__label">Mode</span>
          <div className="segmented t-tabs" role="group" aria-label="Mode baca">
            <span className="t-tabs__indicator" aria-hidden="true" data-index={prefs.readMode === "ayat" ? 0 : 1} />
            <button
              type="button"
              className={cn("segmented__btn", prefs.readMode === "ayat" && "is-on")}
              onClick={() => updatePrefs({ readMode: "ayat" })}
              aria-pressed={prefs.readMode === "ayat"}
            >
              Per ayat
            </button>
            <button
              type="button"
              className={cn("segmented__btn", prefs.readMode === "mushaf" && "is-on")}
              onClick={() => updatePrefs({ readMode: "mushaf" })}
              aria-pressed={prefs.readMode === "mushaf"}
            >
              Mushaf
            </button>
          </div>
        </div>

        <div className="reader-toolbar__group">
          <span className="reader-toolbar__label">Ukuran Arab</span>
          <div className="stepper">
            <button
              type="button"
              className="stepper__btn"
              onClick={() => {
                const i = SCALES.findIndex((s) => s >= prefs.arabicScale - 0.001);
                updatePrefs({ arabicScale: SCALES[Math.max(0, i - 1)] });
              }}
              aria-label="Perkecil ukuran teks Arab"
            >
              −
            </button>
            <span className="stepper__val">{Math.round(prefs.arabicScale * 100)}%</span>
            <button
              type="button"
              className="stepper__btn"
              onClick={() => {
                const i = SCALES.findIndex((s) => s >= prefs.arabicScale - 0.001);
                updatePrefs({ arabicScale: SCALES[Math.min(SCALES.length - 1, i + 1)] });
              }}
              aria-label="Perbesar ukuran teks Arab"
            >
              +
            </button>
          </div>
        </div>

        <div className="reader-toolbar__group">
          <button
            type="button"
            className={cn("btn btn--outline", prefs.showLatin && "is-on")}
            onClick={() => updatePrefs({ showLatin: !prefs.showLatin })}
            aria-pressed={prefs.showLatin}
          >
            Latin
          </button>
          <button
            type="button"
            className={cn("btn btn--outline", prefs.showTranslation && "is-on")}
            onClick={() => updatePrefs({ showTranslation: !prefs.showTranslation })}
            aria-pressed={prefs.showTranslation}
          >
            Terjemahan
          </button>
        </div>
      </div>

      {/* isi */}
      <div className="container-page">
        {prefs.readMode === "ayat" ? (
          <div className="stack-3">
            {ayat.map((a, i) => {
              const prev = ayat[i - 1];
              const gantiSurah = !prev || prev.surahNomor !== a.surahNomor;
              const playingThis =
                state.playing &&
                state.track?.surahNomor === a.surahNomor &&
                state.track?.ayat === a.nomorAyat;
              const marked = typeof window !== "undefined" && isBookmarked(a.surahNomor, a.nomorAyat);
              const key = `${a.surahNomor}:${a.nomorAyat}`;
              /* ambil dari queue supaya objeknya identik dengan yang dipakai player */
              const track = queue.find((t) => t.key === key);

              return (
                <div key={key}>
                  {gantiSurah && (
                    <SurahDivider
                      nomor={a.surahNomor}
                      namaLatin={a.surahNamaLatin}
                      nama={a.surahNama}
                      mulaiAyat={a.nomorAyat}
                      lanjutan={a.nomorAyat > 1}
                    />
                  )}

                  <article id={`ayat-${key}`} className={cn("ayah", playingThis && "is-active")}>
                    <header className="ayah__head">
                      <AyahMedal nomor={a.nomorAyat} />
                      <span className="ayah__meta">
                        {a.surahNamaLatin} · Ayat {a.nomorAyat}
                      </span>
                    </header>

                    <p
                      className="arabic ayah__arabic"
                      lang="ar"
                      dir="rtl"
                      style={{ fontSize: `calc(var(--text-arabic) * ${prefs.arabicScale})` }}
                    >
                      {a.teksArab}
                    </p>

                    {prefs.showLatin && <p className="ayah__latin">{a.teksLatin}</p>}
                    {prefs.showTranslation && (
                      <p className="ayah__translation">{a.teksIndonesia}</p>
                    )}

                    {track && (
                      <AyahVoiceNote
                        track={track}
                        queue={queue}
                        teksLatin={a.teksLatin}
                        seed={a.surahNomor * 1000 + a.nomorAyat}
                      />
                    )}

                    <footer className="ayah__actions">
                      <button
                        type="button"
                        className={cn("ayah-action", playingThis && "is-on")}
                        onClick={() => {
                          const url = a.audio?.[prefs.reciter];
                          if (!url) return;
                          play(
                            {
                              key,
                              url,
                              urls: { ...(a.audio ?? {}) },
                              surahNomor: a.surahNomor,
                              surahNama: a.surahNamaLatin,
                              ayat: a.nomorAyat,
                              full: false,
                            },
                            queue,
                          );
                        }}
                        aria-label={`Putar ayat ${a.nomorAyat}`}
                      >
                        <IconPlay className="ayah-action__icon" />
                        {playingThis ? "Diputar" : "Putar"}
                      </button>

                      <button
                        type="button"
                        className="ayah-action"
                        onClick={() => openTafsir(a.surahNomor, a.nomorAyat)}
                        aria-label={`Buka tafsir ayat ${a.nomorAyat}`}
                      >
                        <IconBook className="ayah-action__icon" />
                        Tafsir
                      </button>

                      <button
                        type="button"
                        className={cn("ayah-action", marked && "is-on")}
                        onClick={() => {
                          toggleBookmark({
                            nomor: a.surahNomor,
                            ayat: a.nomorAyat,
                            namaLatin: a.surahNamaLatin,
                            snippet: a.teksIndonesia.slice(0, 110),
                          });
                        }}
                        aria-label={`Tandai ayat ${a.nomorAyat}`}
                      >
                        <IconBookmark className="ayah-action__icon" filled={marked} />
                        {marked ? "Ditandai" : "Tandai"}
                      </button>

                      <button
                        type="button"
                        className="ayah-action"
                        onClick={() =>
                          copy(
                            `${a.teksArab}\n\n${a.teksIndonesia}\n\n(QS. ${a.surahNamaLatin}: ${a.nomorAyat})`,
                            `ayat-${key}`,
                          )
                        }
                        aria-label="Salin ayat"
                      >
                        <IconCopy className="ayah-action__icon" />
                        {copied === `ayat-${key}` ? "Tersalin" : "Salin"}
                      </button>

                      <button
                        type="button"
                        className="ayah-action"
                        onClick={() =>
                          copy(
                            `${window.location.origin}/surat/${a.surahNomor}?ayat=${a.nomorAyat}`,
                            `link-${key}`,
                          )
                        }
                        aria-label="Salin tautan ayat"
                      >
                        <IconLink className="ayah-action__icon" />
                        {copied === `link-${key}` ? "Tersalin" : "Tautan"}
                      </button>
                    </footer>
                  </article>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ padding: "var(--space-6)" }}>
            <div className="mushaf-flow arabic" lang="ar" dir="rtl">
              {ayat.map((a, i) => {
                const prev = ayat[i - 1];
                const gantiSurah = !prev || prev.surahNomor !== a.surahNomor;
                return (
                  <span key={`${a.surahNomor}:${a.nomorAyat}`}>
                    {gantiSurah && (
                      <span className="mushaf-surah-mark" lang="ar" dir="rtl">
                        {a.surahNama}
                      </span>
                    )}
                    <button
                      type="button"
                      className="mushaf-ayah__tap"
                      onClick={() => {
                        const url = a.audio?.[prefs.reciter];
                        if (!url) return;
                        play(
                          {
                            key: `${a.surahNomor}:${a.nomorAyat}`,
                            url,
                            urls: { ...(a.audio ?? {}) },
                            surahNomor: a.surahNomor,
                            surahNama: a.surahNamaLatin,
                            ayat: a.nomorAyat,
                            full: false,
                          },
                          queue,
                        );
                      }}
                      aria-label={`Putar ayat ${a.nomorAyat}`}
                    >
                      {a.teksArab}
                    </button>
                    <button
                      type="button"
                      className="mushaf-marker"
                      onClick={() => openTafsir(a.surahNomor, a.nomorAyat)}
                      aria-label={`Buka tafsir ayat ${a.nomorAyat}`}
                    >
                      {toArabicNumber(a.nomorAyat)}
                    </button>
                  </span>
                );
              })}
            </div>
            <p className="mushaf-hint">
              Ketuk teks ayat untuk memutar murottal · ketuk nomor untuk membuka tafsir
            </p>
          </div>
        )}
      </div>

      {/* penutup juz: navigasi + tandai selesai */}
      <div className="container-page juz-foot">
        <OrnamentDivider className="ornament-divider" />
        <p className="juz-foot__label">Akhir Juz {juzNomor}</p>
        <div className="juz-foot__actions">
          <button
            type="button"
            className={cn("btn", selesai ? "btn--outline is-on" : "btn--primary")}
            onClick={toggleSelesai}
            aria-pressed={selesai}
          >
            {selesai ? "✓ Sudah ditandai selesai" : "Tandai juz ini selesai"}
          </button>
          {juzNomor < 30 ? (
            <Link href={`/juz/${juzNomor + 1}`} className="btn btn--outline">
              Lanjut ke Juz {juzNomor + 1} →
            </Link>
          ) : (
            <Link href="/juz" className="btn btn--outline">
              Kembali ke daftar juz
            </Link>
          )}
        </div>
      </div>

      {/* modal tafsir */}
      {tafsir && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeTafsir();
          }}
        >
          <div className="modal t-modal is-open" role="dialog" aria-modal="true" aria-label={`Tafsir ayat ${tafsir.ayat}`}>
            <div className="modal__head">
              <div>
                <h2 className="modal__title">Tafsir Kemenag</h2>
                <p className="modal__ref" style={{ marginBottom: 0 }}>
                  QS. {namaSurah(tafsir.surah)} : {tafsir.ayat}
                </p>
              </div>
              <button type="button" className="modal__close" onClick={closeTafsir} aria-label="Tutup tafsir">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="modal__body">
              {tafsir.loading ? (
                <div className="t-skeleton">
                  <span className="t-skeleton__line" />
                  <span className="t-skeleton__line" />
                  <span className="t-skeleton__line t-skeleton__line--short" />
                </div>
              ) : tafsir.teks ? (
                <p className="modal__text">{tafsir.teks}</p>
              ) : (
                <p className="t-muted">Tafsir untuk ayat ini belum tersedia.</p>
              )}
              <p className="modal__source">Sumber: Tafsir Kemenag RI — via equran.id</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
