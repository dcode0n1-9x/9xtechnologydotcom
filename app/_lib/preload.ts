import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Returns the asset path if it exists in /public, else null — so a missing
 * critical asset (e.g. the portrait) degrades to a fallback instead of
 * preloading a 404.
 */
export function publicAssetOrNull(assetPath: string): string | null {
  const file = path.join(process.cwd(), "public", assetPath.replace(/^\//, ""));
  return existsSync(file) ? assetPath : null;
}
