"use client";

import { useActionState } from "react";
import { trackOrder } from "@/app/actions";

const field = "h-12 w-full rounded-md border border-black/15 px-4 outline-none focus:border-black";

export function TrackForm() {
  const [state, action, pending] = useActionState(trackOrder, null);
  return (
    <form action={action} className="mt-6 flex flex-col gap-3">
      <input name="id" required placeholder="Order ID" className={field} />
      <input name="email" type="email" required placeholder="Email" className={field} />
      {state?.message && <p className="text-sm text-red-700">{state.message}</p>}
      <button disabled={pending} className="h-12 rounded-md bg-black font-heading font-bold text-brand-yellow disabled:opacity-60">
        {pending ? "Looking up…" : "Track order"}
      </button>
    </form>
  );
}
