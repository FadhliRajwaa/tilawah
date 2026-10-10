"use client";

/* — Lightbox gambar ————————————————————————————————————————————————
 *
 * Klik gambar mana pun (galeri, banner, header halaman) → terbuka lapisan
 * gelap berisi gambar resolusi besar, keterangan, lisensi, dan tautan ke
 * Wikimedia Commons.
 *
 * Kenapa lightbox, bukan langsung ke Wikimedia:
 *   Pembaca yang tertarik pada satu foto kemungkinan besar cuma ingin
 *   MELIHAT lebih jelas — melempar mereka ke tab baru berarti meninggalkan
 *   halaman baca. Lightbox memberi lihat-besar, dan tautan sumber tetap
 *   tersedia bagi yang memang mau atribusi lengkap.
 *
 * Kenapa pakai <dialog>: elemen native memberi Esc, focus trap, dan lapisan
 * modal gratis dari peramban — tidak perlu perangkap fokus buatan sendiri.
 *
 * Aksesibilitas: gambar pemicu dibungkus <button> supaya bisa dijangkau
 * Tab dan Enter, bukan <div onClick> yang tak terlihat oleh papan tik.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { CreditEntry } from "@/lib/data/credits";

export interface LightboxImage {
  /** nama aset tanpa akhiran varian, mis. "card-dome-mosaic" */
  name: string;
  /** ukuran terbesar yang tersedia */
  src: string;
  caption: string;
  position?: string;
  /** entri atribusi bila ada */
  credit?: CreditEntry;
}

interface Props {
  image: LightboxImage | null;
  onClose: () => void;
}

export function ImageLightbox({ image, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (image && !el.open) el.showModal();
    else if (!image && el.open) el.close();
  }, [image]);

  const handleBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  if (!image) return null;

  return (
    <dialog ref={ref} className="lightbox" onClose={onClose} onClick={handleBackdrop}>
      <div className="lightbox__panel">
        <button type="button" className="lightbox__close" onClick={onClose} aria-label="Tutup gambar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* panggung gelap: memberi bingkai pada foto bertepi terang */}
        <div className="lightbox__stage">
          <img className="lightbox__img" src={image.src} alt={image.caption} />
        </div>

        <div className="lightbox__meta">
          <p className="lightbox__caption">{image.caption}</p>
          {image.credit && (
            <p className="lightbox__credit">
              {image.credit.artist || "Tanpa atribusi"}
              {image.credit.license ? ` · ${image.credit.license}` : ""}
              {image.credit.source && (
                <>
                  {" · "}
                  <a href={image.credit.source} target="_blank" rel="noopener noreferrer">
                    Wikimedia Commons
                  </a>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}

/** Pengait pemicu: satu lightbox untuk seluruh halaman. */
export function useLightbox() {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const buka = useCallback((img: LightboxImage) => setImage(img), []);
  const tutup = useCallback(() => setImage(null), []);
  return { image, buka, tutup };
}
