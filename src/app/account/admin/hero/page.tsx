import { heroContent } from "@/lib/catalog";
import { requireAdmin } from "@/lib/admin";
import { PageTitle } from "../_components/ui";
import { HeroForm } from "./HeroForm";

export default async function HeroPage() {
  const { supabase } = await requireAdmin();
  const [hero, { data: products }] = await Promise.all([
    heroContent(),
    supabase.from("products").select("id, title, image").eq("in_stock", true).order("position").limit(2000),
  ]);
  return (
    <>
      <PageTitle>Homepage hero</PageTitle>
      <HeroForm hero={hero} products={products ?? []} />
    </>
  );
}
