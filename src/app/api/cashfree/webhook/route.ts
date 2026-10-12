import { verifyWebhook } from "@/lib/cashfree";
import { markPaidIfCfPaid } from "@/lib/orders";

export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWebhook(raw, req.headers.get("x-webhook-timestamp"), req.headers.get("x-webhook-signature"))) {
    return new Response("invalid signature", { status: 401 });
  }
  let cfOrderId: string | undefined;
  try {
    cfOrderId = JSON.parse(raw)?.data?.order?.order_id;
  } catch {}
  const orderId = cfOrderId?.slice(0, 36);
  if (!cfOrderId || !orderId || !/^[0-9a-f-]{36}$/.test(orderId)) return new Response("ignored");
  try {
    await markPaidIfCfPaid(orderId, cfOrderId);
  } catch (e) {
    console.error("webhook reconcile failed", cfOrderId, e);
    return new Response("retry", { status: 500 });
  }
  return new Response("ok");
}
