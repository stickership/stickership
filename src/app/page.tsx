import { Suspense } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { Marquee } from "@/components/Marquee";
import { CollectionToolbar } from "@/components/CollectionToolbar";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";
import { facetCounts, listProducts, type Filters } from "@/lib/catalog";

const KEYS = ["theme", "style", "type", "availability", "sort"] as const;

async function Collection({ searchParams }: PageProps<"/">) {
  const sp = await searchParams;
  const filters: Filters = Object.fromEntries(
    KEYS.flatMap((k) => (typeof sp[k] === "string" && sp[k] ? [[k, (sp[k] as string).slice(0, 500)]] : [])),
  );
  const [products, counts] = await Promise.all([listProducts(filters), facetCounts()]);
  return (
    <>
      <CollectionToolbar counts={counts} />
      <ProductGrid key={JSON.stringify(filters)} initial={products} filters={filters} />
    </>
  );
}

export default function Home(props: PageProps<"/">) {
  return (
    <div className="pb-[60px] md:pb-0">
      <AnnouncementBar />
      <Header />
      <main>
        <HeroBanner />
        <Marquee />
        <div className="mx-auto max-w-[1600px] px-[15px] pt-[3px] md:pt-[5px] md:px-[50px]">
          <Suspense fallback={<div className="h-[600px]" />}>
            <Collection {...props} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
