"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const field = "h-12 w-full rounded-md border border-black/15 px-4 outline-none focus:border-black";
const btn = "h-12 rounded-md bg-black font-heading font-bold text-brand-yellow disabled:opacity-60";

export function LoginForm() {
  const router = useRouter();
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
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={field} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button disabled={busy} className={btn}>
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
            router.replace("/account");
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
      <input name="code" required inputMode="numeric" pattern="[0-9]{6,10}" autoComplete="one-time-code" placeholder="Enter code" className={field} />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button disabled={busy} className={btn}>
        {busy ? "Verifying…" : "Verify & log in"}
      </button>
    </form>
  );
}
