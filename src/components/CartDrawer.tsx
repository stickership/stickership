"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartIcon, CloseIcon } from "@/components/icons";
import { cart, cartCount, cartSubtotal, useCart } from "@/lib/cart";
import { FREE_SHIPPING_FROM, rs, shippingFor } from "@/lib/format";

export function CartDrawer() {
  const items = useCart();
  const [open, setOpen] = useState(false);
  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);

  useEffect(() => {
    const show = () => setOpen(true);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener(cart.OPEN_EVENT, show);
    document.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener(cart.OPEN_EVENT, show);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  return (
    <>
      <button type="button" aria-label="Cart" onClick={() => setOpen(true)} className="flex items-center gap-[10px] text-white max-lg:size-11 max-lg:justify-center lg:ml-[20px]">
        <span className="relative">
          <CartIcon />
          <span className="absolute -top-[3px] -right-[5px] flex size-[18px] items-center justify-center rounded-full bg-brand-yellow font-sans text-[10px] font-semibold text-black">
            {cartCount(items)}
          </span>
        </span>
        <span className="hidden flex-col text-left lg:flex">
          <span className="font-sans text-[12px] leading-3 font-medium">Subtotal</span>
          <span className="font-sans text-[16px] leading-4 font-extrabold">{rs(subtotal)}</span>
        </span>
      </button>

      <div className={`fixed inset-0 z-[100] bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setOpen(false)} />
      <aside
        aria-label="Cart"
        className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-[420px] flex-col bg-white font-sans text-black transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <h2 className="font-heading text-xl font-bold">Your cart ({cartCount(items)})</h2>
          <button type="button" aria-label="Close cart" onClick={() => setOpen(false)} className="p-2">
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-heading text-lg font-bold">Your cart is empty</p>
            <button type="button" onClick={() => setOpen(false)} className="rounded-md bg-black px-6 py-3 font-heading text-sm font-bold text-brand-yellow">
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-black/10 overflow-y-auto px-6">
              {items.map((i) => (
                <li key={i.id} className="flex gap-4 py-4">
                  <Link href={`/products/${i.slug}`} onClick={() => setOpen(false)} className="relative size-20 shrink-0 bg-media">
                    <Image src={i.image} alt={i.title} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col gap-2">
                    <Link href={`/products/${i.slug}`} onClick={() => setOpen(false)} className="font-heading text-sm font-bold leading-tight">
                      {i.title}
                    </Link>
                    <span className="text-sm font-semibold text-sale">{rs(i.price)}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-md border border-black/15">
                        <button type="button" aria-label="Decrease" onClick={() => (i.qty > 1 ? cart.setQty(i.id, i.qty - 1) : cart.remove(i.id))} className="px-3 py-1">
                          −
                        </button>
                        <span className="w-6 text-center text-sm">{i.qty}</span>
                        <button type="button" aria-label="Increase" onClick={() => cart.setQty(i.id, i.qty + 1)} className="px-3 py-1">
                          +
                        </button>
                      </div>
                      <button type="button" onClick={() => cart.remove(i.id)} className="text-xs text-black/60 underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-black/10 px-6 py-5">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-bold">{rs(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-black/60">
                {shipping ? `Add ${rs(FREE_SHIPPING_FROM - subtotal)} more for free shipping` : "Free shipping unlocked"}
              </p>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="mt-4 flex h-12 items-center justify-center rounded-md bg-black font-heading text-base font-bold text-brand-yellow"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
