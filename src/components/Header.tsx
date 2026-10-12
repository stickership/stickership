import Link from "next/link";
import { AccountIcon, CartIcon, SearchIcon, SupportIcon } from "@/components/icons";

const btn = "flex size-11 items-center justify-center text-white";

const Bubble = () => (
  <span className="absolute -top-[3px] -right-[5px] flex size-[18px] items-center justify-center rounded-full bg-brand-yellow font-sans text-[10px] font-semibold text-black">
    0
  </span>
);

export function Header() {
  return (
    <header className="border-b border-white/[0.08] bg-black py-[10px]">
      <div className="mx-auto flex h-[52px] max-w-[1600px] items-center justify-between px-[15px] md:px-[50px] lg:h-[70px]">
        <Link href="/" className="font-heading text-[26px] leading-none font-extrabold tracking-[-1px] text-brand-yellow lg:text-[32px]">
          stickership
        </Link>

        <div className="flex items-center justify-end">
          <a href="mailto:support@stickership.com" className="hidden h-[70px] items-center gap-4 rounded-lg bg-[#1f1e1e] px-[10px] text-white lg:flex">
            <SupportIcon />
            <span className="flex flex-col">
              <span className="font-sans text-[12px] leading-3 font-medium opacity-70">Customer support</span>
              <span className="font-sans text-[16px] leading-5 font-extrabold">support@stickership.com</span>
            </span>
          </a>
          <button aria-label="Search" className={`${btn} lg:ml-[20px]`}>
            <SearchIcon />
          </button>
          <Link href="#" aria-label="Account" className={`${btn} lg:ml-[10px]`}>
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
