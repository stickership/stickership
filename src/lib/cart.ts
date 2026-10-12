"use client";

import { useSyncExternalStore } from "react";

export type CartItem = { id: string; slug: string; title: string; image: string; price: number; qty: number };

const KEY = "stickership-cart";
const OPEN_EVENT = "cart:open";
const listeners = new Set<() => void>();
const EMPTY: CartItem[] = [];
let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY };

function read(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw === cache.raw) return cache.items;
  let items = EMPTY;
  try {
    items = raw ? JSON.parse(raw) : EMPTY;
  } catch {}
  cache = { raw, items };
  return items;
}

function write(items: CartItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => e.key === KEY && l();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export const useCart = () => useSyncExternalStore(subscribe, read, () => EMPTY);

const clampQty = (n: number) => Math.max(1, Math.min(50, Math.floor(n) || 1));

export const cart = {
  add(item: Omit<CartItem, "qty">, qty = 1) {
    const items = read();
    const hit = items.find((i) => i.id === item.id);
    write(hit ? items.map((i) => (i.id === item.id ? { ...i, qty: clampQty(i.qty + qty) } : i)) : [...items, { ...item, qty: clampQty(qty) }]);
    window.dispatchEvent(new Event(OPEN_EVENT));
  },
  setQty(id: string, qty: number) {
    write(read().map((i) => (i.id === id ? { ...i, qty: clampQty(qty) } : i)));
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write(EMPTY);
  },
  OPEN_EVENT,
};

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (items: CartItem[]) => items.reduce((n, i) => n + i.price * i.qty, 0);
