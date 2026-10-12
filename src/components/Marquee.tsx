const ITEMS = ["Premium vinyl", "Waterproof", "Fade-proof", "Made in India", "Ships in 24 hrs", "Laptop approved"];

export function Marquee() {
  return (
    <div className="overflow-hidden py-5">
      <div className="-mx-4 flex -rotate-[1.5deg] gap-8 overflow-hidden border-y-2 border-ink bg-slime py-2 text-ink">
        <style>{`@keyframes marquee-gap{to{transform:translateX(calc(-100% - 2rem))}}`}</style>
        {[0, 1].map((i) => (
          <div key={i} aria-hidden={i === 1 || undefined} className="flex min-w-full shrink-0 animate-[marquee-gap_20s_linear_infinite] items-center justify-around gap-8">
            {ITEMS.map((t) => (
              <span key={t} className="flex items-center gap-8 whitespace-nowrap font-display text-lg md:text-2xl">
                {t}
                <span aria-hidden className="text-pop">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
