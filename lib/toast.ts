/* — Notifikasi singkat ("Ayat ditandai", "Tersalin").
 *
 * Event global, bukan context: bisa dipanggil dari mana saja — komponen,
 * store, atau handler biasa — tanpa harus berada di bawah provider tertentu.
 * <Toaster/> di root layout yang menampilkannya. */

export interface ToastData {
  id: number;
  msg: string;
  /** aksi opsional, mis. "Batalkan" */
  action?: { label: string; run: () => void };
}

export const TOAST_EVENT = "tilawah:toast";

let seq = 0;

export function toast(msg: string, action?: ToastData["action"]): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastData>(TOAST_EVENT, { detail: { id: ++seq, msg, action } }),
  );
}
