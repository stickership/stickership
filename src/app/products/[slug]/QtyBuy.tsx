"use client";

import { useState } from "react";
import { AddToCart } from "@/components/AddToCart";
import type { Product } from "@/lib/catalog";

const base = "flex h-12 w-full items-center justify-center rounded-md font-heading text-base font-bold";

export function QtyBuy({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-fit items-center rounded-md border border-black/20">
        <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-lg">
          −
        </button>
        <span className="w-8 text-center">{qty}</span>
        <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(50, q + 1))} className="px-4 py-2 text-lg">
          +
        </button>
      </div>
      <AddToCart product={product} qty={qty} className={`${base} border border-black bg-white text-black`} />
      <AddToCart product={product} qty={qty} buyNow className={`${base} bg-black text-brand-yellow`} />
    </div>
  );
}
