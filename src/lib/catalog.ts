import "server-only";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { PAGE_SIZE } from "@/lib/format";

export type Product = {
  id: string;
  slug: string;
  title: string;
  image: string;
  images: string[];
  price: number;
  compare_at: number | null;
  in_stock: boolean;
  theme: string | null;
};

export type Filters = Partial<Record<"theme" | "style" | "type" | "availability" | "sort", string>>;

const COLUMNS = "id, slug, title, image, images, price, compare_at, in_stock, theme";

const SORTS: Record<string, [string, boolean]> = {
  featured: ["position", true],
  best: ["position", true],
  az: ["title", true],
  za: ["title", false],
  "price-asc": ["price", true],
  "price-desc": ["price", false],
  old: ["created_at", true],
  new: ["created_at", false],
};

const db = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });

const list = (v?: string) => v?.split(",").filter(Boolean).slice(0, 30) ?? [];

export async function listProducts(f: Filters, page = 0) {
  const [col, asc] = SORTS[f.sort ?? ""] ?? SORTS.featured;
  let q = db().from("products").select(COLUMNS);
  for (const key of ["theme", "style", "type"] as const) {
    const values = list(f[key]);
    if (values.length) q = q.in(key, values);
  }
  const stock = list(f.availability);
  if (stock.length === 1) q = q.eq("in_stock", stock[0] === "In stock");
  const { data, error } = await q
    .order(col, { ascending: asc })
    .order("id")
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
  if (error) throw error;
  return data as Product[];
}

export const getProduct = cache(async (slug: string) => {
  const { data, error } = await db().from("products").select(COLUMNS).eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as Product | null;
});

export const allSlugs = unstable_cache(
  async () => {
    const { data, error } = await db().from("products").select("slug, created_at").order("position").limit(50000);
    if (error) throw error;
    return data as { slug: string; created_at: string }[];
  },
  ["all-slugs"],
  { revalidate: 3600, tags: ["products"] },
);

export async function searchProducts(term: string) {
  const words = term.trim().split(/\s+/).filter(Boolean).slice(0, 6);
  if (!words.length) return [];
  const { data, error } = await db()
    .from("products")
    .select(COLUMNS)
    .textSearch("search", words.map((w) => `${w.replace(/[^\p{L}\p{N}]/gu, "")}:*`).filter((w) => w !== ":*").join(" & "), {
      config: "simple",
    })
    .order("position")
    .limit(8);
  if (error) throw error;
  return data as Product[];
}

export type FacetCount = { facet: string; value: string; count: number };

export const facetCounts = unstable_cache(
  async () => {
    const { data, error } = await db().rpc("facet_counts");
    if (error) throw error;
    return data as FacetCount[];
  },
  ["facet-counts"],
  { revalidate: 300, tags: ["products"] },
);

export const heroProducts = unstable_cache(
  async (ids: string[]) => {
    if (ids.length) {
      const { data, error } = await db().from("products").select(COLUMNS).in("id", ids).eq("in_stock", true);
      if (error) throw error;
      return ids.flatMap((id) => (data as Product[]).filter((p) => p.id === id));
    }
    const { data, error } = await db()
      .from("products")
      .select(COLUMNS)
      .eq("type", "Stickers")
      .eq("in_stock", true)
      .order("position")
      .limit(16);
    if (error) throw error;
    return data as Product[];
  },
  ["hero-products"],
  { revalidate: 3600, tags: ["products", "hero"] },
);

export type Hero = { badge: string; line1: string; line2: string; highlight: string; subtitle: string; cta: string; stickers: string[] };

export const HERO_DEFAULT: Hero = {
  badge: "Waterproof vinyl · ships in 24h",
  line1: "slap it",
  line2: "for",
  highlight: "₹10",
  subtitle: "Anime, memes, cats, chaos. Drag a few onto the laptop to test your vibe, then grab the whole setup in one tap.",
  cta: "Shop all stickers",
  stickers: [],
};

export const heroContent = unstable_cache(
  async () => {
    const { data } = await db().from("site_settings").select("value").eq("key", "hero").maybeSingle();
    return { ...HERO_DEFAULT, ...(data?.value as Partial<Hero> | undefined) };
  },
  ["hero-content-v2"],
  { revalidate: 3600, tags: ["hero"] },
);
