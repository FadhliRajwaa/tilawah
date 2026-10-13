"use client";

/* — Lightbox gambar (satu untuk SELURUH situs) ————————————————————
 *
 * Sebelumnya tiap galeri punya lightbox sendiri. Sekarang penyedianya duduk
 * di root layout, sehingga komponen mana pun — banner, header halaman, header
 * surah, strip pembatas, kartu kredit — bisa membuka gambar yang sama tanpa
 * harus jadi klien sendiri atau menggandakan dialog.
 *
 * Kenapa lightbox, bukan langsung ke Wikimedia:
 *   Pembaca yang tertarik pada satu foto kemungkinan besar cuma ingin
 *   MELIHAT lebih jelas — melempar mereka ke tab baru berarti meninggalkan
 *   halaman baca. Lightbox memberi lihat-besar, dan tautan sumber tetap
 *   tersedia bagi yang memang mau atribusi lengkap.
 *
 * Kenapa <dialog>: elemen native memberi Esc, focus trap, dan lapisan modal
 * gratis dari peramban — tidak perlu perangkap fokus buatan sendiri.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CreditEntry } from "@/lib/data/credits";
import { IconClose } from "./icons";

export interface LightboxImage {
  /** nama aset tanpa akhiran varian, mis. "card-dome-mosaic" */
  name: string;
  /** ukuran terbesar yang tersedia (fallback kalau srcSet kosong) */
  src: string;
  /** varian responsif dari CREDITS — ponsel tidak perlu unduh 1900w */
  srcSet?: { src: string; w: number }[];
  /** lebar·tinggi varian terbesar, untuk ruang sebelum gambar tiba (tanpa CLS) */
  width?: number;
  height?: number;
  caption: string;
  position?: string;
  /** entri atribusi bila ada */
  credit?: CreditEntry;
}

interface LightboxApi {
  buka: (img: LightboxImage) => void;
  tutup: () => void;
}

const Ctx = createContext<LightboxApi | null>(null);

/** Dipakai komponen mana pun untuk membuka lightbox global. */
export function useLightbox(): LightboxApi {
  const api = useContext(Ctx);
  if (!api) {
    throw new Error("useLightbox harus dipakai di dalam <LightboxProvider> (lihat app/layout.tsx)");
  }
  return api;
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [image, setImage] = useState<LightboxImage | null>(null);

  const buka = useCallback((img: LightboxImage) => setImage(img), []);
  const tutup = useCallback(() => setImage(null), []);
  const api = useMemo(() => ({ buka, tutup }), [buka, tutup]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <LightboxDialog image={image} onClose={tutup} />
    </Ctx.Provider>
  );
}

function LightboxDialog({
  image,
  onClose,
}: {
  image: LightboxImage | null;
  onClose: () => void;
}) {
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

  return (
    <dialog
      ref={ref}
      className="lightbox"
      onClose={onClose}
      onClick={handleBackdrop}
      aria-label={image ? `Gambar: ${image.caption}` : "Penampil gambar"}
    >
      {image && (
        <div className="lightbox__panel">
          <button
            type="button"
            className="lightbox__close"
            onClick={onClose}
            aria-label="Tutup gambar"
          >
            <IconClose />
          </button>

          {/* panggung gelap: memberi bingkai pada foto bertepi terang */}
          <div className="lightbox__stage">
            <img
              className="lightbox__img"
              src={image.srcSet?.[0]?.src ?? image.src}
              srcSet={
                image.srcSet?.length
                  ? image.srcSet.map((v) => `/images/${v.src} ${v.w}w`).join(", ")
                  : undefined
              }
              sizes="(max-width: 560px) 100vw, min(1400px, 96vw)"
              width={image.width}
              height={image.height}
              decoding="async"
              alt={image.caption}
              style={image.position ? { objectPosition: image.position } : undefined}
            />
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
      )}
    </dialog>
  );
}
