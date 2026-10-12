"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CaretIcon, CartIcon, CloseIcon, LockIcon, TrashIcon } from "@/components/icons";
import { upsells } from "@/app/actions";
import type { Product } from "@/lib/catalog";
import { cart, cartCount, cartSubtotal, useCart } from "@/lib/cart";
import { FREE_SHIPPING_FROM, rs, shippingFor } from "@/lib/format";

export function CartDrawer() {
  const items = useCart();
  const [open, setOpen] = useState(false);
  const [extras, setExtras] = useState<Product[] | null>(null);
  const upsell = (extras ?? []).filter((p) => p.in_stock && !items.some((i) => i.id === p.id)).slice(0, 6);
  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);

  useEffect(() => {
    if (open && extras === null) upsells().then(setExtras, () => setExtras([]));
  }, [open, extras]);

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
        className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-[460px] flex-col bg-white font-sans text-black shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
          <h2 className="font-heading text-[28px] font-bold tracking-[-0.8px]">Your cart</h2>
          <button type="button" aria-label="Close cart" onClick={() => setOpen(false)} className="p-2">
            <CloseIcon width={16} height={16} />
          </button>
        </div>
        <p className="border-b-[3px] border-brand-yellow bg-gradient-to-r from-[#7a1f6e] to-[#3b0d4a] py-3 text-center font-heading text-sm font-bold uppercase tracking-tight text-brand-yellow">
          🔥 Stickers @ ₹10 · Free shipping above ₹{FREE_SHIPPING_FROM}
        </p>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <p className="font-heading text-lg font-bold">Your cart is empty</p>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg bg-black px-6 py-3 font-heading text-sm font-bold text-brand-yellow">
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-black/5 px-6">
              {items.map((i) => (
                <li key={i.id} className="flex gap-4 py-5">
                  <Link href={`/products/${i.slug}`} onClick={() => setOpen(false)} className="relative size-[90px] shrink-0">
                    <Image src={i.image} alt={i.title} fill sizes="90px" className="object-contain" />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <Link href={`/products/${i.slug}`} onClick={() => setOpen(false)} className="font-heading text-base font-bold leading-tight md:text-lg">
                      {i.title}
                    </Link>
                    <span className="text-lg font-medium">{rs(i.price * i.qty)}</span>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="flex h-[52px] overflow-hidden rounded-xl border border-black/10 bg-[#fafafa]">
                      <span className="flex w-12 items-center justify-center text-lg font-semibold">{i.qty}</span>
                      <div className="flex w-8 flex-col divide-y divide-black/10 border-l border-black/10">
                        <button type="button" aria-label="Increase" onClick={() => cart.setQty(i.id, i.qty + 1)} className="flex flex-1 items-center justify-center">
                          <CaretIcon width={12} height={12} className="rotate-180" />
                        </button>
                        <button type="button" aria-label="Decrease" onClick={() => (i.qty > 1 ? cart.setQty(i.id, i.qty - 1) : cart.remove(i.id))} className="flex flex-1 items-center justify-center">
                          <CaretIcon width={12} height={12} />
                        </button>
                      </div>
                    </div>
                    <button type="button" aria-label={`Remove ${i.title}`} onClick={() => cart.remove(i.id)} className="p-1 text-black/70 hover:text-red-600">
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-black/10 bg-[#fafafa] px-6 pb-6 pt-5">
          {upsell.length > 0 && (
            <>
              <p className="font-heading text-sm font-bold uppercase tracking-tight text-[#3b0d4a]">⚡ Fill your cart faster</p>
              <ul className="-mx-6 mt-3 flex snap-x scroll-px-6 gap-3 overflow-x-auto px-6 pb-4 [scrollbar-width:none]">
                {upsell.map((p) => (
                  <li key={p.id} className="w-[132px] shrink-0 snap-start">
                    <button
                      type="button"
                      onClick={() => cart.add({ id: p.id, slug: p.slug, title: p.title, image: p.image, price: Number(p.price) })}
                      className="flex w-full flex-col rounded-xl bg-[#3b0d4a] p-2 text-left transition-transform hover:-translate-y-0.5"
                    >
                      <span className="relative aspect-square w-full overflow-hidden rounded-lg bg-white">
                        <Image src={p.image} alt="" fill sizes="132px" className="object-cover" />
                      </span>
                      <span className="mt-2 truncate text-xs font-medium text-white">{p.title}</span>
                      <span className="font-heading text-base font-bold text-brand-yellow">{rs(Number(p.price)).replace(".00", "")}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="flex items-baseline justify-between border-t border-[#3b0d4a]/20 pt-4">
            <span className="font-heading text-2xl font-extrabold uppercase tracking-tight">Subtotal</span>
            <span className="font-heading text-2xl font-bold">{rs(subtotal)}</span>
          </div>
          <p className="mt-1 text-sm text-black/60">
            {!items.length ? "Add stickers to get started." : shipping ? `Add ${rs(FREE_SHIPPING_FROM - subtotal)} more for free shipping.` : "Free shipping unlocked 🎉"}
          </p>
          {items.length > 0 && (
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="mt-4 flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-brand-yellow bg-[#0f172a] font-heading text-lg font-bold text-brand-yellow transition-colors hover:bg-black"
            >
              <LockIcon />
              Checkout · {rs(subtotal + shipping)}
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
