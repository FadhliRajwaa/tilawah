/* — Latar watercolor ————————————————————————————————————————————
 *
 * Sapuan cat air biru yang DIAM di belakang seluruh halaman. Bukan gambar
 * (nol byte unduhan, nol permintaan jaringan) melainkan gradient bertumpuk
 * yang di-blur, jadi:
 *   · tidak menambah beban bandwidth — penting karena aset 48 MB sudah besar
 *   · tidak pecah di layar selebar apa pun (resolve 100% vektor)
 *   · ikut tema otomatis lewat CSS variable
 *
 * Kenapa "fixed": latarnya menempel di viewport, konten yang menggulir di
 * atasnya. Efeknya halaman terasa seperti satu lembar kertas panjang yang
 * ditarik di atas meja berpola — bukan gambar yang ikut terbawa scroll.
 *
 * empat warna wash: #109BDA · #19BBE3 · #52D9E8 · #8BE9EA (dari palet user)
 *
 * Performa: hanya 3 lapisan gradient + 1 blur besar. Blur di sini dihitung
 * SEKALI saat paint dan tidak berubah saat scroll (karena `fixed`), jadi
 * biayanya jauh lebih murah daripada parallax berbasis JS.
 */

export function WatercolorBg() {
  return (
    <div className="wash" aria-hidden="true">
      {/* tiga tudung cahaya: atas-kiri biru pekat, kanan aqua, bawah pucat */}
      <span className="wash__blob wash__blob--1" />
      <span className="wash__blob wash__blob--2" />
      <span className="wash__blob wash__blob--3" />
      {/* serat kertas halus — menahan kesan "gradient digital" */}
      <span className="wash__grain" />
    </div>
  );
}
