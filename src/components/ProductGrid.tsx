"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { loadMore } from "@/app/actions";
import { PAGE_SIZE } from "@/lib/format";
import type { Filters, Product } from "@/lib/catalog";

export function ProductGrid({ initial, filters }: { initial: Product[]; filters: Filters }) {
  const [items, setItems] = useState(initial);
  const [done, setDone] = useState(initial.length < PAGE_SIZE);
  const page = useRef(1);
  const busy = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || done) return;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting || busy.current) return;
        busy.current = true;
        try {
          const next = await loadMore(filters, page.current);
          page.current += 1;
          setItems((cur) => [...cur, ...next.filter((p) => !cur.some((c) => c.id === p.id))]);
          if (next.length < PAGE_SIZE) setDone(true);
        } catch {
          setDone(true);
        } finally {
          busy.current = false;
        }
      },
      { rootMargin: "800px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [done, filters, items.length]);

  if (!items.length) return <p className="py-24 text-center font-heading text-lg font-bold">No stickers match these filters.</p>;

  return (
    <>
      <ul className="mb-16 mt-[30px] flex flex-wrap gap-x-[17px] gap-y-10 md:mt-10 md:gap-x-[31px] md:gap-y-12">
        {items.map((p) => (
          <li key={p.id} className="w-[calc((100%-17px)/2)] md:w-[calc((100%-62px)/3)] lg:w-[calc((100%-93px)/4)]">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      {!done && <div ref={sentinel} className="h-px" />}
    </>
  );
}
