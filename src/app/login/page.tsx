import { redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in | stickership" };

async function Content({ searchParams }: PageProps<"/login">) {
  const next = (await searchParams).next;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/account");
  return (
    <>
      <div className="mx-auto max-w-[420px] py-16">
        <h1 className="font-display text-5xl leading-none">log in</h1>
        <p className="mt-3 text-sm text-ink/60">We&apos;ll email you a 6-digit code. No password needed.</p>
        <LoginForm />
      </div>
    </>
  );
}

export default function Page(props: PageProps<"/login">) {
  return (
    <Shell>
      <Content {...props} />
    </Shell>
  );
}
