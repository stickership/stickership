import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { Marquee } from "@/components/Marquee";
import { CollectionToolbar } from "@/components/CollectionToolbar";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="pb-[60px] md:pb-0">
      <AnnouncementBar />
      <Header />
      <main>
        <HeroBanner />
        <Marquee />
        <div className="mx-auto max-w-[1600px] px-[15px] pt-[3px] md:pt-[5px] md:px-[50px]">
          <CollectionToolbar />
          <ProductGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
}
