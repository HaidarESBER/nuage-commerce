"use server";

import { ScrapedProduct, SourceAdapter } from "@/types/scraper";
import {
  createScrapedProduct,
  getScrapedProductByUrl,
} from "@/lib/scraper/data";
import { aliexpressAdapter } from "@/lib/scraper/adapters/aliexpress";
import { genericAdapter } from "@/lib/scraper/adapters/generic";

// =============================================================================
// Adapter Registry
// =============================================================================

/**
 * Registered adapters in priority order.
 * First matching adapter handles the URL.
 */
const adapters: SourceAdapter[] = [
  aliexpressAdapter, // Specific adapters first
  genericAdapter,    // Generic fallback last
];

// =============================================================================
// Scraping Engine
// =============================================================================

/**
 * Scrape a single URL and save to database.
 * Handles deduplication, extraction, and error handling.
 */
export async function scrapeUrl(url: string): Promise<ScrapedProduct> {
  // 1. Check dedup: if URL already scraped, return existing
  const existing = await getScrapedProductByUrl(url);
  if (existing) {
    return existing;
  }

  try {
    // 2. Fetch HTML
    const html = await fetchHtml(url);

    // 3. Find matching adapter
    const adapter = adapters.find((a) => a.canHandle(url));
    if (!adapter) {
      throw new Error("No adapter found for URL");
    }

    // 4. Extract data
    const result = await adapter.extract(html, url);

    // 5. Save to database
    const scraped = await createScrapedProduct({
      sourceUrl: url,
      sourceName: adapter.name,
      externalId: result.externalId || null,
      rawName: result.name,
      rawDescription: result.description || null,
      rawPriceText: result.priceText || null,
      rawImages: result.images || [],
      rawCategory: result.category || null,
      rawMetadata: result.metadata || {},
      scrapeStatus: "success",
      errorMessage: null,
      sentToCuration: false,
      draftId: null,
    });

    return scraped;
  } catch (error) {
    // Handle fetch/extraction errors: save with failed status
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    const scraped = await createScrapedProduct({
      sourceUrl: url,
      sourceName: "unknown",
      externalId: null,
      rawName: `Failed: ${url}`,
      rawDescription: null,
      rawPriceText: null,
      rawImages: [],
      rawCategory: null,
      rawMetadata: { error: errorMessage },
      scrapeStatus: "failed",
      errorMessage,
      sentToCuration: false,
      draftId: null,
    });

    return scraped;
  }
}

/**
 * Scrape multiple URLs sequentially with rate limiting.
 * Returns results and errors separately.
 */
export async function scrapeUrls(
  urls: string[]
): Promise<{
  results: ScrapedProduct[];
  errors: { url: string; error: string }[];
}> {
  const results: ScrapedProduct[] = [];
  const errors: { url: string; error: string }[] = [];

  for (const url of urls) {
    try {
      const scraped = await scrapeUrl(url);
      results.push(scraped);

      // Rate limiting: 1 second delay between requests
      if (urls.indexOf(url) < urls.length - 1) {
        await sleep(1000);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      errors.push({ url, error: errorMessage });
    }
  }

  return { results, errors };
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Fetch HTML from a URL with timeout and User-Agent
 */
async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return html;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout after 10 seconds");
    }

    throw error;
  }
}

/**
 * Sleep for given milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
