/* Self-check data statis — jalankan: node scripts/check-data.ts */

import assert from "node:assert/strict";
import { SURAH, BASMALAH } from "../lib/data/surah";
import { JUZ, juzOf } from "../lib/data/juz";
import { audioUrl } from "../lib/audio";

assert.equal(SURAH.length, 114);
assert.equal(SURAH.reduce((a, s) => a + s.ayat, 0), 6236, "total ayat");
SURAH.forEach((s, i) => assert.equal(s.n, i + 1, `urutan surah ${i + 1}`));

/* 30 juz menyambung tanpa celah dan tanpa tumpang tindih */
assert.equal(JUZ.length, 30);
assert.equal(JUZ.reduce((a, j) => a + j.jumlahAyat, 0), 6236, "total ayat juz");
let s = 1;
let n = 1;
for (const j of JUZ) {
  for (const r of j.rentang) {
    assert.deepEqual([r.surah, r.dari], [s, n], `juz ${j.nomor} mulai di ${s}:${n}`);
    assert.ok(r.sampai >= r.dari && r.sampai <= SURAH[r.surah - 1].ayat);
    [s, n] = r.sampai === SURAH[r.surah - 1].ayat ? [r.surah + 1, 1] : [r.surah, r.sampai + 1];
  }
}
assert.deepEqual([s, n], [115, 1], "juz 30 berakhir di 114:6");

/* Batas khas Mushaf Standar Indonesia (berbeda dari Mushaf Madinah) */
assert.equal(juzOf(5, 82), 6);
assert.equal(juzOf(5, 83), 7);
assert.equal(juzOf(1, 1), 1);
assert.equal(juzOf(114, 6), 30);

assert.equal(audioUrl("05", 36, 1), "https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/036001.mp3");
assert.equal(audioUrl("01", 2, 255), "https://cdn.equran.id/audio-partial/Abdullah-Al-Juhany/002255.mp3");
assert.ok(BASMALAH.startsWith("بِسْمِ"));

console.log("data: 114 surah · 30 juz · 6.236 ayat — lolos");
