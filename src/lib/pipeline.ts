"use server";

import { createProduct } from "@/lib/products";
import { getDraftById, updateDraft, updateDraftStatus, createDraft } from "@/lib/curation";
import { batchTranslate } from "@/lib/ai/translate-product";
import {
  getEffectiveName,
  getEffectiveDescription,
  getEffectiveShortDescription,
  getEffectiveCategory,
  getEffectivePrice,
  getEffectiveImages,
  ProductDraft,
} from "@/types/curation";
import { ProductCategory } from "@/types/product";

/**
 * Publish an approved draft to the products table.
 * Creates a real product from the effective values (curated > AI > raw).
 */
export async function publishDraft(draftId: string) {
  const draft = await getDraftById(draftId);
  if (!draft) {
    throw new Error(`Draft not found: ${draftId}`);
  }
  if (draft.status !== "approved") {
    throw new Error(`Draft must be approved to publish. Current status: ${draft.status}`);
  }

  const category = getEffectiveCategory(draft);
  if (!category) {
    throw new Error("Cannot publish: no category set (neither curated nor AI-generated)");
  }

  const price = getEffectivePrice(draft);
  if (!price) {
    throw new Error("Cannot publish: no price set (neither curated nor AI-suggested)");
  }

  const product = await createProduct({
    name: getEffectiveName(draft),
    description: getEffectiveDescription(draft),
    shortDescription: getEffectiveShortDescription(draft),
    category: category as ProductCategory,
    price,
    compareAtPrice: draft.curatedCompareAtPrice ?? undefined,
    images: getEffectiveImages(draft),
    inStock: true,
    featured: false,
  });

  await updateDraft(draftId, {
    status: "published",
    publishedProductId: product.id,
    publishedAt: new Date().toISOString(),
  });

  return product;
}

/**
 * Full pipeline cycle: translate pending drafts.
 * Called by Vercel Cron or manually from admin UI.
 */
export async function processPipeline(): Promise<{
  translated: number;
  errors: number;
  errorDetails: string[];
}> {
  const result = await batchTranslate(5);
  console.log(
    `[Pipeline] ${result.translated} translated, ${result.errors} errors`
  );
  return result;
}

/**
 * Create a new product draft from scraped product data.
 * Bridge between Phase 12 scraper output and Phase 13 curation pipeline.
 */
export async function createDraftFromScrapedProduct(scrapedData: {
  name: string;
  description?: string;
  priceText?: string;
  images?: string[];
  sourceUrl?: string;
  sourceName?: string;
  scrapedProductId?: string;
}): Promise<ProductDraft> {
  return createDraft({
    rawName: scrapedData.name,
    rawDescription: scrapedData.description || null,
    rawPriceText: scrapedData.priceText || null,
    rawImages: scrapedData.images || [],
    rawSourceUrl: scrapedData.sourceUrl || null,
    rawSourceName: scrapedData.sourceName || null,
    scrapedProductId: scrapedData.scrapedProductId || null,
    status: "pending_translation",
  });
}
