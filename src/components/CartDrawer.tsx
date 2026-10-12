"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartIcon, CloseIcon, LockIcon, TrashIcon } from "@/components/icons";
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

  const left = FREE_SHIPPING_FROM - subtotal;

  return (
    <>
      <button type="button" aria-label="Cart" onClick={() => setOpen(true)} className="flex h-11 items-center gap-2 rounded-full bg-ink pl-3 pr-3 text-slime transition-transform hover:-rotate-3 lg:pr-4">
        <span className="relative">
          <CartIcon />
          <span className="absolute -right-2 -top-2 flex size-[18px] items-center justify-center rounded-full bg-pop font-mono text-[10px] font-bold text-ink">
            {cartCount(items)}
          </span>
        </span>
        <span className="hidden font-mono text-sm font-bold lg:inline">{rs(subtotal)}</span>
      </button>

      <div className={`fixed inset-0 z-[100] bg-ink/50 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setOpen(false)} />
      <aside
        aria-label="Cart"
        className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-[460px] flex-col border-l-2 border-ink bg-paper font-sans text-ink transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b-2 border-ink px-6 py-4">
          <h2 className="font-display text-[28px] leading-none">Your stash</h2>
          <button type="button" aria-label="Close cart" onClick={() => setOpen(false)} className="flex size-10 items-center justify-center rounded-full border-2 border-ink bg-white">
            <CloseIcon width={14} height={14} />
          </button>
        </div>
        <div className="border-b-2 border-ink bg-white px-6 py-3">
          <p className="font-mono text-xs font-bold uppercase">
            {!items.length ? `Free shipping over ₹${FREE_SHIPPING_FROM}` : shipping ? `${rs(left)} away from free shipping` : "Free shipping unlocked ✦"}
          </p>
          <div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-ink bg-paper">
            <div className="h-full rounded-full bg-slime transition-[width] duration-500" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
              <span aria-hidden className="text-6xl">🫙</span>
              <p className="text-lg font-bold">Nothing here yet. Your laptop deserves better.</p>
              <button type="button" onClick={() => setOpen(false)} className="btn">
                Browse stickers
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3 p-4">
              {items.map((i) => (
                <li key={i.id} className="flex gap-4 rounded-2xl border-2 border-ink bg-white p-3">
                  <Link href={`/products/${i.slug}`} onClick={() => setOpen(false)} className="relative size-[76px] shrink-0 rounded-xl bg-paper">
                    <Image src={i.image} alt={i.title} fill sizes="76px" className="object-contain p-1" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                    <Link href={`/products/${i.slug}`} onClick={() => setOpen(false)} className="line-clamp-2 text-[15px] font-bold leading-tight">
                      {i.title}
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 items-center rounded-full border-2 border-ink">
                        <button type="button" aria-label="Decrease" onClick={() => (i.qty > 1 ? cart.setQty(i.id, i.qty - 1) : cart.remove(i.id))} className="flex size-8 items-center justify-center text-lg font-bold">
                          −
                        </button>
                        <span className="w-6 text-center font-mono text-sm font-bold">{i.qty}</span>
                        <button type="button" aria-label="Increase" onClick={() => cart.setQty(i.id, i.qty + 1)} className="flex size-8 items-center justify-center text-lg font-bold">
                          +
                        </button>
                      </div>
                      <span className="font-mono text-sm font-bold">{rs(i.price * i.qty)}</span>
                    </div>
                  </div>
                  <button type="button" aria-label={`Remove ${i.title}`} onClick={() => cart.remove(i.id)} className="self-start p-1 text-ink/50 hover:text-pop">
                    <TrashIcon width={18} height={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t-2 border-ink bg-white px-6 pb-6 pt-4">
          {upsell.length > 0 && (
            <>
              <p className="font-mono text-xs font-bold uppercase">Throw these in too</p>
              <ul className="-mx-6 mt-3 flex snap-x scroll-px-6 gap-3 overflow-x-auto px-6 pb-4 [scrollbar-width:none]">
                {upsell.map((p) => (
                  <li key={p.id} className="w-[112px] shrink-0 snap-start">
                    <button
                      type="button"
                      aria-label={`Add ${p.title}`}
                      onClick={() => cart.add({ id: p.id, slug: p.slug, title: p.title, image: p.image, price: Number(p.price) })}
                      className="group flex w-full flex-col text-left"
                    >
                      <span className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-ink bg-paper transition-transform group-hover:-rotate-3">
                        <Image src={p.image} alt="" fill sizes="112px" className="object-cover" />
                        <span className="absolute bottom-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-slime text-lg font-bold leading-none text-ink">+</span>
                      </span>
                      <span className="mt-1.5 truncate text-xs font-semibold">{p.title}</span>
                      <span className="font-mono text-xs font-bold">{rs(Number(p.price)).replace(".00", "")}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold">Subtotal</span>
            <span className="font-mono text-lg font-bold">{rs(subtotal)}</span>
          </div>
          {items.length > 0 && (
            <Link href="/checkout" onClick={() => setOpen(false)} className="btn mt-4 h-14 w-full text-lg">
              <LockIcon />
              Checkout · {rs(subtotal + shipping)}
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
