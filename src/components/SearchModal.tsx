"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { search } from "@/app/actions";
import type { Product } from "@/lib/catalog";
import { rs } from "@/lib/format";

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const latest = useRef(0);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);

  useEffect(() => {
    const id = ++latest.current;
    const t = setTimeout(async () => {
      const r = term.trim() ? await search(term).catch(() => []) : [];
      if (id === latest.current) setResults(r);
    }, 250);
    return () => clearTimeout(t);
  }, [term]);

  return (
    <>
      <button type="button" aria-label="Search" onClick={() => setOpen(true)} className="flex size-11 items-center justify-center text-white lg:ml-[20px]">
        <SearchIcon />
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] bg-black/40" onClick={() => setOpen(false)}>
          <div className="bg-white px-[15px] py-5 font-sans text-black md:px-[50px]" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto flex max-w-[800px] items-center gap-3 rounded-md bg-media px-4">
              <SearchIcon className="shrink-0 text-black/60" />
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search stickers"
                className="h-14 flex-1 bg-transparent text-base outline-none"
              />
              <button type="button" aria-label="Close search" onClick={() => setOpen(false)} className="p-2">
                <CloseIcon width={16} height={16} />
              </button>
            </div>
            {term.trim() && (
              <ul className="mx-auto mt-3 max-h-[60vh] max-w-[800px] overflow-y-auto">
                {results.length === 0 && <li className="py-6 text-center text-sm text-black/60">No results for “{term}”</li>}
                {results.map((p) => (
                  <li key={p.id}>
                    <Link href={`/products/${p.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-4 rounded-md p-2 hover:bg-media">
                      <span className="relative size-14 shrink-0 bg-media">
                        <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />
                      </span>
                      <span className="flex-1 font-heading text-sm font-bold">{p.title}</span>
                      <span className="text-sm font-semibold text-sale">{rs(Number(p.price))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
