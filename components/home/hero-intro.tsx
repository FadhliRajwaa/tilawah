"use client";

/* — Orkestra hero: SATU timeline GSAP, ketukan berlabel ala Apple.
 *
 * Urutan baca: foto (skala 1.06→1, 1.2s) → eyebrow → judul (masked,
 * kata-per-kata 0.035) → lede → aksi → statistik → kartu ayat.
 * Total ≤1.6s. Satu timeline = urutan selalu benar, tak ada animasi
 * berebut seperti gsap.from terpisah.
 *
 * Reduced-motion / ponsel: tak ada gerak — konten langsung tampil.
 * Foto tetap pakai sticky CSS (tak disentuh JS gerak). */

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { reduceMotion } from "@/lib/utils";

export function HeroIntro({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion()) return;

    const ctx = gsap.context(() => {
      /* Pecah judul jadi kata bertopeng (pola masked-reveal, tanpa SplitText
         berbayar). aria-label menjaga pembaca layar. */
      const judul = root.querySelector<HTMLElement>("[data-hero-judul]");
      if (judul && !judul.dataset.heroSiap) {
        const isi = judul.textContent?.trim() ?? "";
        if (isi) {
          judul.setAttribute("aria-label", isi);
          judul.innerHTML = isi
            .split(/(\s+)/)
            .map((pot) =>
              pot.trim()
                ? `<span class="overture__mask" aria-hidden="true"><span class="overture__kata hero__kata">${pot.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span></span>`
                : pot,
            )
            .join("");
          judul.dataset.heroSiap = "1";
        }
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      /* Ketukan 1 — foto: napas masuk sinematik (1.2s). */
      tl.fromTo(
        root.querySelector("[data-hero-foto]"),
        { scale: 1.06, opacity: 0.82 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" },
        0,
      );
      /* Ketukan 2 — eyebrow + judul kata-per-kata. */
      tl.fromTo(
        root.querySelector("[data-hero-eyebrow]"),
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.15,
      );
      tl.fromTo(
        root.querySelectorAll(".hero__kata"),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, ease: "power3.out", stagger: 0.035 },
        0.25,
      );
      /* Ketukan 3 — lede + aksi + statistik mengalir. */
      tl.fromTo(
        root.querySelectorAll("[data-hero-alir]"),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.07, clearProps: "opacity,transform" },
        0.55,
      );
      /* Ketukan 4 — kartu ayat: naik + skala lembut, terakhir. */
      tl.fromTo(
        root.querySelector("[data-hero-kartu]"),
        { y: 24, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, clearProps: "opacity,transform" },
        0.85,
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return <div ref={rootRef} style={{ display: "contents" }}>{children}</div>;
}
