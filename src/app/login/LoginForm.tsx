"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const dest = next?.startsWith("/") && !next.startsWith("//") ? next : "/account";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<{ error: { message: string } | null }>, onOk: () => void) {
    setBusy(true);
    setError("");
    const { error } = await fn();
    setBusy(false);
    if (error) setError(error.message);
    else onOk();
  }

  if (!sent)
    return (
      <form
        className="mt-6 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => createClient().auth.signInWithOtp({ email, options: { shouldCreateUser: true } }), () => setSent(true));
        }}
      >
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="field" />
        {error && <p className="text-sm font-semibold text-pop">{error}</p>}
        <button disabled={busy} className="btn mt-2">
          {busy ? "Sending…" : "Send code"}
        </button>
      </form>
    );

  return (
    <form
      className="mt-6 flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const token = String(new FormData(e.currentTarget).get("code") ?? "").trim();
        run(
          () => createClient().auth.verifyOtp({ email, token, type: "email" }),
          () => {
            router.replace(dest);
            router.refresh();
          },
        );
      }}
    >
      <p className="text-sm">
        Code sent to <b>{email}</b>.{" "}
        <button type="button" className="underline" onClick={() => setSent(false)}>
          Change
        </button>
      </p>
      <input name="code" required inputMode="numeric" pattern="[0-9]{6,10}" autoComplete="one-time-code" placeholder="Enter code" className="field" />
      {error && <p className="text-sm font-semibold text-pop">{error}</p>}
      <button disabled={busy} className="btn mt-2">
        {busy ? "Verifying…" : "Verify & log in"}
      </button>
    </form>
  );
}
