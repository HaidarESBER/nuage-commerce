/**
 * AI Translation Service for Nuage Product Curation
 *
 * Takes raw scraped product data and produces brand-consistent premium French copy
 * using the Anthropic Claude API. All operations are server-side only.
 */

import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, buildTranslationPrompt, VALID_CATEGORIES, TranslationResult } from './prompts';
import { getDraftById, getDraftsByStatus, updateDraft } from '@/lib/curation';

const AI_MODEL = 'claude-sonnet-4-5-20250929';

/**
 * Translate a raw product into premium French copy using Claude API
 *
 * @param rawProduct - Raw product data from scraping
 * @returns Structured translation result with name, description, category, and price
 * @throws Error if API call fails or response cannot be parsed
 */
export async function translateProduct(rawProduct: {
  rawName: string;
  rawDescription: string | null;
  rawPriceText: string | null;
  rawSourceName: string | null;
}): Promise<TranslationResult> {
  const client = new Anthropic();

  const message = await client.messages.create({
    model: AI_MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildTranslationPrompt(rawProduct),
      },
    ],
  });

  // Extract text from response
  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in AI response');
  }

  // Parse JSON from response (handle potential markdown code blocks)
  let jsonStr = textBlock.text.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error(`Failed to parse AI response as JSON: ${jsonStr.substring(0, 200)}`);
  }

  // Validate required fields
  if (!parsed.name || typeof parsed.name !== 'string') {
    throw new Error('AI response missing or invalid "name" field');
  }
  if (!parsed.description || typeof parsed.description !== 'string') {
    throw new Error('AI response missing or invalid "description" field');
  }
  if (!parsed.shortDescription || typeof parsed.shortDescription !== 'string') {
    throw new Error('AI response missing or invalid "shortDescription" field');
  }
  if (!parsed.category || typeof parsed.category !== 'string') {
    throw new Error('AI response missing or invalid "category" field');
  }
  if (typeof parsed.suggestedPriceCents !== 'number' || parsed.suggestedPriceCents <= 0) {
    throw new Error('AI response missing or invalid "suggestedPriceCents" field');
  }

  // Validate category is one of the allowed values
  if (!VALID_CATEGORIES.includes(parsed.category as typeof VALID_CATEGORIES[number])) {
    throw new Error(
      `AI response has invalid category "${parsed.category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`
    );
  }

  // Validate suggestedPriceCents is a positive integer
  if (!Number.isInteger(parsed.suggestedPriceCents)) {
    throw new Error(
      `AI response has non-integer suggestedPriceCents: ${parsed.suggestedPriceCents}`
    );
  }

  return {
    name: parsed.name,
    description: parsed.description,
    shortDescription: parsed.shortDescription,
    category: parsed.category,
    suggestedPriceCents: parsed.suggestedPriceCents,
  };
}

/**
 * Translate a draft and save the AI results back to the database
 *
 * @param draftId - UUID of the product draft to translate
 * @returns Updated product draft with AI fields populated
 */
export async function translateAndSaveDraft(draftId: string) {
  // Fetch draft
  const draft = await getDraftById(draftId);
  if (!draft) {
    throw new Error(`Draft not found: ${draftId}`);
  }

  // Update status to 'translating'
  await updateDraft(draftId, { status: 'translating' });

  try {
    // Call AI translation
    const result = await translateProduct({
      rawName: draft.rawName,
      rawDescription: draft.rawDescription,
      rawPriceText: draft.rawPriceText,
      rawSourceName: draft.rawSourceName,
    });

    // Save AI results
    const updated = await updateDraft(draftId, {
      aiName: result.name,
      aiDescription: result.description,
      aiShortDescription: result.shortDescription,
      aiCategory: result.category,
      aiSuggestedPrice: result.suggestedPriceCents,
      status: 'translated',
      translatedAt: new Date().toISOString(),
      aiModel: AI_MODEL,
      translationError: null,
    });

    return updated;
  } catch (error) {
    // On error: save error message, reset status to pending for retry
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Translation failed for draft ${draftId}:`, errorMessage);

    const updated = await updateDraft(draftId, {
      translationError: errorMessage,
      status: 'pending_translation',
    });

    return updated;
  }
}

/**
 * Batch translate pending drafts with rate limit awareness
 *
 * Processes drafts sequentially with a 1-second delay between calls
 * to avoid hitting Anthropic API rate limits.
 *
 * @param limit - Maximum number of drafts to process (default: 5)
 * @returns Summary of batch operation results
 */
export async function batchTranslate(
  limit: number = 5
): Promise<{ translated: number; errors: number; errorDetails: string[] }> {
  const pendingDrafts = await getDraftsByStatus('pending_translation');
  const toProcess = pendingDrafts.slice(0, limit);

  let translated = 0;
  let errors = 0;
  const errorDetails: string[] = [];

  for (let i = 0; i < toProcess.length; i++) {
    const draft = toProcess[i];

    try {
      await translateAndSaveDraft(draft.id);
      translated++;
    } catch (error) {
      errors++;
      const message = error instanceof Error ? error.message : String(error);
      errorDetails.push(`Draft ${draft.id} (${draft.rawName}): ${message}`);

      // If rate limited (429), stop processing remaining drafts
      if (message.includes('429') || message.toLowerCase().includes('rate limit')) {
        errorDetails.push('Rate limited - stopping batch to avoid further 429 errors');
        break;
      }
    }

    // Add 1-second delay between calls (except after last one)
    if (i < toProcess.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return { translated, errors, errorDetails };
}
