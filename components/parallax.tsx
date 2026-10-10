"use client";

/* — Mesin parallax ————————————————————————————————————————————————
 *
 * Satu pendengar scroll untuk SEMUA lapisan (registry tingkat modul), bukan
 * satu listener per komponen. Dengan 8 lapisan di satu halaman, itu selisih
 * antara 1 dan 8 callback per frame — dan semuanya dibatasi satu rAF.
 *
 * ═══ Kenapa transform, bukan `background-attachment: fixed` ═══
 *
 * Versi sebelumnya memakai `background-attachment: fixed`. Dua masalah:
 *  1. Safari iOS MENGABAIKANNYA (batasan WebKit yang sudah lama) — jadi di
 *     iPhone efeknya tidak ada sama sekali.
 *  2. `cover` diukur terhadap VIEWPORT, bukan elemen. Di ponsel 390×844,
 *     foto 21:9 diskalakan ke tinggi 844px → lebar 1.969px, sehingga hanya
 *     ~20% bagian tengah yang terlihat. Itu sebabnya efeknya lalu dimatikan
 *     di ≤700px — dan itulah yang membuat "fixed tidak jalan di mobile".
 *
 * `transform: translate3d()` bekerja IDENTIK di semua peramban dan skalanya
 * bisa dikendalikan persis. Sekaligus membereskan kedua masalah di atas.
 *
 * ═══ Rumus ═══
 *
 *   kemajuan  = (vh − top) / (vh + tinggi)      → 0 saat masuk, 1 saat keluar
 *   translate = (kemajuan − 0.5) × jarak
 *   jarak     = speed × min(vh, tinggi)
 *
 *   speed  0    → ikut menggulir normal            (paling dekat)
 *   speed  0.35 → lapisan jauh, gerak halus        (awan, cakrawala)
 *   speed  0.6  → nyaris diam, efek latar tetap    (foto latar)
 *
 * ⚠️ JANGAN pakai rumus naif `translate = −top × speed`. Jangkauannya
 * menjadi speed × (vh + tinggi) — di hero ponsel (vh 844 + tinggi 600)
 * dengan speed 0.9 itu 1.300px, sehingga lapisan harus diperbesar 3× agar
 * tepinya tidak terbuka. Terlalu ekstrem dan gambarnya jadi pecah.
 *
 * Dengan `min(vh, tinggi)` jangkauannya dibatasi oleh elemen TERPENDEK,
 * jadi pembesaran yang dibutuhkan tetap wajar (≈1,3–1,5×) dan hasilnya
 * justru lebih halus karena tidak pernah bergerak lebih cepat dari konten.
 *
 * `--px-travel` dipublikasikan ke CSS supaya lapisan bisa memperbesar
 * dirinya sendiri sesuai kebutuhan — lihat `.ambient--px` di components.css.
 */

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface Layer {
  el: HTMLElement;
  speed: number;
  visible: boolean;
}

const layers = new Set<Layer>();
let raf = 0;
let bound = false;

function update() {
  raf = 0;
  const vh = window.innerHeight;
  for (const l of layers) {
    if (!l.visible) continue;
    const host = l.el.parentElement;
    if (!host) continue;
    const r = host.getBoundingClientRect();
    const h = r.height;
    if (h <= 0) continue;

    const travel = l.speed * Math.min(vh, h);
    /* ⚠️ WAJIB di-clamp ke [0,1].
     *
     * Tanpa clamp, elemen yang sudah jauh di atas viewport terus menghasilkan
     * progress besar — terukur awan bergeser 477px padahal jangkauan yang
     * diinginkan hanya 204px. Akibatnya lapisan keluar dari wadahnya dan
     * tepi gambar terbuka. IntersectionObserver TIDAK menolong di sini:
     * elemen setinggi hero masih "terlihat" selama 1px-nya menyentuh layar. */
    let progress = (vh - r.top) / (vh + h);
    if (progress < 0) progress = 0;
    else if (progress > 1) progress = 1;
    const y = (progress - 0.5) * travel;

    l.el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    l.el.style.setProperty("--px-travel", `${travel.toFixed(1)}px`);
  }
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(update);
}

function bind() {
  if (bound) return;
  bound = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
}

interface Props {
  /** 0 = ikut menggulir · 0.3 = terasa jauh · 1 = diam (efek fixed) */
  speed?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function ParallaxLayer({ speed = 0.35, className = "", style, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Kalau pengguna minta kurangi gerak, lapisan cukup dipasang tanpa
     * transform sama sekali — kontennya tetap tampil utuh. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer: Layer = { el, speed, visible: false };
    layers.add(layer);
    bind();

    /* Hanya lapisan yang terlihat yang dihitung — halaman beranda punya
     * delapan lapisan, dan menghitung semuanya tiap frame itu pemborosan. */
    const host = el.parentElement;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          layer.visible = e.isIntersecting;
          if (e.isIntersecting) schedule();
        }
      },
      { rootMargin: "200px 0px" },
    );
    if (host) io.observe(host);

    schedule();

    return () => {
      io.disconnect();
      layers.delete(layer);
      el.style.transform = "";
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className={`px-layer ${className}`.trim()}
      style={
        {
          "--px-speed": speed,
          /* cadangan sebelum JS jalan: pembesaran 1.6× selalu cukup untuk
           * jangkauan maksimum speed 0.6 pada elemen setinggi viewport */
          "--px-travel": `${Math.round(speed * 100)}vh`,
          ...style,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
