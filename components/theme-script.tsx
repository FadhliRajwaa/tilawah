/* — Skrip inline sebelum paint pertama.
 *
 * Menerapkan preferensi tampilan ke <html> SEBELUM React hidrasi, supaya
 * halaman yang dirender server langsung tampil sesuai pilihan pengguna:
 * tema, latin/terjemahan, mode baca, dan ukuran teks Arab.
 *
 * ⚠️ Logikanya harus sama dengan `applyPrefs` di lib/store/prefs.ts.
 * Duplikasi ini disengaja: skrip ini berjalan sebelum bundle JS dimuat,
 * jadi tidak bisa mengimpor apa pun.
 */

const SCRIPT = `
(function () {
  var d = document.documentElement, p = {};
  try { p = JSON.parse(localStorage.getItem("tilawah:prefs") || "{}") || {}; } catch (e) {}
  var mode = p.theme || "auto";
  var dark = mode === "dark" || (mode === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  d.dataset.theme = dark ? "dark" : "light";
  d.dataset.themeMode = mode;
  d.dataset.latin = p.showLatin === false ? "0" : "1";
  d.dataset.tr = p.showTranslation === false ? "0" : "1";
  d.dataset.mode = p.readMode === "mushaf" ? "mushaf" : "ayat";
  var s = Number(p.arabicScale);
  if (s >= 0.7 && s <= 2) d.style.setProperty("--arabic-scale", String(s));
  var m = document.querySelectorAll('meta[name="theme-color"]');
  for (var i = 0; i < m.length; i++) m[i].content = dark ? "#061118" : "#e8f6fb";
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
