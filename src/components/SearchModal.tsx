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
      <button type="button" aria-label="Search" onClick={() => setOpen(true)} className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5">
        <SearchIcon />
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] bg-ink/50" onClick={() => setOpen(false)}>
          <div className="border-b-2 border-ink bg-paper px-[15px] py-5 font-sans text-ink md:px-[50px]" onClick={(e) => e.stopPropagation()}>
            <div className="field mx-auto flex h-14 max-w-[800px] items-center gap-3 rounded-full px-5 focus-within:shadow-[4px_4px_0_var(--color-slime)]">
              <SearchIcon className="shrink-0 text-ink/60" />
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search anime, memes, cats…"
                className="h-full min-w-0 flex-1 bg-transparent text-base outline-none"
              />
              <button type="button" aria-label="Close search" onClick={() => setOpen(false)} className="p-2">
                <CloseIcon width={16} height={16} />
              </button>
            </div>
            {term.trim() && (
              <ul className="mx-auto mt-3 max-h-[60vh] max-w-[800px] overflow-y-auto">
                {results.length === 0 && <li className="py-6 text-center text-sm text-ink/60">No stickers for for “{term}”</li>}
                {results.map((p) => (
                  <li key={p.id}>
                    <Link href={`/products/${p.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-4 rounded-2xl p-2 hover:bg-white">
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-white">
                        <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />
                      </span>
                      <span className="flex-1 text-sm font-bold">{p.title}</span>
                      <span className="font-mono text-sm font-bold">{rs(Number(p.price))}</span>
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
