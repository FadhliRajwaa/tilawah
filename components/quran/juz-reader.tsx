"use client";

/* — Reader Juz: ayat satu juz penuh, yang bisa mencakup beberapa surah.
 *
 * ⚠️ Rombak: duplikasi dengan reader surat dihapus.
 *
 * Versi lama menulis ulang toolbar (71 baris), baris aksi lima tombol
 * (85 baris), dan blok mushaf kontinu (~50 baris) yang sama persis dengan
 * reader surat. Sekarang semuanya memakai komponen bersama — file ini
 * tinggal berisi yang KHAS juz:
 *
 *   · penanda pergantian surah (juz bisa memuat beberapa surah)
 *   · label "Lanjutan" saat juz mulai di tengah surah
 *   · tombol "tandai juz selesai" di akhir halaman
 *
 * Mode per-ayat memakai `AyahCard` yang sama dengan reader surat, jadi
 * perilaku tombol putar/tafsir/tandai/salin identik di kedua halaman.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { TafsirItem } from "@/lib/types";
import type { JuzAyah } from "@/lib/api/juz";
import { usePrefs } from "@/lib/store/prefs";
import { setLastRead, useBookmarks } from "@/lib/store/bookmark";
import { readJuzProgress, toggleJuzProgress } from "@/lib/store/juz-progress";
import { usePlayer, type Track } from "@/components/player/player-provider";
import { OrnamentDivider } from "@/components/ornaments";
import { cn } from "@/lib/utils";
import { ReaderToolbar } from "./reader-toolbar";
import { TafsirModal } from "./tafsir-modal";
import { MushafFlow } from "./mushaf-flow";
import { AyahCard } from "./ayah-card";

/**
 * Penanda pergantian surah di dalam juz.
 *
 * Dua keadaan yang harus dibedakan:
 *  - `lanjutan` = juz MULAI di tengah surah (mis. Juz 6 mulai An-Nisa' 148).
 *    Labelnya harus jelas "dimulai dari ayat …", bukan seolah juz ini
 *    memuat surah itu dari awal.
 *  - bukan lanjutan = juz mulai tepat di ayat 1 surah.
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
        {lanjutan && <span className="juz-surah-divider__tag">Lanjutan</span>}
        <span className="juz-surah-divider__ar" lang="ar" dir="rtl">
          {nama}
        </span>
        <Link href={`/surat/${nomor}`} className="juz-surah-divider__name">
          {namaLatin}
          <span aria-hidden="true"> →</span>
        </Link>
        <span className="juz-surah-divider__arti">
          {lanjutan ? `dimulai dari ayat ${mulaiAyat}` : "dari ayat 1"}
        </span>
      </div>
    </div>
  );
}

interface Props {
  juzNomor: number;
  ayat: JuzAyah[];
}

export function JuzReader({ juzNomor, ayat }: Props) {
  const [prefs] = usePrefs();
  const { state, play } = usePlayer();
  const [tafsir, setTafsir] = useState<{
    surah: number;
    ayat: number;
    teks: string | null;
    loading: boolean;
  } | null>(null);

  /* ⚠️ Bookmark dibaca lewat HOOK, bukan `isBookmarked()` saat render.
   *
   * Versi sebelumnya memanggil `isBookmarked()` langsung di dalam map ayat.
   * Itu membaca localStorage setiap render, tapi TIDAK ADA yang memicu
   * render ulang setelah `toggleBookmark()` — jadi tombol "Tandai" tetap
   * berbunyi "Tandai" walau ayatnya sudah tersimpan. Pengguna harus
   * me-refresh halaman untuk melihat perubahannya.
   *
   * Hook ini mendengarkan event `tilawah:marks-changed` (dipancarkan store)
   * dan event `storage` (tab lain), jadi daftarnya ikut ter-update seketika. */
  const bookmarks = useBookmarks();
  const markedSet = useMemo(
    () => new Set(bookmarks.map((b) => `${b.nomor}:${b.ayat}`)),
    [bookmarks],
  );

  /* Queue audio seluruh juz — otomatis lanjut lintas surah */
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
   * Juz TIDAK langsung ditandai "selesai" saat dibuka — kalau begitu, juz
   * yang cuma diklik sekali langsung berlabel selesai dan itu menyesatkan.
   * Progres di sini hanya "terakhir dibaca"; tanda selesai diberikan
   * pengguna lewat tombol di akhir halaman. */
  useEffect(() => {
    const first = ayat[0];
    if (first) {
      setLastRead({
        nomor: first.surahNomor,
        ayat: first.nomorAyat,
        namaLatin: first.surahNamaLatin,
      });
    }
  }, [ayat]);

  const [selesai, setSelesai] = useState(false);
  useEffect(() => {
    setSelesai(readJuzProgress().includes(juzNomor));
  }, [juzNomor]);

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

  const namaSurah = (n: number) => ayat.find((a) => a.surahNomor === n)?.surahNamaLatin ?? "";

  /* Ayat juz berbentuk `JuzAyah` (Ayah + metadata surah). AyahCard
     mengharapkan `Ayah` murni, jadi metadata surahnya dikeluarkan dulu —
     ia diteruskan lewat prop terpisah (`surahNomor`, `surahNama`). */
  const asAyah = (a: JuzAyah) => ({
    nomorAyat: a.nomorAyat,
    teksArab: a.teksArab,
    teksLatin: a.teksLatin,
    teksIndonesia: a.teksIndonesia,
    audio: a.audio,
  });

  return (
    <>
      <ReaderToolbar />

      <div className="container-page">
        {prefs.readMode === "ayat" ? (
          <div className="stack-3">
            {ayat.map((a, i) => {
              const prev = ayat[i - 1];
              const gantiSurah = !prev || prev.surahNomor !== a.surahNomor;
              const key = `${a.surahNomor}:${a.nomorAyat}`;

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

                  <AyahCard
                    /* id unik lintas surah: satu juz bisa memuat 2+ surah,
                       dan `ayat-1` akan muncul berkali-kali tanpa ini. */
                    idPrefix={`ayat-${a.surahNomor}`}
                    surahNomor={a.surahNomor}
                    surahNama={a.surahNamaLatin}
                    ayah={asAyah(a)}
                    queue={queue}
                    isActive={state.track?.surahNomor === a.surahNomor && state.playing}
                    isTarget={false}
                    onOpenTafsir={() => openTafsir(a.surahNomor, a.nomorAyat)}
                    markedOverride={markedSet.has(key)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ padding: "var(--space-6)" }}>
            <MushafFlow
              ayat={ayat}
              penandaSurah
              /* Sama seperti AyahCard: id harus unik lintas surah. Karena
                 MushafFlow menomori per AYAT (bukan per surah:ayat), ia
                 menerima fungsi awalan, bukan string tetap. */
              idPrefix={(a) => `mushaf-${a.surahNomor}-${a.nomorAyat}`}
              playingKey={
                state.playing && state.track
                  ? `${state.track.surahNomor}:${state.track.ayat}`
                  : null
              }
              onPlay={(a) => {
                const url = a.audio?.[prefs.reciter];
                if (!url) return;
                play(
                  {
                    key: `${a.surahNomor}:${a.nomorAyat}`,
                    url,
                    urls: { ...(a.audio ?? {}) },
                    surahNomor: a.surahNomor!,
                    /* ⚠️ `surahNamaLatin`, bukan `surahNama`.
                       `JuzAyah` punya KEDUANYA: `surahNama` = teks Arab
                       (untuk penanda mushaf), `surahNamaLatin` = transliterasi
                       (untuk label UI). Versi ini sempat memakai yang Arab,
                       sehingga dock pemutar menampilkan "يٰس" alih-alih
                       "Yasin" saat memutar ayat dari halaman juz. */
                    surahNama: a.surahNamaLatin,
                    ayat: a.nomorAyat,
                    full: false,
                  },
                  queue,
                );
              }}
              onOpenTafsir={(a) => openTafsir(a.surahNomor!, a.nomorAyat)}
            />
          </div>
        )}
      </div>

      {/* — penutup juz: navigasi + tandai selesai — */}
      <div className="container-page juz-foot">
        <OrnamentDivider className="ornament-divider" />
        <p className="juz-foot__label">Akhir Juz {juzNomor}</p>
        <div className="juz-foot__actions">
          <button
            type="button"
            className={cn("btn", selesai ? "btn--outline is-on" : "btn--primary")}
            onClick={() => setSelesai(toggleJuzProgress(juzNomor))}
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

      <TafsirModal
        open={tafsir !== null}
        title="Tafsir Kemenag"
        reference={tafsir ? `QS. ${namaSurah(tafsir.surah)} : ${tafsir.ayat}` : ""}
        text={tafsir?.teks ?? null}
        loading={tafsir?.loading ?? false}
        onClose={closeTafsir}
      />
    </>
  );
}
