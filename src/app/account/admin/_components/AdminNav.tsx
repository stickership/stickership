"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["Dashboard", "/admin"],
  ["Products", "/admin/products"],
  ["Orders", "/admin/orders"],
  ["Customers", "/admin/customers"],
  ["Subscribers", "/admin/subscribers"],
  ["View store ↗", "/"],
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
      {LINKS.map(([label, href]) => {
        const active = href === "/admin" ? path === href : href !== "/" && path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active ? "bg-brand-yellow text-black" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
