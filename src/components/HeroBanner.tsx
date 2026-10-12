import { heroProducts } from "@/lib/catalog";
import { StickerLaptop } from "@/components/StickerLaptop";

export async function HeroBanner() {
  const products = await heroProducts();
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_75%_40%,#fff7d6_0%,#fafafa_55%)]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)] items-center gap-8 px-[15px] py-8 md:px-[50px] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:py-14">
        <div>
          <p className="inline-block rounded-full bg-brand-red px-3 py-1 font-heading text-xs font-bold uppercase tracking-wide text-white md:text-sm">
            Flat 87% off · today only
          </p>
          <h1 className="mt-4 font-heading text-[44px] font-extrabold leading-[0.95] tracking-[-2px] text-black md:text-[72px] lg:text-[84px]">
            Stickers at
            <br />
            just <span className="text-brand-red">₹10</span>
          </h1>
          <p className="mt-4 max-w-[420px] text-base text-black/70 md:text-lg">
            Drag stickers onto the laptop, build your vibe, then add the whole setup to your cart in one tap.
          </p>
          <a
            href="#shop"
            className="mt-6 inline-flex h-12 items-center rounded-lg bg-black px-6 font-heading text-base font-bold text-brand-yellow transition-colors hover:bg-brand-yellow hover:text-black"
          >
            Shop all stickers ↓
          </a>
        </div>
        <StickerLaptop products={products} />
      </div>
    </section>
  );
}
