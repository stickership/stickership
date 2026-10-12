import "server-only";
import { createHmac } from "node:crypto";
import { admin } from "@/lib/supabase/admin";
import { getRzpOrder } from "@/lib/razorpay";

export const orderToken = (id: string) =>
  createHmac("sha256", process.env.ORDER_TOKEN_SECRET!).update(id).digest("hex").slice(0, 32);

export async function markPaid(orderId: string, paymentId: string | null, amountPaise: number) {
  const { error } = await admin()
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString(), rzp_payment_id: paymentId })
    .eq("id", orderId)
    .eq("status", "pending")
    .eq("total", amountPaise / 100);
  if (error) throw error;
}

export async function reconcile(orderId: string, rzpOrderId: string) {
  const o = await getRzpOrder(rzpOrderId);
  if (o.status === "paid") await markPaid(orderId, null, o.amount_paid);
  return o.status;
}
