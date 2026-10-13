import { NextRequest, NextResponse } from "next/server";
import { cariKota } from "@/lib/api/sholat";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3 || q.length > 40) {
    return NextResponse.json({ error: "Kata kunci kota 3–40 huruf." }, { status: 400 });
  }
  try {
    return NextResponse.json(await cariKota(q), {
      headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=2592000" },
    });
  } catch {
    return NextResponse.json({ error: "Pencarian kota sedang tidak tersedia." }, { status: 502 });
  }
}
