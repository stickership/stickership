import { heroContent, heroProducts } from "@/lib/catalog";
import { StickerLaptop } from "@/components/StickerLaptop";

const dieCut = "[paint-order:stroke_fill] [-webkit-text-stroke:12px_white] md:[-webkit-text-stroke:16px_white]";

export async function HeroBanner() {
  const hero = await heroContent();
  const products = await heroProducts(hero.stickers ?? []);
  return (
    <section className="mat relative overflow-hidden border-b-2 border-ink text-white">
      <div aria-hidden className="flex h-6 justify-between overflow-hidden border-b border-white/30 px-2 font-mono text-[10px] leading-6 text-white/60">
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} className={i > 11 ? "hidden md:inline" : ""}>
            {i * 5}
          </span>
        ))}
      </div>
      <div className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)] items-center gap-10 px-[15px] py-10 md:px-[50px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:py-16">
        <div>
          <p className="inline-block -rotate-2 rounded-full border-2 border-ink bg-slime px-3 py-1 font-mono text-xs font-bold uppercase text-ink md:text-sm">
            {hero.badge}
          </p>
          <h1 className="mt-6 font-display text-[64px] leading-[0.92] text-ink md:text-[104px] lg:text-[120px]">
            <span className={`block -rotate-2 ${dieCut}`}>{hero.line1}</span>
            <span className={`block rotate-1 ${dieCut}`}>
              {hero.line2} <span className="text-pop">{hero.highlight}</span>
            </span>
          </h1>
          <p className="mt-6 max-w-[440px] text-base text-white/85 md:text-lg">
            {hero.subtitle}
          </p>
          <a href="#shop" className="btn mt-7 h-14 border-ink px-8 text-lg">
            {hero.cta}
          </a>
        </div>
        <StickerLaptop products={products} />
      </div>
    </section>
  );
}
