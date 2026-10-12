import Image from "next/image";
import Link from "next/link";
import { EyeIcon } from "@/components/icons";
import { AddToCart } from "@/components/AddToCart";
import type { Product } from "@/lib/catalog";
import { rs } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const { slug, title, image } = product;
  const price = Number(product.price);
  const compareAt = Number(product.compare_at ?? 0);
  const href = `/products/${slug}`;
  const off = compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;
  return (
    <div className="group flex h-full flex-col">
      <Link href={href} className="relative block aspect-square overflow-hidden rounded-2xl bg-media">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width:990px) 25vw, (min-width:750px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[rgb(220,38,38)] px-2.5 py-1 font-sans text-[11px] font-extrabold leading-none text-white md:text-xs">
            {off}% OFF
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute inset-x-0 bottom-0 bg-black/70 py-1.5 text-center font-heading text-xs font-bold uppercase text-white">Sold out</span>
        )}
        <span
          aria-hidden
          className="absolute bottom-3 right-3 hidden size-10 items-center justify-center rounded-xl bg-white/90 text-black opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100 lg:flex"
        >
          <EyeIcon width={18} height={18} />
        </span>
      </Link>
      <h3 className="mt-3 line-clamp-2 font-heading text-sm font-bold leading-[18.2px] tracking-[-0.072px] text-black md:mt-4 md:text-lg md:leading-[23.4px]">
        <Link href={href} className="hover:underline">
          {title}
        </Link>
      </h3>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 font-sans">
        <span className="text-base font-bold text-black md:text-lg">{rs(price)}</span>
        {off > 0 && <s className="text-xs font-medium text-strike md:text-sm">{rs(compareAt)}</s>}
      </div>
      <div className="mt-auto pt-3">
        <AddToCart
          product={product}
          className="h-10 w-full rounded-lg border border-black bg-black font-heading text-sm font-bold text-brand-yellow transition-colors duration-200 hover:bg-brand-yellow hover:text-black"
        />
      </div>
    </div>
  );
}
