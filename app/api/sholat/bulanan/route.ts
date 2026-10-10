import { NextRequest, NextResponse } from "next/server";
import { getJadwalBulanan } from "@/lib/api/sholat";

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const id = sp.get("id");
  const y = Number(sp.get("y"));
  const m = Number(sp.get("m"));

  if (!id || !Number.isInteger(y) || !Number.isInteger(m)) {
    return NextResponse.json({ error: "Parameter id, y, m wajib." }, { status: 400 });
  }

  try {
    const jadwal = await getJadwalBulanan(id, y, m);
    return NextResponse.json(jadwal, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json(
      { error: "Jadwal bulanan sedang tidak tersedia." },
      { status: 502 },
    );
  }
}
