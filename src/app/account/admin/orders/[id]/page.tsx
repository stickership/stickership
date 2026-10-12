import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { rs } from "@/lib/format";
import { card, PageTitle, StatusPill, when } from "../../_components/ui";
import { OrderActions } from "./OrderActions";

export default async function AdminOrder({ params }: PageProps<"/account/admin/orders/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: o } = await supabase
    .from("orders")
    .select("*, order_items(product_id, title, image, price, qty)")
    .eq("id", id)
    .maybeSingle();
  if (!o) notFound();
  const a = o.address as Record<string, string>;
  const timeline = [
    ["Placed", o.created_at],
    ["Paid", o.paid_at],
    ["Shipped", o.shipped_at],
    ["Delivered", o.delivered_at],
  ].filter(([, t]) => t) as [string, string][];

  return (
    <>
      <Link href="/account/admin/orders" className="text-sm text-black/50 hover:underline">
        ← Orders
      </Link>
      <PageTitle action={<StatusPill status={o.status} />}>
        Order #{o.id.slice(0, 8).toUpperCase()}
      </PageTitle>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4">
          <section className={card}>
            <h2 className="mb-3 font-heading text-lg font-bold">Items</h2>
            <ul className="divide-y divide-black/5">
              {o.order_items.map((i: { product_id: string; title: string; image: string; price: number; qty: number }) => (
                <li key={i.product_id} className="flex items-center gap-3 py-3 text-sm">
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-media">
                    <Image src={i.image} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <Link href={`/account/admin/products/${i.product_id}`} className="flex-1 font-semibold hover:underline">
                    {i.title}
                  </Link>
                  <span className="text-black/50">
                    {rs(Number(i.price))} × {i.qty}
                  </span>
                  <span className="w-24 text-right font-semibold">{rs(Number(i.price) * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 flex flex-col gap-1 border-t border-black/10 pt-3 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{rs(Number(o.subtotal))}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>{rs(Number(o.shipping))}</dd>
              </div>
              <div className="flex justify-between text-base font-bold">
                <dt>Total</dt>
                <dd>{rs(Number(o.total))}</dd>
              </div>
            </dl>
          </section>
          <OrderActions id={o.id} status={o.status} courier={o.courier} trackingNo={o.tracking_no} />
        </div>

        <div className="flex flex-col gap-4">
          <section className={`${card} text-sm`}>
            <h2 className="mb-2 font-heading text-lg font-bold">Customer</h2>
            <p className="font-semibold">{o.name}</p>
            <p>
              <a href={`mailto:${o.email}`} className="underline">
                {o.email}
              </a>
            </p>
            <p>
              <a href={`tel:+91${o.phone}`} className="underline">
                +91 {o.phone}
              </a>
            </p>
            <h3 className="mt-4 font-semibold">Ship to</h3>
            <p className="text-black/70">
              {a.line1}
              {a.line2 && <>, {a.line2}</>}
              <br />
              {a.city}, {a.state} {a.pincode}
            </p>
          </section>
          <section className={`${card} text-sm`}>
            <h2 className="mb-2 font-heading text-lg font-bold">Timeline</h2>
            <ol className="flex flex-col gap-1.5">
              {timeline.map(([label, t]) => (
                <li key={label} className="flex justify-between">
                  <span>{label}</span>
                  <span className="text-black/50">{when(t)}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 break-all text-xs text-black/40">
              Razorpay order: {o.rzp_order_id ?? "—"}
              {o.rzp_payment_id && <> · payment {o.rzp_payment_id}</>}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
