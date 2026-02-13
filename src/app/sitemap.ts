import { MetadataRoute } from 'next';
import { getAllProductSlugs } from '@/lib/products';
import { getAllPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nuage.fr';

  // Homepage
  const homepage = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  // Category pages
  const categories = ['chicha', 'bol', 'tuyau', 'charbon', 'accessoire'];
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/produits?categorie=${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Products listing
  const productsListing = [
    {
      url: `${baseUrl}/produits`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  // Product detail pages
  const productSlugs = await getAllProductSlugs();
  const productPages = productSlugs.map((slug) => ({
    url: `${baseUrl}/produits/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Blog listing page
  const blogListing = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ];

  // Blog posts
  const posts = getAllPosts();
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Legal pages
  const legalPages = [
    {
      url: `${baseUrl}/cgv`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  return [
    ...homepage,
    ...categoryPages,
    ...productsListing,
    ...productPages,
    ...blogListing,
    ...blogPages,
    ...legalPages,
  ];
}
