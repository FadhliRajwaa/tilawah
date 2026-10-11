/* — Kerangka pemuatan untuk halaman baca (surat & juz).
 *
 * Bentuknya MENIRU tata letak yang akan menggantikannya: satu baris toolbar
 * dan beberapa blok ayat dengan tinggi berbeda. Itu penting — kerangka yang
 * berbentuk kotak seragam akan tetap terasa seperti "melompat" saat konten
 * asli muncul, karena tinggi totalnya berbeda jauh.
 *
 * Ini komponen server (tanpa "use client") karena hanya dipakai sebagai
 * `fallback` Suspense di halaman server.
 */

export function ReaderSkeleton({ ayah = 4 }: { ayah?: number }) {
  /* Tinggi tiap blok ayat bervariasi — kalau seragam, polanya terbaca
     sebagai baris tabel, bukan sebagai ayat. */
  const tinggi = [180, 140, 210, 160, 190, 150];

  return (
    <div className="container-page" aria-hidden="true">
      {/* toolbar */}
      <div className="skeleton" style={{ height: 52, marginBottom: "var(--space-5)" }} />

      <div className="stack-3">
        {Array.from({ length: ayah }, (_, i) => (
          <div key={i} className="skeleton" style={{ height: tinggi[i % tinggi.length] }} />
        ))}
      </div>
    </div>
  );
}
