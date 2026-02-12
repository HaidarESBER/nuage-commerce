import * as cheerio from 'cheerio';
import { SourceAdapter, ScrapeResult } from '@/types/scraper';

/**
 * AliExpress adapter: extracts product data from AliExpress HTML
 * NOTE: AliExpress uses heavy client-side rendering, so extraction from raw HTML is limited.
 * This adapter extracts what's available in meta tags and initial HTML.
 * For full extraction, a headless browser would be needed (future enhancement).
 */
export const aliexpressAdapter: SourceAdapter = {
  name: 'aliexpress',

  canHandle(url: string): boolean {
    return url.includes('aliexpress.com');
  },

  async extract(html: string, url: string): Promise<ScrapeResult> {
    const $ = cheerio.load(html);
    const result: ScrapeResult = {
      name: '',
    };

    // Extract external ID from URL
    // AliExpress URLs: https://www.aliexpress.com/item/{id}.html
    const idMatch = url.match(/\/item\/(\d+)\.html/);
    if (idMatch) {
      result.externalId = idMatch[1];
    }

    // Extract name from meta tags (most reliable for AliExpress)
    result.name =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="title"]').attr('content') ||
      $('title').text() ||
      'AliExpress Product';

    result.name = result.name.trim();
    // Remove "- AliExpress" suffix if present
    result.name = result.name.replace(/\s*-\s*AliExpress.*$/i, '').trim();

    // Extract description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content');

    if (description) {
      result.description = description.trim();
    }

    // Extract price
    // AliExpress embeds data in window.__INIT_DATA__ or window.runParams
    // Try to extract from scripts or meta tags
    const priceText = extractAliExpressPrice($, html);
    if (priceText) {
      result.priceText = priceText;
    }

    // Extract images from meta tags
    const images = extractAliExpressImages($);
    if (images.length > 0) {
      result.images = images;
    }

    // Extract category from breadcrumbs or meta
    const category = extractAliExpressCategory($);
    if (category) {
      result.category = category;
    }

    // Store metadata
    result.metadata = {
      sourceUrl: url,
      extractionMethod: 'aliexpress',
      externalId: result.externalId,
      note: 'Limited extraction from static HTML. Full data requires headless browser.',
    };

    return result;
  },
};

/**
 * Extract price from AliExpress page
 */
function extractAliExpressPrice($: cheerio.CheerioAPI, html: string): string | null {
  // Try og:price meta tags
  const priceAmount = $('meta[property="og:price:amount"]').attr('content');
  const priceCurrency = $('meta[property="og:price:currency"]').attr('content');

  if (priceAmount) {
    return priceCurrency ? `${priceAmount} ${priceCurrency}` : priceAmount;
  }

  // Try to extract from window.runParams or __INIT_DATA__
  // This is fragile but worth attempting for static HTML
  try {
    const runParamsMatch = html.match(/window\.runParams\s*=\s*(\{[\s\S]+?\});/);
    if (runParamsMatch) {
      const runParams = JSON.parse(runParamsMatch[1]);
      if (runParams.priceFrom || runParams.price) {
        const price = runParams.priceFrom || runParams.price;
        return `${price.min || price} USD`; // AliExpress typically uses USD in runParams
      }
    }
  } catch {
    // Ignore parsing errors
  }

  // Try price elements (may be empty without JS)
  const priceSelectors = [
    '.product-price-value',
    '[class*="price"]',
    '#j-sku-price',
    '.uniform-banner-box-price',
  ];

  for (const selector of priceSelectors) {
    const priceEl = $(selector).first();
    if (priceEl.length > 0) {
      const text = priceEl.text().trim();
      if (/[$€£¥]|\d+[.,]\d{2}/.test(text)) {
        return text;
      }
    }
  }

  return null;
}

/**
 * Extract images from AliExpress page
 */
function extractAliExpressImages($: cheerio.CheerioAPI): string[] {
  const images: string[] = [];

  // Try og:image (main product image)
  const ogImage = $('meta[property="og:image"]').attr('content');
  if (ogImage) {
    images.push(ogImage);
  }

  // Try to find gallery images
  // AliExpress uses various patterns like ae-thumb-img, image-view
  const imgElements = $(
    '.images-view-item img, .magnifier-image img, [class*="image"] img, [class*="gallery"] img'
  ).toArray();

  for (const img of imgElements) {
    const src =
      $(img).attr('src') ||
      $(img).attr('data-src') ||
      $(img).attr('data-image');

    if (src && isValidAliExpressImageUrl(src) && !images.includes(src)) {
      // Convert thumbnail to full size if possible
      const fullSizeUrl = src.replace(/_\d+x\d+\./, '.');
      images.push(fullSizeUrl);

      if (images.length >= 10) break;
    }
  }

  return images;
}

/**
 * Extract category from AliExpress page
 */
function extractAliExpressCategory($: cheerio.CheerioAPI): string | null {
  // Try breadcrumb navigation
  const breadcrumbLinks = $('.breadcrumb a, .nav-breadcrumb a, [class*="breadcrumb"] a').toArray();

  if (breadcrumbLinks.length > 1) {
    // Get second-to-last breadcrumb (last is usually the product)
    const categoryLink = breadcrumbLinks[breadcrumbLinks.length - 2];
    const category = $(categoryLink).text().trim();
    if (category && category.toLowerCase() !== 'aliexpress') {
      return category;
    }
  }

  // Try category meta tags
  const categoryMeta =
    $('meta[property="og:product:category"]').attr('content') ||
    $('meta[name="category"]').attr('content');

  if (categoryMeta) {
    return categoryMeta.trim();
  }

  return null;
}

/**
 * Validate AliExpress image URL
 */
function isValidAliExpressImageUrl(url: string): boolean {
  if (!url) return false;
  // Must be http(s) URL
  if (!url.startsWith('http')) return false;
  // AliExpress images are on ae01.alicdn.com or similar CDN domains
  const aliExpressImagePattern = /(alicdn\.com|ae\d+\.|\.jpg|\.jpeg|\.png|\.webp)/i;
  return aliExpressImagePattern.test(url);
}
