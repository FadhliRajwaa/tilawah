"use client";

/* — Modal tafsir Kemenag.
 *
 * ⚠️ Diekstrak dari duplikasi antara `surah-reader.tsx` dan `juz-reader.tsx`.
 * Keduanya menulis dialog yang sama (backdrop, kepala, tombol tutup, badan,
 * sumber) plus blok `useEffect` yang sama untuk Esc + kunci scroll.
 *
 * Perilaku yang ditangani di sini:
 *  · Esc menutup
 *  · klik backdrop menutup (klik di dalam panel tidak)
 *  · scroll halaman dikunci selama modal terbuka
 *  · fokus dipindahkan ke panel saat dibuka
 *
 * Catatan aksesibilitas: ini bukan `<dialog>` native seperti lightbox
 * gambar, karena pemanggilnya perlu mengontrol status buka dari luar
 * (reader memegang nomor ayat yang sedang ditafsirkan). Focus trap-nya
 * disederhanakan: fokus masuk ke panel, Esc menutup, dan backdrop menutup.
 * Itu cukup untuk dialog informasi satu tombol — tidak ada urutan fokus
 * rumit yang perlu dikurung.
 */

import { useEffect, useRef } from "react";
import { IconClose } from "@/components/icons";

interface Props {
  open: boolean;
  title: string;
  /** mis. "QS. Al-Baqarah : 255" */
  reference: string;
  text: string | null;
  loading: boolean;
  onClose: () => void;
}

export function TafsirModal({ open, title, reference, text, loading, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  /* Simpan elemen yang punya fokus SEBELUM modal dibuka, supaya fokusnya
     bisa dikembalikan ke sana saat modal ditutup. Tanpa ini, pengguna
     keyboard yang menutup modal kehilangan posisinya dan harus menekan Tab
     dari awal halaman. */
  const balikKeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    /* Simpan & pindahkan fokus. `activeElement` bisa berupa `body` kalau
       modal dibuka lewat klik mouse — dalam hal itu tidak ada yang perlu
       dikembalikan, dan itu ditangani di cleanup. */
    balikKeRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      /* Kembalikan fokus ke pemicunya */
      balikKeRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        /* Hanya klik di backdrop yang menutup — klik di dalam panel
           (mis. saat menyeleksi teks) tidak boleh menutup. */
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} — ${reference}`}
        tabIndex={-1}
      >
        <div className="modal__head">
          <div>
            <h2 className="modal__title">{title}</h2>
            <p className="modal__ref">{reference}</p>
          </div>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Tutup tafsir"
          >
            <IconClose />
          </button>
        </div>

        <div className="modal__body">
          {loading ? (
            /* Kerangka tiga baris — bentuknya mengikuti teks yang akan
               menggantikannya, jadi tidak ada lompatan tata letak. */
            <div className="stack-3" aria-hidden="true">
              <div className="skeleton" style={{ height: 14 }} />
              <div className="skeleton" style={{ height: 14 }} />
              <div className="skeleton" style={{ height: 14, width: "62%" }} />
            </div>
          ) : text ? (
            <p className="modal__text">{text}</p>
          ) : (
            <p className="t-muted">Tafsir untuk ayat ini belum tersedia.</p>
          )}
          <p className="modal__source">Sumber: Tafsir Kemenag RI — via equran.id</p>
        </div>
      </div>
    </div>
  );
}
