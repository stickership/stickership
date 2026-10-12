"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { removeSubscriber } from "../actions";

export function RemoveButton({ email }: { email: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm(`Remove ${email}?`)) return;
        start(async () => {
          if ((await removeSubscriber(email)).ok) router.refresh();
        });
      }}
      className="text-xs text-red-600 underline disabled:opacity-50"
    >
      Remove
    </button>
  );
}
