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
          <h1 className="font-heading text-3xl font-bold">My account</h1>
          <form action={signOut}>
            <button className="text-sm underline">Log out</button>
          </form>
        </div>
        <p className="mt-1 text-sm text-black/60">{user.email}</p>
        <h2 className="mt-10 font-heading text-lg font-bold">Orders</h2>
        {!orders?.length ? (
          <p className="mt-3 text-sm text-black/60">
            No orders yet. Orders placed with {user.email} while logged in show here. Placed one as a guest?{" "}
            <Link href="/track" className="underline">
              Track it
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-black/10 border-y border-black/10">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/orders/${o.id}`} className="flex items-center justify-between py-4 text-sm hover:bg-media">
                  <span className="font-mono">#{o.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-black/60">{new Date(o.created_at).toLocaleDateString("en-IN")}</span>
                  <span className="capitalize">{o.status}</span>
                  <span className="font-semibold">{rs(Number(o.total))}</span>
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
