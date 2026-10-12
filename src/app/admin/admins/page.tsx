import { requireAdmin } from "@/lib/admin";
import { card, PageTitle, when } from "../_components/ui";
import { AdminRow, InviteForm } from "./AdminControls";

export default async function AdminsPage() {
  const { supabase, user } = await requireAdmin();
  const [{ data: admins }, { data: invites }] = await Promise.all([
    supabase.from("admins").select("user_id, email, created_at").order("created_at"),
    supabase.from("admin_invites").select("email, created_at").order("created_at"),
  ]);
  const active = new Set(admins?.map((a) => a.email.toLowerCase()));
  const pending = invites?.filter((i) => !active.has(i.email)) ?? [];

  return (
    <>
      <PageTitle>Admins</PageTitle>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <section className={`${card} p-0`}>
          <ul className="divide-y divide-black/5 text-sm">
            {admins?.map((a) => (
              <AdminRow key={a.user_id} label={a.email} sub={`Admin since ${when(a.created_at)}`} userId={a.user_id} self={a.user_id === user.id} />
            ))}
            {pending.map((i) => (
              <AdminRow key={i.email} label={i.email} sub="Invited · becomes admin on first login" email={i.email} />
            ))}
          </ul>
        </section>
        <section className={card}>
          <h2 className="font-heading text-lg font-bold">Add admin</h2>
          <p className="mt-1 text-sm text-black/60">They log in at /login with this email and get admin access automatically.</p>
          <InviteForm />
        </section>
      </div>
    </>
  );
}
