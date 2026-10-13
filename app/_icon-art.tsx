/* — Gambar ikon aplikasi, dipakai bersama oleh favicon (icon.tsx) dan ikon
 * layar utama / layar kunci (apple-icon.tsx). Satu sumber supaya keduanya
 * tidak pernah berbeda bentuk. Warna ditulis langsung karena ImageResponse
 * tidak membaca CSS variable. */

const PAGE = "M20 11.6C16 7.6 9.4 6.6 5.4 8.6v19.2c4-2 10.6-1 14.6 3Z";

export function IconArt({ px, radius }: { px: number; radius: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(150deg, #19a7e0 0%, #0a6fa3 100%)",
        borderRadius: radius,
      }}
    >
      <svg width={px} height={px} viewBox="0 0 40 40" fill="none">
        <g stroke="#f5fbfe" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
          <path d={PAGE} />
          <g transform="translate(40 0) scale(-1 1)">
            <path d={PAGE} />
          </g>
        </g>
        <path d="M20 11.6v19.2" stroke="#f0d9a0" strokeWidth="3.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
