import { redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { AccountNav } from "./AccountNav";

async function Frame({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");
  return (
    <div className="mx-auto grid max-w-[1280px] gap-8 py-10 md:grid-cols-[230px_minmax(0,1fr)] md:py-14">
      <AccountNav email={user.email ?? ""} admin={isAdmin(user)} />
      <section className="min-w-0">{children}</section>
    </div>
  );
}

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <Shell>
      <Frame>{children}</Frame>
    </Shell>
  );
}
