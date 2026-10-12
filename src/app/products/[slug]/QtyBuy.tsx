"use client";

import { useState } from "react";
import { AddToCart } from "@/components/AddToCart";
import { CaretIcon } from "@/components/icons";
import type { Product } from "@/lib/catalog";

export function QtyBuy({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="card mt-8 p-5">
      <label htmlFor="qty" className="font-mono text-xs font-bold uppercase text-ink/60">
        Quantity
      </label>
      <div className="mt-3 flex flex-wrap gap-4">
        <div className="flex h-[52px] overflow-hidden rounded-full border-2 border-ink">
          <input
            id="qty"
            type="number"
            min={1}
            max={50}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            className="w-[60px] bg-white pl-3 text-center font-mono text-base font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="flex w-10 flex-col divide-y-2 divide-ink border-l-2 border-ink bg-paper">
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(50, q + 1))} className="flex flex-1 items-center justify-center">
              <CaretIcon width={12} height={12} className="rotate-180" />
            </button>
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex flex-1 items-center justify-center">
              <CaretIcon width={12} height={12} />
            </button>
          </div>
        </div>
        <AddToCart
          product={product}
          qty={qty}
          className="btn h-[52px] min-w-[180px] flex-1 text-base"
        />
      </div>
    </div>
  );
}
