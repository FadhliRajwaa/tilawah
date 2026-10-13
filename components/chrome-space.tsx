"use client";

/* — Ruang chrome bawah dinamis.
 *
 * Menulis `--chrome-bottom` (padding konten + posisi toast) dan
 * `--tabbar-space` (jarak mini-player di atas tabbar). Diperbarui saat ukuran
 * body berubah (pemutar muncul/tutup) dan saat kelas tabbar berubah
 * (sembunyi/muncul) — tanpa polling. */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/lib/player";

export function ChromeSpace() {
  const pathname = usePathname();
  const hasTrack = usePlayer((s) => !!s.track);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const mobile = window.matchMedia("(max-width: 900px)").matches;
      const tabbar = document.querySelector<HTMLElement>(".tabbar");
      const tabVisible = mobile && tabbar && !tabbar.classList.contains("is-hidden");
      const tabH = tabVisible ? tabbar.offsetHeight : 0;

      const mini = document.querySelector<HTMLElement>(".mini-player");
      const miniH = mobile && mini ? mini.offsetHeight + 24 : 0;
      const dock = document.querySelector<HTMLElement>(".audio-dock");
      const dockH = !mobile && dock ? dock.offsetHeight : 0;

      root.style.setProperty("--tabbar-space", `${tabH}px`);
      root.style.setProperty("--chrome-bottom", `${Math.max(tabH, miniH, dockH)}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    const mo = new MutationObserver(update);
    const tabbar = document.querySelector(".tabbar");
    if (tabbar) mo.observe(tabbar, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", update);
      root.style.setProperty("--tabbar-space", "0px");
      root.style.setProperty("--chrome-bottom", "0px");
    };
  }, [pathname, hasTrack]);

  return null;
}
