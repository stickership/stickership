import { Shell } from "@/components/Shell";
import { TrackForm } from "./TrackForm";

export const metadata = { title: "Track your order | stickership" };

export default function TrackPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-[480px] py-16">
        <h1 className="font-display text-5xl leading-none">where&apos;s my <span className="text-pop">stuff?</span></h1>
        <p className="mt-3 text-sm text-ink/60">Enter the order ID from your confirmation and the email you used at checkout.</p>
        <TrackForm />
      </div>
    </Shell>
  );
}
