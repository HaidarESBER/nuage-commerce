import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import {
  getProductBySlug,
  getAllProductSlugs,
} from "@/data/products";
import { formatPrice, categoryLabels } from "@/types/product";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all product pages
 */
export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate metadata per product
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produit non trouvé | Nuage",
    };
  }

  return {
    title: `${product.name} | Nuage`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <main className="py-12 lg:py-16">
      <Container size="lg">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li>
              <Link href="/produits" className="hover:text-primary transition-colors">
                Produits
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/produits?categorie=${product.category}`}
                className="hover:text-primary transition-colors"
              >
                {categoryLabels[product.category]}
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary">{product.name}</li>
          </ol>
        </nav>

        {/* Two-column layout on desktop */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image section - sticky on desktop */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            {/* Main image */}
            <div className="relative aspect-square bg-background-secondary rounded-[--radius-card] overflow-hidden mb-4">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {/* Sale badge */}
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-error text-background text-sm font-medium px-3 py-1.5 rounded">
                  Promo
                </div>
              )}
            </div>

            {/* Image gallery thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`
                      relative w-20 h-20 flex-shrink-0 rounded-[--radius-button] overflow-hidden
                      border-2 ${index === 0 ? "border-accent" : "border-transparent hover:border-muted"}
                      transition-colors
                    `}
                    title={`Image ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details section */}
          <div>
            {/* Product name */}
            <h1 className="text-3xl lg:text-4xl text-primary mb-4">
              {product.name}
            </h1>

            {/* Price display */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl lg:text-3xl font-medium text-primary">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            {/* Short description */}
            <p className="text-muted text-lg mb-6">{product.shortDescription}</p>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-6">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  product.inStock ? "bg-success" : "bg-error"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  product.inStock ? "text-success" : "text-error"
                }`}
              >
                {product.inStock ? "Stock disponible" : "Rupture de stock"}
              </span>
            </div>

            {/* Add to cart button */}
            <div className="mb-8">
              <AddToCartButton product={product} />
            </div>

            {/* Divider */}
            <hr className="border-background-secondary mb-8" />

            {/* Full description */}
            <div>
              <h2 className="text-xl text-primary mb-4">Description</h2>
              <div className="prose prose-neutral max-w-none">
                <p className="text-text leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Category link */}
            <div className="mt-8 pt-8 border-t border-background-secondary">
              <p className="text-sm text-muted">
                Catégorie:{" "}
                <Link
                  href={`/produits?categorie=${product.category}`}
                  className="text-primary hover:text-accent transition-colors"
                >
                  {categoryLabels[product.category]}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
