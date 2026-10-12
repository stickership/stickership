"use client";

import { useRouter } from "next/navigation";
import { cart } from "@/lib/cart";
import type { Product } from "@/lib/catalog";

type Props = { product: Pick<Product, "id" | "slug" | "title" | "image" | "price" | "in_stock">; qty?: number; buyNow?: boolean; className: string };

export function AddToCart({ product, qty = 1, buyNow, className }: Props) {
  const router = useRouter();
  const { id, slug, title, image, price, in_stock } = product;
  return (
    <button
      type="button"
      disabled={!in_stock}
      onClick={() => {
        cart.add({ id, slug, title, image, price: Number(price) }, qty);
        if (buyNow) router.push("/checkout");
      }}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {!in_stock ? "Sold out" : buyNow ? "Buy it now" : "Add to cart"}
    </button>
  );
}
