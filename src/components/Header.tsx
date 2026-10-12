import Image from "next/image";
import Link from "next/link";
import { AccountIcon, SupportIcon } from "@/components/icons";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileMenu } from "@/components/MobileMenu";
import { SearchModal } from "@/components/SearchModal";

export function Header() {
  return (
    <header className="border-b border-white/[0.08] bg-black py-[10px]">
      <div className="mx-auto flex h-[52px] max-w-[1600px] items-center justify-between px-[5px] md:px-[50px] lg:h-[70px]">
        <div className="flex items-center">
          <MobileMenu />
          <Link href="/" className="flex items-center gap-2 font-heading text-[26px] leading-none font-extrabold tracking-[-1px] text-brand-yellow lg:gap-3 lg:text-[32px]">
            <Image src="/logo.jpg" alt="" width={500} height={500} priority className="size-9 rounded-lg lg:size-11" />
            stickership
          </Link>
        </div>

        <div className="flex items-center justify-end">
          <a href="mailto:support@stickership.com" className="hidden h-[70px] items-center gap-4 rounded-lg bg-[#1f1e1e] px-[10px] text-white lg:flex">
            <SupportIcon />
            <span className="flex flex-col">
              <span className="font-sans text-[12px] leading-3 font-medium opacity-70">Customer support</span>
              <span className="font-sans text-[16px] leading-5 font-extrabold">support@stickership.com</span>
            </span>
          </a>
          <SearchModal />
          <Link href="/account" aria-label="Account" className="flex size-11 items-center justify-center text-white lg:ml-[10px]">
            <AccountIcon />
          </Link>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
