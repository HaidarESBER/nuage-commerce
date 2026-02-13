import { Metadata } from "next";
import { Container } from "@/components/ui";
import { ProduitsClientEnhanced } from "./ProduitsClientEnhanced";
import { getAllProducts } from "@/lib/products";
import { getProductRatingStats } from "@/lib/reviews";
import {
  ProductCategory,
} from "@/types/product";

export const metadata: Metadata = {
  title: "Produits | Nuage",
  description:
    "Découvrez notre collection de chichas premium, bols, tuyaux, charbon et accessoires. Qualité supérieure pour une expérience unique.",
};

interface ProduitsPageProps {
  searchParams: Promise<{ categorie?: string; q?: string }>;
}

export default async function ProduitsPage({ searchParams }: ProduitsPageProps) {
  const params = await searchParams;
  const categoryParam = params.categorie as ProductCategory | undefined;
  const searchQuery = params.q || '';

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

  // Load products from database
  const products = await getAllProducts();

  // Fetch ratings for all products
  const ratingsMap = new Map();
  await Promise.all(
    products.map(async (product) => {
      const stats = await getProductRatingStats(product.id);
      if (stats) {
        ratingsMap.set(product.id, stats);
      }
    })
  );

  return (
    <main className="py-12 lg:py-16">
      <Container size="lg">
        <ProduitsClientEnhanced
          products={products}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          ratingsMap={Object.fromEntries(ratingsMap)}
        />
      </Container>
    </main>
  );
}
