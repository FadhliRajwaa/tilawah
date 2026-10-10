import Link from "next/link";
import type { SurahSummary } from "@/lib/types";

interface Item {
  nomor: number;
  label: string;
  surah?: SurahSummary;
}

export function PopularSurah({ items }: { items: Item[] }) {
  return (
    <div className="chip-row">
      {items.map((it) => (
        <Link key={it.nomor} href={`/surat/${it.nomor}`} className="chip">
          {it.label}
          <b>{it.surah ? `${it.surah.jumlahAyat} ayat` : `#${it.nomor}`}</b>
        </Link>
      ))}
    </div>
  );
}
