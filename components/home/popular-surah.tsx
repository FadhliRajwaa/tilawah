import Link from "@/components/smart-link";
import type { SurahMeta } from "@/lib/data/surah";

interface Item {
  nomor: number;
  label: string;
  surah?: SurahMeta;
}

export function PopularSurah({ items }: { items: Item[] }) {
  return (
    <div className="chip-row">
      {items.map((it) => (
        <Link key={it.nomor} href={`/surat/${it.nomor}`} className="chip">
          {it.label}
          <b>{it.surah ? `${it.surah.ayat} ayat` : `#${it.nomor}`}</b>
        </Link>
      ))}
    </div>
  );
}
