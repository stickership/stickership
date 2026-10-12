import Link from "next/link";
import { redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import { rs } from "@/lib/format";
import { isAdmin } from "@/lib/admin";

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
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const tab = "flex shrink-0 items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-bold transition-colors";

  return (
    <div className="mx-auto grid max-w-[1040px] gap-8 py-10 md:grid-cols-[230px_1fr] md:py-14">
      <aside className="md:sticky md:top-24 md:self-start">
        <p className="truncate font-mono text-xs text-ink/60">{user.email}</p>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
          <Link href="/account" aria-current="page" className={`${tab} border-ink bg-ink text-slime`}>
            📦 My orders
          </Link>
          <Link href="/track" className={`${tab} border-ink/15 bg-white hover:border-ink`}>
            🔎 Track an order
          </Link>
          {isAdmin(user) && (
            <Link href="/admin" className={`${tab} border-ink bg-pop text-ink shadow-[3px_3px_0_var(--color-ink)] hover:-translate-y-0.5`}>
              🛠 Admin panel
            </Link>
          )}
          <form action={signOut} className="md:mt-4">
            <button className={`${tab} w-full border-ink/15 bg-transparent text-ink/70 hover:border-ink hover:text-ink`}>Log out</button>
          </form>
        </nav>
      </aside>

      <section className="min-w-0">
        <h1 className="font-display text-5xl leading-none">my orders</h1>
        {!orders?.length ? (
          <div className="card mt-6 flex flex-col items-start gap-4 p-6">
            <p className="text-sm text-ink/70">
              No orders yet. Orders placed with {user.email} while logged in show here. Placed one as a guest?{" "}
              <Link href="/track" className="font-semibold underline">
                Track it
              </Link>
              .
            </p>
            <Link href="/#shop" className="btn">
              Shop stickers
            </Link>
          </div>
        ) : (
          <ul className="card mt-6 divide-y-2 divide-ink/10 overflow-hidden">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/orders/${o.id}`} className="grid grid-cols-2 items-center gap-x-3 gap-y-1 px-5 py-4 text-sm hover:bg-slime/40 sm:grid-cols-4">
                  <span className="font-mono font-bold">#{o.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-right text-ink/60 sm:text-left">{new Date(o.created_at).toLocaleDateString("en-IN")}</span>
                  <span className="capitalize">{o.status}</span>
                  <span className="text-right font-mono font-bold">{rs(Number(o.total))}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <Shell>
      <Content />
    </Shell>
  );
}
