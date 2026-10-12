import Link from "next/link";
import { Shell } from "@/components/Shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p aria-hidden className="font-display text-[120px] leading-none text-pop [paint-order:stroke_fill] [-webkit-text-stroke:12px_white]">404</p>
        <h1 className="text-2xl font-bold">This page peeled off.</h1>
        <Link href="/" className="btn">
          Back to stickers
        </Link>
      </div>
    </Shell>
  );
}
