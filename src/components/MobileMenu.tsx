"use client";

import Link from "next/link";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";

const LINKS = [
  ["Shop all stickers", "/#shop"],
  ["Holographic", "/?type=Holographic+stickers#shop"],
  ["Mystery box", "/?type=Mystery+Box#shop"],
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
      <button type="button" aria-label="Menu" onClick={() => setOpen(true)} className="flex size-11 items-center justify-center text-ink lg:hidden">
        <MenuIcon />
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] bg-ink/50 lg:hidden" onClick={() => setOpen(false)}>
          <nav className="mat h-full w-[85%] max-w-[360px] border-r-2 border-ink p-6 text-white" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="mb-8 flex size-10 items-center justify-center rounded-full bg-white text-ink">
              <CloseIcon width={14} height={14} />
            </button>
            <ul className="flex flex-col gap-3">
              {LINKS.map(([label, href], i) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`inline-block rounded-xl border-2 border-ink px-4 py-2 text-lg font-bold text-ink shadow-[3px_3px_0_var(--color-ink)] ${["bg-white", "bg-slime", "bg-pop", "bg-sky"][i % 4]}`}
                    style={{ rotate: `${[-2, 1.5, -1, 2][i % 4]}deg` }}
                  >
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
