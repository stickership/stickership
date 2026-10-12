"use client";

import { useActionState } from "react";
import { trackOrder } from "@/app/actions";

export function TrackForm() {
  const [state, action, pending] = useActionState(trackOrder, null);
  return (
    <form action={action} className="mt-6 flex flex-col gap-3">
      <input name="id" required placeholder="Order ID" className="field" />
      <input name="email" type="email" required placeholder="Email" className="field" />
      {state?.message && <p className="text-sm font-semibold text-pop">{state.message}</p>}
      <button disabled={pending} className="btn mt-2">
        {pending ? "Looking up…" : "Track order"}
      </button>
    </form>
  );
}
