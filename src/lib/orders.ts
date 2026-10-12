import "server-only";
import { createHmac } from "node:crypto";
import { admin } from "@/lib/supabase/admin";
import { getCfOrder } from "@/lib/cashfree";

export const orderToken = (id: string) =>
  createHmac("sha256", process.env.ORDER_TOKEN_SECRET!).update(id).digest("hex").slice(0, 32);

export async function markPaidIfCfPaid(orderId: string, cfOrderId: string) {
  const cf = await getCfOrder(cfOrderId);
  const db = admin();
  if (cf.order_status === "PAID") {
    const { error } = await db
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString(), cf_order_id: cfOrderId })
      .eq("id", orderId)
      .eq("status", "pending")
      .eq("total", cf.order_amount);
    if (error) throw error;
  } else if (cf.order_status === "EXPIRED" || cf.order_status === "TERMINATED") {
    const { error } = await db.from("orders").update({ status: "failed" }).eq("id", orderId).eq("status", "pending");
    if (error) throw error;
  }
  return cf.order_status;
}
