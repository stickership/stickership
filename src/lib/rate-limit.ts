import "server-only";
import { headers } from "next/headers";

// ponytail: per-instance memory buckets; move to Upstash/KV when running many instances or under abuse
const hits = new Map<string, number[]>();

export async function rateLimit(key: string, max = 10, windowMs = 60_000) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const id = `${key}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(id) ?? []).filter((t) => now - t < windowMs);
  if (hits.size > 10_000) hits.clear();
  hits.set(id, [...recent, now]);
  return recent.length < max;
}
