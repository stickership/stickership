"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { listProducts, searchProducts, type Filters } from "@/lib/catalog";
import { admin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { orderToken } from "@/lib/orders";
import { rateLimit } from "@/lib/rate-limit";

export async function loadMore(filters: Filters, page: number) {
  return listProducts(filters, Math.max(0, Math.min(page, 500)));
}

export async function search(term: string) {
  return searchProducts(String(term).slice(0, 80));
}

export async function subscribe(_: unknown, form: FormData) {
  const email = z.string().trim().toLowerCase().email().max(254).safeParse(form.get("email"));
  if (!email.success) return { ok: false, message: "Enter a valid email." };
  if (!(await rateLimit("subscribe", 5))) return { ok: false, message: "Too many tries. Wait a minute." };
  const supabase = await createClient();
  const { error } = await supabase.from("subscribers").insert({ email: email.data });
  if (error && error.code !== "23505") return { ok: false, message: "Couldn't subscribe. Try again." };
  return { ok: true, message: "You're in! Watch your inbox." };
}

export async function trackOrder(_: unknown, form: FormData) {
  const parsed = z
    .object({ id: z.string().trim().uuid(), email: z.string().trim().toLowerCase().email() })
    .safeParse({ id: form.get("id"), email: form.get("email") });
  if (!parsed.success) return { message: "Enter your order ID and email." };
  if (!(await rateLimit("track", 10))) return { message: "Too many tries. Wait a minute." };
  const { data } = await admin().from("orders").select("id, email").eq("id", parsed.data.id).maybeSingle();
  if (!data || data.email.toLowerCase() !== parsed.data.email) return { message: "No order found with those details." };
  redirect(`/orders/${data.id}?t=${orderToken(data.id)}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
