import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { btnGhost, PageTitle } from "../../_components/ui";
import { ImportForm } from "./ImportForm";

export default async function ImportPage() {
  await requireAdmin();
  return (
    <>
      <PageTitle
        action={
          <Link href="/account/admin/products" className={btnGhost}>
            ← Products
          </Link>
        }
      >
        Import CSV
      </PageTitle>
      <ImportForm />
    </>
  );
}
