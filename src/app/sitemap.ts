import type { MetadataRoute } from "next";
import { allSlugs } from "@/lib/catalog";
import { pages } from "@/data/pages";

const BASE = "https://stickership.shop";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await allSlugs();
  return [
    { url: `${BASE}/`, changeFrequency: "daily", priority: 1 },
    ...products.map((p) => ({ url: `${BASE}/products/${p.slug}`, lastModified: p.created_at, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...Object.keys(pages).map((slug) => ({ url: `${BASE}/pages/${slug}`, changeFrequency: "monthly" as const, priority: 0.4 })),
    { url: `${BASE}/track`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
