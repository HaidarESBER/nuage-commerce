import { MetadataRoute } from 'next';
import { getAllProductSlugs } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nuage.fr';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/produits`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/panier`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/favoris`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/comparaison`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    },
  ];

  // Product pages
  const productSlugs = await getAllProductSlugs();
  const productPages = productSlugs.map((slug) => ({
    url: `${baseUrl}/produits/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
