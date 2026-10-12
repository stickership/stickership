import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { btn, btnGhost, card, PageTitle, when } from "../_components/ui";
import { RemoveButton } from "./RemoveButton";

const PER_PAGE = 100;

export default async function SubscribersPage({ searchParams }: PageProps<"/account/admin/subscribers">) {
  const { supabase } = await requireAdmin();
  const page = Math.max(0, Number((await searchParams).page) || 0);
  const { data: subs, count } = await supabase
    .from("subscribers")
    .select("email, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * PER_PAGE, page * PER_PAGE + PER_PAGE - 1);
  const pages = Math.ceil((count ?? 0) / PER_PAGE);

  return (
    <>
      <PageTitle
        action={
          <a href="/account/admin/subscribers/export" className={btn}>
            Export CSV
          </a>
        }
      >
        Subscribers <span className="text-base font-medium text-black/40">({count ?? 0})</span>
      </PageTitle>
      <div className={`${card} p-0`}>
        {!subs?.length ? (
          <p className="py-12 text-center text-sm text-black/50">No subscribers yet.</p>
        ) : (
          <ul className="divide-y divide-black/5 text-sm">
            {subs.map((s) => (
              <li key={s.email} className="flex items-center gap-3 px-4 py-3">
                <span className="min-w-0 flex-1 truncate font-medium">{s.email}</span>
                <span className="text-black/50">{when(s.created_at)}</span>
                <RemoveButton email={s.email} />
              </li>
            ))}
          </ul>
        )}
      </div>
      {pages > 1 && (
        <div className="mt-4 flex justify-center gap-3">
          {page > 0 && (
            <Link href={`/account/admin/subscribers?page=${page - 1}`} className={btnGhost}>
              ← Prev
            </Link>
          )}
          {page + 1 < pages && (
            <Link href={`/account/admin/subscribers?page=${page + 1}`} className={btnGhost}>
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
