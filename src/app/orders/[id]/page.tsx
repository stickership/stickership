import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { Shell } from "@/components/Shell";
import { admin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { orderToken, reconcile } from "@/lib/orders";
import { rs } from "@/lib/format";
import { ClearCart } from "./ClearCart";
import { Confetti } from "./Confetti";

export const metadata = { title: "Your order", robots: { index: false } };

const LABEL: Record<string, [string, string]> = {
  pending: ["Awaiting payment", "bg-amber-200"],
  paid: ["Paid · preparing to ship", "bg-slime"],
  shipped: ["Shipped · on the way", "bg-sky"],
  delivered: ["Delivered", "bg-slime"],
  failed: ["Payment failed", "bg-pop"],
  cancelled: ["Cancelled", "bg-white"],
};

const sameToken = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

async function Content({ params, searchParams }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const token = typeof sp.t === "string" ? sp.t : "";
  let allowed = token !== "" && sameToken(token, orderToken(id));
  if (!allowed) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("orders").select("id").eq("id", id).maybeSingle();
      allowed = !!data;
    }
  }
  if (!allowed) notFound();

  const db = admin();
  let { data: order } = await db
    .from("orders")
    .select("id, email, name, address, subtotal, shipping, total, status, rzp_order_id, courier, tracking_no, created_at, order_items(product_id, title, image, price, qty)")
    .eq("id", id)
    .maybeSingle();
  if (!order) notFound();

  if (order.status === "pending" && order.rzp_order_id) {
    try {
      if ((await reconcile(order.id, order.rzp_order_id)) === "paid") order = { ...order, status: "paid" };
    } catch (e) {
      console.error("order reconcile failed", id, e);
    }
  }

  const [label, tone] = LABEL[order.status] ?? LABEL.pending;
  const addr = order.address as Record<string, string>;

  return (
    <>
      {order.status !== "pending" && order.status !== "cancelled" && order.status !== "failed" && <ClearCart />}
      {order.status === "paid" && <Confetti id={order.id} />}
      <div className="mx-auto max-w-[720px] py-12">
        <p className="font-mono text-sm text-ink/60">Order #{order.id.slice(0, 8).toUpperCase()}</p>
        <h1 className="mt-2 font-display text-5xl leading-none">{order.status === "paid" ? `Thanks, ${order.name.split(" ")[0]}!` : "Order status"}</h1>
        <span className={`mt-4 inline-block -rotate-2 rounded-full border-2 border-ink px-3 py-1 text-sm font-bold text-ink ${tone}`}>{label}</span>
        {order.tracking_no && (
          <p className="mt-3 text-sm">
            Shipped via <b>{order.courier}</b> · tracking number <b className="font-mono">{order.tracking_no}</b>
          </p>
        )}
        {order.status === "failed" && (
          <p className="mt-3 text-sm">
            Your payment didn&apos;t go through. No money was taken.{" "}
            <Link href="/checkout" className="underline">
              Try again
            </Link>
          </p>
        )}

        <ul className="card mt-8 divide-y-2 divide-ink/10 px-5">
          {order.order_items.map((i) => (
            <li key={i.product_id} className="flex items-center gap-4 py-4">
              <span className="relative size-16 shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-paper">
                <Image src={i.image} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <span className="flex-1 text-sm font-medium">
                {i.title} × {i.qty}
              </span>
              <span className="font-mono text-sm font-bold">{rs(Number(i.price) * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 flex flex-col gap-1 px-1 font-mono text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{rs(Number(order.subtotal))}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{Number(order.shipping) ? rs(Number(order.shipping)) : "Free"}</dd>
          </div>
          <div className="flex justify-between text-base font-bold">
            <dt>Total</dt>
            <dd>{rs(Number(order.total))}</dd>
          </div>
        </dl>
        <div className="mt-8 rounded-3xl border-2 border-ink bg-white p-5 text-sm">
          <p className="font-semibold">Shipping to</p>
          <p className="mt-1 text-ink/70">
            {order.name}, {addr.line1}
            {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} {addr.pincode}
          </p>
          <p className="mt-3 text-ink/60">Updates go to {order.email}. Keep your order ID to track it anytime.</p>
          <p className="mt-1 font-mono text-xs text-ink/50">{order.id}</p>
        </div>
      </div>
    </>
  );
}

export default function Page(props: PageProps<"/orders/[id]">) {
  return (
    <Shell>
      <Content {...props} />
    </Shell>
  );
}
