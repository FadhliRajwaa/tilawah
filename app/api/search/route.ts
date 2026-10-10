import { NextRequest, NextResponse } from "next/server";
import { searchTerjemahan } from "@/lib/api/search";

export const revalidate = 86400;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const offset = Number(req.nextUrl.searchParams.get("offset") ?? 0);
  const limit = Math.min(50, Number(req.nextUrl.searchParams.get("limit") ?? 20));

  if (!q || q.length < 2) {
    return NextResponse.json(
      { error: "Kata kunci minimal 2 karakter." },
      { status: 400 },
    );
  }

  try {
    const result = await searchTerjemahan(q, offset, limit);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch {
    return NextResponse.json(
      { error: "Pencarian sedang tidak tersedia. Coba lagi sebentar lagi." },
      { status: 502 },
    );
  }
}
