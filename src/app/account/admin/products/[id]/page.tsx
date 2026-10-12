import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { PageTitle } from "../../_components/ui";
import { ProductForm } from "../ProductForm";
import { productOptions } from "../options";

export default async function EditProduct({ params }: PageProps<"/account/admin/products/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [{ data: product }, options] = await Promise.all([
    supabase.from("products").select("id, title, slug, image, price, compare_at, theme, style, type, in_stock, position").eq("id", id).maybeSingle(),
    productOptions(),
  ]);
  if (!product) notFound();
  return (
    <>
      <PageTitle>Edit sticker</PageTitle>
      <ProductForm product={product} options={options} />
    </>
  );
}
