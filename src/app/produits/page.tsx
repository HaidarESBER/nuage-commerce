import { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui";
import { getAllProducts } from "@/lib/products";
import { indexProducts } from "@/lib/search/flexsearch";
import { buildSearchQuery } from "@/lib/search";
import { FracturedCategories } from "@/components/home/FracturedCategories";
import { ProductSearch } from "@/components/product/ProductSearch";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductCategory } from "@/types/product";
import type { SortOption } from "@/types/search";

export const metadata: Metadata = {
  title: "Produits | Nuage",
  description:
    "Découvrez notre collection de chichas premium, bols, tuyaux, charbon et accessoires. Qualité supérieure pour une expérience unique.",
};

interface ProduitsPageProps {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProduitsPage(props: ProduitsPageProps) {
  const params = await props.searchParams;
  const query = params?.q || '';
  const category = params?.category as ProductCategory | undefined;
  const page = Number(params?.page) || 1;

  // Load all products
  const products = await getAllProducts();

  // Index products with FlexSearch
  indexProducts(products);

  // Execute search with filters
  const searchResult = await buildSearchQuery(products, {
    q: query,
    category,
    minPrice: params?.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params?.maxPrice ? Number(params.maxPrice) : undefined,
    sort: params?.sort as SortOption,
    page,
  });

  return (
    <main className="py-12 lg:py-16">
      <Container size="lg">
        <div className="space-y-6">
          {/* Desktop: Title + Fractured Categories */}
          <div className="hidden md:block">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-primary tracking-wide text-center mb-6">
              Découvrez notre collection
            </h1>
            <div className="h-[25vh] overflow-hidden mb-8">
              <FracturedCategories textPosition="top" />
            </div>
          </div>

          {/* Search */}
          <Suspense fallback={<SearchSkeleton />}>
            <ProductSearch defaultValue={query} />
          </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <Suspense fallback={<FiltersSkeleton />}>
                <ProductFilters
                  facets={searchResult.facets}
                  selectedCategory={category}
                />
              </Suspense>
            </aside>

            {/* Product Grid */}
            <div className="lg:col-span-3">
              <Suspense key={query + category + page} fallback={<GridSkeleton />}>
                <ProductGrid
                  products={searchResult.products}
                  total={searchResult.total}
                  currentPage={page}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

// Loading skeletons
function SearchSkeleton() {
  return (
    <div className="w-full max-w-2xl h-12 bg-background-card rounded-[--radius-button] animate-pulse" />
  );
}

function FiltersSkeleton() {
  return (
    <div className="bg-background-card rounded-[--radius-card] p-6 space-y-4">
      <div className="h-6 bg-background-secondary rounded animate-pulse" />
      <div className="h-32 bg-background-secondary rounded animate-pulse" />
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-96 bg-background-card rounded-[--radius-card] animate-pulse" />
      ))}
    </div>
  );
}
