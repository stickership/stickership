"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center font-sans">
      <h1 className="font-display text-4xl">well, that broke</h1>
      <p className="text-ink/60">Something went wrong loading this page. Try again in a moment.</p>
      <button onClick={reset} className="btn">
        Try again
      </button>
    </div>
  );
}
