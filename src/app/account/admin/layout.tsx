import { requireAdmin } from "@/lib/admin";

export const metadata = { title: "Admin | stickership", robots: { index: false } };

export default async function AdminLayout({ children }: LayoutProps<"/account/admin">) {
  await requireAdmin();
  return children;
}
