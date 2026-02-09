import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createProduct } from "@/lib/products";
import { ProductCategory } from "@/types/product";
import { ProductForm } from "@/components/admin";

async function handleCreate(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const shortDescription = formData.get("shortDescription") as string;
  const description = formData.get("description") as string;
  const priceStr = formData.get("price") as string;
  const compareAtPriceStr = formData.get("compareAtPrice") as string;
  const category = formData.get("category") as ProductCategory;
  const imagesStr = formData.get("images") as string;
  const inStock = formData.get("inStock") === "on";
  const featured = formData.get("featured") === "on";

  // Convert EUR to cents
  const price = Math.round(parseFloat(priceStr) * 100);
  const compareAtPrice = compareAtPriceStr
    ? Math.round(parseFloat(compareAtPriceStr) * 100)
    : undefined;

  // Parse images
  const images = imagesStr
    ? imagesStr
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
    : [];

  await createProduct({
    name,
    shortDescription: shortDescription || "",
    description: description || "",
    price,
    compareAtPrice,
    category,
    images,
    inStock,
    featured,
  });

  revalidatePath("/admin/produits");
  revalidatePath("/produits");
  redirect("/admin/produits");
}

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/produits"
          className="text-primary/70 hover:text-primary transition-colors"
        >
          &larr; Retour
        </Link>
      </div>

      <h2 className="text-2xl font-heading font-semibold text-primary">
        Nouveau Produit
      </h2>

      {/* Form */}
      <ProductForm onSubmit={handleCreate} />
    </div>
  );
}
