/* — Pencarian cepat: "36", "2:255", "yasin 9", "kahfi", "juz 30", "ayat kursi".
 *
 * Fungsi murni tanpa impor (datanya diterima sebagai argumen) supaya bisa
 * diuji langsung dengan `node scripts/check-quick-find.ts`.
 *
 * Ejaan nama surah di Indonesia sangat beragam — "Yaasiin", "Al Kahfi",
 * "alkahfi", "Ar-Rahman", "annas". Nama dan kueri dinormalkan dengan cara
 * yang sama: huruf kecil, tanpa tanda baca, tanpa awalan "al/an/ar/asy…",
 * dan huruf ganda dirapatkan ("yaasiin" → "yasin").
 */

export interface QFSurah {
  n: number;
  latin: string;
  arti: string;
  ayat: number;
}

export type QFResult =
  | { kind: "surah"; s: number }
  | { kind: "ayah"; s: number; n: number }
  | { kind: "juz"; n: number }
  | { kind: "text"; q: string };

const ARTIKEL = /^(asy|ash|adz|al|an|ar|as|at|az|ad)(?=[a-z]{3})/;

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

const rapat = (s: string) => s.replace(/(.)\1+/g, "$1");

/** Dua bentuk kunci: dengan dan tanpa artikel (keduanya dirapatkan). */
function kunci(s: string): [string, string] {
  const n = norm(s);
  return [rapat(n), rapat(n.replace(ARTIKEL, ""))];
}

/** Nama populer yang tidak terbaca dari nama latinnya. */
const ALIAS: Record<string, QFResult> = {
  ayatkursi: { kind: "ayah", s: 2, n: 255 },
  kursi: { kind: "ayah", s: 2, n: 255 },
  tabarak: { kind: "surah", s: 67 },
  ama: { kind: "juz", n: 30 },
  juzama: { kind: "juz", n: 30 },
  alamnasyrah: { kind: "surah", s: 94 },
  fatiha: { kind: "surah", s: 1 },
};

/** Skor kecocokan kueri terhadap satu surah (0 = tidak cocok). */
function skor(q: string[], s: QFSurah): number {
  const [utuh, dasar] = kunci(s.latin);
  let best = 0;
  for (const k of q) {
    if (!k) continue;
    if (k === dasar || k === utuh) best = Math.max(best, 100);
    else if (dasar.startsWith(k) || utuh.startsWith(k)) best = Math.max(best, 80 + k.length);
    /* "kahfi" → Al-Kahf: kueri lebih panjang dari namanya */
    else if (dasar.length >= 3 && k.startsWith(dasar)) best = Math.max(best, 70);
    else if (k.length >= 3 && dasar.includes(k)) best = Math.max(best, 50);
  }
  if (best === 0 && q[0].length >= 3 && norm(s.arti).includes(norm(q[0]))) best = 30;
  return best;
}

function cariSurah(teks: string, list: readonly QFSurah[]): QFSurah[] {
  const q = kunci(teks);
  return list
    .map((s) => [s, skor(q, s)] as const)
    .filter(([, sk]) => sk > 0)
    .sort((a, b) => b[1] - a[1] || a[0].n - b[0].n)
    .map(([s]) => s);
}

export function quickFind(raw: string, list: readonly QFSurah[], max = 8): QFResult[] {
  const q = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!q) return [];
  const out: QFResult[] = [];
  const push = (r: QFResult) => {
    if (out.length < max && !out.some((o) => JSON.stringify(o) === JSON.stringify(r))) out.push(r);
  };
  const ayahValid = (s: number, n: number) => s >= 1 && s <= 114 && n >= 1 && n <= list[s - 1].ayat;

  const alias = ALIAS[rapat(norm(q))];
  if (alias) push(alias);

  /* 2:255 · 2.255 · 2 255 */
  let m = /^(\d{1,3})\s*[:.\s]\s*(\d{1,3})$/.exec(q);
  if (m && ayahValid(+m[1], +m[2])) push({ kind: "ayah", s: +m[1], n: +m[2] });

  /* juz 30 · j30 */
  m = /^(?:juz|j)\s*(\d{1,2})$/.exec(q);
  if (m && +m[1] >= 1 && +m[1] <= 30) push({ kind: "juz", n: +m[1] });

  /* 36 → surah; ≤30 juga ditawarkan sebagai juz */
  m = /^(\d{1,3})$/.exec(q);
  if (m) {
    const n = +m[1];
    if (n >= 1 && n <= 114) push({ kind: "surah", s: n });
    if (n >= 1 && n <= 30) push({ kind: "juz", n });
  }

  /* yasin 9 · al kahfi 10 */
  m = /^(.*\D)\s*(\d{1,3})$/.exec(q);
  if (m && !/^(juz|j)\s*$/.test(m[1].trim())) {
    const [s] = cariSurah(m[1], list);
    if (s && ayahValid(s.n, +m[2])) push({ kind: "ayah", s: s.n, n: +m[2] });
  }

  if (/[a-z]/.test(q)) {
    for (const s of cariSurah(q, list)) push({ kind: "surah", s: s.n });
    if (q.length >= 3) push({ kind: "text", q: raw.trim() });
  }
  return out;
}
