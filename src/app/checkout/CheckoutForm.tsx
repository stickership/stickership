"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import { cart, cartSubtotal, useCart } from "@/lib/cart";
import { rs, shippingFor } from "@/lib/format";
import { startCheckout } from "./actions";

declare global {
  interface Window {
    Cashfree?: (o: { mode: "sandbox" | "production" }) => { checkout: (o: { paymentSessionId: string; redirectTarget: "_self" }) => Promise<unknown> };
  }
}

const field = "h-12 w-full rounded-md border border-black/15 px-4 text-[15px] outline-none focus:border-black";
const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export function CheckoutForm({ email }: { email: string }) {
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
    if (!window.Cashfree) {
      setError("Payment library failed to load. Refresh and try again.");
      setBusy(false);
      return;
    }
    await window.Cashfree({ mode: res.mode }).checkout({ paymentSessionId: res.paymentSessionId, redirectTarget: "_self" });
  }

  if (!items.length)
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold">Your cart is empty</h1>
        <Link href="/" className="rounded-md bg-black px-6 py-3 font-heading font-bold text-brand-yellow">
          Shop stickers
        </Link>
      </div>
    );

  return (
    <div className="grid gap-10 py-10 lg:grid-cols-[1fr_420px]">
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />
      <form action={submit} className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-bold">Checkout</h1>
        <h2 className="mt-2 font-heading text-lg font-bold">Contact</h2>
        <input name="email" type="email" required defaultValue={email} placeholder="Email" autoComplete="email" className={field} />
        <input name="phone" type="tel" required pattern="[6-9][0-9]{9}" maxLength={10} placeholder="Mobile number (10 digits)" autoComplete="tel-national" className={field} />
        <h2 className="mt-2 font-heading text-lg font-bold">Delivery</h2>
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
        {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="mt-2 h-14 rounded-md bg-black font-heading text-lg font-bold text-brand-yellow disabled:opacity-60">
          {busy ? "Starting payment…" : `Pay ${rs(subtotal + shipping)}`}
        </button>
        <p className="text-xs text-black/60">Payments are processed securely by Cashfree. UPI, cards, netbanking and wallets accepted.</p>
      </form>

      <aside className="h-fit rounded-lg bg-media p-6">
        <h2 className="font-heading text-lg font-bold">Order summary</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3">
              <span className="relative size-14 shrink-0 bg-white">
                <Image src={i.image} alt="" fill sizes="56px" className="object-cover" />
                <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-black text-[11px] text-white">{i.qty}</span>
              </span>
              <span className="flex-1 text-sm font-medium">{i.title}</span>
              <span className="text-sm font-semibold">{rs(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 flex flex-col gap-2 border-t border-black/10 pt-4 text-sm">
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
        <p className="mt-3 text-xs text-black/50">Final prices are confirmed on the server before payment.</p>
      </aside>
    </div>
  );
}
