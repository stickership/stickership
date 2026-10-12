import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { rs } from "@/lib/format";
import { card, PageTitle, StatusPill, when } from "./_components/ui";

type Stats = {
  revenue_today: number;
  revenue_7d: number;
  revenue_30d: number;
  orders_today: number;
  orders_7d: number;
  orders_30d: number;
  to_ship: number;
  products: number;
  out_of_stock: number;
  subscribers: number;
  top: { title: string; qty: number; revenue: number }[];
};

export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const [{ data: stats }, { data: recent }] = await Promise.all([
    supabase.rpc("admin_stats"),
    supabase.from("orders").select("id, name, email, total, status, created_at").order("created_at", { ascending: false }).limit(10),
  ]);
  const s = stats as Stats;

  const tiles = [
    ["Revenue today", rs(Number(s.revenue_today)), `${s.orders_today} orders`],
    ["Last 7 days", rs(Number(s.revenue_7d)), `${s.orders_7d} orders`],
    ["Last 30 days", rs(Number(s.revenue_30d)), `${s.orders_30d} orders`],
    ["To ship", String(s.to_ship), "paid, not shipped"],
  ];

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map(([label, value, sub], i) => (
          <div key={label} className={`${card} ${i === 3 && s.to_ship > 0 ? "ring-2 ring-brand-yellow" : ""}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/50">{label}</p>
            <p className="mt-2 font-heading text-2xl font-bold md:text-3xl">{value}</p>
            <p className="mt-1 text-xs text-black/50">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className={card}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold">Latest orders</h2>
            <Link href="/account/admin/orders" className="text-sm underline">
              All orders
            </Link>
          </div>
          {!recent?.length ? (
            <p className="py-8 text-center text-sm text-black/50">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-black/5">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link href={`/account/admin/orders/${o.id}`} className="flex items-center gap-3 py-3 text-sm hover:bg-black/[0.02]">
                    <span className="w-20 font-mono text-xs">#{o.id.slice(0, 8).toUpperCase()}</span>
                    <span className="min-w-0 flex-1 truncate">{o.name}</span>
                    <StatusPill status={o.status} />
                    <span className="hidden w-36 text-right text-black/50 md:block">{when(o.created_at)}</span>
                    <span className="w-24 text-right font-semibold">{rs(Number(o.total))}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-4">
          <section className={card}>
            <h2 className="mb-3 font-heading text-lg font-bold">Top stickers · 30 days</h2>
            {!s.top.length ? (
              <p className="py-4 text-sm text-black/50">No sales yet.</p>
            ) : (
              <ol className="flex flex-col gap-2 text-sm">
                {s.top.map((t, i) => (
                  <li key={t.title} className="flex gap-3">
                    <span className="w-4 text-black/40">{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate">{t.title}</span>
                    <span className="text-black/50">{t.qty} sold</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
          <section className={`${card} grid grid-cols-3 gap-3 text-center`}>
            <Link href="/account/admin/products">
              <p className="font-heading text-2xl font-bold">{s.products}</p>
              <p className="text-xs text-black/50">products</p>
            </Link>
            <Link href="/account/admin/products?stock=out">
              <p className="font-heading text-2xl font-bold">{s.out_of_stock}</p>
              <p className="text-xs text-black/50">out of stock</p>
            </Link>
            <Link href="/account/admin/subscribers">
              <p className="font-heading text-2xl font-bold">{s.subscribers}</p>
              <p className="text-xs text-black/50">subscribers</p>
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
