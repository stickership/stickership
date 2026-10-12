import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/catalog";
import { rs } from "@/lib/format";
import { Shell } from "@/components/Shell";
import { QtyBuy } from "./QtyBuy";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">) {
  const p = await getProduct((await params).slug);
  return { title: p ? `${p.title} | stickership` : "Not found | stickership" };
}

async function Content({ params }: PageProps<"/products/[slug]">) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const price = Number(product.price);
  const compareAt = Number(product.compare_at ?? 0);

  return (
    <>
      <div className="grid gap-8 py-10 md:grid-cols-2 md:gap-14 md:py-16">
        <div className="relative aspect-square bg-media">
          <Image src={product.image} alt={product.title} fill priority sizes="(min-width:750px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="font-heading text-3xl font-bold tracking-[-0.5px] md:text-[40px] md:leading-[1.1]">{product.title}</h1>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-sale">{rs(price)}</span>
            {compareAt > price && (
              <>
                <s className="text-lg text-strike">{rs(compareAt)}</s>
                <span className="rounded-[16px] border border-[rgba(220,38,38,0.25)] bg-[rgb(254,242,242)] px-3 py-1 text-xs font-extrabold text-[rgb(220,38,38)]">
                  Save {rs(compareAt - price)}
                </span>
              </>
            )}
          </div>
          <QtyBuy product={product} />
          <ul className="mt-4 flex flex-col gap-2 text-sm text-black/70">
            <li>✔ Premium waterproof vinyl, matte finish</li>
            <li>✔ Fade-proof &amp; scratch-resistant</li>
            <li>✔ Ships in 24 hours across India</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default function Page(props: PageProps<"/products/[slug]">) {
  return (
    <Shell>
      <Content {...props} />
    </Shell>
  );
}
