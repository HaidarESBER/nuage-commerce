import { Product } from "@/types/product";

/**
 * SEO utilities for generating structured data (JSON-LD) and meta tags
 *
 * Implements Schema.org structured data for:
 * - Product pages (Product schema with offers and ratings)
 * - Organization (business info)
 * - Breadcrumbs (navigation hierarchy)
 *
 * Also provides Open Graph and Twitter Card meta tag generation
 */

/**
 * Generate Product schema (Schema.org Product)
 * For product detail pages
 */
export function generateProductSchema(product: Product, ratingStats?: {
  averageRating: number;
  totalReviews: number;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.shortDescription || product.description,
    "image": product.images,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Nuage"
    },
    "offers": {
      "@type": "Offer",
      "price": (product.price / 100).toFixed(2),
      "priceCurrency": "EUR",
      "availability": product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "url": `https://nuage.fr/produits/${product.slug}`,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    }
  };

  // Add aggregate rating if available
  if (ratingStats && ratingStats.totalReviews > 0) {
    (schema as any).aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": ratingStats.averageRating.toFixed(1),
      "reviewCount": ratingStats.totalReviews
    };
  }

  return schema;
}

/**
 * Generate Organization schema (for root layout)
 * Business information and branding
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nuage",
    "description": "L'art de la detente - Boutique en ligne d'accessoires chicha haut de gamme",
    "url": "https://nuage.fr",
    "logo": "https://nuage.fr/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "areaServed": "FR",
      "availableLanguage": "French"
    },
    "sameAs": [
      // Placeholder for future social media links
      // "https://facebook.com/nuage",
      // "https://instagram.com/nuage"
    ]
  };
}

/**
 * Generate Breadcrumb schema
 * For product pages to show navigation hierarchy
 */
export function generateBreadcrumbSchema(items: Array<{
  name: string;
  url: string;
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://nuage.fr${item.url}`
    }))
  };
}

/**
 * Generate Open Graph meta tags for social sharing
 */
export function generateOpenGraphTags(config: {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: "website" | "product";
  price?: number;
  currency?: string;
}) {
  const tags = {
    "og:title": config.title,
    "og:description": config.description,
    "og:url": config.url,
    "og:type": config.type || "website",
    "og:locale": "fr_FR",
  };

  if (config.image) {
    (tags as any)["og:image"] = config.image;
    (tags as any)["og:image:alt"] = config.title;
  }

  if (config.type === "product" && config.price !== undefined) {
    (tags as any)["og:price:amount"] = (config.price / 100).toFixed(2);
    (tags as any)["og:price:currency"] = config.currency || "EUR";
  }

  return tags;
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterCardTags(config: {
  title: string;
  description: string;
  image?: string;
}) {
  const tags = {
    "twitter:card": "summary_large_image",
    "twitter:title": config.title,
    "twitter:description": config.description,
  };

  if (config.image) {
    (tags as any)["twitter:image"] = config.image;
  }

  return tags;
}

/**
 * Helper to inject JSON-LD script tag
 * Usage in Next.js metadata API:
 *   <script type="application/ld+json">{JSON.stringify(schema)}</script>
 */
export function jsonLdScriptProps(schema: any) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(schema) }
  };
}
