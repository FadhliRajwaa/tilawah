/* — Favicon, digenerate saat build. Pada 32px hanya siluet yang terbaca,
 * jadi bentuknya hanya dua halaman mushaf + tulang buku emas. */

import { ImageResponse } from "next/og";
import { IconArt } from "./_icon-art";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<IconArt px={26} radius={7} />, { ...size });
}
