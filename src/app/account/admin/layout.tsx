import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "./_components/AdminNav";

export const metadata = { title: "Admin | stickership", robots: { index: false } };

async function Gate({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return (
    <div className="min-h-screen bg-[#f6f6f7] font-sans text-black lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="bg-black text-white lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center justify-between px-5 py-5 lg:block">
          <Link href="/admin" className="font-heading text-2xl font-extrabold tracking-[-1px] text-brand-yellow">
            stickership
          </Link>
          <p className="text-xs text-white/50 lg:mt-1">Admin · {user.email}</p>
        </div>
        <AdminNav />
      </aside>
      <main className="min-w-0 px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-black/40">Loading admin…</div>}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}
