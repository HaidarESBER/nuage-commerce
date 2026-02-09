import Image from "next/image";
import Link from "next/link";
import { Product, formatPrice } from "@/types/product";

interface ProductCardProps {
  product: Product;
  /** Use priority loading for above-the-fold images */
  priority?: boolean;
}

/**
 * ProductCard component displays a single product in the catalog
 *
 * Features:
 * - 16:9 aspect ratio image with hover scale effect
 * - Product name in heading font
 * - Price display with sale price support
 * - "Voir" button with accent hover
 * - Entire card links to product detail page
 *
 * @example
 * <ProductCard product={product} priority={true} />
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group block bg-background-card rounded-[--radius-card] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image container with 16:9 aspect ratio */}
      <div className="relative aspect-video overflow-hidden bg-background-secondary">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
        />
        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
            <span className="text-background font-medium text-sm uppercase tracking-wide">
              Rupture de stock
            </span>
          </div>
        )}
        {/* Sale badge */}
        {hasDiscount && product.inStock && (
          <div className="absolute top-3 left-3 bg-error text-background text-xs font-medium px-2 py-1 rounded">
            Promo
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product name */}
        <h3 className="font-heading text-lg text-primary line-clamp-1 mb-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-medium text-primary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <div className="flex justify-end">
          <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-[--radius-button] group-hover:bg-accent group-hover:border-accent group-hover:text-primary transition-colors">
            Voir
          </span>
        </div>
      </div>
    </Link>
  );
}
