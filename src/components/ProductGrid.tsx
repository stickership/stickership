"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

const STEP = 24;

export function ProductGrid() {
  const [count, setCount] = useState(STEP);
  const sentinel = useRef<HTMLDivElement>(null);
  const done = count >= products.length;

  useEffect(() => {
    const el = sentinel.current;
    if (!el || done) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setCount((c) => Math.min(c + STEP, products.length)),
      { rootMargin: "800px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [count, done]);

  return (
    <>
      <ul className="mb-5 mt-[30px] flex flex-wrap gap-x-[17px] gap-y-[34px] md:mt-10 md:gap-x-[31px]">
        {products.slice(0, count).map((p) => (
          <li
            key={p.image}
            className="w-[calc((100%-17px)/2)] md:w-[calc((100%-62px)/3)] lg:w-[calc((100%-93px)/4)]"
          >
            <ProductCard {...p} />
          </li>
        ))}
      </ul>
      {!done && <div ref={sentinel} />}
    </>
  );
}
