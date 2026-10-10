import { NextRequest, NextResponse } from "next/server";
import { cariKota, getKotaList } from "@/lib/api/sholat";

export const revalidate = 604800;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();

  try {
    if (!q || q.length < 3) {
      // tanpa query: kembalikan daftar lengkap (518 kota) untuk pencarian lokal
      const semua = await getKotaList();
      return NextResponse.json(semua, {
        headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=2592000" },
      });
    }
    const hasil = await cariKota(q);
    return NextResponse.json(hasil, {
      headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=2592000" },
    });
  } catch {
    return NextResponse.json(
      { error: "Pencarian kota sedang tidak tersedia." },
      { status: 502 },
    );
  }
}
