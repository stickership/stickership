"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cart, cartSubtotal, useCart } from "@/lib/cart";
import { rs, shippingFor } from "@/lib/format";
import { confirmPayment, startCheckout } from "./actions";

type RzpResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };

declare global {
  interface Window {
    Razorpay?: new (o: Record<string, unknown>) => { open: () => void; on: (e: string, cb: () => void) => void };
  }
}

const field = "field text-[15px]";
const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export function CheckoutForm({ email }: { email: string }) {
  const router = useRouter();
  const items = useCart();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);

  async function submit(form: FormData) {
    setBusy(true);
    setError("");
    const get = (k: string) => String(form.get(k) ?? "");
    const res = await startCheckout({
      email: get("email"),
      phone: get("phone"),
      name: get("name"),
      line1: get("line1"),
      line2: get("line2"),
      city: get("city"),
      state: get("state"),
      pincode: get("pincode"),
      items: items.map(({ id, qty }) => ({ id, qty })),
    }).catch(() => ({ ok: false as const, error: "Network error. Try again." }));
    if (!res.ok) {
      if ("removed" in res) res.removed?.forEach((id) => cart.remove(id));
      setError(res.error);
      setBusy(false);
      return;
    }
    if (!window.Razorpay) {
      setError("Payment library failed to load. Refresh and try again.");
      setBusy(false);
      return;
    }
    const rzp = new window.Razorpay({
      key: res.keyId,
      order_id: res.rzpOrderId,
      amount: res.amount,
      currency: "INR",
      name: "stickership",
      description: `Order #${res.orderId.slice(0, 8).toUpperCase()}`,
      prefill: { name: res.name, email: res.email, contact: res.phone },
      theme: { color: "#000000" },
      handler: async (r: RzpResponse) => {
        const done = await confirmPayment({ orderId: res.orderId, ...r }).catch(() => null);
        if (done?.ok) return router.push(done.url);
        setBusy(false);
        setError(`We couldn't confirm your payment. If money was deducted, contact support with order ID ${res.orderId}.`);
      },
      modal: {
        ondismiss: () => {
          setBusy(false);
          setError("Payment cancelled. You can try again.");
        },
      },
    });
    rzp.on("payment.failed", () => setError("Payment failed. Try another method."));
    rzp.open();
  }

  if (!items.length)
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-4xl">cart&apos;s empty</h1>
        <Link href="/" className="btn">
          Shop stickers
        </Link>
      </div>
    );

  return (
    <div className="grid gap-10 py-10 lg:grid-cols-[1fr_420px]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <form action={submit} className="flex flex-col gap-4">
        <h1 className="font-display text-5xl leading-none">checkout</h1>
        <h2 className="mt-4 font-mono text-xs font-bold uppercase tracking-wider">Contact</h2>
        <input name="email" type="email" required defaultValue={email} placeholder="Email" autoComplete="email" className={field} />
        <input name="phone" type="tel" required pattern="[6-9][0-9]{9}" maxLength={10} placeholder="Mobile number (10 digits)" autoComplete="tel-national" className={field} />
        <h2 className="mt-4 font-mono text-xs font-bold uppercase tracking-wider">Delivery</h2>
        <input name="name" required minLength={2} placeholder="Full name" autoComplete="name" className={field} />
        <input name="line1" required minLength={3} placeholder="House no., building, street" autoComplete="address-line1" className={field} />
        <input name="line2" placeholder="Area, landmark (optional)" autoComplete="address-line2" className={field} />
        <div className="grid gap-4 md:grid-cols-3">
          <input name="city" required placeholder="City" autoComplete="address-level2" className={field} />
          <select name="state" required defaultValue="" className={field}>
            <option value="" disabled>
              State
            </option>
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input name="pincode" required pattern="[0-9]{6}" maxLength={6} inputMode="numeric" placeholder="Pincode" autoComplete="postal-code" className={field} />
        </div>
        {error && <p className="rounded-2xl border-2 border-ink bg-pop/20 px-4 py-3 text-sm font-semibold">{error}</p>}
        <button type="submit" disabled={busy} className="btn mt-2 h-14 text-lg">
          {busy ? "Starting payment…" : `Pay ${rs(subtotal + shipping)}`}
        </button>
        <p className="text-xs text-ink/60">Payments are processed securely by Razorpay. UPI, cards, netbanking and wallets accepted.</p>
      </form>

      <aside className="card h-fit p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-3xl leading-none">your stash</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3">
              <span className="relative size-14 shrink-0 rounded-xl border-2 border-ink bg-paper">
                <Image src={i.image} alt="" fill sizes="56px" className="rounded-[10px] object-cover" />
                <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-pop font-mono text-[11px] font-bold text-ink">{i.qty}</span>
              </span>
              <span className="flex-1 text-sm font-medium">{i.title}</span>
              <span className="font-mono text-sm font-bold">{rs(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 flex flex-col gap-2 border-t-2 border-ink/10 pt-4 font-mono text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{rs(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{shipping ? rs(shipping) : "Free"}</dd>
          </div>
          <div className="flex justify-between text-base font-bold">
            <dt>Total</dt>
            <dd>{rs(subtotal + shipping)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-ink/50">Final prices are confirmed on the server before payment.</p>
      </aside>
    </div>
  );
}
