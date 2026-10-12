"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const dest = next?.startsWith("/") && !next.startsWith("//") ? next : "/account";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(params.get("error") ? "Google sign-in didn't finish. Try again or use your email." : "");
  const [busy, setBusy] = useState<"" | "google" | "email" | "code">("");

  useEffect(() => {
    const reset = (e: PageTransitionEvent) => e.persisted && setBusy("");
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  async function run(what: typeof busy, fn: () => Promise<{ error: { message: string } | null }>, onOk: () => void) {
    setBusy(what);
    setError("");
    const { error } = await fn();
    if (error) {
      setBusy("");
      setError(error.message);
    } else onOk();
  }

  const google = () =>
    run(
      "google",
      () =>
        createClient().auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(dest)}` },
        }),
      () => {},
    );

  if (!sent)
    return (
      <div className="mt-8 flex flex-col gap-4">
        <button
          type="button"
          onClick={google}
          disabled={!!busy}
          className="flex h-12 items-center justify-center gap-3 rounded-full border-2 border-ink bg-white font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <GoogleIcon />
          {busy === "google" ? "Opening Google…" : "Continue with Google"}
        </button>
        <div className="flex items-center gap-3 font-mono text-xs uppercase text-ink/50">
          <span className="h-0.5 flex-1 bg-ink/10" />
          or use email
          <span className="h-0.5 flex-1 bg-ink/10" />
        </div>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            run(
              "email",
              () => createClient().auth.signInWithOtp({ email, options: { shouldCreateUser: true } }),
              () => {
                setBusy("");
                setSent(true);
              },
            );
          }}
        >
          <label htmlFor="login-email" className="sr-only">Email</label>
          <input id="login-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="field" />
          {error && <p className="text-sm font-semibold text-pop">{error}</p>}
          <button disabled={!!busy} className="btn mt-1">
            {busy === "email" ? "Sending…" : "Email me a code"}
          </button>
        </form>
      </div>
    );

  return (
    <form
      className="mt-8 flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const token = String(new FormData(e.currentTarget).get("code") ?? "").trim();
        run(
          "code",
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
        <button type="button" className="font-semibold underline" onClick={() => setSent(false)}>
          Change
        </button>
      </p>
      <label htmlFor="login-code" className="sr-only">Login code</label>
      <input
        id="login-code"
        name="code"
        required
        autoFocus
        inputMode="numeric"
        pattern="[0-9]{6,10}"
        autoComplete="one-time-code"
        placeholder="••••••"
        className="field h-16 text-center font-mono text-3xl font-bold tracking-[0.4em]"
      />
      {error && <p className="text-sm font-semibold text-pop">{error}</p>}
      <button disabled={!!busy} className="btn mt-1">
        {busy === "code" ? "Checking…" : "Log in"}
      </button>
      <p className="text-xs text-ink/50">Can&apos;t find it? Check spam, or wait a minute and resend.</p>
    </form>
  );
}
