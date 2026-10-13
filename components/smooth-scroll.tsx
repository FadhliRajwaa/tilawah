"use client";

/* — SmoothScroll: gulir mentega via Lenis + rAF manual (tanpa lenis-react,
 * tanpa gsap ticker — satu loop cukup).
 * Mati saat reduced-motion / sentuh murni; stop saat tab hidden.
 * Ekspos window.__lenis untuk debug. */

// ponytail: gsap tetap terpasang; pakai saat butuh timeline/ScrollTrigger.
import Lenis from "lenis";
import { useEffect } from "react";

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse) and (hover: none)").matches) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (waktu: number) => {
      lenis.raf(waktu);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onVis = () => {
      if (document.hidden) lenis.stop();
      else lenis.start();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
  return null;
}
