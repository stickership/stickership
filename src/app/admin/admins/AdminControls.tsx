"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useTransition } from "react";
import { inviteAdmin, removeAdmin, removeInvite } from "../actions";
import { btn, input } from "../_components/ui";

export function InviteForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(inviteAdmin, null);
  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);
  return (
    <form action={action} className="mt-4 flex flex-col gap-2">
      <input name="email" type="email" required placeholder="email@example.com" className={input} />
      <button disabled={pending} className={btn}>
        {pending ? "Adding…" : "Add admin"}
      </button>
      {state && !state.ok && <p className="text-sm text-red-700">{state.error}</p>}
      {state?.ok && <p className="text-sm text-green-700">Added.</p>}
    </form>
  );
}

export function AdminRow({ label, sub, userId, email, self }: { label: string; sub: string; userId?: string; email?: string; self?: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const remove = () =>
    confirm(`Remove ${label}?`) &&
    start(async () => {
      const res = userId ? await removeAdmin(userId) : await removeInvite(email!);
      if (res.ok) router.refresh();
      else alert(res.error);
    });
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">
          {label} {self && <span className="text-xs font-normal text-black/40">(you)</span>}
        </p>
        <p className="text-xs text-black/50">{sub}</p>
      </div>
      {!self && (
        <button disabled={pending} onClick={remove} className="text-xs text-red-600 underline disabled:opacity-50">
          Remove
        </button>
      )}
    </li>
  );
}
