/* — Script inline anti-flash: menerapkan tema SEBELUM paint pertama.
 *
 * Alasan (dari riset Next.js): membaca localStorage saat render → hydration
 * mismatch. Solusi resmi: inline script sinkron di <head> yang menulis
 * data-theme ke <html> sebelum React hydrate; komponen klien membaca
 * nilai yang sama setelah mount.
 */

const SCRIPT = `
(function () {
  try {
    var raw = localStorage.getItem("tilawah:prefs");
    var mode = raw ? (JSON.parse(raw).theme || "auto") : "auto";
    var dark =
      mode === "dark" ||
      (mode === "auto" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.dataset.themeMode = mode;
  } catch (e) {
    document.documentElement.dataset.theme = "light";
    document.documentElement.dataset.themeMode = "auto";
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
