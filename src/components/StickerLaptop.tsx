"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cart } from "@/lib/cart";
import type { Product } from "@/lib/catalog";
import { rs } from "@/lib/format";

type Spot = { x: number; y: number; rot: number; z?: number };
type Drag = { id: string; px: number; py: number; moved: boolean };

const SURFACES = {
  laptop: { label: "Laptop", emoji: "💻", size: 21 },
  bottle: { label: "Bottle", emoji: "🧴", size: 42 },
  phone: { label: "Phone", emoji: "📱", size: 42 },
  notebook: { label: "Notebook", emoji: "📓", size: 29 },
  skateboard: { label: "Skateboard", emoji: "🛹", size: 13 },
};
type Surface = keyof typeof SURFACES;

const ROT = [-8, 6, -4, 9, 7, -5, 4, -9];
const JITTER = [2, -2, 3, -1, -3, 1, -2, 2];

const grid = (xs: number[], ys: number[]): Spot[] =>
  ys
    .flatMap((y, r) => xs.map((x, c) => r * xs.length + c).map((i, c) => ({ x: xs[c] + JITTER[i % 8], y: y + JITTER[(i + 3) % 8], rot: ROT[i % 8] })))
    .slice(0, 8);

const LAYOUTS: Record<Surface, Spot[]> = {
  laptop: grid([14, 38, 62, 86], [27, 73]),
  bottle: grid([28, 72], [14, 38, 62, 86]),
  phone: grid([28, 72], [28, 48, 68, 88]),
  notebook: grid([24, 52, 80], [17, 50, 83]),
  skateboard: grid([22, 41, 60, 79], [30, 70]),
};

const layout = (ids: string[], surface: Surface, cur: Record<string, Spot> = {}) =>
  Object.fromEntries(ids.map((id, i) => [id, LAYOUTS[surface][i] ?? cur[id]]));

