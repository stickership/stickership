import "server-only";
import { facetCounts } from "@/lib/catalog";

export async function productOptions() {
  const counts = await facetCounts();
  const of = (facet: string) => counts.filter((c) => c.facet === facet).map((c) => c.value);
  return { theme: of("theme"), style: of("style"), type: [...new Set(["Stickers", "Holographic stickers", "Glitter Stickers", "Mystery Box", ...of("type")])] };
}
