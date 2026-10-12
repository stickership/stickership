"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cart } from "@/lib/cart";
import type { Product } from "@/lib/catalog";
import { rs } from "@/lib/format";

type Spot = { x: number; y: number; rot: number; z?: number };
type Drag = { id: string; px: number; py: number; moved: boolean };

const START: Spot[] = [
  { x: 15, y: 22, rot: -8 },
  { x: 38, y: 20, rot: 6 },
  { x: 63, y: 24, rot: -4 },
  { x: 86, y: 21, rot: 9 },
  { x: 24, y: 60, rot: 7 },
  { x: 50, y: 52, rot: -5 },
  { x: 76, y: 60, rot: 4 },
  { x: 13, y: 82, rot: -9 },
];

export function StickerLaptop({ products }: { products: Product[] }) {
  const lid = useRef<HTMLDivElement>(null);
  const [spots, setSpots] = useState<Record<string, Spot>>(() =>
    Object.fromEntries(products.slice(0, START.length).map((p, i) => [p.id, START[i]])),
  );
  const [drag, setDrag] = useState<Drag | null>(null);
  const [added, setAdded] = useState(false);

  const placed = products.filter((p) => spots[p.id]);
  const tray = products.filter((p) => !spots[p.id]);
  const total = placed.reduce((s, p) => s + Number(p.price), 0);

  function start(e: ReactPointerEvent, id: string) {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ id, px: e.clientX, py: e.clientY, moved: false });
  }

  function move(e: ReactPointerEvent) {
    if (!drag) return;
    setDrag({ ...drag, px: e.clientX, py: e.clientY, moved: true });
  }

  function end(e: ReactPointerEvent) {
    if (!drag) return;
    const r = lid.current!.getBoundingClientRect();
    const inside = e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
    setSpots((s) => {
      const next = { ...s };
      if (inside) {
        next[drag.id] = {
          x: Math.min(92, Math.max(8, ((e.clientX - r.left) / r.width) * 100)),
          y: Math.min(88, Math.max(12, ((e.clientY - r.top) / r.height) * 100)),
          rot: s[drag.id]?.rot ?? Math.round(Math.random() * 20 - 10),
          z: Math.max(0, ...Object.values(s).map((v) => v.z ?? 0)) + 1,
        };
      } else if (drag.moved) {
        delete next[drag.id];
      }
      return next;
    });
    setDrag(null);
    setAdded(false);
  }

  function addAll() {
    placed.forEach(({ id, slug, title, image, price }) => cart.add({ id, slug, title, image, price: Number(price) }));
    setAdded(true);
  }

  const dragged = drag && products.find((p) => p.id === drag.id);

  return (
    <div className="select-none" onPointerMove={move} onPointerUp={end} onPointerCancel={() => setDrag(null)}>
      <div className="mx-auto w-full max-w-[720px]">
        <div
          ref={lid}
          className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-[linear-gradient(160deg,#eeedf3_0%,#d9d8e1_45%,#c4c3ce_100%)] shadow-[inset_0_0_0_1.5px_rgb(255_255_255/0.7),inset_0_-8px_16px_rgb(21_17_28/0.08),0_0_0_3px_var(--color-ink)]"
        >
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.45)_48%,transparent_60%)]" />
          <span aria-hidden className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#cfcdd8)] shadow-[inset_0_1px_2px_rgb(21_17_28/0.2)]" />
          {placed.length === 0 && (
            <p className="absolute inset-0 flex items-center justify-center font-display text-2xl text-ink/30">drop stickers here</p>
          )}
          {placed.map((p) => {
            const s = spots[p.id];
            const hidden = drag?.id === p.id && drag.moved;
            return (
              <button
                key={p.id}
                type="button"
                aria-label={`Move ${p.title}`}
                onPointerDown={(e) => start(e, p.id)}
                className={`absolute w-[21%] cursor-grab touch-none mix-blend-multiply active:cursor-grabbing ${hidden ? "opacity-0" : ""}`}
                style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: s.z, transform: `translate(-50%,-50%) rotate(${s.rot}deg)` }}
              >
                <Sticker product={p} />
              </button>
            );
          })}
        </div>
        <div aria-hidden className="relative -mx-[6%]">
          <div className="mx-auto h-1.5 w-[86%] rounded-b-sm bg-[#3a3542]" />
          <div className="relative h-4 rounded-b-[40px] rounded-t-sm border-[3px] border-t-0 border-ink bg-[linear-gradient(#f2f1f6,#bdbcc8)] md:h-5">
            <span className="absolute left-1/2 top-0 h-1.5 w-[14%] -translate-x-1/2 rounded-b-lg bg-[#a6a4b2]" />
          </div>
          <div className="mx-auto mt-2 h-3 w-[90%] rounded-[50%] bg-ink/35 blur-md" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-white/80 md:text-sm">
          {placed.length} on laptop · {rs(total)} · drag off to remove
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSpots({})}
            className="h-11 rounded-full border-2 border-ink bg-white px-5 text-sm font-bold text-ink"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={!placed.length}
            onClick={addAll}
            className="btn h-11 text-sm"
          >
            {added ? "Added ✓" : `Add all ${placed.length} to cart`}
          </button>
        </div>
      </div>

      {tray.length > 0 && (
        <ul className="mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {tray.map((p) => (
            <li key={p.id} className="shrink-0">
              <button
                type="button"
                aria-label={`Drag ${p.title} onto the laptop`}
                onPointerDown={(e) => start(e, p.id)}
                className={`block w-[72px] cursor-grab touch-none rounded-2xl border-2 border-ink bg-white p-1.5 transition-transform hover:-rotate-6 active:cursor-grabbing md:w-[84px] ${drag?.id === p.id && drag.moved ? "opacity-30" : ""}`}
              >
                <Sticker product={p} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {dragged && drag.moved && (
        <div className="pointer-events-none fixed z-[200] w-[110px] -translate-x-1/2 -translate-y-1/2 rotate-6 drop-shadow-2xl" style={{ left: drag.px, top: drag.py }}>
          <Sticker product={dragged} />
        </div>
      )}
    </div>
  );
}

function Sticker({ product }: { product: Product }) {
  return (
    <span className="relative block aspect-square">
      <Image src={product.image} alt="" fill sizes="160px" draggable={false} className="object-contain" />
    </span>
  );
}
