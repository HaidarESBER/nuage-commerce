import { Metadata } from "next";
import { Container } from "@/components/ui";
import { ProduitsClientEnhanced } from "./ProduitsClientEnhanced";
import { getAllProducts } from "@/lib/products";
import {
  ProductCategory,
} from "@/types/product";

export const metadata: Metadata = {
  title: "Produits | Nuage",
  description:
    "Découvrez notre collection de chichas premium, bols, tuyaux, charbon et accessoires. Qualité supérieure pour une expérience unique.",
};

interface ProduitsPageProps {
  searchParams: Promise<{ categorie?: string }>;
}

export default async function ProduitsPage({ searchParams }: ProduitsPageProps) {
  const params = await searchParams;
  const categoryParam = params.categorie as ProductCategory | undefined;

  // Validate category parameter
  const validCategories: ProductCategory[] = [
    "chicha",
    "bol",
    "tuyau",
    "charbon",
    "accessoire",
  ];
  const isValidCategory =
    categoryParam && validCategories.includes(categoryParam);
  const activeCategory = isValidCategory ? categoryParam : null;

  // Load products from JSON file
  const products = await getAllProducts();

  return (
    <main className="py-12 lg:py-16">
      <Container size="lg">
        <ProduitsClientEnhanced products={products} activeCategory={activeCategory} />
      </Container>
    </main>
  );
}
