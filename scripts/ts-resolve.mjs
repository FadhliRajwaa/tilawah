/* Supaya `node scripts/check-*.ts` bisa mengimpor modul aplikasi apa adanya:
 * alias "@/…" dan impor tanpa ekstensi, sama seperti yang dipahami bundler Next.
 * Dipakai lewat `npm run check`. */
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = pathToFileURL(path.resolve(import.meta.dirname, "..") + path.sep);

registerHooks({
  resolve(spec, ctx, next) {
    if (spec.startsWith("@/")) spec = new URL(spec.slice(2), root).href;
    try {
      return next(spec, ctx);
    } catch (err) {
      for (const ext of [".ts", ".tsx", "/index.ts"]) {
        try {
          return next(spec + ext, ctx);
        } catch {}
      }
      throw err;
    }
  },
});
