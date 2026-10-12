"use client";

import Link from "next/link";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";

const LINKS = [
  ["Shop all stickers", "/"],
  ["Track your order", "/track"],
  ["My account", "/account"],
  ["Our story", "/pages/our-story"],
  ["FAQ", "/pages/faq"],
  ["Contact us", "/pages/contact"],
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-label="Menu" onClick={() => setOpen(true)} className="flex size-11 items-center justify-center text-white lg:hidden">
        <MenuIcon />
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] bg-black/40 lg:hidden" onClick={() => setOpen(false)}>
          <nav className="h-full w-[85%] max-w-[360px] bg-black p-6 text-white" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="mb-6 p-2">
              <CloseIcon width={16} height={16} />
            </button>
            <ul className="flex flex-col gap-5 font-heading text-lg font-bold uppercase">
              {LINKS.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} onClick={() => setOpen(false)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
