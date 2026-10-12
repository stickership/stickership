import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Keep in sync with private.is_admin() in supabase/migrations/0006_admin_allowlist.sql
const ADMIN_EMAILS = ["sourabh52.singh@gmail.com", "stickershipindia@gmail.com"];

export const isAdmin = (user: User) => !!user.email_confirmed_at && ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "");

export const requireAdmin = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin(user)) notFound();
  return { supabase, user };
});

export const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "failed", "cancelled"] as const;
