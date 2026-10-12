"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CaretIcon, CheckIcon, CloseIcon, FilterIcon, SortIcon } from "@/components/icons";
import type { FacetCount } from "@/lib/catalog";

const FACETS = [
  ["theme", "Theme"],
  ["style", "Style"],
  ["availability", "Availability"],
  ["type", "Product type"],
] as const;

const SORTS = [
  ["featured", "Featured"],
  ["best", "Best selling"],
  ["az", "Alphabetically, A-Z"],
  ["za", "Alphabetically, Z-A"],
  ["price-asc", "Price, low to high"],
  ["price-desc", "Price, high to low"],
  ["old", "Date, old to new"],
  ["new", "Date, new to old"],
];

function useQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const get = (key: string) => params.get(key)?.split(",").filter(Boolean) ?? [];
  const set = (key: string, values: string[]) => {
    const next = new URLSearchParams(params);
    if (values.length) next.set(key, values.join(","));
    else next.delete(key);
    start(() => router.replace(`${pathname}?${next}`, { scroll: false }));
  };
  return { get, set, pending };
}

function FacetList({ facet, counts, q }: { facet: string; counts: FacetCount[]; q: ReturnType<typeof useQuery> }) {
  const sel = q.get(facet);
  return (
    <>
      <div className="flex items-center justify-between border-b-2 border-ink px-6 py-4">
        <span className="text-[16px] font-semibold">{sel.length} selected</span>
        <button
          type="button"
          onClick={() => q.set(facet, [])}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-ink py-1 pl-3 pr-2.5 text-xs font-bold"
        >
          Reset
          <CloseIcon />
        </button>
      </div>
      <div className="flex flex-col gap-[13px] overflow-y-auto p-6">
        {counts
          .filter((c) => c.facet === facet)
          .map(({ value, count }) => {
            const on = sel.includes(value);
            return (
              <label key={value} className="flex w-full cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => q.set(facet, on ? sel.filter((v) => v !== value) : [...sel, value])}
                  className="sr-only"
                />
                <span className={`flex size-4 shrink-0 items-center justify-center rounded-md border-2 border-ink text-slime ${on ? "bg-ink" : "bg-white"}`}>
                  {on && <CheckIcon />}
                </span>
                <span className="flex-1 text-[14px] font-medium leading-[22.4px]">{value}</span>
                <span className="font-mono text-xs text-ink/50">{count}</span>
              </label>
            );
          })}
      </div>
    </>
  );
}

function SortSelect({ q, className }: { q: ReturnType<typeof useQuery>; className: string }) {
  return (
    <div className={`relative rounded-full border-2 border-ink bg-white ${className}`}>
      <select
        aria-label="Sort by"
        value={q.get("sort")[0] ?? "featured"}
        onChange={(e) => q.set("sort", e.target.value === "featured" ? [] : [e.target.value])}
        className="h-11 w-full cursor-pointer appearance-none rounded-full bg-transparent pl-5 pr-[43px] text-sm font-semibold text-ink"
      >
        {SORTS.map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <CaretIcon className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2" />
    </div>
  );
}

export function CollectionToolbar({ counts }: { counts: FacetCount[] }) {
  const q = useQuery();
  const [open, setOpen] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const down = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(null);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(null);
      setSheet(false);
    };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, []);

  return (
    <>
      <div className={`hidden items-center justify-between font-sans transition-opacity md:flex ${q.pending ? "opacity-60" : ""}`}>
        <div ref={ref} className="flex items-center gap-3">
          <span className="font-display text-2xl">filter</span>
          {FACETS.map(([facet, label]) => {
            const isOpen = open === facet;
            const n = q.get(facet).length;
            return (
              <div key={facet} className="relative">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : facet)}
                  className={`flex h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-ink px-5 text-sm font-semibold transition-colors ${isOpen || n ? "bg-ink text-slime" : "bg-white text-ink hover:bg-slime"}`}
                >
                  {label}
                  {n > 0 && <span className="rounded-full bg-pop px-1.5 font-mono text-[11px] leading-[18px] text-ink">{n}</span>}
                  <CaretIcon className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="card absolute left-0 top-[52px] z-30 flex max-h-[450px] w-[320px] flex-col overflow-hidden">
                    <FacetList facet={facet} counts={counts} q={q} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <SortSelect q={q} className="w-[200px]" />
      </div>

      <button
        type="button"
        onClick={() => setSheet(true)}
        className="btn fixed inset-x-4 bottom-4 z-40 h-14 text-base md:hidden"
      >
        <FilterIcon />
        Filter and sort
        <SortIcon />
      </button>

      {sheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-ink/50 md:hidden" onClick={() => setSheet(false)}>
          <div className="flex max-h-[85vh] flex-col overflow-y-auto rounded-t-3xl border-t-2 border-ink bg-paper pb-6 font-sans" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between bg-paper px-6 py-4">
              <span className="font-display text-2xl">filter & sort</span>
              <button type="button" aria-label="Close" onClick={() => setSheet(false)} className="p-2">
                <CloseIcon width={16} height={16} />
              </button>
            </div>
            <div className="px-6 pb-2">
              <SortSelect q={q} className="w-full" />
            </div>
            {FACETS.map(([facet, label]) => (
              <details key={facet} className="border-t-2 border-ink/10">
                <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-[15px] font-semibold">
                  {label}
                  <CaretIcon />
                </summary>
                <FacetList facet={facet} counts={counts} q={q} />
              </details>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
