import { NextRequest, NextResponse } from "next/server";
import { getTafsir } from "@/lib/api/equran";

export const revalidate = 604800;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ nomor: string }> },
) {
  const { nomor } = await params;
  const n = Number(nomor);
  if (!Number.isInteger(n) || n < 1 || n > 114) {
    return NextResponse.json({ error: "Nomor surah tidak valid." }, { status: 400 });
  }

  try {
    const tafsir = await getTafsir(n);
    return NextResponse.json(
      { tafsir },
      {
        headers: {
          "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=2592000",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Tafsir sedang tidak tersedia." },
      { status: 502 },
    );
  }
}
