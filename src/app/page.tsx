import { getAllProducts } from "@/lib/products";
import { HomeClient } from "./HomeClient";

/**
 * Homepage with cinematic video hero and featured products
 *
 * Features:
 * - Full-screen video hero with smoke reveal effect
 * - Text overlay with shadows (no card background)
 * - Featured products section showcasing premium items
 * - French content throughout
 */
export default async function Home() {
  // Load products from JSON file
  const allProducts = await getAllProducts();
  const featuredProducts = allProducts.filter((p) => p.featured);

  return <HomeClient featuredProducts={featuredProducts} />;
}
