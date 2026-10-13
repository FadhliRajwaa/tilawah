import { NextRequest, NextResponse } from "next/server";
import { getJadwalBulanan, getJadwalHarian } from "@/lib/api/sholat";

/* Jadwal sholat satu kota.
 *   ?id=…&y=…&m=…&d=…   → jadwal harian
 *   ?id=…&y=…&m=…       → jadwal sebulan (tanpa `d`)
 *
 * Dulu dua route terpisah (`/api/sholat` dan `/api/sholat/bulanan`) dengan
 * validasi dan header cache yang disalin. */

const CACHE = { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" };

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const id = sp.get("id") ?? "";
  const y = Number(sp.get("y"));
  const m = Number(sp.get("m"));
  const d = sp.has("d") ? Number(sp.get("d")) : null;

  const ok =
    /^\d{1,6}$/.test(id) &&
    Number.isInteger(y) && y >= 2000 && y <= 2100 &&
    Number.isInteger(m) && m >= 1 && m <= 12 &&
    (d === null || (Number.isInteger(d) && d >= 1 && d <= 31));
  if (!ok) {
    return NextResponse.json({ error: "Parameter id, y, m (dan d) tidak valid." }, { status: 400 });
  }

  try {
    const data = d === null ? await getJadwalBulanan(id, y, m) : await getJadwalHarian(id, y, m, d);
    return NextResponse.json(data, { headers: CACHE });
  } catch {
    return NextResponse.json({ error: "Jadwal sholat sedang tidak tersedia." }, { status: 502 });
  }
}
