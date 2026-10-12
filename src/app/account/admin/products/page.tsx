import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { btn, btnGhost, input, PageTitle } from "../_components/ui";
import { ProductTable } from "./ProductTable";

const PER_PAGE = 50;

export default async function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
  const stock = sp.stock === "in" || sp.stock === "out" ? sp.stock : "";
  const page = Math.max(0, Number(sp.page) || 0);

  let query = supabase
    .from("products")
    .select("id, slug, title, image, price, compare_at, type, theme, in_stock, position", { count: "exact" })
    .order("position")
    .order("id")
    .range(page * PER_PAGE, page * PER_PAGE + PER_PAGE - 1);
  if (q) query = query.ilike("title", `%${q.replace(/[%_]/g, "")}%`);
  if (stock) query = query.eq("in_stock", stock === "in");
  const { data: products, count } = await query;
  const pages = Math.ceil((count ?? 0) / PER_PAGE);
  const link = (p: number) => `/admin/products?${new URLSearchParams({ ...(q && { q }), ...(stock && { stock }), page: String(p) })}`;

  return (
    <>
      <PageTitle
        action={
          <Link href="/admin/products/new" className={btn}>
            + New sticker
          </Link>
        }
      >
        Products <span className="text-base font-medium text-black/40">({count ?? 0})</span>
      </PageTitle>

      <form className="mb-4 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search title…" className={`${input} max-w-xs`} />
        <select name="stock" defaultValue={stock} className={`${input} max-w-[160px]`}>
          <option value="">All stock</option>
          <option value="in">In stock</option>
          <option value="out">Out of stock</option>
        </select>
        <button className={btnGhost}>Filter</button>
      </form>

      <ProductTable key={`${q}-${stock}-${page}`} products={products ?? []} />

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          {page > 0 && (
            <Link href={link(page - 1)} className={btnGhost}>
              ← Prev
            </Link>
          )}
          <span className="text-black/50">
            Page {page + 1} of {pages}
          </span>
          {page + 1 < pages && (
            <Link href={link(page + 1)} className={btnGhost}>
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
