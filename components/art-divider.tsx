/* — Pembatas seksi bergambar: strip tipis tekstur ubin Islami.
 * Berfungsi sebagai jeda visual antar seksi tanpa memutus ritme tipografi.
 */

import { AmbientImage } from "./ambient-image";

type DividerVariant = "divider-tile" | "divider-vine" | "divider-zellige" | "divider-star" | "divider-dome" | "divider-mosaic";

export function ArtDivider({ variant = "divider-zellige" }: { variant?: DividerVariant }) {
  return (
    <div className="divider-art" role="presentation">
      <AmbientImage variant={variant} intensity={0.28} position="center" fade="sides" />
    </div>
  );
}
