"use client";

/* — Mesin parallax — desktop saja ————————————————————————————————————
 *
 * ⚠️ KENAPA HANYA DESKTOP (≥1025px)
 *
 * Percobaan pertama menjalankan ini di semua ukuran layar, dan hasilnya di
 * ponsel JELEK: tersendat, gambar seperti tertinggal lalu menyusul.
 * Penyebabnya bukan bug yang bisa ditambal — melainkan sifat platform:
 *
 *   · Di iOS, gulir berjalan di COMPOSITOR THREAD. Konten bergerak mulus
 *     tanpa menunggu JS. Sementara itu `scroll` event disampaikan ke main
 *     thread yang sibuk → transform kita selalu tertinggal 1–2 frame →
 *     terlihat sebagai gambar yang "gemetar" mengikuti halaman.
 *   · 8 lapisan dengan `will-change: transform` = 8 tekstur GPU besar. Di
 *     ponsel dengan memori GPU terbatas, itu memicu penurunan frame rate.
 *
 * Di desktop keduanya tidak berlaku: main thread lapang, dan gulir biasanya
 * roda/trackpad yang eventnya rapat. Efeknya mulus di sana — dan memang di
 * sana parallax layak dipakai.
 *
 * Di ponsel & tablet, efek "diam" diperoleh lewat `background-attachment:
 * fixed` (murni CSS, dikerjakan compositor, nol JS) — lihat `.ambient--depth`
 * di components.css. Itu sebabnya file ini punya gerbang lebar layar.
 *
 * ═══ Kenapa offset di-cache ═══
 *
 * Versi pertama memanggil `getBoundingClientRect()` untuk SETIAP lapisan di
 * SETIAP frame. Itu memaksa peramban menghitung ulang tata letak (forced
 * synchronous layout) 8× per frame — pemborosan besar yang ikut menyebabkan
 * tersendat. Sekarang posisi diukur SEKALI (saat mount, saat ukuran berubah,
 * dan setelah gambar selesai dimuat), lalu tiap frame hanya membaca
 * `window.scrollY` yang murah.
 *
 * ═══ Rumus ═══
 *
 *   kemajuan  = (vh − top) / (vh + tinggi)      → 0 saat masuk, 1 saat keluar
 *   translate = (kemajuan − 0.5) × jarak
 *   jarak     = speed × min(vh, tinggi)
 *
 * `min(vh, tinggi)` membatasi jangkauan pada elemen TERPENDEK. Rumus naif
 * `−top × speed` memberi jangkauan `speed × (vh + tinggi)` — di hero ponsel
 * itu 1.300px, sehingga lapisan harus diperbesar 3× agar tepinya tidak
 * terbuka. Terlalu ekstrem dan gambarnya pecah.
 */

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface Layer {
  el: HTMLElement;
  host: HTMLElement;
  speed: number;
  top: number;
  height: number;
  visible: boolean;
}

const layers = new Set<Layer>();
let raf = 0;
let bound = false;
let enabled = false;

/** Ukur posisi & tinggi host. Dipanggil jarang — bukan tiap frame. */
function measure(l: Layer) {
  const r = l.host.getBoundingClientRect();
  l.top = r.top + window.scrollY;
  l.height = r.height;
}

function measureAll() {
  for (const l of layers) measure(l);
  schedule();
}

function update() {
  raf = 0;
  if (!enabled) return;
  const sy = window.scrollY;
  const vh = window.innerHeight;

  for (const l of layers) {
    if (!l.visible || l.height <= 0) continue;

    const travel = l.speed * Math.min(vh, l.height);
    /* WAJIB di-clamp [0,1]: tanpa itu, elemen yang sudah jauh di atas
     * viewport terus menghasilkan kemajuan besar (terukur: awan bergeser
     * 477px padahal jangkauannya 204px) sehingga tepi gambar terbuka. */
    let p = (vh - (l.top - sy)) / (vh + l.height);
    if (p < 0) p = 0;
    else if (p > 1) p = 1;

    l.el.style.transform = `translate3d(0, ${((p - 0.5) * travel).toFixed(2)}px, 0)`;
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
  window.addEventListener("resize", measureAll, { passive: true });
  /* gambar yang selesai dimuat mengubah tinggi host → ukur ulang */
  window.addEventListener("load", measureAll);
}

function unbindIfEmpty() {
  if (layers.size > 0 || !bound) return;
  bound = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", measureAll);
  window.removeEventListener("load", measureAll);
}

interface Props {
  /** 0 = ikut menggulir · 0.35 = jauh · 0.6 = nyaris diam */
  speed?: number;
  className?: string;
  children?: ReactNode;
}

export function ParallaxLayer({ speed = 0.35, className = "", children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    /* Gerbang lebar layar: di bawah 1025px mesin ini TIDAK dipasang sama
     * sekali. Efek diam di ponsel/tablet ditangani CSS (`background-
     * attachment: fixed`) yang jauh lebih mulus karena berjalan di
     * compositor, bukan di main thread. */
    const mq = window.matchMedia("(min-width: 1025px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      const on = mq.matches && !reduce.matches;
      if (on === enabled && layers.size > 0) {
        /* sudah benar — tapi pastikan lapisan ini terdaftar */
      }
      enabled = on;
      if (!on) {
        el.style.transform = "";
        el.style.removeProperty("--px-travel");
        layers.delete(layer);
        unbindIfEmpty();
        return;
      }
      if (!layers.has(layer)) {
        layers.add(layer);
        measure(layer);
      }
      bind();
      schedule();
    };

    const layer: Layer = { el, host, speed, top: 0, height: 0, visible: false };

    /* Hanya lapisan terlihat yang dihitung tiap frame. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          layer.visible = e.isIntersecting;
          if (e.isIntersecting) schedule();
        }
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(host);

    apply();
    mq.addEventListener("change", apply);
    reduce.addEventListener("change", apply);

    return () => {
      io.disconnect();
      mq.removeEventListener("change", apply);
      reduce.removeEventListener("change", apply);
      layers.delete(layer);
      el.style.transform = "";
      el.style.removeProperty("--px-travel");
      unbindIfEmpty();
    };
  }, [speed]);

  return (
    <div ref={ref} className={`px-layer ${className}`.trim()} style={{ "--px-speed": speed } as CSSProperties}>
      {children}
    </div>
  );
}
