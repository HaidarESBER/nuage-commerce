/**
 * Product scraping type definitions for the sourcing pipeline
 */

export type ScrapeStatus = 'success' | 'partial' | 'failed';

/**
 * ScrapedProduct: Raw product data extracted from external sources
 */
export interface ScrapedProduct {
  id: string;

  // Source tracking
  sourceUrl: string;
  sourceName: string;
  externalId: string | null;

  // Raw extracted data
  rawName: string;
  rawDescription: string | null;
  rawPriceText: string | null;
  rawImages: string[];
  rawCategory: string | null;
  rawMetadata: Record<string, unknown>;

  // Scraping metadata
  scrapeStatus: ScrapeStatus;
  errorMessage: string | null;

  // Curation pipeline linkage
  sentToCuration: boolean;
  draftId: string | null;

  createdAt: string;
  updatedAt: string;
}

/**
 * ScrapeResult: Output from a source adapter's extract() method
 */
export interface ScrapeResult {
  name: string;
  description?: string;
  priceText?: string;
  images?: string[];
  category?: string;
  metadata?: Record<string, unknown>;
  externalId?: string;
}

/**
 * SourceAdapter: Interface for site-specific scraping adapters
 */
export interface SourceAdapter {
  name: string;
  canHandle(url: string): boolean;
  extract(html: string, url: string): Promise<ScrapeResult>;
}
