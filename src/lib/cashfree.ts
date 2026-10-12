import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const BASE = process.env.CASHFREE_ENV === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

async function cf<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      "content-type": "application/json",
      "x-api-version": "2023-08-01",
      "x-client-id": process.env.CASHFREE_APP_ID!,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
      ...init?.headers,
    },
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Cashfree ${res.status}: ${await res.text()}`);
  return res.json();
}

export function createCfOrder(o: {
  cfOrderId: string;
  amount: number;
  email: string;
  phone: string;
  name: string;
  returnUrl: string;
}) {
  return cf<{ payment_session_id: string }>("/orders", {
    method: "POST",
    headers: { "x-idempotency-key": o.cfOrderId },
    body: JSON.stringify({
      order_id: o.cfOrderId,
      order_amount: o.amount,
      order_currency: "INR",
      customer_details: {
        customer_id: `c${o.phone}`,
        customer_phone: o.phone,
        customer_email: o.email,
        customer_name: o.name,
      },
      order_meta: { return_url: o.returnUrl },
    }),
  });
}

export const getCfOrder = (cfOrderId: string) =>
  cf<{ order_status: string; order_amount: number }>(`/orders/${encodeURIComponent(cfOrderId)}`);

export function verifyWebhook(rawBody: string, timestamp: string | null, signature: string | null, secret = process.env.CASHFREE_SECRET_KEY!) {
  if (!timestamp || !signature) return false;
  if (Math.abs(Date.now() - Number(timestamp)) > 5 * 60_000) return false;
  const expected = createHmac("sha256", secret).update(timestamp + rawBody).digest();
  const given = Buffer.from(signature, "base64");
  return given.length === expected.length && timingSafeEqual(given, expected);
}
