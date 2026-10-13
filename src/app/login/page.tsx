import Link from "next/link";
import { redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in", robots: { index: false } };

async function Content({ searchParams }: PageProps<"/login">) {
  const next = (await searchParams).next;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/account");
  return (
    <div className="card mx-auto my-10 grid max-w-[960px] overflow-hidden md:my-16 md:grid-cols-2">
      <div className="mat relative hidden flex-col justify-between overflow-hidden border-r-2 border-ink p-10 text-white md:flex">
        <p className="font-display text-5xl leading-[0.95] text-ink [paint-order:stroke_fill] [-webkit-text-stroke:10px_white]">
          your stash,
          <br />
          <span className="text-pop">saved.</span>
        </p>
        <div aria-hidden className="relative h-40">
          {[
            ["✦", "bg-slime", "left-2 top-6 -rotate-12"],
            ["★", "bg-pop", "left-28 top-0 rotate-6"],
            ["☻", "bg-sky", "left-52 top-10 -rotate-6"],
            ["♥", "bg-white", "left-16 top-24 rotate-12"],
          ].map(([g, bg, pos]) => (
            <span key={g} className={`absolute flex size-20 items-center justify-center rounded-full border-[5px] border-white text-4xl text-ink shadow-[0_8px_16px_-6px_rgb(21_17_28/0.5)] ${bg} ${pos}`}>
              {g}
            </span>
          ))}
        </div>
        <ul className="flex flex-col gap-2 text-sm text-white/90">
          <li>✓ See every order in one place</li>
          <li>✓ Checkout with your email filled in</li>
          <li>✓ No password to forget</li>
        </ul>
      </div>
      <div className="p-6 sm:p-10">
        <h1 className="font-display text-5xl leading-none">log in</h1>
        <p className="mt-3 text-sm text-ink/60">New here? Same button. We&apos;ll set up your account automatically.</p>
        <LoginForm />
        <p className="mt-8 text-xs text-ink/50">
          By continuing you agree to our{" "}
          <Link href="/pages/terms" className="underline">Terms</Link> and{" "}
          <Link href="/pages/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

export default function Page(props: PageProps<"/login">) {
  return (
    <Shell>
      <Content {...props} />
    </Shell>
  );
}