export function StickerLaptop({ products }: { products: Product[] }) {
  const zone = useRef<HTMLDivElement>(null);
  const [surface, setSurface] = useState<Surface>("laptop");
  const [spots, setSpots] = useState<Record<string, Spot>>(() =>
    layout(products.slice(0, 8).map((p) => p.id), "laptop"),
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
    const r = zone.current!.getBoundingClientRect();
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

  const stickers = (
    <>
      {placed.length === 0 && <p className="absolute inset-0 flex items-center justify-center text-center font-display text-2xl text-ink/30">drop stickers here</p>}
      {placed.map((p) => {
        const sp = spots[p.id];
        const hidden = drag?.id === p.id && drag.moved;
        const size = SURFACES[surface].size;
        return (
          <button
            key={p.id}
            type="button"
            aria-label={`Move ${p.title}`}
            onPointerDown={(e) => start(e, p.id)}
            className={`absolute cursor-grab touch-none mix-blend-multiply active:cursor-grabbing ${hidden ? "opacity-0" : ""}`}
            style={{ width: `${size}%`, left: `${Math.min(100 - size / 2, Math.max(size / 2, sp.x))}%`, top: `${sp.y}%`, zIndex: sp.z, transform: `translate(-50%,-50%) rotate(${sp.rot}deg)` }}
          >
            <Sticker product={p} />
          </button>
        );
      })}
    </>
  );

  return (
    <div className="select-none" onPointerMove={move} onPointerUp={end} onPointerCancel={() => setDrag(null)}>
      <div role="tablist" aria-label="Choose what to stick on" className="mb-4 flex flex-wrap justify-center gap-2">
        {(Object.keys(SURFACES) as Surface[]).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={surface === k}
            onClick={() => {
              setSurface(k);
              setSpots((cur) => layout(products.filter((p) => cur[p.id]).map((p) => p.id), k, cur));
            }}
            className={`flex h-10 items-center gap-1.5 rounded-full border-2 border-ink px-4 text-sm font-bold transition-transform ${surface === k ? "-rotate-2 bg-slime text-ink shadow-[3px_3px_0_var(--color-ink)]" : "bg-white text-ink hover:-translate-y-0.5"}`}
          >
            <span aria-hidden>{SURFACES[k].emoji}</span>
            {SURFACES[k].label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto flex aspect-[16/11] w-full max-w-[720px] items-center justify-center">
        {surface === "laptop" && (
          <div className="w-full">
            <div
              ref={zone}
              className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-[linear-gradient(160deg,#eeedf3_0%,#d9d8e1_45%,#c4c3ce_100%)] shadow-[inset_0_0_0_1.5px_rgb(255_255_255/0.7),inset_0_-8px_16px_rgb(21_17_28/0.08),0_0_0_3px_var(--color-ink)]"
            >
              <span aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.45)_48%,transparent_60%)]" />
              <span aria-hidden className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#cfcdd8)] shadow-[inset_0_1px_2px_rgb(21_17_28/0.2)]" />
              {stickers}
            </div>
            <div aria-hidden className="relative -mx-[6%]">
              <div className="mx-auto h-1.5 w-[86%] rounded-b-sm bg-[#3a3542]" />
              <div className="relative h-4 rounded-b-[40px] rounded-t-sm border-[3px] border-t-0 border-ink bg-[linear-gradient(#f2f1f6,#bdbcc8)] md:h-5">
                <span className="absolute left-1/2 top-0 h-1.5 w-[14%] -translate-x-1/2 rounded-b-lg bg-[#a6a4b2]" />
              </div>
            </div>
          </div>
        )}

        {surface === "bottle" && (
          <div className="flex aspect-[1/2.3] h-full flex-col items-center">
            <div aria-hidden className="h-[8%] w-[46%] rounded-b-sm rounded-t-xl border-[3px] border-ink bg-ink" />
            <div aria-hidden className="h-[4%] w-[56%] border-x-[3px] border-ink bg-[#b9b7c4]" />
            <div
              ref={zone}
              className="relative w-full flex-1 overflow-hidden rounded-[30%_30%_16%_16%/14%_14%_6%_6%] bg-[linear-gradient(90deg,#b8b6c2,#f1f0f5_35%,#d8d6e0_60%,#a9a7b4)] shadow-[0_0_0_3px_var(--color-ink)]"
            >
              {stickers}
            </div>
          </div>
        )}

        {surface === "phone" && (
          <div
            ref={zone}
            className="relative aspect-[9/19] h-full overflow-hidden rounded-[18%/8.5%] bg-[linear-gradient(160deg,#efe6fc,#cdbdf0)] shadow-[0_0_0_3px_var(--color-ink),inset_0_0_0_6px_rgb(255_255_255/0.35)]"
          >
            <span aria-hidden className="absolute left-[8%] top-[4%] grid aspect-square w-[40%] grid-cols-2 gap-[10%] rounded-[24%] bg-white/45 p-[10%] shadow-[inset_0_0_0_2px_rgb(21_17_28/0.15)]">
              {[0, 1, 2].map((i) => (
                <span key={i} className="rounded-full bg-ink shadow-[inset_0_0_0_3px_#5b5566]" />
              ))}
            </span>
            {stickers}
          </div>
        )}

        {surface === "notebook" && (
          <div ref={zone} className="relative aspect-[3/4] h-full overflow-hidden rounded-l-md rounded-r-2xl bg-sky shadow-[0_0_0_3px_var(--color-ink)]">
            <span aria-hidden className="absolute inset-y-0 left-0 w-[8%] bg-[radial-gradient(circle,var(--color-ink)_32%,transparent_38%)] bg-[length:100%_6%]" />
            <span aria-hidden className="absolute left-[54%] top-[10%] w-[52%] -translate-x-1/2 rounded-lg border-2 border-ink/20 bg-white/80 py-1 text-center font-display text-lg text-ink/30">notes</span>
            {stickers}
          </div>
        )}

        {surface === "skateboard" && (
          <div className="w-full">
            <div
              ref={zone}
              className="relative aspect-[10/2.9] w-full overflow-hidden rounded-full bg-[repeating-linear-gradient(176deg,transparent_0_14px,rgb(120_70_20/0.08)_14px_16px),linear-gradient(180deg,#ecc994,#c9955a)] shadow-[0_0_0_3px_var(--color-ink),inset_0_-6px_0_rgb(21_17_28/0.12)]"
            >
              {stickers}
            </div>
            <div aria-hidden className="mx-auto -mt-0.5 flex w-[70%] justify-between">
              {[0, 1].map((t) => (
                <div key={t} className="flex flex-col items-center">
                  <span className="h-2.5 w-20 rounded-b-md border-[3px] border-t-0 border-ink bg-[#b9b7c4]" />
                  <span className="flex w-28 justify-between">
                    <span className="size-8 rounded-full border-[3px] border-ink bg-slime" />
                    <span className="size-8 rounded-full border-[3px] border-ink bg-slime" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-white/80 md:text-sm">
          {placed.length} on {SURFACES[surface].label.toLowerCase()} · {rs(total)} · drag off to remove
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
                aria-label={`Drag ${p.title} onto the ${SURFACES[surface].label.toLowerCase()}`}
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
