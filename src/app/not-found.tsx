import Link from "next/link";
import { Shell } from "@/components/Shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-heading text-3xl font-bold">Page not found</h1>
        <Link href="/" className="rounded-md bg-black px-6 py-3 font-heading font-bold text-brand-yellow">
          Back to stickers
        </Link>
      </div>
    </Shell>
  );
}
