"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveProduct, type ProductInput } from "../actions";
import { btn, btnGhost, card, input } from "../_components/ui";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);

type Options = { theme: string[]; style: string[]; type: string[] };

export function ProductForm({ product, options }: { product?: ProductInput & { id: string }; options: Options }) {
  const router = useRouter();
  const [f, setF] = useState<ProductInput>(
    product ?? { title: "", slug: "", image: "", images: [], price: 10, compare_at: 79, theme: null, style: null, type: "Stickers", in_stock: true, position: 0 },
  );
  const [slugTouched, setSlugTouched] = useState(!!product);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pending, start] = useTransition();
  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) => {
    setSaved(false);
    setF((cur) => ({ ...cur, [k]: v }));
  };

  async function upload(file: File, extra = false) {
    if (file.size > 5 * 1024 * 1024) return setError("Image must be under 5 MB");
    const ext = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" }[file.type];
    if (!ext) return setError("Use a PNG, JPG or WEBP image");
    setUploading(true);
    setError("");
    const path = `${crypto.randomUUID()}.${ext}`;
    const supabase = createClient();
    const { error } = await supabase.storage.from("products").upload(path, file, { contentType: file.type, cacheControl: "31536000" });
    setUploading(false);
    if (error) return setError(error.message);
    const url = supabase.storage.from("products").getPublicUrl(path).data.publicUrl;
    if (extra) {
      setSaved(false);
      setF((cur) => ({ ...cur, images: [...(cur.images ?? []), url].slice(0, 8) }));
    }
    else set("image", url);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      setSaved(false);
      const res = await saveProduct({ ...f, id: product?.id });
      if (!res.ok) return setError(res.error);
      setError("");
      if (!product) return router.replace(`/account/admin/products/${res.id}`);
      setSaved(true);
      router.refresh();
    });
  }

  const field = (label: string, el: React.ReactNode) => (
    <label className="flex flex-col gap-1.5 text-sm font-semibold">
      {label}
      {el}
    </label>
  );
  const pick = (k: "theme" | "style" | "type") => (
    <>
      <input
        list={`opt-${k}`}
        value={f[k] ?? ""}
        onChange={(e) => set(k, e.target.value || (k === "type" ? "" : null))}
        className={input}
      />
      <datalist id={`opt-${k}`}>
        {options[k].map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </>
  );

  return (
    <form onSubmit={submit} className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <div className={card}>
        <p className="mb-2 text-sm font-semibold">Image</p>
        <label className="relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-black/15 bg-media text-sm text-black/50 hover:border-black/40">
          {f.image ? <Image src={f.image} alt="" fill sizes="320px" className="object-contain" /> : uploading ? "Uploading…" : "Click to upload PNG / JPG / WEBP"}
          <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
        {f.image && <p className="mt-2 text-xs text-black/50">{uploading ? "Uploading…" : "Click the image to replace it."}</p>}
        <p className="mb-2 mt-5 text-sm font-semibold">More images ({f.images?.length ?? 0}/8)</p>
        <div className="grid grid-cols-4 gap-2">
          {f.images?.map((src, i) => (
            <div key={src} className="group relative aspect-square overflow-hidden rounded-lg border-2 border-ink/10 bg-media">
              <Image src={src} alt="" fill sizes="80px" className="object-contain" />
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => set("images", f.images!.filter((_, j) => j !== i))}
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-ink text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
          {(f.images?.length ?? 0) < 8 && (
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-black/15 text-2xl text-black/40 hover:border-black/40">
              +
              <input type="file" accept="image/png,image/jpeg,image/webp" multiple className="sr-only" onChange={(e) => Array.from(e.target.files ?? []).slice(0, 8 - (f.images?.length ?? 0)).forEach((file) => upload(file, true))} />
            </label>
          )}
        </div>
      </div>

      <div className={`${card} grid content-start gap-4 md:grid-cols-2`}>
        <div className="md:col-span-2">
          {field(
            "Title",
            <input
              required
              value={f.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
              className={input}
            />,
          )}
        </div>
        <div className="md:col-span-2">
          {field(
            "URL slug",
            <input
              required
              value={f.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              className={input}
            />,
          )}
        </div>
        {field("Price (Rs.)", <input required type="number" min={0} step="0.01" value={String(f.price)} onChange={(e) => set("price", e.target.value)} className={input} />)}
        {field(
          "Original price (Rs.)",
          <input type="number" min={0} step="0.01" value={f.compare_at == null ? "" : String(f.compare_at)} onChange={(e) => set("compare_at", e.target.value === "" ? null : e.target.value)} className={input} />,
        )}
        {field("Type", pick("type"))}
        {field("Theme", pick("theme"))}
        {field("Style", pick("style"))}
        {field("Sort position (lower = first)", <input type="number" min={0} value={String(f.position)} onChange={(e) => set("position", e.target.value)} className={input} />)}
        <label className="flex items-center gap-2 text-sm font-semibold md:col-span-2">
          <input type="checkbox" checked={f.in_stock} onChange={(e) => set("in_stock", e.target.checked)} className="size-4" />
          In stock
        </label>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 md:col-span-2">{error}</p>}
        <div className="flex gap-2 md:col-span-2">
          <button disabled={pending || uploading} className={btn}>
            {pending ? "Saving…" : saved ? "Saved ✓" : product ? "Save changes" : "Create sticker"}
          </button>
          <button type="button" onClick={() => router.back()} className={btnGhost}>
            Cancel
          </button>
          {product && (
            <a href={`/products/${product.slug}`} target="_blank" className={`${btnGhost} ml-auto`}>
              View in store ↗
            </a>
          )}
        </div>
      </div>
    </form>
  );
}
