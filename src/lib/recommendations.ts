import { Product } from "@/types/product";
import { products } from "@/data/products";

/**
 * Get related products based on intelligent recommendation logic
 *
 * Priority:
 * 1. Same category products (exclude current)
 * 2. Similar price range (±30%)
 * 3. Featured products as fallback
 *
 * Returns 4-6 randomized recommendations
 */
export function getRelatedProducts(
  currentProduct: Product,
  count: number = 6
): Product[] {
  // Filter out current product and out-of-stock items
  const availableProducts = products.filter(
    (p) => p.id !== currentProduct.id && p.inStock
  );

  // Primary: Same category
  const sameCategory = availableProducts.filter(
    (p) => p.category === currentProduct.category
  );

  // Secondary: Similar price range (±30%)
  const priceMin = currentProduct.price * 0.7;
  const priceMax = currentProduct.price * 1.3;
  const similarPrice = availableProducts.filter(
    (p) => p.price >= priceMin && p.price <= priceMax
  );

  // Tertiary: Featured products
  const featured = availableProducts.filter((p) => p.featured);

  // Build recommendation pool with priority
  let recommendations: Product[] = [];

  // Add same category first
  if (sameCategory.length > 0) {
    recommendations = [...sameCategory];
  }

  // Add similar price if we need more
  if (recommendations.length < count) {
    const uniqueSimilarPrice = similarPrice.filter(
      (p) => !recommendations.find((r) => r.id === p.id)
    );
    recommendations = [...recommendations, ...uniqueSimilarPrice];
  }

  // Add featured as fallback
  if (recommendations.length < count) {
    const uniqueFeatured = featured.filter(
      (p) => !recommendations.find((r) => r.id === p.id)
    );
    recommendations = [...recommendations, ...uniqueFeatured];
  }

  // Randomize selection for variety
  const shuffled = shuffleArray([...recommendations]);

  // Return 4-6 products (4 minimum, 6 maximum)
  const finalCount = Math.min(Math.max(shuffled.length, 4), count);
  return shuffled.slice(0, finalCount);
}

/**
 * Fisher-Yates shuffle for randomization
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
