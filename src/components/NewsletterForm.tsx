"use client";

import { useActionState } from "react";
import { subscribe } from "@/app/actions";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, null);
  return (
    <>
      <form
        action={action}
        className="mt-5 flex h-14 w-[460px] max-w-full gap-2 rounded-full border-2 border-white/20 bg-panel p-1.5 focus-within:border-slime"
      >
        <label htmlFor="footer-email" className="sr-only">Email</label>
        <input
          id="footer-email"
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-white/40"
        />
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-full bg-slime px-5 text-sm font-bold text-ink transition-transform hover:-rotate-2 disabled:opacity-60"
        >
          {pending ? "…" : "Subscribe"}
        </button>
      </form>
      {state && <p className={`mt-3 text-sm ${state.ok ? "text-slime" : "text-pop"}`}>{state.message}</p>}
    </>
  );
}
