/* — utilitas umum — */

/** Gabung className; nilai falsy dibuang.
 *
 *  Dulu `twMerge(clsx(...))`. Proyek ini memakai kelas BEM sendiri — tidak ada
 *  utility Tailwind yang bisa bertabrakan — jadi dua dependensi itu (±8 KB JS
 *  di setiap halaman) diganti satu baris. */
export function cn(...c: Array<string | false | null | undefined>): string {
  return c.filter(Boolean).join(" ");
}

export function pad(n: number, w = 2): string {
  return String(n).padStart(w, "0");
}

export function toArabicNumber(n: number): string {
  const digits = "٠١٢٣٤٥٦٧٨٩";
  return String(n)
    .split("")
    .map((d) => digits[Number(d)] ?? d)
    .join("");
}

/** Tanggal Hijriah (kalender Umm al-Qura) dalam Bahasa Indonesia,
 *  mis. "12 Rabiulawal 1447 H". Dihitung lokal via Intl — tanpa API. */
export function tanggalHijriah(d: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("id-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).formatToParts(d);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
    return `${get("day")} ${get("month")} ${get("year")} H`;
  } catch {
    return "";
  }
}

/** Nama hari Indonesia dari objek Date */
export function hariIndo(d: Date): string {
  return ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][d.getDay()];
}

/** Selisih detik sampai "HH:MM" hari ini (bisa negatif). */
export function secondsUntil(hhmm: string, now = new Date()): number {
  const [h, m] = hhmm.split(":").map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  return Math.floor((target.getTime() - now.getTime()) / 1000);
}

export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => pad(v)).join(":");
}

/** Detik → "m:ss" (label pemutar). */
export function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "0:00";
  const s = Math.floor(sec);
  return `${Math.floor(s / 60)}:${pad(s % 60)}`;
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari lalu`;
}

/** Potong teks dengan aman (tanpa memotong kata). */
export function truncate(text: string, max = 120): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

/** Permintaan "kurangi gerak" — dibaca saat dipakai, bukan saat modul dimuat,
 *  karena pengguna bisa mengubahnya kapan saja. Opsi `behavior` pada
 *  `scrollIntoView` MENANG atas CSS, jadi pemeriksaan ini wajib eksplisit. */
export function reduceMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Gulir ke elemen: langsung kalau jauh (animasi 200.000px tidak membantu
 *  siapa pun), halus kalau dekat (mata bisa mengikuti ke mana ia pergi). */
export function scrollToEl(el: Element, block: ScrollLogicalPosition = "center"): void {
  const dist = Math.abs(el.getBoundingClientRect().top);
  const near = dist < window.innerHeight * 1.5;
  el.scrollIntoView({ block, behavior: near && !reduceMotion() ? "smooth" : "instant" });
}
