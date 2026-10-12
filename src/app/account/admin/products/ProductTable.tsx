"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { rs } from "@/lib/format";
import { bulkProducts } from "../actions";
import { btn, btnGhost, card, input } from "../_components/ui";

type Row = {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  compare_at: number | null;
  type: string;
  theme: string | null;
  in_stock: boolean;
};

export function ProductTable({ products }: { products: Row[] }) {
  const router = useRouter();
  const [sel, setSel] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [compare, setCompare] = useState("");
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();

  const all = sel.length === products.length && products.length > 0;
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  function run(op: Parameters<typeof bulkProducts>[0]["op"], confirmText?: string) {
    if (confirmText && !confirm(confirmText)) return;
    start(async () => {
      const res = await bulkProducts({ ids: sel, op });
      setMsg(res.ok ? `Updated ${sel.length} sticker${sel.length > 1 ? "s" : ""}` : res.error);
      if (res.ok) {
        setSel([]);
        router.refresh();
      }
    });
  }

  return (
    <div className={`${card} p-0`}>
      {sel.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-black/10 bg-brand-yellow/30 px-4 py-3 text-sm">
          <b>{sel.length} selected</b>
          <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" inputMode="decimal" className={`${input} w-24`} />
          <input value={compare} onChange={(e) => setCompare(e.target.value)} placeholder="Original" inputMode="decimal" className={`${input} w-24`} />
          <button
            disabled={pending || price === ""}
            onClick={() => run({ kind: "price", price: Number(price), compare_at: compare === "" ? null : Number(compare) })}
            className={btn}
          >
            Set price
          </button>
          <button disabled={pending} onClick={() => run({ kind: "stock", in_stock: true })} className={btnGhost}>
            In stock
          </button>
          <button disabled={pending} onClick={() => run({ kind: "stock", in_stock: false })} className={btnGhost}>
            Out of stock
          </button>
          <button
            disabled={pending}
            onClick={() => run({ kind: "delete" }, `Delete ${sel.length} sticker(s)? This can't be undone.`)}
            className={`${btnGhost} text-red-600`}
          >
            Delete
          </button>
        </div>
      )}
      {msg && <p className="border-b border-black/10 px-4 py-2 text-sm">{msg}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-black/50">
            <tr className="border-b border-black/10">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" aria-label="Select all" checked={all} onChange={() => setSel(all ? [] : products.map((p) => p.id))} />
              </th>
              <th className="py-3">Sticker</th>
              <th className="py-3">Type</th>
              <th className="py-3">Theme</th>
              <th className="py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-black/50">
                  No stickers found.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                <td className="px-4 py-2">
                  <input type="checkbox" aria-label={`Select ${p.title}`} checked={sel.includes(p.id)} onChange={() => toggle(p.id)} />
                </td>
                <td className="py-2">
                  <Link href={`/account/admin/products/${p.id}`} className="flex items-center gap-3 hover:underline">
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-media">
                      <Image src={p.image} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                    <span className="font-semibold">{p.title}</span>
                  </Link>
                </td>
                <td className="py-2 text-black/60">{p.type}</td>
                <td className="py-2 text-black/60">{p.theme ?? "—"}</td>
                <td className="py-2 text-right">
                  <b>{rs(Number(p.price))}</b>
                  {p.compare_at && <s className="ml-2 text-xs text-black/40">{rs(Number(p.compare_at))}</s>}
                </td>
                <td className="px-4 py-2 text-right">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${p.in_stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                    {p.in_stock ? "In stock" : "Out"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
