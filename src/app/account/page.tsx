import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rs } from "@/lib/format";
import { isAdmin } from "@/lib/admin";

export const metadata = { title: "My account", robots: { index: false } };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (isAdmin(user)) redirect("/account/admin");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <>
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
    </>
  );
}

