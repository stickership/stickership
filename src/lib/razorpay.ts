import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const auth = () => "Basic " + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");

async function rzp<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch("https://api.razorpay.com/v1" + path, {
    ...init,
    headers: { "content-type": "application/json", authorization: auth() },
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Razorpay ${res.status}: ${await res.text()}`);
  return res.json();
}

export const createRzpOrder = (orderId: string, amountPaise: number) =>
  rzp<{ id: string; amount: number }>("/orders", {
    method: "POST",
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt: orderId.slice(0, 40), notes: { order_id: orderId } }),
  });

export const getRzpOrder = (rzpOrderId: string) =>
  rzp<{ id: string; status: string; amount: number; amount_paid: number }>(`/orders/${encodeURIComponent(rzpOrderId)}`);

function sameHex(expected: string, given: string | null) {
  if (!given || given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(given));
}

export const verifyPayment = (rzpOrderId: string, paymentId: string, signature: string, secret = process.env.RAZORPAY_KEY_SECRET!) =>
  sameHex(createHmac("sha256", secret).update(`${rzpOrderId}|${paymentId}`).digest("hex"), signature);

export const verifyWebhook = (rawBody: string, signature: string | null, secret = process.env.RAZORPAY_WEBHOOK_SECRET!) =>
  sameHex(createHmac("sha256", secret).update(rawBody).digest("hex"), signature);
