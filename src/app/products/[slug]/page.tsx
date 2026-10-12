import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, listProducts } from "@/lib/catalog";
import { rs } from "@/lib/format";
import { Shell } from "@/components/Shell";
import { ProductCard } from "@/components/ProductCard";
import { QtyBuy } from "./QtyBuy";
import { ShareButton } from "./ShareButton";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">) {
  const p = await getProduct((await params).slug);
  return { title: p ? `${p.title} | stickership` : "Not found | stickership" };
}

const DETAILS = [
  {
    title: "Features & Description",
    icon: "ⓘ",
    body: [
      "Printed on premium waterproof vinyl with a satin matte finish.",
      "Scratch-proof and fade-resistant: handles rain, sunlight and bottle washing.",
      "Fits within a 3 × 3 inch area. Height and width depend on the design's shape.",
      "Colours may vary slightly from screen to print.",
    ],
  },
  {
    title: "Shipping & Returns",
    icon: "↺",
    body: [
      "Packed and dispatched within 24 hours on working days.",
      "Free shipping on orders of Rs. 299 and above, otherwise a flat Rs. 49.",
      "Damaged or wrong item? Email us within 7 days of delivery for a replacement or refund.",
    ],
  },
];

async function Content({ params }: PageProps<"/products/[slug]">) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const price = Number(product.price);
  const compareAt = Number(product.compare_at ?? 0);
  const related = (await listProducts(product.theme ? { theme: product.theme } : {})).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="pb-16">
      <nav aria-label="Breadcrumb" className="flex items-center gap-3 pb-8 pt-8 font-mono text-xs text-ink/60">
        <Link href="/" className="hover:underline">Home</Link>
        <span aria-hidden>›</span>
        <Link href="/" className="hover:underline">All Stickers</Link>
        <span aria-hidden>›</span>
        <span className="truncate font-bold text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[45%_1fr]">
        <div className="die-cut relative aspect-square -rotate-1 overflow-hidden bg-white">
          <Image src={product.image} alt={product.title} fill priority sizes="(min-width:990px) 45vw, 100vw" className="object-contain" />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start lg:pl-20">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-[40px]">{product.title}</h1>
            <ShareButton title={product.title} />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 font-mono">
            {compareAt > price && <s className="text-lg text-strike">{rs(compareAt)}</s>}
            <span className="text-3xl font-bold">{rs(price)}</span>
            {compareAt > price && (
              <span className="-rotate-3 rounded-full border-2 border-ink bg-slime px-2.5 py-0.5 text-xs font-bold">Save {rs(compareAt - price)}</span>
            )}
          </div>
          <p className="mt-2 text-sm text-ink/60">
            <Link href="/pages/shipping" className="underline">Shipping</Link> calculated at checkout.
          </p>

          <QtyBuy product={product} />

          <div className="card mt-6 divide-y-2 divide-ink/10 px-5">
            {DETAILS.map((d) => (
              <details key={d.title} className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 py-4 text-base font-bold">
                  <span aria-hidden className="w-5 text-center text-lg font-normal">{d.icon}</span>
                  <span className="flex-1">{d.title}</span>
                  <span aria-hidden className="flex size-7 items-center justify-center rounded-full border-2 border-ink text-lg leading-none transition-transform group-open:rotate-45 group-open:bg-slime">+</span>
                </summary>
                <ul className="flex list-disc flex-col gap-2 pb-5 pl-12 pr-4 text-sm leading-relaxed text-ink/75">
                  {d.body.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-bold md:text-base">
            <div className="flex rotate-1 items-center gap-3 rounded-2xl border-2 border-ink bg-sky p-4">
              <span aria-hidden className="text-2xl">🇮🇳</span>Proudly Made in India
            </div>
            <div className="flex -rotate-1 items-center gap-3 rounded-2xl border-2 border-ink bg-pop p-4">
              <span aria-hidden className="text-2xl">🚚</span>Shipped in 24 hours
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-4xl leading-none md:text-5xl">
            more <span className="text-pop">like this</span>
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-[17px] gap-y-10 md:grid-cols-4 md:gap-x-[31px]">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default function Page(props: PageProps<"/products/[slug]">) {
  return (
    <Shell>
      <Content {...props} />
    </Shell>
  );
}
