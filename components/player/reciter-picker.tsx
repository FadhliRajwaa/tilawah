"use client";

/* — Pemilih qari: bisa dipakai sebelum memutar (di header surat) maupun
 * saat memutar (di audio dock). Ganti qari → audio langsung berpindah
 * dan mengulang dari awal ayat yang sama, tanpa reload.
 */

import { useEffect, useRef, useState } from "react";
import { QARI } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePlayer } from "./player-provider";
import { usePrefs } from "@/lib/store/prefs";
import { IconUser, IconCheck, IconChevron, IconSpinner } from "@/components/icons";

/** Varian: "dock" (kompak, di player) · "panel" (lebar, sebelum memutar) */
export function ReciterPicker({ variant = "dock" }: { variant?: "dock" | "panel" }) {
  const { state, changeReciter } = usePlayer();
  const [prefs] = usePrefs();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  /** true = menu dibuka ke atas (saat ruang bawah tidak cukup) */
  const [dropUp, setDropUp] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const switchTimer = useRef(0);

  /* Tentukan arah menu: kalau sisa ruang di bawah < tinggi menu, buka ke atas.
   * Mencegah menu jatuh di luar viewport (mis. di audio dock yang menempel bawah). */
  useEffect(() => {
    if (!open || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const MENU_H = 300;
    setDropUp(window.innerHeight - r.bottom < MENU_H && r.top > MENU_H * 0.6);
  }, [open]);

  const active = prefs.reciter;
  const activeInfo = QARI.find((q) => q.id === active);

  /* indikator "sedang berganti" — hilang saat audio siap atau 2,5 dtk */
  useEffect(() => {
    if (!switching) return;
    const t = window.setTimeout(() => setSwitching(false), 2500);
    return () => window.clearTimeout(t);
  }, [switching]);

  /* klik di luar / Esc menutup */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (id: string) => {
    if (id === active) {
      setOpen(false);
      return;
    }
    window.clearTimeout(switchTimer.current);
    setSwitching(true);
    changeReciter(id);
    setOpen(false);
  };

  /* qari yang punya rekaman untuk track aktif (kalau ada) */
  const available = state.track ? new Set(Object.keys(state.track.urls ?? {})) : null;

  return (
    <div
      className={cn("reciter", variant === "panel" && "reciter--panel", dropUp && "reciter--up")}
      ref={wrapRef}
    >
      <button
        type="button"
        className={cn("reciter__trigger", variant === "panel" && "reciter__trigger--panel")}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Pilih qari — sekarang ${activeInfo?.nama ?? "belum dipilih"}`}
      >
        {switching ? (
          <IconSpinner className="reciter__icon reciter__icon--spin" />
        ) : (
          <IconUser className="reciter__icon" />
        )}
        <span className="reciter__label">
          <span className="reciter__hint">{variant === "panel" ? "Qari" : "Murottal"}</span>
          <span className="reciter__name">{activeInfo?.singkat ?? "Pilih qari"}</span>
        </span>
        <IconChevron className={cn("reciter__chev", open && "is-open")} />
      </button>

      {open && (
        <div className="reciter__menu" role="listbox" aria-label="Daftar qari">
          {QARI.map((q) => {
            const isActive = q.id === active;
            const enabled = !available || available.has(q.id);
            return (
              <button
                key={q.id}
                type="button"
                role="option"
                aria-selected={isActive}
                disabled={!enabled}
                className={cn("reciter__item", isActive && "is-active", !enabled && "is-disabled")}
                onClick={() => pick(q.id)}
              >
                <span className="reciter__num">{q.id}</span>
                <span className="reciter__item-body">
                  <span className="reciter__item-name">{q.nama}</span>
                  <span className="reciter__item-sub">
                    {enabled ? "Murottal lengkap" : "Tidak tersedia untuk ayat ini"}
                  </span>
                </span>
                {isActive && <IconCheck className="reciter__check" />}
              </button>
            );
          })}
          <p className="reciter__note">
            Mengganti qari saat memutar akan mengulang ayat ini dengan rekaman baru.
          </p>
        </div>
      )}
    </div>
  );
}
