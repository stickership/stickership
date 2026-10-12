"use server";

import { z } from "zod";
import { admin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createRzpOrder, verifyPayment } from "@/lib/razorpay";
import { markPaid, orderToken } from "@/lib/orders";
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
  | { ok: true; keyId: string; rzpOrderId: string; amount: number; orderId: string; email: string; phone: string; name: string }
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

  try {
    const rzp = await createRzpOrder(order.id, Math.round(total * 100));
    await db.from("orders").update({ rzp_order_id: rzp.id }).eq("id", order.id);
    return { ok: true, keyId: process.env.RAZORPAY_KEY_ID!, rzpOrderId: rzp.id, amount: rzp.amount, orderId: order.id, email: d.email, phone: d.phone, name: d.name };
  } catch (e) {
    console.error("razorpay create order failed", order.id, e);
    await db.from("orders").update({ status: "cancelled" }).eq("id", order.id);
    return { ok: false, error: "Payment couldn't start. Please try again." };
  }
}

const confirmSchema = z.object({
  orderId: z.string().uuid(),
  razorpay_order_id: z.string().min(1).max(64),
  razorpay_payment_id: z.string().min(1).max(64),
  razorpay_signature: z.string().min(1).max(128),
});

export async function confirmPayment(input: z.input<typeof confirmSchema>): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const parsed = confirmSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid payment response" };
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;
  if (!verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)) return { ok: false, error: "Payment verification failed" };
  const db = admin();
  const { data: order } = await db.from("orders").select("rzp_order_id, total").eq("id", orderId).maybeSingle();
  if (!order || order.rzp_order_id !== razorpay_order_id) return { ok: false, error: "Order mismatch" };
  try {
    await markPaid(orderId, razorpay_payment_id, Math.round(Number(order.total) * 100));
  } catch (e) {
    console.error("mark paid failed", orderId, e);
  }
  return { ok: true, url: `/orders/${orderId}?t=${orderToken(orderId)}` };
}
