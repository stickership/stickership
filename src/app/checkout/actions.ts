"use server";

import { z } from "zod";
import { admin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createCfOrder } from "@/lib/cashfree";
import { orderToken } from "@/lib/orders";
import { shippingFor } from "@/lib/format";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a 10-digit mobile number"),
  name: z.string().trim().min(2).max(100),
  line1: z.string().trim().min(3).max(200),
  line2: z.string().trim().max(200).optional().default(""),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a 6-digit pincode"),
  items: z
    .array(z.object({ id: z.string().uuid(), qty: z.number().int().min(1).max(50) }))
    .min(1, "Your cart is empty")
    .max(100),
});

export type CheckoutInput = z.input<typeof schema>;
export type CheckoutResult =
  | { ok: true; paymentSessionId: string; mode: "sandbox" | "production" }
  | { ok: false; error: string; removed?: string[] };

export async function startCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check your details" };
  if (!(await rateLimit("checkout", 8))) return { ok: false, error: "Too many attempts. Wait a minute." };
  const d = parsed.data;

  const qty = new Map<string, number>();
  d.items.forEach((i) => qty.set(i.id, Math.min(50, (qty.get(i.id) ?? 0) + i.qty)));

  const db = admin();
  const { data: products, error } = await db
    .from("products")
    .select("id, title, image, price, in_stock")
    .in("id", [...qty.keys()]);
  if (error) return { ok: false, error: "Couldn't load products. Try again." };

  const available = products.filter((p) => p.in_stock);
  const removed = [...qty.keys()].filter((id) => !available.some((p) => p.id === id));
  if (removed.length) return { ok: false, error: "Some items are no longer available and were removed.", removed };

  const subtotal = Math.round(available.reduce((s, p) => s + Number(p.price) * qty.get(p.id)!, 0) * 100) / 100;
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  if (total < 1) return { ok: false, error: "Order total is too low." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order, error: orderError } = await db
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      email: d.email,
      phone: d.phone,
      name: d.name,
      address: { line1: d.line1, line2: d.line2, city: d.city, state: d.state, pincode: d.pincode },
      subtotal,
      shipping,
      total,
    })
    .select("id")
    .single();
  if (orderError) return { ok: false, error: "Couldn't create order. Try again." };

  const { error: itemsError } = await db.from("order_items").insert(
    available.map((p) => ({ order_id: order.id, product_id: p.id, title: p.title, image: p.image, price: p.price, qty: qty.get(p.id) })),
  );
  if (itemsError) {
    await db.from("orders").delete().eq("id", order.id);
    return { ok: false, error: "Couldn't create order. Try again." };
  }

  const cfOrderId = `${order.id}-1`;
  try {
    const cf = await createCfOrder({
      cfOrderId,
      amount: total,
      email: d.email,
      phone: d.phone,
      name: d.name,
      returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}?t=${orderToken(order.id)}&cf=1`,
    });
    await db.from("orders").update({ cf_order_id: cfOrderId }).eq("id", order.id);
    return { ok: true, paymentSessionId: cf.payment_session_id, mode: process.env.CASHFREE_ENV === "production" ? "production" : "sandbox" };
  } catch (e) {
    console.error("cashfree create order failed", order.id, e);
    await db.from("orders").update({ status: "cancelled" }).eq("id", order.id);
    return { ok: false, error: "Payment couldn't start. Please try again." };
  }
}
