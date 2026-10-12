import { requireAdmin } from "@/lib/admin";
import { PageTitle } from "../../_components/ui";
import { ProductForm } from "../ProductForm";
import { productOptions } from "../options";

export default async function NewProduct() {
  await requireAdmin();
  return (
    <>
      <PageTitle>New sticker</PageTitle>
      <ProductForm options={await productOptions()} />
    </>
  );
}
