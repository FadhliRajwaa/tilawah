"use client";

/* — Lembar (sheet): satu primitif untuk semua panel yang muncul di atas halaman.
 *
 *  Ponsel  → lembar dari bawah yang bisa DISERET turun untuk ditutup.
 *  Desktop → "drawer": laci dari kanan, dengan tirai.
 *            "pop":    panel melayang di dekat tombol pemicunya, TANPA tirai —
 *                      halaman tetap terlihat & bisa dipakai. Dipakai untuk
 *                      pengaturan baca: efek tiap perubahan langsung terlihat.
 *
 * Dibangun di atas <dialog>: Esc, perangkap fokus, dan lapisan teratas
 * didapat dari peramban. Animasi masuk/keluar memakai TRANSISI CSS (bukan
 * keyframe), jadi bisa dibalik di tengah jalan — buka lalu tutup dengan
 * cepat tidak membuat panel melompat.
 *
 * Seret: panel mengikuti jari 1:1. Saat dilepas, kecepatan jari
 * diproyeksikan ke depan dengan rumus deselerasi gulir iOS (d = 0.998) —
 * jentikan pendek yang cepat sudah cukup untuk menutup.
 */

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { IconClose } from "./icons";

const DESKTOP = "(min-width: 900px)";

/** Jarak yang akan ditempuh kalau jentikan dibiarkan melambat (px). */
const project = (vPxPerMs: number) => vPxPerMs * 499;
/** Hambatan karet saat menarik melewati batas — makin jauh, makin berat. */
const rubber = (x: number, dim: number) => (x * dim * 0.55) / (dim + 0.55 * x);

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  /** baris kecil di bawah judul */
  sub?: ReactNode;
  children: ReactNode;
  /** aksi yang menempel di bawah (tidak ikut menggulir) */
  footer?: ReactNode;
  variant?: "drawer" | "pop";
  className?: string;
}

