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

export async function inviteAdmin(_: unknown, form: FormData): Promise<Result | null> {
  const { supabase } = await requireAdmin();
  const email = z.string().trim().toLowerCase().email().safeParse(form.get("email"));
  if (!email.success) return { ok: false, error: "Enter a valid email" };
  const { error } = await supabase.from("admin_invites").upsert({ email: email.data }, { onConflict: "email", ignoreDuplicates: true });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function removeAdmin(userId: string): Promise<Result> {
  const { supabase, user } = await requireAdmin();
  if (userId === user.id) return { ok: false, error: "You can't remove yourself" };
  const { data: target } = await supabase.from("admins").select("email").eq("user_id", userId).maybeSingle();
  const { error } = await supabase.from("admins").delete().eq("user_id", userId);
  if (error) return { ok: false, error: error.message };
  if (target) await supabase.from("admin_invites").delete().eq("email", target.email);
  return { ok: true };
}

export async function removeInvite(email: string): Promise<Result> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("admin_invites").delete().eq("email", email);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function removeSubscriber(email: string): Promise<Result> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("subscribers").delete().eq("email", email);
  return error ? { ok: false, error: error.message } : { ok: true };
}
