import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { ProductGrid } from "@/components/product";
import {
  products,
  getProductsByCategory,
} from "@/data/products";
import {
  ProductCategory,
  categoryLabels,
} from "@/types/product";

export const metadata: Metadata = {
  title: "Produits | Nuage",
  description:
    "Découvrez notre collection de chichas premium, bols, tuyaux, charbon et accessoires. Qualité supérieure pour une expérience unique.",
};

interface ProduitsPageProps {
  searchParams: Promise<{ categorie?: string }>;
}

/**
 * Category filter button component
 */
function CategoryButton({
  category,
  label,
  isActive,
}: {
  category: string | null;
  label: string;
  isActive: boolean;
}) {
  const href = category ? `/produits?categorie=${category}` : "/produits";

  return (
    <Link
      href={href}
      className={`
        inline-flex items-center justify-center px-4 py-2 text-sm font-medium
        rounded-[--radius-button] transition-colors whitespace-nowrap
        ${
          isActive
            ? "bg-accent text-primary"
            : "bg-transparent border border-primary text-primary hover:bg-primary hover:text-background"
        }
      `}
    >
      {label}
    </Link>
  );
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

  // Get filtered products
  const filteredProducts = activeCategory
    ? getProductsByCategory(activeCategory)
    : products;

  return (
    <main className="py-12 lg:py-16">
      <Container size="lg">
        {/* Page header */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-4xl lg:text-5xl text-primary mb-4">
            Nos Produits
          </h1>
          <p className="text-muted text-lg max-w-2xl">
            Une sélection raffinée de chichas et accessoires pour les amateurs
            exigeants.
          </p>
        </div>

        {/* Category filters */}
        <div className="mb-8 lg:mb-10">
          <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
            <CategoryButton
              category={null}
              label="Tous"
              isActive={!activeCategory}
            />
            {validCategories.map((cat) => (
              <CategoryButton
                key={cat}
                category={cat}
                label={categoryLabels[cat]}
                isActive={activeCategory === cat}
              />
            ))}
          </div>
        </div>

        {/* Products grid or empty state */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} columns={3} />
        ) : (
          <div className="text-center py-16">
            <p className="text-muted text-lg">
              Aucun produit dans cette catégorie
            </p>
            <Link
              href="/produits"
              className="inline-flex items-center justify-center mt-4 px-6 py-3 text-sm font-medium bg-primary text-background rounded-[--radius-button] hover:bg-accent hover:text-primary transition-colors"
            >
              Voir tous les produits
            </Link>
          </div>
        )}
      </Container>
    </main>
  );
}
