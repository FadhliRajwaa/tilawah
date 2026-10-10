"use client";

/* — Folder (rare-ui) — folder yang membuka dengan kartu berhamburan.
 * Sumber: https://www.rareui.com/components/foldercomponent
 * Tidak diubah dari aslinya selain: import cn dari lib/utils proyek ini.
 * Pemakaian di Tilawah: `components/juz-folder.tsx`.
 */

import React, { useEffect, useId, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const themes = {
  black: {
    backFill: "black",
    backInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.37 0",
    backInsetShadow: "inset 0 0 6px 2px rgba(255,255,255,0.37)",
    flapFill: "#292929",
    flapFillOpacity: 0.25,
    flapStroke: "#979797",
    flapInsetColor: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0",
    cardFill: "#F1F1F1",
    cardStroke: "#E0E0E0",
    cardLineFill: "#D4D4D4",
    cardInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0",
  },
  white: {
    backFill: "#ffffff",
    backInsetColor: "0 0 0 0 0.7 0 0 0 0 0.7 0 0 0 0 0.7 0 0 0 0.25 0",
    backInsetShadow: "inset 0 0 6px 2px rgba(178,178,178,0.25)",
    flapFill: "#f5f5f5",
    flapFillOpacity: 0.85,
    flapStroke: "#d4d4d4",
    flapInsetColor: "0 0 0 0 0.6 0 0 0 0 0.6 0 0 0 0 0.6 0 0 0 0.15 0",
    cardFill: "#262626",
    cardStroke: "#404040",
    cardLineFill: "#737373",
    cardInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0",
  },
  blue: {
    backFill: "#50B1FD",
    backInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.35 0",
    backInsetShadow: "inset 0 0 6px 2px rgba(255,255,255,0.35)",
    flapFill: "#3a9ae8",
    flapFillOpacity: 0.45,
    flapStroke: "#7ec8ff",
    flapInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0",
    cardFill: "#F1F1F1",
    cardStroke: "#E0E0E0",
    cardLineFill: "#D4D4D4",
    cardInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0",
  },
  /* — ditambahkan untuk Tilawah: krem kertas + hijau mushaf + emas.
   * Nilainya di-hardcode (bukan CSS var) karena SVG `fill` dan
   * feColorMatrix tidak menerima custom property di semua peramban.
   *
   * Flap dibuat hampir opak seperti tema "white" bawaan. Kalau dibiarkan
   * tembus pandang, `backdropFilter: blur()` di bawahnya mem-blur kartu
   * hijau sehingga seluruh folder jadi gumpalan buram tanpa bentuk. */
  /* Tema Tilawah: mengikuti palet "air" — badan folder biru muda seperti
   * kertas yang dibasahi cat, kartu di dalamnya biru indigo sungai (#109BDA).
   *
   * ⚠️ Nilai lama di sini hijau (#125c35) + krem — sisa tema "mushaf hangat"
   * sebelum overhaul. Di halaman /juz folder-nya jadi satu-satunya elemen
   * hijau di antara semua yang biru, dan itu terlihat jelas di screenshot. */
  tilawah: {
    /* Badan folder: biru pucat (terlihat di belakang kartu).
     * Flap DEPAN: biru lebih pekat + garis tepi yang jelas.
     *
     * ⚠️ Percobaan pertama memakai flap #eaf6fd — hanya 1 tingkat lebih
     * terang dari badan (#dceefa). Di screenshot keduanya menyatu jadi
     * gumpalan putih dan folder kehilangan bentuknya. Sekarang flap lebih
     * PEKAT dari badan, bukan lebih terang: bentuk folder jadi terbaca
     * karena kontras, bukan karena bayangan tipis. */
    backFill: "#cfe7f7",
    backInsetColor: "0 0 0 0 0.35 0 0 0 0 0.62 0 0 0 0 0.82 0 0 0 0.2 0",
    backInsetShadow: "inset 0 0 6px 2px rgba(16,155,218,0.22)",
    flapFill: "#8fd4f0",
    flapFillOpacity: 0.97,
    flapStroke: "#3fa8d4",
    flapInsetColor: "0 0 0 0 0.28 0 0 0 0 0.58 0 0 0 0 0.78 0 0 0 0.14 0",
    cardFill: "#109bda",
    cardStroke: "#19bbe3",
    cardLineFill: "#c8ecfa",
    cardInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.18 0",
  },
} as const;

/* Nilai untuk mode gelap — komponen ini di-render klien, jadi tema dibaca
 * langsung dari <html data-theme> alih-alih lewat utility `dark:`. */
const darkThemes = {
  tilawah: {
    backFill: "#0f1d27",
    backInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.14 0",
    backInsetShadow: "inset 0 0 6px 2px rgba(111,200,232,0.14)",
    flapFill: "#162936",
    flapFillOpacity: 0.96,
    flapStroke: "#3d6a83",
    flapInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0",
    cardFill: "#2f9fd4",
    cardStroke: "#52d9e8",
    cardLineFill: "#bfe9f8",
    cardInsetColor: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0",
  },
} as const;

const sizeScales = {
  sm: 0.65,
  md: 1,
  lg: 1.35,
} as const;

type FolderComponentProps = Omit<React.ComponentProps<"div">, "color"> & {
  color?: "black" | "white" | "blue" | "tilawah";
  size?: "sm" | "md" | "lg";
  /**
   * `false` = folder dekoratif: tidak ikut menangkap klik dan tidak
   * membuka-tutup. Dipakai saat folder hanya jadi ikon di dalam tombol
   * lain (mis. pemilih kelompok juz), supaya klik tidak "dimakan" folder.
   */
  interactive?: boolean;
  /**
   * Skalakan folder agar selalu muat di dalam kotak induknya.
   *
   * Tanpa ini, `size` memakai skala tetap (sm/md/lg) sehingga folder
   * berukuran sama di semua layar — pada wadah sempit ia meluber keluar
   * dan menutupi elemen di bawahnya. Dengan `fit`, skala dihitung ulang
   * setiap kali kotak induk berubah ukuran (ResizeObserver).
   */
  fit?: boolean;
};

/* Jejak konten folder TIDAK sama dengan BASE_WIDTH/HEIGHT: tiga kartu ikut
 * menonjol keluar dari badan folder. Nilainya juga tidak bisa ditulis sebagai
 * konstanta — transform kartu (x/y) dan `mt-4` pada flap ikut terpengaruh
 * skala, sehingga rasio jejak berubah saat skala berubah. Karena itu mode
 * `fit` mengukur jejak aslinya sekali dari DOM, lalu menghitung skala dari
 * hasil ukur itu (bukan dari angka perkiraan). */

const BASE_WIDTH = 321;
const BASE_HEIGHT = 270;

const FLAP_PATH =
  "M0 25C0 11.1929 11.1929 0 25 0H136.084C143.044 0 149.689 2.90139 154.42 8.00608L178.08 33.5343C182.811 38.639 189.456 41.5404 196.416 41.5404H296C309.807 41.5404 321 52.7333 321 66.5404V216C321 229.807 309.807 241 296 241H25C11.1929 241 0 229.807 0 216V25Z";

const FolderComponent = ({
  color = "black",
  size = "md",
  interactive = true,
  fit = false,
  className,
  ...props
}: FolderComponentProps) => {
  /* Tema gelap dibaca dari <html data-theme>; komponen ini klien-saja. */
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setDark(el.dataset.theme === "dark");
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  /* Mode `fit`.
   *
   * Jejak folder tidak sebanding lurus dengan skala: rotasi kartu (10°, 2°,
   * -5°) tetap, sedangkan offset x/y-nya ikut menyusut — jadi pada skala
   * kecil folder tampak "lebih lebar" secara proporsional. Karena itu skala
   * tidak bisa dihitung dari konstanta.
   *
   * Solusinya: bungkus seluruh isi dengan SATU transform skala di lapisan
   * terluar. Uniform scale bersifat linear penuh terhadap bounding box, jadi
   * jejak pada skala k = k × jejak alami. Jejak alami diukur sekali dari DOM
   * (union rect semua keturunan) lalu dibagi skala yang sedang dipakai. */
  const hostRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [fitK, setFitK] = useState(1);

  useEffect(() => {
    if (!fit) return;
    const host = hostRef.current;
    const stage = stageRef.current;
    if (!host || !stage) return;

    /* Kartu beranimasi spring saat mount (y: -10 dengan delay berbeda per
     * kartu), jadi pengukuran pertama terjadi saat posisinya masih bergerak
     * dan jejaknya terbaca lebih besar dari sebenarnya. Karena itu pengukuran
     * diulang berkala sampai dua hasil berturut-turut sama (stabil). */
    let frame = 0;
    let timer = 0;
    let last = -1;
    let stable = 0;
    let elapsed = 0;
    const STEP = 140;
    const BUDGET = 2000; // ms — batas aman kalau animasi tak pernah tenang

    const measureOnce = (): number | null => {
      const boxW = host.clientWidth;
      const boxH = host.clientHeight;
      if (!boxW || !boxH) return null;

      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (const el of stage.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) continue;
        if (r.left < minX) minX = r.left;
        if (r.right > maxX) maxX = r.right;
        if (r.top < minY) minY = r.top;
        if (r.bottom > maxY) maxY = r.bottom;
      }
      if (!Number.isFinite(minX) || maxX <= minX) return null;

      /* Skala berjalan dibaca dari computed transform (sumber kebenaran di
       * DOM), bukan dari state — state yang di-set tanpa render ulang bisa
       * menyimpang dan membuat perhitungan berikutnya makin jauh. */
      const m = new DOMMatrixReadOnly(getComputedStyle(stage).transform);
      const k = m.a || 1;
      const natW = (maxX - minX) / k;
      const natH = (maxY - minY) / k;
      if (!natW || !natH) return null;
      return Math.min(boxW / natW, boxH / natH);
    };

    const pass = () => {
      const next = measureOnce();
      if (next === null) return;
      setFitK((prev) => (Math.abs(next - prev) < 0.002 ? prev : next));
      if (last >= 0 && Math.abs(next - last) < 0.002) stable += 1;
      else stable = 0;
      last = next;
      elapsed += STEP;
      if (stable < 2 && elapsed < BUDGET) timer = window.setTimeout(pass, STEP);
    };

    timer = window.setTimeout(pass, STEP);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            last = -1;
            stable = 0;
            elapsed = 0;
            window.clearTimeout(timer);
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(pass);
          })
        : null;
    ro?.observe(host);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      ro?.disconnect();
    };
  }, [fit]);

  const theme =
    (dark ? darkThemes[color as keyof typeof darkThemes] : undefined) ??
    themes[color] ??
    themes.black;
  /* `fit` memakai skala internal 1 dan menyerahkan pembesaran ke lapisan
   * luar; `size` tetap dipakai sebagai skala internal untuk mode biasa. */
  const scale = fit ? 1 : sizeScales[size];
  const outer = fit ? fitK : 1;
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  /* ID filter SVG harus unik — komponen asli memakai satu ID hardcoded,
   * sehingga beberapa folder dalam satu halaman saling menimpa. */
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const flapFilter = `folder-flap-${uid}`;

  return (
    <div
      ref={hostRef}
      data-slot="folder"
      data-fit={fit ? "true" : undefined}
      data-k={fit ? fitK.toFixed(3) : undefined}
      className={cn(
        "relative w-full h-full flex items-center justify-center",
        className,
      )}
      {...props}
    >
      <div
        ref={stageRef}
        className={cn("relative select-none", interactive && "cursor-pointer")}
        style={{
          width: BASE_WIDTH * scale,
          height: BASE_HEIGHT * scale,
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          ...(fit ? { transform: `scale(${outer})` } : null),
        }}
        onMouseEnter={() => interactive && setIsHovered(true)}
        onMouseLeave={() => {
          if (!interactive) return;
          setIsHovered(false);
          setIsOpen(false);
        }}
        onClick={() => interactive && setIsOpen((o) => !o)}
      >
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            transform: `translate(-50%, -50%) scale(${scale})`,
            perspective: 800 * scale,
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              style={{
                width: BASE_WIDTH,
                height: BASE_HEIGHT,
                borderRadius: 25,
                backgroundColor: theme.backFill,
                boxShadow: theme.backInsetShadow,
              }}
            />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <motion.div
              className="absolute"
              animate={{
                y: isOpen ? -160 : isHovered ? -30 : -10,
                x: isOpen ? 70 : 40,
                rotate: isOpen ? 18 : isHovered ? 14 : 10,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 13,
                delay: isOpen ? 0.1 : isHovered ? 0.12 : 0,
              }}
            >
              <Card id={1} theme={theme} uid={uid} />
            </motion.div>
            <motion.div
              className="absolute"
              animate={{
                y: isOpen ? -180 : isHovered ? -35 : -20,
                x: isOpen ? 0 : 3,
                rotate: isOpen ? -3 : isHovered ? -1 : 2,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 13,
                delay: isOpen ? 0.05 : isHovered ? 0.06 : 0,
              }}
            >
              <Card id={2} theme={theme} uid={uid} />
            </motion.div>
            <motion.div
              className="absolute"
              animate={{
                y: isOpen ? -170 : isHovered ? -44 : -22,
                x: isOpen ? -65 : -40,
                rotate: isOpen ? -14 : isHovered ? -9 : -5,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 13,
                delay: isOpen ? 0 : 0,
              }}
            >
              <Card id={3} theme={theme} uid={uid} />
            </motion.div>
          </div>

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4"
            style={{
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d",
              width: 321,
              height: 241,
            }}
            animate={{ rotateX: isOpen ? -55 : isHovered ? -45 : -15 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            <div
              className="absolute inset-0"
              style={{
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                clipPath: `path('${FLAP_PATH}')`,
                WebkitClipPath: `path('${FLAP_PATH}')`,
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                willChange: "transform",
              }}
            />
            <svg
              className="absolute inset-0"
              width="321"
              height="241"
              viewBox="0 0 321 241"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter={`url(#${flapFilter})`}>
                <path
                  d={FLAP_PATH}
                  fill={theme.flapFill}
                  fillOpacity={theme.flapFillOpacity}
                />
                <path
                  d="M25 0.5H136.084C142.905 0.5 149.417 3.3431 154.054 8.3457L177.713 33.874C182.539 39.0808 189.317 42.04 196.416 42.04H296C309.531 42.04 320.5 53.0092 320.5 66.54V216C320.5 229.531 309.531 240.5 296 240.5H25C11.469 240.5 0.5 229.531 0.5 216V25C0.5 11.469 11.469 0.5 25 0.5Z"
                  stroke={theme.flapStroke}
                />
              </g>
              <defs>
                <filter
                  id={flapFilter}
                  x="-25.4"
                  y="-25.4"
                  width="371.8"
                  height="291.8"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2.65" />
                  <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                  />
                  <feColorMatrix type="matrix" values={theme.flapInsetColor} />
                  <feBlend
                    mode="normal"
                    in2="shape"
                    result="effect1_innerShadow_171_13"
                  />
                </filter>
              </defs>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FolderComponent;

export { FolderComponent as Folder };
export type { FolderComponentProps };

type Theme = {
  backFill: string;
  backInsetColor: string;
  backInsetShadow: string;
  flapFill: string;
  flapFillOpacity: number;
  flapStroke: string;
  flapInsetColor: string;
  cardFill: string;
  cardStroke: string;
  cardLineFill: string;
  cardInsetColor: string;
};

const Card = ({ id, theme, uid }: { id: number; theme: Theme; uid: string }) => {
  const filterId = `folder-card-${uid}-${id}`;
  return (
    <div data-slot="folder-card">
      <svg
        width="164"
        height="214"
        viewBox="0 0 164 214"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={`url(#${filterId})`}>
          <rect
            width="163.078"
            height="213.262"
            rx="20"
            fill={theme.cardFill}
          />
        </g>
        <rect
          x="0.5"
          y="0.5"
          width="162.078"
          height="212.262"
          rx="19.5"
          stroke={theme.cardStroke}
        />
        <rect
          x="14.1193"
          y="31.2091"
          width="134.84"
          height="11.8892"
          rx="5.94459"
          fill={theme.cardLineFill}
        />
        {[
          [14.8253, 60.9939],
          [84.4303, 60.9617],
          [14.8253, 75.1122],
          [84.4303, 75.0801],
          [14.8253, 89.2306],
          [84.4303, 89.1985],
          [14.8253, 103.349],
          [84.4303, 103.317],
          [14.8253, 117.467],
          [84.4303, 117.435],
          [14.8253, 131.586],
          [84.4303, 131.554],
          [14.8253, 145.704],
          [84.4303, 145.672],
          [14.8253, 159.823],
          [84.4303, 159.79],
          [14.8253, 173.941],
          [84.4303, 173.909],
        ].map(([x, y], i) => (
          <rect
            key={i}
            width="64.5183"
            height="5.88276"
            rx="2.94138"
            transform={`matrix(1 ${i % 2 === 0 ? "-0.000409158" : "-0.000461045"} ${i % 2 === 0 ? "0.00201956" : "0.00179228"} 0.999998 ${x} ${y})`}
            fill={theme.cardLineFill}
          />
        ))}
        <defs>
          <filter
            id={filterId}
            x="0"
            y="0"
            width="166.078"
            height="218.262"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="2"
              operator="erode"
              in="SourceAlpha"
              result={`effect1_innerShadow_${id}`}
            />
            <feOffset dx="3" dy="5" />
            <feGaussianBlur stdDeviation="3.05" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values={theme.cardInsetColor} />
            <feBlend
              mode="normal"
              in2="shape"
              result={`effect1_innerShadow_${id}`}
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
