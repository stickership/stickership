const item = "inline whitespace-nowrap p-[5px] text-[14px] leading-[22.4px] md:text-[18px]";
const bricolage = `${item} font-heading font-bold md:leading-[23.4px]`;
const outfit = `${item} font-sans font-medium md:leading-[28.8px]`;

const gradient = {
  backgroundImage:
    "linear-gradient(133deg, rgb(250,220,54) 11%, rgb(254,98,146) 49%, rgb(250,220,54) 87%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as const;

export function Marquee() {
  return (
    <div className="flex h-[26px] gap-[30px] overflow-hidden bg-black text-white md:h-[29px]">
      <style>{`@keyframes marquee-gap{to{transform:translateX(calc(-100% - 30px))}}`}</style>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1 || undefined}
          className="flex min-w-full shrink-0 animate-[marquee-gap_12s_linear_infinite] items-center justify-around gap-[30px]"
        >
          <span className={bricolage}>🔥 India&apos;s Largest Sticker Brand</span>
          <span className={outfit} style={gradient}>💚 12 Lakh+ Happy Customers</span>
          <span className={bricolage}>🇮🇳 Made in India</span>
          <span className={outfit}>🚚 Ships in 24 Hrs</span>
        </div>
      ))}
    </div>
  );
}
