/**
 * European countries data for shipping calculator
 *
 * Categorized by shipping regions:
 * - france: France (domestic)
 * - eu-schengen: EU Schengen Area
 * - eu-non-schengen: EU but not Schengen
 * - non-eu: European countries outside EU
 */

export type CountryRegion = "france" | "eu-schengen" | "eu-non-schengen" | "non-eu";

export interface Country {
  code: string;
  name: string;
  region: CountryRegion;
  flag: string; // Emoji flag
}

export const EUROPEAN_COUNTRIES: Country[] = [
  // France
  { code: "FR", name: "France", region: "france", flag: "🇫🇷" },

  // EU Schengen
  { code: "DE", name: "Allemagne", region: "eu-schengen", flag: "🇩🇪" },
  { code: "AT", name: "Autriche", region: "eu-schengen", flag: "🇦🇹" },
  { code: "BE", name: "Belgique", region: "eu-schengen", flag: "🇧🇪" },
  { code: "DK", name: "Danemark", region: "eu-schengen", flag: "🇩🇰" },
  { code: "ES", name: "Espagne", region: "eu-schengen", flag: "🇪🇸" },
  { code: "EE", name: "Estonie", region: "eu-schengen", flag: "🇪🇪" },
  { code: "FI", name: "Finlande", region: "eu-schengen", flag: "🇫🇮" },
  { code: "GR", name: "Grece", region: "eu-schengen", flag: "🇬🇷" },
  { code: "HU", name: "Hongrie", region: "eu-schengen", flag: "🇭🇺" },
  { code: "IT", name: "Italie", region: "eu-schengen", flag: "🇮🇹" },
  { code: "LV", name: "Lettonie", region: "eu-schengen", flag: "🇱🇻" },
  { code: "LT", name: "Lituanie", region: "eu-schengen", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", region: "eu-schengen", flag: "🇱🇺" },
  { code: "MT", name: "Malte", region: "eu-schengen", flag: "🇲🇹" },
  { code: "NL", name: "Pays-Bas", region: "eu-schengen", flag: "🇳🇱" },
  { code: "PL", name: "Pologne", region: "eu-schengen", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", region: "eu-schengen", flag: "🇵🇹" },
  { code: "CZ", name: "Republique tcheque", region: "eu-schengen", flag: "🇨🇿" },
  { code: "SK", name: "Slovaquie", region: "eu-schengen", flag: "🇸🇰" },
  { code: "SI", name: "Slovenie", region: "eu-schengen", flag: "🇸🇮" },
  { code: "SE", name: "Suede", region: "eu-schengen", flag: "🇸🇪" },

  // EU non-Schengen
  { code: "BG", name: "Bulgarie", region: "eu-non-schengen", flag: "🇧🇬" },
  { code: "HR", name: "Croatie", region: "eu-non-schengen", flag: "🇭🇷" },
  { code: "CY", name: "Chypre", region: "eu-non-schengen", flag: "🇨🇾" },
  { code: "IE", name: "Irlande", region: "eu-non-schengen", flag: "🇮🇪" },
  { code: "RO", name: "Roumanie", region: "eu-non-schengen", flag: "🇷🇴" },

  // Non-EU Europe
  { code: "CH", name: "Suisse", region: "non-eu", flag: "🇨🇭" },
  { code: "GB", name: "Royaume-Uni", region: "non-eu", flag: "🇬🇧" },
  { code: "NO", name: "Norvege", region: "non-eu", flag: "🇳🇴" },
  { code: "IS", name: "Islande", region: "non-eu", flag: "🇮🇸" },
].sort((a, b) => a.name.localeCompare(b.name, "fr"));

/**
 * Get country by code
 */
export function getCountryByCode(code: string): Country | undefined {
  return EUROPEAN_COUNTRIES.find((c) => c.code === code);
}

/**
 * Detect user's country from browser locale
 */
export function detectUserCountry(): string {
  if (typeof navigator === "undefined") return "FR";

  const locale = navigator.language || "fr-FR";
  const countryCode = locale.split("-")[1]?.toUpperCase();

  // Check if detected country is in our supported list
  const country = getCountryByCode(countryCode || "FR");
  return country ? country.code : "FR";
}
