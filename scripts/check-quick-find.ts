/* Self-check pencarian cepat — jalankan: node scripts/check-quick-find.ts */

import assert from "node:assert/strict";
import { quickFind, type QFResult } from "../lib/quick-find";
import { SURAH } from "../lib/data/surah";

const first = (q: string): QFResult | undefined => quickFind(q, SURAH)[0];
const surahOf = (q: string) => {
  const r = first(q);
  return r?.kind === "surah" ? r.s : r;
};

const kasus: [string, number][] = [
  ["yasin", 36],
  ["Yaasiin", 36],
  ["al kahfi", 18],
  ["alkahfi", 18],
  ["kahf", 18],
  ["ar-rahman", 55],
  ["rahman", 55],
  ["al mulk", 67],
  ["waqiah", 56],
  ["annas", 114],
  ["an nas", 114],
  ["al-ikhlas", 112],
  ["anfal", 8],
  ["asy syams", 91],
  ["ali imran", 3],
  ["al fatihah", 1],
  ["36", 36],
  ["114", 114],
  ["tabarak", 67],
];
for (const [q, s] of kasus) assert.equal(surahOf(q), s, `"${q}" → surah ${s}`);

assert.deepEqual(first("2:255"), { kind: "ayah", s: 2, n: 255 });
assert.deepEqual(first("2 255"), { kind: "ayah", s: 2, n: 255 });
assert.deepEqual(first("yasin 9"), { kind: "ayah", s: 36, n: 9 });
assert.deepEqual(first("ayat kursi"), { kind: "ayah", s: 2, n: 255 });
assert.deepEqual(first("juz 30"), { kind: "juz", n: 30 });
assert.deepEqual(first("j7"), { kind: "juz", n: 7 });
/* ayat di luar jangkauan tidak boleh menghasilkan tautan rusak */
assert.equal(quickFind("1:8", SURAH).length, 0);
assert.equal(quickFind("115", SURAH).length, 0);
/* angka ≤30 juga ditawarkan sebagai juz */
assert.ok(quickFind("30", SURAH).some((r) => r.kind === "juz" && r.n === 30));
/* teks bebas menawarkan pencarian terjemahan */
assert.ok(quickFind("sabar", SURAH).some((r) => r.kind === "text"));
assert.equal(quickFind("   ", SURAH).length, 0);

console.log(`quick-find: ${kasus.length + 11} kasus lolos`);
