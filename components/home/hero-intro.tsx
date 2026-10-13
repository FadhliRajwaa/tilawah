"use client";

/* — Intro hero: menganimasikan anak .hero__anim SEKALI saat mount.
 * Komponen klien terpisah agar hero.tsx tetap server component (SEO/LCP).
 * Total <0.9 detik. Lewati total bila reduced-motion. */

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { reduceMotion } from "@/lib/utils";

export function HeroIntro({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll(".hero__anim"), {
        opacity: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.07,
        ease: "power3.out",
        clearProps: "opacity,transform",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return <div ref={rootRef} style={{ display: "contents" }}>{children}</div>;
}
