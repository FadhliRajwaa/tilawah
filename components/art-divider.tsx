/* — Pembatas seksi bergambar: strip tipis tekstur ubin Islami.
 * Berfungsi sebagai jeda visual antar seksi tanpa memutus ritme tipografi.
 *
 * Strip ini juga bisa diklik: tombol perbesar kecil di tengah muncul saat
 * hover/fokus. Tepat di strip setinggi 76px, satu klik adalah satu-satunya
 * cara masuk akal untuk melihat polanya lebih dekat.
 */

import { AmbientImage } from "./ambient-image";
import { PhotoZoom } from "./photo-zoom";

type DividerVariant =
  | "divider-tile" | "divider-vine" | "divider-zellige"
  | "divider-star" | "divider-dome" | "divider-mosaic";

export function ArtDivider({ variant = "divider-zellige" }: { variant?: DividerVariant }) {
  return (
    <div className="divider-art" role="presentation">
      <AmbientImage variant={variant} intensity={0.28} position="center" fade="sides" />
      <PhotoZoom
        variant={variant}
        caption="Pola geometri Islami"
        className="divider-art__zoom"
        ringkas
      />
    </div>
  );
}
