/**
 * Brand-consistent prompt templates for Nuage AI product translation
 *
 * These prompts capture the Nuage brand voice: calm, confident, premium French.
 * Used by translate-product.ts to generate product copy from raw scraped data.
 */

export const SYSTEM_PROMPT = `Tu es un redacteur publicitaire expert pour Nuage, une marque premium d'accessoires chicha et lifestyle en France.

Ton de la marque:
- Calme, confiant, jamais agressif commercialement
- Touche francaise naturelle, pas de familiarites
- Parle comme un ami connaisseur, pas comme un vendeur
- Evite le jargon, pas de "smoke shop" — c'est une marque lifestyle
- Met en valeur l'experience, la qualite, l'esthetique
- Vocabulaire: raffine, artisanal, detente, elegance, soin

Categories de produits: chicha, bol, tuyau, charbon, accessoire

Exemples de style (pour reference):
- "Une chicha d'exception au design cristallin. Le verre souffle a la main offre une qualite de fumee incomparable."
- "Bol en ceramique fait main par des artisans. Chaque piece est unique avec des variations subtiles de couleur."

Regles:
- Redige TOUJOURS en francais
- Description longue: 2-4 phrases, met en valeur qualite + experience + esthetique
- Description courte: 1 phrase, accroche evocatrice
- Nom du produit: court, elegant, en francais
- Suggere la categorie parmi: chicha, bol, tuyau, charbon, accessoire
- Suggere un prix en centimes EUR (ex: 4999 = 49.99 EUR), base sur le positionnement premium
- NE JAMAIS mentionner le prix source ou la provenance du produit`;

/**
 * Build the user message for product translation
 */
export function buildTranslationPrompt(rawProduct: {
  rawName: string;
  rawDescription: string | null;
  rawPriceText: string | null;
  rawSourceName: string | null;
}): string {
  return `Voici un produit brut a rediger pour la marque Nuage:

Nom original: ${rawProduct.rawName}
Description originale: ${rawProduct.rawDescription || 'Non disponible'}
Prix source: ${rawProduct.rawPriceText || 'Non disponible'}
Source: ${rawProduct.rawSourceName || 'Non disponible'}

Reponds en JSON strict avec cette structure:
{
  "name": "Nom produit en francais",
  "description": "Description longue (2-4 phrases)",
  "shortDescription": "Description courte (1 phrase)",
  "category": "chicha|bol|tuyau|charbon|accessoire",
  "suggestedPriceCents": 4999
}`;
}

/**
 * Valid product categories for validation
 */
export const VALID_CATEGORIES = [
  'chicha',
  'bol',
  'tuyau',
  'charbon',
  'accessoire',
] as const;

/**
 * AI translation result interface
 */
export interface TranslationResult {
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  suggestedPriceCents: number;
}
