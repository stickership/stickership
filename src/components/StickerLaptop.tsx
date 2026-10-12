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
          className="relative aspect-[16/10] rounded-[22px] border-[6px] border-[#2b2d31] bg-[linear-gradient(145deg,#9a9da3_0%,#7d8086_55%,#6c6f75_100%)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]"
        >
          <span aria-hidden className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
          {placed.length === 0 && (
            <p className="absolute inset-0 flex items-center justify-center font-heading text-lg font-bold text-white/70">Drop stickers here</p>
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
                className={`absolute w-[17%] cursor-grab touch-none active:cursor-grabbing ${hidden ? "opacity-0" : ""}`}
                style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: s.z, transform: `translate(-50%,-50%) rotate(${s.rot}deg)` }}
              >
                <Sticker product={p} />
              </button>
            );
          })}
        </div>
        <div aria-hidden className="mx-auto h-3 w-[112%] -translate-x-[5.4%] rounded-b-[18px] bg-gradient-to-b from-[#c9ccd1] to-[#9a9da3] shadow-[0_10px_20px_-8px_rgba(0,0,0,0.4)]" />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-sm text-black/60">
          {placed.length} on laptop · {rs(total)} · drag off to remove
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSpots({})}
            className="h-10 rounded-lg border border-black/15 bg-white px-4 font-heading text-sm font-bold"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={!placed.length}
            onClick={addAll}
            className="h-10 rounded-lg bg-black px-4 font-heading text-sm font-bold text-brand-yellow transition-colors hover:bg-brand-yellow hover:text-black disabled:opacity-40"
          >
            {added ? "Added ✓" : `Add ${placed.length} to cart`}
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
                className={`block w-[72px] cursor-grab touch-none rounded-xl bg-white p-1.5 shadow-sm active:cursor-grabbing md:w-[84px] ${drag?.id === p.id && drag.moved ? "opacity-30" : ""}`}
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
    <span className="relative block aspect-square overflow-hidden rounded-[16%] bg-white shadow-[0_3px_8px_rgba(0,0,0,0.3)]">
      <Image src={product.image} alt="" fill sizes="160px" draggable={false} className="object-contain p-[4%]" />
    </span>
  );
}
