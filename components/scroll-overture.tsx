/* — Gulir sinematik: scrub + reveal kata + orkestra foto ala Apple.
 *
 * Satu orkestra per section (bukan per elemen): judul kata-per-kata,
 * foto skala lembut, panel geser — semua terikat SATU ScrollTrigger,
 * satu timeline, satu scrub. Tanpa ScrollTrigger per kata (mahal).
 *
 * Pola dari gsap-scrolltrigger-storytelling + masked-reveal:
 * pin secukupnya, scrub 0.6 (sinematik, bukan kaku), gerak hanya
 * transform/opacity, `once` untuk reveal teks, scrub untuk foto.
 *
 * Mati total saat reduced-motion / sentuh murni (ponsel pakai Reveal
 * biasa — scrub + Lenis mati di ponsel, jadi orkestra tak ada gunanya).
 * Lenis + ScrollTrigger disinkron via scrollerProxy (pola resmi GSAP). */

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reduceMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  className?: string;
  id?: string;
  ariaLabelledby?: string;
  /** pin section selama orkestra (default: tidak — hanya untuk momen besar) */
  pin?: boolean;
  /** jarak pin tambahan, mis. "+=40%" */
  pinJarak?: string;
}

export function ScrollOverture({
  children,
  className,
  id,
  ariaLabelledby,
  pin = false,
  pinJarak = "+=30%",
}: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    /* Ponsel sentuh-murni / reduced-motion: biarkan statis, Reveal biasa
       yang menangani entrance. */
    if (reduceMotion()) return;
    if (window.matchMedia("(pointer: coarse) and (hover: none)").matches) return;

    const ctx = gsap.context(() => {
      /* — sinkron Lenis → ScrollTrigger (pola resmi scrollerProxy) — */
      const lenis = (window as unknown as { __lenis?: { on: (e: string, f: () => void) => void; raf: (t: number) => void } }).__lenis;
      if (lenis) lenis.on("scroll", ScrollTrigger.update);

      /* — teks [data-overture]: pecah per kata, naik lewat mask — */
      const teks = root.querySelectorAll<HTMLElement>("[data-overture]");
      teks.forEach((el) => {
        if (el.dataset.overtureSiap === "1") return;
        const isi = el.textContent?.trim() ?? "";
        if (!isi) return;
        el.setAttribute("aria-label", isi);
        el.innerHTML = isi
          .split(/(\s+)/)
          .map((pot) =>
            pot.trim()
              ? `<span class="overture__mask" aria-hidden="true"><span class="overture__kata">${pot.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span></span>`
              : pot,
          )
          .join("");
        el.dataset.overtureSiap = "1";
      });

      const kata = root.querySelectorAll(".overture__kata");
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: pin
          ? {
              trigger: root,
              start: "top top",
              end: pinJarak,
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
            }
          : undefined,
      });

      if (kata.length > 0) {
        tl.fromTo(
          kata,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.8,
            stagger: 0.035,
            scrollTrigger: pin
              ? undefined
              : { trigger: root, start: "top 82%", once: true },
          },
          0,
        );
      }

      /* — foto [data-overture-foto]: skala 1.06→1 + redup 0.82→1 — */
      const foto = root.querySelectorAll("[data-overture-foto]");
      foto.forEach((f) => {
        tl.fromTo(
          f,
          { scale: 1.06, opacity: 0.82 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: pin
              ? undefined
              : { trigger: root, start: "top bottom", end: "top 35%", scrub: 0.6 },
          },
          0,
        );
      });

      /* — panel [data-overture-panel]: naik 24px + pudar, stagger — */
      const panel = root.querySelectorAll("[data-overture-panel]");
      if (panel.length > 0) {
        tl.fromTo(
          panel,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.07,
            scrollTrigger: pin
              ? undefined
              : { trigger: root, start: "top 78%", once: true },
          },
          0.1,
        );
      }
    }, root);
    return () => ctx.revert();
  }, [pin, pinJarak]);

  return (
    <section ref={rootRef as React.RefObject<HTMLElement>} className={className} id={id} aria-labelledby={ariaLabelledby}>
      {children}
    </section>
  );
}
