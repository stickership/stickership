import Image from "next/image";
import Link from "next/link";
import { AccountIcon, CaretIcon, CartIcon, MenuIcon, SearchIcon, SupportIcon } from "@/components/icons";

const nav: { label: string; href: string; active?: boolean; sub?: string[] }[] = [
  {
    label: "STICKERS & SKINS",
    href: "#",
    active: true,
    sub: [
      "PREMIUM VINYL STICKERS",
      "REFLECTIVE BUMPER STICKERS",
      "HOLOGRAPHIC STICKERS",
      "MINI STICKER SHEETS",
      "GLITTER STICKERS",
      "LAPTOP SKINS",
      "INFINITY STICKERS",
      "STICKER PACKS",
    ],
  },
  { label: "FIND YOUR VIBE", href: "#" },
  { label: "CLOTHING", href: "#", sub: ["T-SHIRTS", "HOODIES", "BOTTOMS"] },
  { label: "MYSTERY BOX", href: "#" },
  { label: "CUSTOM STICKERS", href: "#" },
  { label: "OUR STORY", href: "#" },
  { label: "REVIEWS", href: "#" },
];

const btn = "flex size-11 items-center justify-center text-white";

const Bubble = () => (
  <span className="absolute -top-[3px] -right-[5px] flex size-[18px] items-center justify-center rounded-full bg-brand-yellow font-sans text-[10px] font-semibold text-black">
    0
  </span>
);

export function Header() {
  return (
    <header className="border-b border-white/[0.08] bg-black py-[10px]">
      <div className="mx-auto grid h-[52px] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-[10px] px-[5px] md:px-[50px] lg:h-[70px] lg:grid-cols-[170px_1fr_auto] lg:gap-x-[10px]">
        <div className="flex lg:hidden">
          <button aria-label="Menu" className={btn}>
            <MenuIcon />
          </button>
          <Link href="#" aria-label="Account" className={btn}>
            <AccountIcon />
          </Link>
        </div>

        <Link href="/" className="flex items-center justify-center lg:px-[15px]">
          <Image src="/images/logo.png" alt="Stick it up" width={500} height={216} priority className="h-[52px] w-[120px] object-contain lg:h-[60px] lg:w-[140px]" />
        </Link>

        <ul className="ml-[13px] hidden flex-wrap gap-x-[10px] self-start lg:flex">
          {nav.map(({ label, href, active, sub }) => (
            <li key={label} className="group relative">
              <Link
                href={href}
                className={`relative block py-[5px] font-heading text-[16px] leading-[20.8px] font-bold tracking-[-0.32px] text-white decoration-1 underline-offset-[3px] ${sub ? "pr-[27px] pl-[15px]" : "px-[15px]"} ${active ? "underline" : ""}`}
              >
                {label}
                {sub && <CaretIcon className="absolute top-1/2 right-2 -translate-y-1/2 opacity-70 transition-transform duration-300 group-hover:rotate-180" />}
              </Link>
              {sub && (
                <ul className="pointer-events-none invisible absolute top-[40.8px] left-0 z-20 ml-[-9px] w-[258px] translate-y-2 rounded-[5px] border border-white/[0.03] bg-black py-6 opacity-0 shadow-[0_1px_5px_0_rgba(43,43,43,0.05)] transition-[opacity,transform,visibility] duration-300 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {sub.map((s, i) => (
                    <li key={s}>
                      <Link href="#" className={`block px-6 py-[10px] font-sans text-[14px] leading-[18.2px] font-semibold text-white hover:underline ${i === 0 && active ? "underline" : ""}`}>
                        {s}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end">
          <a href="mailto:wecare@stickitup.xyz" className="hidden h-[70px] items-center gap-4 rounded-lg bg-[#1f1e1e] px-[10px] text-white lg:flex">
            <SupportIcon />
            <span className="flex flex-col">
              <span className="font-sans text-[12px] leading-3 font-medium opacity-70">Customer support</span>
              <span className="font-sans text-[16px] leading-5 font-extrabold">wecare@stickitup.xyz</span>
            </span>
          </a>
          <button aria-label="Search" className={`${btn} lg:ml-[20px]`}>
            <SearchIcon />
          </button>
          <Link href="#" aria-label="Account" className={`${btn} hidden lg:ml-[10px] lg:flex`}>
            <AccountIcon />
          </Link>
          <Link href="#" aria-label="Cart" className="flex items-center gap-[10px] text-white max-lg:size-11 max-lg:justify-center lg:ml-[20px]">
            <span className="relative">
              <CartIcon />
              <Bubble />
            </span>
            <span className="hidden flex-col lg:flex">
              <span className="font-sans text-[12px] leading-3 font-medium">Subtotal</span>
              <span className="font-sans text-[16px] leading-4 font-extrabold">Rs. 0.00</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
