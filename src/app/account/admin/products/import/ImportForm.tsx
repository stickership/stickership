"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { importProducts } from "../../actions";
import { btn, btnGhost, card } from "../../_components/ui";

const COLUMNS = ["title", "slug", "image", "images", "price", "compare_at", "theme", "style", "type", "in_stock", "position"];
const TEMPLATE = `${COLUMNS.join(",")}\n"Wasted Sticker",wasted-sticker,/products/0.jpg,"/products/1.jpg|/products/2.jpg",10,79,Gaming,Text,Stickers,true,\n`;

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  text = text.replace(/^﻿/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c !== '"') cell += c;
      else if (text[i + 1] === '"') cell += text[i++];
      else quoted = false;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      rows.push([...row, cell]);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) rows.push([...row, cell]);
  const [head = [], ...body] = rows.filter((r) => r.some((v) => v.trim()));
  const keys = head.map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return { keys, rows: body.map((r) => Object.fromEntries(keys.map((k, i) => [k, r[i] ?? ""]))) };
}

export function ImportForm() {
  const [file, setFile] = useState<{ name: string; keys: string[]; rows: Record<string, string>[] } | null>(null);
  const [result, setResult] = useState<Awaited<ReturnType<typeof importProducts>> | null>(null);
  const [pending, start] = useTransition();
  const missing = file ? ["title", "image", "price"].filter((k) => !file.keys.includes(k)) : [];

  async function pick(f: File | undefined) {
    setResult(null);
    if (!f) return setFile(null);
    if (f.size > 900 * 1024) return setResult({ ok: false, error: "File must be under 900 KB. Split it into smaller files." });
    setFile({ name: f.name, ...parseCsv(await f.text()) });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={`${card} flex flex-col gap-3 text-sm`}>
        <p>
          Columns: <code className="font-mono text-xs">{COLUMNS.join(", ")}</code>. Only <b>title, image, price</b> are required.
        </p>
        <ul className="list-disc pl-5 text-ink/70">
          <li>Existing stickers with the same slug get updated; new slugs are added.</li>
          <li>Blank slug is made from the title. Blank type = Stickers. Blank in_stock = true. Blank position = added at the end.</li>
          <li>image must be a /products/… path or a Supabase Storage URL (upload images first, then paste their URLs). images = up to 8 extra gallery images separated by |</li>
        </ul>
        <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(TEMPLATE)}`} download="stickers-template.csv" className={`${btnGhost} self-start`}>
          Download template
        </a>
      </div>

      <label className={`${card} flex cursor-pointer flex-col items-center gap-2 border-dashed py-10 text-center text-sm hover:bg-slime/20`}>
        <span className="font-bold">{file ? file.name : "Choose a .csv file"}</span>
        <span className="text-ink/60">{file ? `${file.rows.length} rows found` : "Exported from Excel or Google Sheets as CSV"}</span>
        <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
      </label>

      {file && missing.length > 0 && <p className="font-semibold text-pop">Missing required column(s): {missing.join(", ")}</p>}

      {file && file.rows.length > 0 && missing.length === 0 && (
        <div className={`${card} overflow-x-auto p-0`}>
          <table className="w-full text-left text-xs">
            <thead className="bg-paper font-mono uppercase">
              <tr>
                {COLUMNS.filter((c) => file.keys.includes(c)).map((c) => (
                  <th key={c} className="px-3 py-2">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {file.rows.slice(0, 5).map((r, i) => (
                <tr key={i}>
                  {COLUMNS.filter((c) => file.keys.includes(c)).map((c) => (
                    <td key={c} className="max-w-[200px] truncate px-3 py-2">{r[c]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {file.rows.length > 5 && <p className="px-3 py-2 text-xs text-ink/50">…and {file.rows.length - 5} more</p>}
        </div>
      )}

      {result && !result.ok && (
        <div className="rounded-2xl border-2 border-ink bg-pop/15 p-4 text-sm">
          <p className="font-bold">{result.error}</p>
          {result.rowErrors && (
            <ul className="mt-2 list-disc pl-5 font-mono text-xs">
              {result.rowErrors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {result?.ok && (
        <p className="rounded-2xl border-2 border-ink bg-slime p-4 text-sm font-bold">
          Imported {result.count} stickers. <Link href="/account/admin/products" className="underline">View products</Link>
        </p>
      )}

      <button
        disabled={!file?.rows.length || missing.length > 0 || pending || result?.ok}
        onClick={() => start(async () => setResult(await importProducts(file!.rows).catch(() => ({ ok: false as const, error: "Upload failed. Try again." }))))}
        className={`${btn} self-start`}
      >
        {pending ? "Importing…" : `Import ${file?.rows.length ?? 0} stickers`}
      </button>
    </div>
  );
}
