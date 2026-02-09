import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  /** Number of columns on desktop (default: 3) */
  columns?: 2 | 3 | 4;
}

/**
 * ProductGrid component arranges ProductCards in a responsive grid
 *
 * Responsive behavior:
 * - Mobile: 1 column
 * - Tablet (sm): 2 columns
 * - Desktop (lg+): columns prop (2, 3, or 4)
 *
 * @example
 * <ProductGrid products={products} columns={3} />
 */
export function ProductGrid({ products, columns = 3 }: ProductGridProps) {
  const columnClasses: Record<2 | 3 | 4, string> = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${columnClasses[columns]} gap-6 lg:gap-8`}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          // Priority load first 3 images for above-the-fold content
          priority={index < 3}
        />
      ))}
    </div>
  );
}
