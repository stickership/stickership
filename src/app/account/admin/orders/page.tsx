import Link from "next/link";
import { ORDER_STATUSES, requireAdmin } from "@/lib/admin";
import { rs } from "@/lib/format";
import { btnGhost, card, input, PageTitle, StatusPill, when } from "../_components/ui";

const PER_PAGE = 50;

export default async function OrdersPage({ searchParams }: PageProps<"/account/admin/orders">) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" && (ORDER_STATUSES as readonly string[]).includes(sp.status) ? sp.status : "";
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
  const page = Math.max(0, Number(sp.page) || 0);

  let query = supabase
    .from("orders")
    .select("id, name, email, phone, total, status, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * PER_PAGE, page * PER_PAGE + PER_PAGE - 1);
  if (status) query = query.eq("status", status);
  if (/^[0-9a-f-]{36}$/i.test(q)) query = query.eq("id", q);
  else if (q) query = query.ilike("email", `%${q.replace(/[%_]/g, "")}%`);
  const { data: orders, count } = await query;
  const pages = Math.ceil((count ?? 0) / PER_PAGE);
  const link = (p: Record<string, string>) => `/account/admin/orders?${new URLSearchParams({ ...(status && { status }), ...(q && { q }), ...p })}`;

  return (
    <>
      <PageTitle>
        Orders <span className="text-base font-medium text-black/40">({count ?? 0})</span>
      </PageTitle>
      <div className="mb-4 flex flex-wrap gap-2">
        {["", ...ORDER_STATUSES].map((s) => (
          <Link
            key={s || "all"}
            href={`/account/admin/orders?${new URLSearchParams({ ...(s && { status: s }), ...(q && { q }) })}`}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${status === s ? "bg-black text-brand-yellow" : "bg-white text-black/70"}`}
          >
            {s || "all"}
          </Link>
        ))}
      </div>
      <form className="mb-4 flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <input name="q" defaultValue={q} placeholder="Order ID or email…" className={`${input} max-w-sm`} />
        <button className={btnGhost}>Search</button>
      </form>

      <div className={`${card} overflow-x-auto p-0`}>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-black/50">
            <tr className="border-b border-black/10">
              <th className="px-4 py-3">Order</th>
              <th className="py-3">Customer</th>
              <th className="py-3">Date</th>
              <th className="py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {!orders?.length && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-black/50">
                  No orders.
                </td>
              </tr>
            )}
            {orders?.map((o) => (
              <tr key={o.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                <td className="px-4 py-3">
                  <Link href={`/account/admin/orders/${o.id}`} className="font-mono text-xs font-bold underline">
                    #{o.id.slice(0, 8).toUpperCase()}
                  </Link>
                </td>
                <td className="py-3">
                  <p className="font-semibold">{o.name}</p>
                  <p className="text-xs text-black/50">{o.email}</p>
                </td>
                <td className="py-3 text-black/60">{when(o.created_at)}</td>
                <td className="py-3">
                  <StatusPill status={o.status} />
                </td>
                <td className="px-4 py-3 text-right font-semibold">{rs(Number(o.total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          {page > 0 && (
            <Link href={link({ page: String(page - 1) })} className={btnGhost}>
              ← Prev
            </Link>
          )}
          <span className="text-black/50">
            Page {page + 1} of {pages}
          </span>
          {page + 1 < pages && (
            <Link href={link({ page: String(page + 1) })} className={btnGhost}>
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
