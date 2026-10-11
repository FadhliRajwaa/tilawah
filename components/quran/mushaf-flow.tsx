"use client";

/* — Mode mushaf: satu lembar mengalir, bukan daftar kartu.
 *
 * ⚠️ Diekstrak dari duplikasi antara `surah-reader.tsx` dan `juz-reader.tsx`
 * — keduanya menulis blok ini utuh (~50 baris yang sama persis), hanya
 * berbeda pada cara menandai pergantian surah.
 *
 * Perbedaan itu diserap oleh prop `penandaSurah`:
 *   · reader SURAT  → tidak perlu penanda (satu surah saja)
 *   · reader JUZ    → perlu penanda, karena satu juz bisa memuat beberapa surah
 *
 * Catatan desain: teks Arab disambung jadi satu paragraf, dengan nomor ayat
 * sebagai penanda bulat emas yang bisa diklik untuk membuka tafsir. Mengetuk
 * teksnya memutar murottal ayat itu. Dua aksi, dua area klik — tidak ada
 * tombol terpisah yang mengotori lembaran.
 */

import { cn, toArabicNumber } from "@/lib/utils";

export interface MushafAyah {
  nomorAyat: number;
  teksArab: string;
  /** nomor surah — dipakai untuk membedakan penanda saat lintas surah */
  surahNomor?: number;
  /** nama Arab surah — hanya perlu kalau `penandaSurah` aktif */
  surahNama?: string;
}

interface Props<T extends MushafAyah> {
  ayat: T[];
  /** ayat yang sedang diputar (kunci `surah:ayat`, atau nomor ayat untuk surat) */
  playingKey?: string | null;
  /** ayat sasaran deep-link — diberi sorot sementara */
  targetAyah?: number | null;
  /**
   * Awalan id elemen. Bisa string (`mushaf` → `mushaf-5`) atau FUNGSI
   * (`(a) => \`mushaf-${a.surahNomor}-${a.nomorAyat}\``).
   *
   * Fungsi diperlukan reader juz: di sana satu halaman memuat beberapa
   * surah, jadi `mushaf-5` akan muncul lebih dari sekali — dan
   * `getElementById` hanya mengembalikan yang pertama, sehingga deep-link
   * menggulir ke ayat yang salah.
   */
  idPrefix?: string | ((a: T) => string);
  /** tampilkan penanda pergantian surah (dipakai reader juz) */
  penandaSurah?: boolean;
  onPlay: (a: T) => void;
  onOpenTafsir: (a: T) => void;
}

export function MushafFlow<T extends MushafAyah>({
  ayat,
  playingKey,
  targetAyah,
  idPrefix = "mushaf",
  penandaSurah = false,
  onPlay,
  onOpenTafsir,
}: Props<T>) {
  return (
    <>
      <div className="mushaf-flow arabic" lang="ar" dir="rtl">
        {ayat.map((a, i) => {
          const prev = ayat[i - 1];
          /* Pergantian surah terdeteksi kalau nomor surahnya berbeda dari
             ayat sebelumnya. Hanya relevan di reader juz. */
          const gantiSurah =
            penandaSurah && (!prev || prev.surahNomor !== a.surahNomor);
          const key = a.surahNomor ? `${a.surahNomor}:${a.nomorAyat}` : String(a.nomorAyat);
          const isPlaying = playingKey === key;

          return (
            <span key={key}>
              {gantiSurah && a.surahNama && (
                <span className="mushaf-surah-mark" lang="ar" dir="rtl">
                  {a.surahNama}
                </span>
              )}
              <span
                className={cn("mushaf-ayah", targetAyah === a.nomorAyat && "is-target")}
                id={
                  typeof idPrefix === "function"
                    ? idPrefix(a)
                    : `${idPrefix ?? "mushaf"}-${a.nomorAyat}`
                }
              >
                <button
                  type="button"
                  className={cn("mushaf-ayah__tap", isPlaying && "is-playing")}
                  onClick={() => onPlay(a)}
                  aria-label={`Putar ayat ${a.nomorAyat}`}
                  title={`Putar ayat ${a.nomorAyat}`}
                >
                  {a.teksArab}
                </button>
                <button
                  type="button"
                  className="mushaf-marker"
                  onClick={() => onOpenTafsir(a)}
                  aria-label={`Buka tafsir ayat ${a.nomorAyat}`}
                  title={`Tafsir ayat ${a.nomorAyat}`}
                >
                  {toArabicNumber(a.nomorAyat)}
                </button>
              </span>
            </span>
          );
        })}
      </div>
      <p className="mushaf-hint">
        Ketuk teks ayat untuk memutar murottal · ketuk nomor untuk membuka tafsir
      </p>
    </>
  );
}
