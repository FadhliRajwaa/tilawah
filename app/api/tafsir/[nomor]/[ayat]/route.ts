import { NextResponse } from "next/server";
import { getTafsir } from "@/lib/api/equran";
import { SURAH } from "@/lib/data/surah";

/* Tafsir SATU ayat. Dulu klien mengunduh tafsir seluruh surah untuk membaca
 * satu ayat — untuk Al-Baqarah itu 657.000 karakter. Tafsir surah tetap
 * diambil utuh dari equran.id di server (dan di-cache), tapi yang dikirim ke
 * peramban hanya ayat yang diminta. */

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ nomor: string; ayat: string }> },
) {
  const { nomor, ayat } = await params;
  const s = Number(nomor);
  const n = Number(ayat);
  if (!Number.isInteger(s) || s < 1 || s > 114 || !Number.isInteger(n) || n < 1 || n > SURAH[s - 1].ayat) {
    return NextResponse.json({ error: "Nomor surah atau ayat tidak valid." }, { status: 400 });
  }

  try {
    const teks = (await getTafsir(s)).find((t) => t.ayat === n)?.teks ?? null;
    return NextResponse.json(
      { teks },
      { headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=31536000" } },
    );
  } catch {
    return NextResponse.json({ error: "Tafsir sedang tidak tersedia." }, { status: 502 });
  }
}
