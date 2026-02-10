import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getAllProductSlugs,
} from "@/lib/products";
import { getProductRatingStats } from "@/data/reviews";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateOpenGraphTags,
  generateTwitterCardTags
} from "@/lib/seo";
import { ProductDetailClient } from "./ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all product pages
 */
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate metadata per product
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produit non trouvé | Nuage",
    };
  }

  const productUrl = `https://nuage.fr/produits/${product.slug}`;
  const ogTags = generateOpenGraphTags({
    title: product.name,
    description: product.shortDescription,
    image: product.images[0],
    url: productUrl,
    type: "product",
    price: product.price,
    currency: "EUR"
  });

  const twitterTags = generateTwitterCardTags({
    title: product.name,
    description: product.shortDescription,
    image: product.images[0]
  });

  return {
    title: `${product.name} | Nuage`,
    description: product.shortDescription,
    alternates: {
      canonical: productUrl
    },
    openGraph: {
      title: ogTags["og:title"],
      description: ogTags["og:description"],
      url: ogTags["og:url"],
      type: "website",
      locale: ogTags["og:locale"],
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTags["twitter:title"],
      description: twitterTags["twitter:description"],
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch all products for related products recommendations
  const { getAllProducts } = await import("@/lib/products");
  const allProducts = await getAllProducts();

  // Generate structured data
  const ratingStats = getProductRatingStats(product.id);
  const productSchema = generateProductSchema(product, ratingStats || undefined);

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Produits", url: "/produits" },
    { name: product.name, url: `/produits/${product.slug}` }
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ProductDetailClient product={product} allProducts={allProducts} />
    </>
  );
}
