"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AddToCart } from "@/components/AddToCart";
import type { Product } from "@/lib/catalog";
import { rs } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const { slug, title, image } = product;
  const pics = [image, ...(product.images ?? [])];
  const [hover, setHover] = useState(false);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!hover || pics.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % pics.length), 900);
    return () => clearInterval(id);
  }, [hover, pics.length]);
  const price = Number(product.price);
  const compareAt = Number(product.compare_at ?? 0);
  const href = `/products/${slug}`;
  const off = compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;
  return (
    <div className="group flex h-full flex-col">
      <Link
        href={href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          setIdx(0);
        }}
        className="die-cut relative block aspect-square overflow-hidden bg-white transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:-rotate-2"
      >
        {(hover ? pics : [image]).map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i ? "" : title}
            fill
            sizes="(min-width:990px) 25vw, (min-width:750px) 33vw, 50vw"
            className={`object-cover transition-opacity duration-300 ${i === idx ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {hover && pics.length > 1 && (
          <span aria-hidden className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
            {pics.map((src, i) => (
              <span key={src} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-4 bg-ink" : "w-1.5 bg-ink/30"}`} />
            ))}
          </span>
        )}
        {off > 0 && (
          <span className="absolute left-2.5 top-2.5 -rotate-6 rounded-full border-2 border-ink bg-slime px-2 py-0.5 font-mono text-[11px] font-bold leading-tight text-ink md:text-xs">
            -{off}%
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 -rotate-6 bg-ink py-1.5 text-center font-mono text-xs font-bold uppercase text-white">Sold out</span>
        )}
        <span
          aria-hidden
          className="absolute -bottom-px -right-px size-0 rounded-tl-xl bg-[linear-gradient(135deg,#ece8f6_45%,rgb(21_17_28/0.15)_50%,transparent_55%)] shadow-[-3px_-3px_6px_rgb(21_17_28/0.15)] transition-all duration-300 group-hover:size-10"
        />
      </Link>
      <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-tight md:mt-4 md:text-base">
        <Link href={href} className="hover:underline">
          {title}
        </Link>
      </h3>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 font-mono">
        <span className="text-base font-bold md:text-lg">{rs(price)}</span>
        {off > 0 && <s className="text-xs text-strike md:text-sm">{rs(compareAt)}</s>}
      </div>
      <div className="mt-auto pt-3">
        <AddToCart product={product} className="btn h-10 w-full px-3 text-sm" />
      </div>
    </div>
  );
}
