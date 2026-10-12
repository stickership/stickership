"use client";

import { useState } from "react";
import { AddToCart } from "@/components/AddToCart";
import { CaretIcon } from "@/components/icons";
import type { Product } from "@/lib/catalog";

export function QtyBuy({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="mt-8 rounded-2xl bg-white p-6">
      <label htmlFor="qty" className="font-sans text-xs text-black/50">
        Quantity
      </label>
      <div className="mt-3 flex flex-wrap gap-4">
        <div className="flex h-[52px] overflow-hidden rounded-lg border border-black/10">
          <input
            id="qty"
            type="number"
            min={1}
            max={50}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            className="w-[60px] bg-[#fafafa] text-center font-sans text-base font-semibold shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="flex w-8 flex-col divide-y divide-black/10 border-l border-black/10">
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
          className="h-[50px] w-full max-w-[300px] flex-1 rounded-md border border-black bg-black px-[22px] font-heading text-base font-bold text-brand-yellow shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-brand-yellow hover:text-black"
        />
      </div>
    </div>
  );
}
