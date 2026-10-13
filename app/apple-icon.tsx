/* — Ikon layar utama iOS & sampul di layar kunci (Media Session).
 * Tanpa sudut membulat: iOS memotongnya sendiri. */

import { ImageResponse } from "next/og";
import { IconArt } from "./_icon-art";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<IconArt px={128} radius={0} />, { ...size });
}
