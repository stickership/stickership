import Image from "next/image";

const alt = "Festive Fever Sale – stickers at just ₹10";

export function HeroBanner() {
  return (
    <section className="w-full bg-[#fafafa]">
      <Image
        src="/images/hero-desktop.webp"
        alt={alt}
        width={1920}
        height={982}
        priority
        sizes="100vw"
        className="hidden h-auto w-full object-cover md:block"
      />
      <Image
        src="/images/hero-mobile.webp"
        alt={alt}
        width={750}
        height={502}
        priority
        sizes="100vw"
        className="block h-auto w-full object-cover md:hidden"
      />
    </section>
  );
}
