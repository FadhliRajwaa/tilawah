/* — utilitas umum — */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gabung className (dipakai komponen shadcn + komponen sendiri). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function pad(n: number, w = 2): string {
  return String(n).padStart(w, "0");
}

/** "2:255" → { surah: 2, ayah: 255 } */
export function parseAyatRef(ref: string): { surah: number; ayah: number } | null {
  const m = /^(\d{1,3})[:.](\d{1,3})$/.exec(ref.trim());
  if (!m) return null;
  const surah = Number(m[1]);
  const ayah = Number(m[2]);
  if (surah < 1 || surah > 114 || ayah < 1) return null;
  return { surah, ayah };
}

/** Deteksi input pencarian: "yasin", "36", "2:255", "al-kahf" */
export function looksLikeSurahQuery(q: string): boolean {
  const s = q.trim().toLowerCase();
  return /^\d{1,3}$/.test(s) || /^[a-z\-\s']+$/.test(s);
}

export function toArabicNumber(n: number): string {
  const digits = "٠١٢٣٤٥٦٧٨٩";
  return String(n)
    .split("")
    .map((d) => digits[Number(d)] ?? d)
    .join("");
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
