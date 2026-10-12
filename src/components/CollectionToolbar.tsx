"use client";

import { useEffect, useRef, useState } from "react";
import { CaretIcon, CheckIcon, CloseIcon, FilterIcon, SortIcon } from "@/components/icons";

const FACETS: Record<string, [string, number][]> = {
  Theme: [
    ["Abstract & Artistic", 55], ["Animals & Pets", 73], ["Anime & Manga", 434], ["Cars, Bikes & Racing", 207],
    ["Dark & Edgy", 136], ["Food & Drinks", 77], ["Gaming", 79], ["Humor & Attitude", 959],
    ["Indian & Desi", 152], ["Japanese & JDM", 31], ["Love & Emotions", 76], ["Motivational & Hustle", 519],
    ["Music", 37], ["Nature & Travel", 151], ["Pop Culture", 280], ["Quotes & Typography", 71],
    ["Space & Sci-Fi", 77], ["Spiritual & Faith", 102], ["Sports & Fitness", 135], ["Tech & Code", 111],
    ["Warning & Signs", 43],
  ],
  Style: [
    ["Bold & Loud", 1308], ["Cute & Kawaii", 320], ["Dark", 139], ["Illustrated", 1216],
    ["Line Art", 162], ["Minimal", 189], ["Neon & Glow", 323], ["Retro & Vintage", 148],
  ],
  Availability: [["In stock", 3640], ["Out of stock", 165]],
  "Product type": [
    ["Glitter Stickers", 203], ["Holographic stickers", 523], ["Mystery Box", 2], ["Stickers", 3077],
  ],
};

const SORTS = [
  "Featured", "Most relevant", "Best selling", "Alphabetically, A-Z", "Alphabetically, Z-A",
  "Price, low to high", "Price, high to low", "Date, old to new", "Date, new to old",
];

export function CollectionToolbar() {
  const [open, setOpen] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, string[]>>({});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const down = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(null);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, []);

  const toggle = (facet: string, label: string) =>
    setChecked((c) => {
      const cur = c[facet] ?? [];
      return { ...c, [facet]: cur.includes(label) ? cur.filter((l) => l !== label) : [...cur, label] };
    });

  return (
    <>
      <div className="hidden items-start justify-between font-sans md:flex">
        <div ref={ref} className="flex items-center gap-3">
          <span className="my-[11.6px] text-[14px] font-medium leading-[21px] tracking-[0.6px]">Filter:</span>
          {Object.entries(FACETS).map(([facet, items]) => {
            const isOpen = open === facet;
            const sel = checked[facet] ?? [];
            return (
              <div key={facet} className="relative">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : facet)}
                  className="flex h-[54px] cursor-pointer items-center gap-[10px] rounded-[6px] bg-[#fafafa] px-5 py-4 text-[14px] font-semibold leading-[22.4px] text-black transition-colors duration-300 hover:bg-[#f0f0f0]"
                >
                  {facet}
                  <CaretIcon className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="absolute left-[-12px] top-[59.4px] z-30 flex max-h-[450px] w-[350px] flex-col rounded-[6px] bg-white shadow-[rgba(0,0,0,0.1)_0_0_24px_-3px]">
                    <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                      <span className="text-[16px] font-semibold">{sel.length} selected</span>
                      <button
                        type="button"
                        onClick={() => setChecked((c) => ({ ...c, [facet]: [] }))}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-[4px] border border-black/[0.08] py-[7px] pl-[11px] pr-[9px] text-[12px] font-bold shadow-[rgba(0,0,0,0.05)_0_1px_2px]"
                      >
                        Reset
                        <CloseIcon />
                      </button>
                    </div>
                    <div className="flex flex-col gap-[13px] overflow-y-auto p-6">
                      {items.map(([label, count]) => {
                        const on = sel.includes(label);
                        return (
                          <label key={label} className="flex w-full cursor-pointer items-center gap-3">
                            <input type="checkbox" checked={on} onChange={() => toggle(facet, label)} className="sr-only" />
                            <span
                              className={`flex size-4 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-black/60 text-white ${on ? "bg-black" : ""}`}
                            >
                              {on && <CheckIcon />}
                            </span>
                            <span className="flex-1 text-[14px] font-medium leading-[22.4px]">{label}</span>
                            <span className="rounded-[4px] border border-black/10 bg-[#fafafa]/30 px-2 py-[6px] text-[10px] font-medium leading-[10px]">
                              {count}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="relative w-[200px] rounded-[6px] bg-[#fafafa]">
          <select
            aria-label="Sort by"
            className="w-full cursor-pointer appearance-none rounded-[6px] bg-transparent py-4 pl-5 pr-[43px] text-[14px] leading-[14px] font-medium text-black/[0.78] shadow-[inset_rgba(0,0,0,0.1)_0_1px_2px]"
          >
            {SORTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <CaretIcon className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2" />
        </div>
      </div>
      <button
        type="button"
        className="fixed inset-x-0 bottom-0 z-40 flex h-[63px] items-center justify-center gap-[10px] bg-black py-[15px] font-heading text-[18px] font-bold uppercase text-white md:hidden"
      >
        <FilterIcon />
        Filter and sort
        <SortIcon />
      </button>
    </>
  );
}
