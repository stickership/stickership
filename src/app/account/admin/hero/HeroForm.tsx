"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import type { Hero } from "@/lib/catalog";
import { saveHero } from "../actions";
import { btn, card, input } from "../_components/ui";

const FIELDS: [keyof Hero, string, number][] = [
  ["badge", "Badge (small tag above the headline)", 60],
  ["line1", "Headline line 1", 24],
  ["line2", "Headline line 2", 24],
  ["highlight", "Pink word after line 2", 16],
  ["cta", "Button text", 30],
];

const dieCut = "[paint-order:stroke_fill] [-webkit-text-stroke:8px_white]";

type Pick = { id: string; title: string; image: string };

export function HeroForm({ hero, products }: { hero: Hero; products: Pick[] }) {
  const [h, setH] = useState(hero);
  const [q, setQ] = useState("");
  const byId = new Map(products.map((p) => [p.id, p]));
  const picked = h.stickers.flatMap((id) => byId.get(id) ?? []);
  const setPicked = (ids: string[]) => setH({ ...h, stickers: ids });
  const move = (i: number, d: number) => {
    const ids = picked.map((p) => p.id);
    [ids[i], ids[i + d]] = [ids[i + d], ids[i]];
    setPicked(ids);
  };
  const results = products.filter((p) => !h.stickers.includes(p.id) && p.title.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 24);
  const [state, action, pending] = useActionState(saveHero, null);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <form action={action} className={`${card} flex flex-col gap-4`}>
        {FIELDS.map(([k, label, max]) => (
          <label key={k} className="flex flex-col gap-1.5 text-sm font-semibold">
            {label}
            <input name={k} value={h[k]} maxLength={max} onChange={(e) => setH({ ...h, [k]: e.target.value })} className={input} />
          </label>
        ))}
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Subtitle
          <textarea name="subtitle" value={h.subtitle} maxLength={240} rows={3} onChange={(e) => setH({ ...h, subtitle: e.target.value })} className={`${input} h-auto py-2`} />
        </label>
        <fieldset className="flex flex-col gap-3 border-t-2 border-ink/10 pt-4">
          <legend className="text-sm font-semibold">Laptop stickers ({picked.length}/16)</legend>
          <p className="text-xs text-ink/60">First 8 go on the laptop, the rest sit in the tray below it. Leave empty to show the first 16 stickers automatically.</p>
          {picked.map((p) => (
            <input key={p.id} type="hidden" name="stickers" value={p.id} />
          ))}
          {picked.length > 0 && (
            <ol className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {picked.map((p, i) => (
                <li key={p.id} className={`relative rounded-xl border-2 p-1 ${i < 8 ? "border-ink bg-white" : "border-dashed border-ink/30 bg-paper"}`}>
                  <span className="absolute -left-1.5 -top-1.5 z-10 flex size-5 items-center justify-center rounded-full bg-ink font-mono text-[10px] font-bold text-slime">{i + 1}</span>
                  <span className="relative block aspect-square">
                    <Image src={p.image} alt={p.title} fill sizes="80px" className="object-contain" />
                  </span>
                  <span className="mt-1 flex justify-between text-xs">
                    <button type="button" aria-label="Move earlier" disabled={i === 0} onClick={() => move(i, -1)} className="px-1 disabled:opacity-20">←</button>
                    <button type="button" aria-label={`Remove ${p.title}`} onClick={() => setPicked(h.stickers.filter((id) => id !== p.id))} className="px-1 text-pop">✕</button>
                    <button type="button" aria-label="Move later" disabled={i === picked.length - 1} onClick={() => move(i, 1)} className="px-1 disabled:opacity-20">→</button>
                  </span>
                </li>
              ))}
            </ol>
          )}
          {picked.length < 16 && (
            <>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stickers to add…" className={input} />
              <div className="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6">
                {results.map((p) => (
                  <button key={p.id} type="button" title={p.title} onClick={() => setPicked([...picked.map((x) => x.id), p.id])} className="relative aspect-square rounded-xl border-2 border-ink/10 bg-white hover:border-ink">
                    <Image src={p.image} alt={p.title} fill sizes="80px" className="object-contain p-1" />
                  </button>
                ))}
              </div>
            </>
          )}
          {picked.length > 0 && (
            <button type="button" onClick={() => setPicked([])} className="self-start text-xs font-semibold underline">
              Clear all (use automatic)
            </button>
          )}
        </fieldset>
        {state && <p className={`text-sm font-semibold ${state.ok ? "text-mat" : "text-pop"}`}>{state.ok ? "Saved. Live on the homepage now." : state.error}</p>}
        <button disabled={pending} className={`${btn} self-start`}>
          {pending ? "Saving…" : "Save hero"}
        </button>
      </form>

      <div className="mat overflow-hidden rounded-3xl border-2 border-ink p-6 text-white">
        <p className="font-mono text-xs uppercase text-white/60">Preview</p>
        {h.badge && <p className="mt-4 inline-block -rotate-2 rounded-full border-2 border-ink bg-slime px-3 py-1 font-mono text-xs font-bold uppercase text-ink">{h.badge}</p>}
        <p className="mt-4 font-display text-5xl leading-[0.92] text-ink">
          <span className={`block -rotate-2 ${dieCut}`}>{h.line1}</span>
          <span className={`block rotate-1 ${dieCut}`}>
            {h.line2} <span className="text-pop">{h.highlight}</span>
          </span>
        </p>
        <p className="mt-4 text-sm text-white/85">{h.subtitle}</p>
        <span className="btn mt-5 h-11 text-sm">{h.cta}</span>
      </div>
    </div>
  );
}
