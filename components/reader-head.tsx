/* — Header halaman surat & juz: marquee mushaf.
 *
 * Sama seperti PageHead, tapi isinya bukan judul teks biasa — ada nama Arab
 * besar, meta, aksi, dan deskripsi. Karena itu ia komponen sendiri dengan
 * slot `children` yang lebar.
 */

import { AmbientImage, type ArtVariant } from "./ambient-image";
import { CornerFlourish } from "./ornaments";
import { PhotoZoom } from "./photo-zoom";

interface Props {
  variant: ArtVariant;
  caption: string;
  position?: string;
  intensity?: number;
  children: React.ReactNode;
}

export function ReaderHead({
  variant,
  caption,
  position = "center 42%",
  intensity = 0.88,
  children,
}: Props) {
  return (
    <header className="reader-head">
      <AmbientImage
        variant={variant}
        mode="plate"
        intensity={intensity}
        position={position}
        fixed
      />
      <div className="reader-head__veil" aria-hidden="true" />
      <CornerFlourish className="reader-head__corner reader-head__corner--tl" />
      <CornerFlourish className="reader-head__corner reader-head__corner--br" />
      <PhotoZoom
        variant={variant}
        caption={caption}
        position={position}
        className="reader-head__zoom"
      />
      <div className="reader-head__inner container-page on-ambient">{children}</div>
    </header>
  );
}
