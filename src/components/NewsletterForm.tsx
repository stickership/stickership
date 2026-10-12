"use client";

import { useActionState } from "react";
import { subscribe } from "@/app/actions";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, null);
  return (
    <>
      <form
        action={action}
        className="mt-5 flex h-20 w-[500px] max-w-full justify-between gap-2.5 rounded-lg bg-panel p-2.5 shadow-[0_1px_2px_0_rgba(255,255,255,0.06),0_1px_3px_0_rgba(255,255,255,0.1)]"
      >
        <label htmlFor="footer-email" className="sr-only">Email</label>
        <input
          id="footer-email"
          type="email"
          name="email"
          required
          placeholder="Email"
          className="h-[60px] min-w-0 flex-1 rounded-lg bg-transparent p-[15px] text-[14px] font-semibold leading-[21px] text-white outline-none placeholder:text-white"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-[60px] cursor-pointer rounded-md border border-brand-yellow bg-brand-yellow px-[22px] py-[11px] font-heading text-[14px] font-bold leading-[16.8px] text-black shadow-[0_1px_2px_0_rgba(255,255,255,0.05)] disabled:opacity-60"
        >
          {pending ? "…" : "Subscribe"}
        </button>
      </form>
      {state && <p className={`mt-3 text-sm ${state.ok ? "text-brand-yellow" : "text-red-400"}`}>{state.message}</p>}
    </>
  );
}
