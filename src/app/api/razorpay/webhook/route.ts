import { verifyWebhook } from "@/lib/razorpay";
import { markPaid } from "@/lib/orders";

type Payment = { id: string; order_id: string; amount: number; notes?: { order_id?: string } };

export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWebhook(raw, req.headers.get("x-razorpay-signature"))) return new Response("invalid signature", { status: 401 });

  let event: { event?: string; payload?: { payment?: { entity?: Payment }; order?: { entity?: { notes?: { order_id?: string } } } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("bad json", { status: 400 });
  }
  if (event.event !== "payment.captured" && event.event !== "order.paid") return new Response("ignored");

  const payment = event.payload?.payment?.entity;
  const orderId = payment?.notes?.order_id ?? event.payload?.order?.entity?.notes?.order_id;
  if (!payment || !orderId || !/^[0-9a-f-]{36}$/.test(orderId)) return new Response("ignored");

  try {
    await markPaid(orderId, payment.id, payment.amount);
  } catch (e) {
    console.error("razorpay webhook failed", orderId, e);
    return new Response("retry", { status: 500 });
  }
  return new Response("ok");
}
