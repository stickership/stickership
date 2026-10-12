"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center font-sans">
      <h1 className="font-heading text-2xl font-bold">Something went wrong</h1>
      <p className="text-black/60">Please try again in a moment.</p>
      <button onClick={reset} className="rounded-md bg-black px-6 py-3 font-heading font-bold text-brand-yellow">
        Try again
      </button>
    </div>
  );
}
