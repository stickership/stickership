import Link from "next/link";
import { redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import { rs } from "@/lib/format";

export const metadata = { title: "My account | stickership" };

async function Content() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <>
      <div className="mx-auto max-w-[720px] py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-5xl leading-none">my account</h1>
          <form action={signOut}>
            <button className="rounded-full border-2 border-ink bg-white px-4 py-1.5 text-sm font-bold hover:bg-pop">Log out</button>
          </form>
        </div>
        <p className="mt-2 font-mono text-sm text-ink/60">{user.email}</p>
        <h2 className="mt-10 font-mono text-xs font-bold uppercase tracking-wider">Orders</h2>
        {!orders?.length ? (
          <p className="mt-3 text-sm text-ink/60">
            No orders yet. Orders placed with {user.email} while logged in show here. Placed one as a guest?{" "}
            <Link href="/track" className="underline">
              Track it
            </Link>
            .
          </p>
        ) : (
          <ul className="card mt-3 divide-y-2 divide-ink/10 overflow-hidden">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/orders/${o.id}`} className="flex items-center justify-between gap-3 px-5 py-4 text-sm hover:bg-slime/40">
                  <span className="font-mono">#{o.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-ink/60">{new Date(o.created_at).toLocaleDateString("en-IN")}</span>
                  <span className="capitalize">{o.status}</span>
                  <span className="font-mono font-bold">{rs(Number(o.total))}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Shell>
      <Content />
    </Shell>
  );
}
