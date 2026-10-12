import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { rs } from "@/lib/format";
import { btnGhost, card, input, PageTitle, when } from "../_components/ui";

const PER_PAGE = 50;

export default async function CustomersPage({ searchParams }: PageProps<"/account/admin/customers">) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
  const page = Math.max(0, Number(sp.page) || 0);
  const { data: rows } = await supabase.rpc("admin_customers", { q, lim: PER_PAGE + 1, off: page * PER_PAGE });
  const customers = (rows ?? []).slice(0, PER_PAGE) as { email: string; name: string; phone: string; orders: number; spent: number; last_order: string }[];
  const more = (rows ?? []).length > PER_PAGE;
  const link = (p: number) => `/account/admin/customers?${new URLSearchParams({ ...(q && { q }), page: String(p) })}`;

  return (
    <>
      <PageTitle>Customers</PageTitle>
      <form className="mb-4 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search name or email…" className={`${input} max-w-sm`} />
        <button className={btnGhost}>Search</button>
      </form>
      <div className={`${card} overflow-x-auto p-0`}>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase text-black/50">
            <tr className="border-b border-black/10">
              <th className="px-4 py-3">Customer</th>
              <th className="py-3">Phone</th>
              <th className="py-3 text-right">Orders</th>
              <th className="py-3 text-right">Spent</th>
              <th className="px-4 py-3 text-right">Last order</th>
            </tr>
          </thead>
          <tbody>
            {!customers.length && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-black/50">
                  No paying customers yet.
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.email} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-semibold">{c.name}</p>
                  <Link href={`/account/admin/orders?q=${encodeURIComponent(c.email)}`} className="text-xs text-black/50 underline">
                    {c.email}
                  </Link>
                </td>
                <td className="py-3 text-black/60">{c.phone}</td>
                <td className="py-3 text-right">{c.orders}</td>
                <td className="py-3 text-right font-semibold">{rs(Number(c.spent))}</td>
                <td className="px-4 py-3 text-right text-black/60">{when(c.last_order)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center gap-3">
        {page > 0 && (
          <Link href={link(page - 1)} className={btnGhost}>
            ← Prev
          </Link>
        )}
        {more && (
          <Link href={link(page + 1)} className={btnGhost}>
            Next →
          </Link>
        )}
      </div>
    </>
  );
}
