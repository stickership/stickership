import { Shell } from "@/components/Shell";
import { TrackForm } from "./TrackForm";

export const metadata = { title: "Track your order | stickership" };

export default function TrackPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-[480px] py-16">
        <h1 className="font-heading text-3xl font-bold">Track your order</h1>
        <p className="mt-2 text-sm text-black/60">Enter the order ID from your confirmation and the email you used at checkout.</p>
        <TrackForm />
      </div>
    </Shell>
  );
}
