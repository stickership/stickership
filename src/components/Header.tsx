import Image from "next/image";
import Link from "next/link";
import { AccountIcon } from "@/components/icons";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileMenu } from "@/components/MobileMenu";
import { SearchModal } from "@/components/SearchModal";

const NAV = [
  ["Shop", "/#shop"],
  ["Holo", "/?type=Holographic+stickers#shop"],
  ["Mystery box", "/?type=Mystery+Box#shop"],
  ["Track order", "/track"],
];

export function Header() {
  return (
    <header className="sticky top-0 z-[80] border-b-2 border-ink bg-paper">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-2 md:px-[50px] lg:h-[72px]">
        <div className="flex items-center gap-1">
          <MobileMenu />
          <Link href="/" className="group flex items-center gap-2 font-display text-[26px] leading-none text-ink lg:text-[30px]">
            <Image src="/logo.jpg" alt="" width={500} height={500} priority className="size-9 rotate-[-6deg] rounded-xl border-2 border-ink transition-transform group-hover:rotate-6 lg:size-10" />
            stickership
          </Link>
        </div>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[15px] font-semibold">
            {NAV.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="rounded-full px-4 py-2 transition-colors hover:bg-ink hover:text-slime">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 text-ink">
          <SearchModal />
          <Link href="/account" aria-label="Account" className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5">
            <AccountIcon />
          </Link>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
