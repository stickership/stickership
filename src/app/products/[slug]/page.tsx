import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, listProducts, type Product } from "@/lib/catalog";
import { rs } from "@/lib/format";
import { Shell } from "@/components/Shell";
import { ProductCard } from "@/components/ProductCard";
import { QtyBuy } from "./QtyBuy";
import { ShareButton } from "./ShareButton";
import { Gallery } from "./Gallery";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">) {
  const p = await getProduct((await params).slug);
  if (!p) return { title: "Not found" };
  return {
    title: `${p.title} – Waterproof Vinyl Sticker`,
    description: describe(p).slice(0, 160),
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { type: "website", url: `/products/${p.slug}`, images: [p.image, ...p.images].map((url) => ({ url, alt: p.title })) },
  };
}

const describe = (p: Product) =>
  `${p.title} vinyl sticker${p.theme ? ` from our ${p.theme} collection` : ""} for ${rs(Number(p.price))}. Waterproof, scratch-proof and sized to fit within 3 × 3 inches, perfect for laptops, bottles and phones. Ships across India in 24 hours.`;

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

  const url = `https://stickership.shop/products/${product.slug}`;

  return (
    <div className="pb-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              "@id": `${url}#product`,
              name: product.title,
              description: describe(product),
              image: [product.image, ...product.images].map((src) => new URL(src, "https://stickership.shop").href),
              sku: product.slug,
              brand: { "@type": "Brand", name: "stickership" },
              category: product.theme ? `Stickers > ${product.theme}` : "Stickers",
              material: "Waterproof vinyl",
              offers: {
                "@type": "Offer",
                url,
                priceCurrency: "INR",
                price: price.toFixed(2),
                availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                itemCondition: "https://schema.org/NewCondition",
                seller: { "@type": "Organization", name: "stickership" },
                shippingDetails: {
                  "@type": "OfferShippingDetails",
                  shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
                  deliveryTime: {
                    "@type": "ShippingDeliveryTime",
                    handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
                    transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 7, unitCode: "DAY" },
                  },
                },
                hasMerchantReturnPolicy: {
                  "@type": "MerchantReturnPolicy",
                  applicableCountry: "IN",
                  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                  merchantReturnDays: 7,
                },
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://stickership.shop/" },
                { "@type": "ListItem", position: 2, name: "All Stickers", item: "https://stickership.shop/#shop" },
                { "@type": "ListItem", position: 3, name: product.title, item: url },
              ],
            },
          ],
        }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-3 pb-8 pt-8 font-mono text-xs text-ink/60">
        <Link href="/" className="hover:underline">Home</Link>
        <span aria-hidden>›</span>
        <Link href="/" className="hover:underline">All Stickers</Link>
        <span aria-hidden>›</span>
        <span className="truncate font-bold text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-14">
        <Gallery images={[product.image, ...product.images]} title={product.title} />

        <div className="lg:sticky lg:top-24 lg:self-start">
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
          <p className="mt-4 max-w-[560px] leading-relaxed text-ink/80">{describe(product)}</p>

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
