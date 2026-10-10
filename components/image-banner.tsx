/* — Banner bergambar: foto tampil jelas dengan overlay tipis agar teks terbaca.
 * Berbeda dari AmbientImage (yang jadi tekstur samar), banner ini MENUNJUKKAN
 * fotonya — untuk memberi napas visual di antara seksi teks.
 *
 * Fotonya bergerak lebih lambat dari halaman (`parallax`): saat halaman
 * menggulir, banner meluncur di atas gambar yang tertinggal — lapisan visual
 * yang tenang, bukan gambar yang ikut terbawa scroll.
 *
 * ⚠️ Dulu ini memakai `background-attachment: fixed`, dan itu TIDAK bekerja
 * di Safari iOS (diabaikan) maupun di layar sempit (cover diukur terhadap
 * viewport, bukan elemen). Sekarang `transform` — lihat parallax.tsx.
 */

import Link from "next/link";
import { AmbientImage, type ArtVariant } from "./ambient-image";
import { PhotoZoom } from "./photo-zoom";

interface Props {
  variant: ArtVariant;
  /** teks kecil di atas judul */
  eyebrow?: string;
  title: string;
  desc?: string;
  /** CTA opsional */
  cta?: { href: string; label: string };
  /** tinggi minimum */
  height?: "sm" | "md" | "lg";
  position?: string;
  /** arah gradien overlay: bawah (teks di bawah) atau kiri */
  align?: "bottom" | "left";
  /** keterangan untuk lightbox (default: judul) */
  caption?: string;
}

export function ImageBanner({
  variant,
  eyebrow,
  title,
  desc,
  cta,
  height = "md",
  position = "center",
  align = "bottom",
  caption,
}: Props) {
  return (
    <section className={`img-banner img-banner--${height} img-banner--${align}`}>
      <AmbientImage variant={variant} mode="plate" intensity={1} position={position} parallax />
      <div className="img-banner__veil" aria-hidden="true" />
      <PhotoZoom variant={variant} caption={caption ?? title} position={position} />
      <div className="img-banner__body container-page">
        {eyebrow && <p className="img-banner__eyebrow">{eyebrow}</p>}
        <h2 className="img-banner__title">{title}</h2>
        {desc && <p className="img-banner__desc">{desc}</p>}
        {cta && (
          <Link href={cta.href} className="btn btn--primary img-banner__cta">
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
