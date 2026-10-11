/* — Header halaman bergambar: dipakai /surat, /ibadah, /cari, /juz.
 *
 * Sebelumnya tiap halaman menulis ulang blok yang sama (foto + veil + orb +
 * eyebrow + judul + sub + ornamen) dengan panjang yang berbeda-beda. Sekarang
 * satu komponen: struktur sama, isi berbeda. Lebih sedikit tempat untuk salah,
 * dan perubahan desain cukup di sini.
 *
 * Latar fotonya dipaku ke viewport sehingga terasa satu lembar dengan hero
 * beranda dan banner di bawahnya.
 */

import { AmbientImage, type ArtVariant } from "./ambient-image";
import { Orb } from "./orb";
import { OrnamentDivider } from "./ornaments";
import { PhotoZoom } from "./photo-zoom";

interface Props {
  eyebrow: string;
  title: string;
  desc: string;
  variant: ArtVariant;
  /** keterangan untuk lightbox (default: judul) */
  caption?: string;
  position?: string;
  intensity?: number;
  /** orb dekoratif di sudut — warna & ukuran mengikuti tema */
  orb?: boolean;
  priority?: boolean;
  /** elemen tambahan di bawah deskripsi (mis. label acuan mushaf) */
  children?: React.ReactNode;
}

export function PageHead({
  eyebrow,
  title,
  desc,
  variant,
  caption,
  position = "center 42%",
  intensity = 0.85,
  orb = false,
  priority = false,
  children,
}: Props) {
  return (
    <header className="page-head page-head--tall">
      <AmbientImage
        variant={variant}
        mode="plate"
        intensity={intensity}
        position={position}
        parallax
        priority={priority}
      />
      {orb && <Orb size={440} color="#109BDA" className="orb-host--page" delay={900} />}
      <div className="page-head__veil" aria-hidden="true" />
      <PhotoZoom
        variant={variant}
        caption={caption ?? title}
        position={position}
        className="page-head__zoom"
      />
      <div className="container-page page-head__inner on-ambient">
        <p className="reader-head__eyebrow">{eyebrow}</p>
        <h1 className="page-head__title">{title}</h1>
        <p className="page-head__desc">{desc}</p>
        {children}
        <div className="page-head__ornament">
          <OrnamentDivider className="ornament-divider" />
        </div>
      </div>
    </header>
  );
}
