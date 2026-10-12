"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions";

const USER = [
  ["📦 My orders", "/account"],
  ["🔎 Track an order", "/track"],
];
const ADMIN = [
  ["Dashboard", "/account/admin"],
  ["Products", "/account/admin/products"],
  ["Orders", "/account/admin/orders"],
  ["Customers", "/account/admin/customers"],
  ["Subscribers", "/account/admin/subscribers"],
];

const tab = "flex shrink-0 items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-bold transition-colors";

export function AccountNav({ email, admin }: { email: string; admin: boolean }) {
  const path = usePathname();
  const isOn = (href: string) => (href === "/account" || href === "/account/admin" ? path === href : path.startsWith(href));
  const link = ([label, href]: string[], on: string) => (
    <Link key={href} href={href} aria-current={isOn(href) ? "page" : undefined} className={`${tab} ${isOn(href) ? on : "border-ink/15 bg-white hover:border-ink"}`}>
      {label}
    </Link>
  );

  return (
    <aside className="md:sticky md:top-24 md:self-start">
      <p className="truncate font-mono text-xs text-ink/60">{email}</p>
      <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
        {admin ? ADMIN.map((l) => link(l, "border-ink bg-pop text-ink shadow-[3px_3px_0_var(--color-ink)]")) : USER.map((l) => link(l, "border-ink bg-ink text-slime"))}
        <form action={signOut} className="md:mt-4">
          <button className={`${tab} w-full border-ink/15 bg-transparent text-ink/70 hover:border-ink hover:text-ink`}>Log out</button>
        </form>
      </nav>
    </aside>
  );
}