export function Sheet({ open, onClose, title, sub, children, footer, variant = "drawer", className }: Props) {
  const dlgRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);

  const onCloseRef = useRef(onClose);
  const openRef = useRef(open);
  const backTo = useRef<HTMLElement | null>(null);
  useEffect(() => {
    onCloseRef.current = onClose;
    openRef.current = open;
  });

  useEffect(() => {
    const d = dlgRef.current;
    const p = panelRef.current;
    if (!d || !p) return;

    if (open) {
      if (!d.open) {
        const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        backTo.current = trigger;
        const modal = variant === "drawer" || !matchMedia(DESKTOP).matches;
        d.dataset.modal = modal ? "1" : "0";
        if (!modal && trigger) {
          const r = trigger.getBoundingClientRect();
          d.style.setProperty("--pop-top", `${Math.round(r.bottom + 8)}px`);
          d.style.setProperty("--pop-end", `${Math.round(Math.max(12, innerWidth - r.right))}px`);
        }
        if (modal) d.showModal();
        else d.show();
        /* Paksa gaya "tertutup" terhitung dulu, supaya pergantian ke "terbuka"
           benar-benar beranimasi (tanpa ini peramban melompat ke akhir). */
        void p.offsetWidth;
      }
      d.dataset.state = "open";
      p.focus({ preventScroll: true });
      if (d.dataset.modal === "1") return;

      /* Non-modal: tutup saat mengetuk di luar panel atau menekan Esc.
         Tombol pemicu (data-sheet-trigger) dikecualikan — ia sendiri yang
         membuka/menutup, kalau tidak panel tertutup lalu langsung terbuka. */
      const onDown = (e: PointerEvent) => {
        const t = e.target as Element | null;
        if (!t || p.contains(t) || t.closest("[data-sheet-trigger]")) return;
        onCloseRef.current();
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onCloseRef.current();
      };
      document.addEventListener("pointerdown", onDown, true);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("pointerdown", onDown, true);
        document.removeEventListener("keydown", onKey);
      };
    }

    if (!d.open) return;
    d.dataset.state = "closed";
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      d.close();
      setMounted(false);
      const b = backTo.current;
      if (b?.isConnected && (!document.activeElement || document.activeElement === document.body)) {
        b.focus({ preventScroll: true });
      }
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.target === p && (e.propertyName === "transform" || e.propertyName === "opacity")) finish();
    };
    p.addEventListener("transitionend", onEnd);
    const t = window.setTimeout(finish, 650);
    return () => {
      p.removeEventListener("transitionend", onEnd);
      window.clearTimeout(t);
    };
  }, [open, variant]);

  /* ─── seret untuk menutup (lembar bawah saja) ─── */
  const drag = useRef<{ y0: number; y: number; t: number; v: number; h: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || matchMedia(DESKTOP).matches) return;
    if ((e.target as Element).closest("button, a, input, select")) return;
    const p = panelRef.current;
    if (!p) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y0: e.clientY, y: e.clientY, t: e.timeStamp, v: 0, h: p.offsetHeight };
    p.style.transition = "none";
    if (scrimRef.current) scrimRef.current.style.transition = "none";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = drag.current;
    const p = panelRef.current;
    if (!g || !p) return;
    const dt = e.timeStamp - g.t;
    if (dt > 0) g.v = 0.75 * ((e.clientY - g.y) / dt) + 0.25 * g.v;
    g.y = e.clientY;
    g.t = e.timeStamp;
    let dy = e.clientY - g.y0;
    if (dy < 0) dy = -rubber(-dy, g.h);
    p.style.transform = `translate3d(0, ${dy}px, 0)`;
    if (scrimRef.current) scrimRef.current.style.opacity = String(1 - Math.max(0, dy) / g.h);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = drag.current;
    const p = panelRef.current;
    const d = dlgRef.current;
    if (!g || !p || !d) return;
    drag.current = null;
    /* Jari diam sebelum dilepas = tidak ada momentum */
    const v = e.timeStamp - g.t > 90 ? 0 : g.v;
    const dy = Math.max(0, e.clientY - g.y0);
    const dismiss = v > -0.15 && dy + project(Math.max(0, v)) > g.h * 0.5;
    /* Keadaan akhir ditulis SEBELUM gaya inline dihapus, dalam frame yang
       sama — transisi lalu berjalan dari posisi jari ke tujuan, bukan
       kembali ke atas dulu. */
    if (dismiss) d.dataset.state = "closed";
    p.style.transition = "";
    p.style.transform = "";
    if (scrimRef.current) {
      scrimRef.current.style.transition = "";
      scrimRef.current.style.opacity = "";
    }
    if (dismiss) onCloseRef.current();
  };

  if (!mounted) return null;

  return (
    <dialog
      ref={dlgRef}
      className={cn("sheet", `sheet--${variant}`, className)}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onCloseRef.current();
      }}
      onClose={() => {
        /* Peramban kadang menutup dialog sendiri (Esc ditekan berulang).
           Samakan keadaan supaya induk tidak mengira lembar masih terbuka. */
        if (openRef.current) onCloseRef.current();
        setMounted(false);
      }}
    >
      <div ref={scrimRef} className="sheet__scrim" onClick={() => onCloseRef.current()} />
      <div ref={panelRef} className="sheet__panel" tabIndex={-1}>
        <div
          className="sheet__head"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span className="sheet__grip" aria-hidden="true" />
          <div className="sheet__titles">
            <h2 id={titleId} className="sheet__title">
              {title}
            </h2>
            {sub && <p className="sheet__sub">{sub}</p>}
          </div>
          <motion.button
            type="button"
            className="sheet__close"
            onClick={() => onCloseRef.current()}
            aria-label="Tutup"
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.12 }}
          >
            <IconClose />
          </motion.button>
        </div>
        <div className="sheet__body">{children}</div>
        {footer && <div className="sheet__foot">{footer}</div>}
      </div>
    </dialog>
  );
}
