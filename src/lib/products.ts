"use server";

import { promises as fs } from "fs";
import path from "path";
import { Product } from "@/types/product";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "products.json");

/**
 * Generate a slug from product name
 * Lowercase, replace spaces with hyphens, remove special chars
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
}

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Read products from JSON file
 */
async function readProductsFile(): Promise<Product[]> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data) as Product[];
  } catch (error) {
    // If file doesn't exist, return empty array
    // The sample data should be initialized from data/products.json
    console.error("Error reading products file:", error);
    return [];
  }
}

/**
 * Write products to JSON file
 */
async function writeProductsFile(products: Product[]): Promise<void> {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(products, null, 2), "utf-8");
}

/**
 * Get all products
 */
export async function getAllProducts(): Promise<Product[]> {
  return readProductsFile();
}

/**
 * Get a product by its ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const products = await readProductsFile();
  return products.find((p) => p.id === id) ?? null;
}

/**
 * Get a product by its slug
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await readProductsFile();
  return products.find((p) => p.slug === slug);
}

/**
 * Get all product slugs (for static generation)
 */
export async function getAllProductSlugs(): Promise<string[]> {
  const products = await readProductsFile();
  return products.map((p) => p.slug);
}

/**
 * Create a new product
 * Auto-generates id and slug
 */
export async function createProduct(
  data: Omit<Product, "id" | "slug">
): Promise<Product> {
  const products = await readProductsFile();

  const newProduct: Product = {
    ...data,
    id: generateUUID(),
    slug: slugify(data.name),
  };

  // Ensure unique slug
  const slugBase = newProduct.slug;
  let slugCounter = 1;
  while (products.some((p) => p.slug === newProduct.slug)) {
    newProduct.slug = `${slugBase}-${slugCounter}`;
    slugCounter++;
  }

  products.push(newProduct);
  await writeProductsFile(products);

  return newProduct;
}

/**
 * Update an existing product
 */
export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  const products = await readProductsFile();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error(`Product with id ${id} not found`);
  }

  // If name changed, regenerate slug
  let updatedSlug = products[index].slug;
  if (data.name && data.name !== products[index].name) {
    updatedSlug = slugify(data.name);
    // Ensure unique slug (excluding current product)
    const slugBase = updatedSlug;
    let slugCounter = 1;
    while (products.some((p, i) => i !== index && p.slug === updatedSlug)) {
      updatedSlug = `${slugBase}-${slugCounter}`;
      slugCounter++;
    }
  }

  const updatedProduct: Product = {
    ...products[index],
    ...data,
    id, // Ensure id cannot be changed
    slug: updatedSlug,
  };

  products[index] = updatedProduct;
  await writeProductsFile(products);

  return updatedProduct;
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(id: string): Promise<void> {
  const products = await readProductsFile();
  const filteredProducts = products.filter((p) => p.id !== id);

  if (filteredProducts.length === products.length) {
    throw new Error(`Product with id ${id} not found`);
  }

  await writeProductsFile(filteredProducts);
}

/**
 * Get product statistics for admin dashboard
 */
export async function getProductStats(): Promise<{
  total: number;
  featured: number;
  outOfStock: number;
}> {
  const products = await readProductsFile();
  return {
    total: products.length,
    featured: products.filter((p) => p.featured).length,
    outOfStock: products.filter((p) => !p.inStock).length,
  };
}
