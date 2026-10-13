"use client";

/* — Penampil notifikasi singkat. Satu untuk seluruh situs (root layout).
 *
 * Wadah `role="status"` SELALU ada di DOM — kalau baru dibuat saat pesan
 * muncul, pembaca layar sering tidak mengumumkannya. Pesan dengan aksi
 * ("Batalkan") bertahan lebih lama, dan waktunya berhenti selama penunjuk
 * atau fokus ada di atasnya (WCAG 2.2.1: batas waktu bisa disesuaikan). */

import { useEffect, useRef, useState } from "react";
import { TOAST_EVENT, type ToastData } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const [t, setT] = useState<ToastData | null>(null);
  const [shown, setShown] = useState(false);
  const timer = useRef(0);

  const arm = (ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShown(false), ms);
  };

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<ToastData>).detail;
      setT(d);
      setShown(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setShown(false), d.action ? 5200 : 2600);
    };
    window.addEventListener(TOAST_EVENT, on);
    return () => {
      window.removeEventListener(TOAST_EVENT, on);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="toaster" role="status" aria-live="polite">
      {t && (
        <div
          key={t.id}
          className={cn("toast", shown && "is-shown")}
          onPointerEnter={() => window.clearTimeout(timer.current)}
          onPointerLeave={() => shown && arm(2200)}
          onFocus={() => window.clearTimeout(timer.current)}
          onBlur={() => shown && arm(2200)}
        >
          <span className="toast__msg">{t.msg}</span>
          {t.action && (
            <button
              type="button"
              className="toast__act"
              onClick={() => {
                t.action!.run();
                setShown(false);
              }}
            >
              {t.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
