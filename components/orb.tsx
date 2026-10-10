"use client";

/* — Fluid Orb (rare-ui) dengan pengaman performa.
 *
 * Shader WebGL itu mahal di GPU. Komponen ini:
 *  1. Menunda mount sampai masuk viewport (IntersectionObserver)
 *  2. Mematikan diri di perangkat lemah / hemat data / reduced-motion
 *  3. Menghormati preferensi pengguna (Save-Data, hardwareConcurrency, deviceMemory)
 *
 * Sumber komponen: `npx shadcn@latest add swamimalode07/rare-ui/fluid-orb`
 * → components/ui/fluid-orb.tsx (TIDAK diubah, hanya dibungkus).
 */

import { useEffect, useRef, useState } from "react";
import FluidOrb from "@/components/ui/fluid-orb";
import { cn } from "@/lib/utils";

/** Perangkat ini sanggup menjalankan shader? */
function canRunShader(): boolean {
  if (typeof window === "undefined") return false;
  // hormati permintaan minim gerak
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  // hemat data (Chrome/Android)
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /2g|slow-2g|3g/.test(nav.connection.effectiveType)) {
    return false;
  }
  // perangkat lemah
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return false;
  // WebGL tersedia?
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
    if (!gl) return false;
  } catch {
    return false;
  }
  return true;
}

interface Props {
  size?: number;
  /** warna orb (hex) — default hijau mushaf */
  color?: string;
  className?: string;
  /** delay mount (ms) agar tidak berebut dengan LCP */
  delay?: number;
}

export function Orb({
  size = 420,
  color = "#125c35",
  className,
  delay = 0,
}: Props) {
  const [mount, setMount] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  /* cek kemampuan perangkat sekali */
  useEffect(() => {
    setAllowed(canRunShader());
  }, []);

  /* tunda mount sampai masuk viewport */
  useEffect(() => {
    if (allowed !== true || !hostRef.current) return;
    const el = hostRef.current;

    const start = () => {
      if (delay > 0) {
        window.setTimeout(() => setMount(true), delay);
      } else {
        setMount(true);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            start();
            io.disconnect();
          }
        });
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [allowed, delay]);

  /* kalau perangkat tidak sanggup, tampilkan gradien CSS statis sebagai ganti */
  return (
    <div
      ref={hostRef}
      className={cn("orb-host", className)}
      style={{ "--orb-size": `${size}px`, "--orb-color": color } as React.CSSProperties}
      aria-hidden="true"
    >
      {allowed === false && <span className="orb-fallback" />}
      {mount && allowed && (
        <FluidOrb
          size={size}
          color={color}
          className="orb-canvas"
        />
      )}
    </div>
  );
}
