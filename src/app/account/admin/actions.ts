"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";

type Result = { ok: true; id?: string } | { ok: false; error: string };

const money = z.coerce.number().min(0).max(100000).multipleOf(0.01);

const productSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug: lowercase letters, numbers and dashes only")
    .max(120),
  image: z.string().trim().min(1, "Upload an image").max(500),
  images: z.array(z.string().trim().min(1).max(500)).max(8, "Max 8 extra images").default([]),
  price: money,
  compare_at: money.nullable(),
  theme: z.string().trim().max(60).nullable(),
  style: z.string().trim().max(60).nullable(),
  type: z.string().trim().min(1).max(60),
  in_stock: z.boolean(),
  position: z.coerce.number().int().min(0).max(1_000_000),
});

export type ProductInput = z.input<typeof productSchema>;

export async function saveProduct(input: ProductInput): Promise<Result> {
  const { supabase } = await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form" };
  const { id, ...row } = parsed.data;
  const query = id
    ? supabase.from("products").update(row).eq("id", id).select("id").single()
    : supabase.from("products").insert(row).select("id").single();
  const { data, error } = await query;
  if (error) return { ok: false, error: error.code === "23505" ? "That slug is already used by another sticker" : error.message };
  revalidateTag("products", { expire: 0 });
  return { ok: true, id: data.id };
}

const bulkSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(500),
  op: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("price"), price: money, compare_at: money.nullable() }),
    z.object({ kind: z.literal("stock"), in_stock: z.boolean() }),
    z.object({ kind: z.literal("delete") }),
  ]),
});

export async function bulkProducts(input: z.input<typeof bulkSchema>): Promise<Result> {
  const { supabase } = await requireAdmin();
  const parsed = bulkSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid bulk action" };
  const { ids, op } = parsed.data;
  const table = supabase.from("products");
  const { error } =
    op.kind === "delete"
      ? await table.delete().in("id", ids)
      : await table.update(op.kind === "price" ? { price: op.price, compare_at: op.compare_at } : { in_stock: op.in_stock }).in("id", ids);
  if (error)
    return { ok: false, error: error.code === "23503" ? "Some stickers are in past orders and can't be deleted. Mark them out of stock instead." : error.message };
  revalidateTag("products", { expire: 0 });
  return { ok: true };
}

const NEXT: Record<string, string[]> = {
  pending: ["cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  failed: [],
  cancelled: [],
};

const orderSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["shipped", "delivered", "cancelled"]),
  courier: z.string().trim().max(60).optional(),
  tracking_no: z.string().trim().max(80).optional(),
});

export async function updateOrderStatus(input: z.input<typeof orderSchema>): Promise<Result> {
  const { supabase } = await requireAdmin();
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid update" };
  const { id, status, courier, tracking_no } = parsed.data;
  if (status === "shipped" && (!courier || !tracking_no)) return { ok: false, error: "Courier and tracking number are required" };

  const { data: order } = await supabase.from("orders").select("status").eq("id", id).maybeSingle();
  if (!order) return { ok: false, error: "Order not found" };
  if (!NEXT[order.status]?.includes(status)) return { ok: false, error: `Can't move a ${order.status} order to ${status}` };

  const now = new Date().toISOString();
  const patch =
    status === "shipped" ? { status, courier, tracking_no, shipped_at: now } : status === "delivered" ? { status, delivered_at: now } : { status };
  const { error } = await supabase.from("orders").update(patch).eq("id", id).eq("status", order.status);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function removeSubscriber(email: string): Promise<Result> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("subscribers").delete().eq("email", email);
  return error ? { ok: false, error: error.message } : { ok: true };
}

const heroSchema = z.object({
  badge: z.string().trim().max(60),
  line1: z.string().trim().min(1, "Headline line 1 is required").max(24),
  line2: z.string().trim().max(24),
  highlight: z.string().trim().max(16),
  subtitle: z.string().trim().max(240),
  cta: z.string().trim().min(1, "Button text is required").max(30),
  stickers: z.array(z.string().uuid()).max(16, "Pick up to 16 stickers"),
});

export async function saveHero(_: unknown, form: FormData): Promise<Result | null> {
  const { supabase } = await requireAdmin();
  const parsed = heroSchema.safeParse({ ...Object.fromEntries(form), stickers: form.getAll("stickers") });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the form" };
  const { error } = await supabase.from("site_settings").upsert({ key: "hero", value: parsed.data, updated_at: new Date().toISOString() });
  if (error) return { ok: false, error: error.message };
  revalidateTag("hero", { expire: 0 });
  return { ok: true };
}

const MAX_IMPORT = 2000;
const truthy = (v: string) => !["false", "no", "0", "n", "out", "out of stock"].includes(v.trim().toLowerCase());

export async function importProducts(rows: Record<string, string>[]): Promise<{ ok: true; count: number } | { ok: false; error: string; rowErrors?: string[] }> {
  const { supabase } = await requireAdmin();
  if (!Array.isArray(rows) || !rows.length) return { ok: false, error: "The file has no rows" };
  if (rows.length > MAX_IMPORT) return { ok: false, error: `Max ${MAX_IMPORT} rows per import. Split the file.` };

  const { data: last } = await supabase.from("products").select("position").order("position", { ascending: false }).limit(1).maybeSingle();
  const base = (last?.position ?? 0) + 1;
  const storage = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`;
  const seen = new Set<string>();
  const rowErrors: string[] = [];
  const valid = [];

  for (const [i, r] of rows.entries()) {
    const get = (k: string) => String(r?.[k] ?? "").trim();
    const title = get("title");
    const slug = get("slug") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
    const image = get("image");
    const images = get("images").split("|").map((u) => u.trim()).filter(Boolean);
    const parsed = productSchema.omit({ id: true }).safeParse({
      title,
      slug,
      image,
      images,
      price: get("price"),
      compare_at: get("compare_at") || null,
      theme: get("theme") || null,
      style: get("style") || null,
      type: get("type") || "Stickers",
      in_stock: get("in_stock") ? truthy(get("in_stock")) : true,
      position: get("position") || base + i,
    });
    const line = `Row ${i + 2}`;
    if (!parsed.success) rowErrors.push(`${line}: ${parsed.error.issues[0]?.path.join(".")} – ${parsed.error.issues[0]?.message}`);
    else if ([image, ...images].some((u) => !u.startsWith("/") && !u.startsWith(storage))) rowErrors.push(`${line}: image/images must be /products/... paths or Supabase Storage URLs`);
    else if (seen.has(parsed.data.slug)) rowErrors.push(`${line}: duplicate slug "${parsed.data.slug}" in file`);
    else {
      seen.add(parsed.data.slug);
      valid.push(parsed.data);
    }
    if (rowErrors.length >= 20) break;
  }
  if (rowErrors.length) return { ok: false, error: "Fix these rows and upload again. Nothing was imported.", rowErrors };

  for (let i = 0; i < valid.length; i += 500) {
    const { error } = await supabase.from("products").upsert(valid.slice(i, i + 500), { onConflict: "slug" });
    if (error) return { ok: false, error: `Import stopped at row ${i + 2}: ${error.message}. Earlier rows were saved.` };
  }
  revalidateTag("products", { expire: 0 });
  return { ok: true, count: valid.length };
}
