import Image from "next/image";
import { EyeIcon } from "@/components/icons";
import type { Product } from "@/data/products";

const rs = (n: number) => `Rs. ${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export function ProductCard({ title, image, price, compareAt }: Product) {
  const save = rs(compareAt - price);
  return (
    <div className="group relative transition-transform duration-500 lg:hover:-translate-y-[13px]">
      <div className="relative aspect-square overflow-hidden bg-media">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width:990px) 25vw, (min-width:750px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 lg:group-hover:scale-[1.03]"
        />
        <button
          type="button"
          aria-label="Quick view"
          className="absolute bottom-[15px] left-1/2 hidden size-11 -translate-x-1/2 items-center justify-center rounded-[14px] bg-white/85 p-3 text-black opacity-0 shadow-[0_1px_1px_0_rgba(0,0,0,0.1)] transition-opacity duration-300 lg:flex lg:group-hover:opacity-100"
        >
          <EyeIcon width={18} height={18} />
        </button>
      </div>
      <span className="absolute -right-[10px] top-2 z-[2] rounded-[16px] border border-[rgba(220,38,38,0.25)] bg-[rgb(254,242,242)] px-[13px] py-[7px] font-sans text-[10px] font-extrabold leading-[10px] tracking-[0.3px] text-[rgb(220,38,38)]">
        Save {save}
      </span>
      <div className="mt-5">
        <h3 className="my-[5px] font-heading text-sm font-bold leading-[18.2px] tracking-[-0.072px] text-black md:text-lg md:leading-[23.4px]">
          {title}
        </h3>
        <div className="mt-[10px] flex flex-col">
          <div className="flex items-center">
            <s className="font-sans text-sm font-medium leading-[22.4px] text-strike">{rs(compareAt)}</s>
            <span className="ml-[5px] rounded-[3px] bg-black/5 px-2 py-1 font-sans text-[10px] font-medium leading-[10px] text-black">
              -{save}
            </span>
          </div>
          <span className="font-sans text-base font-semibold leading-[25.6px] text-sale">{rs(price)}</span>
        </div>
      </div>
      <div className="mt-[10px] flex justify-center transition-[opacity,transform] duration-300 lg:absolute lg:inset-x-0 lg:top-full z-[2] lg:translate-y-[10px] lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
        <button
          type="button"
          className="h-[37px] w-full rounded-md border border-black bg-black/90 px-[17px] py-[9px] font-heading text-sm font-bold leading-[16.8px] text-brand-yellow shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] lg:w-[250px]"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
