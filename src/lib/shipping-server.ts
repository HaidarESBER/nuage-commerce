"use server";

import { promises as fs } from "fs";
import path from "path";
import { CountryRegion } from "@/data/countries";
import { ShippingMethod, ShippingRate } from "./shipping";

/**
 * Shipping rates by region and method
 */
type ShippingRates = Record<CountryRegion, Record<ShippingMethod, ShippingRate>>;

const DATA_FILE_PATH = path.join(process.cwd(), "data", "shipping-rates.json");

/**
 * Read shipping rates from JSON file
 */
async function readShippingRates(): Promise<ShippingRates> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data) as ShippingRates;
  } catch (error) {
    console.error("Error reading shipping rates file:", error);
    // Return default rates if file doesn't exist
    return getDefaultShippingRates();
  }
}

/**
 * Write shipping rates to JSON file
 */
async function writeShippingRates(rates: ShippingRates): Promise<void> {
  const dataDir = path.dirname(DATA_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(rates, null, 2), "utf-8");
}

/**
 * Get default shipping rates (fallback)
 */
function getDefaultShippingRates(): ShippingRates {
  return {
    france: {
      standard: {
        cost: 590,
        currency: "EUR",
        estimatedDays: "2-3 jours ouvrés",
        carrier: "Colissimo Suivi",
      },
      express: {
        cost: 990,
        currency: "EUR",
        estimatedDays: "24h",
        carrier: "Chronopost",
      },
    },
    "eu-schengen": {
      standard: {
        cost: 890,
        currency: "EUR",
        estimatedDays: "3-5 jours ouvrés",
        carrier: "Colissimo International",
      },
      express: {
        cost: 1590,
        currency: "EUR",
        estimatedDays: "2-3 jours ouvrés",
        carrier: "Chronopost International",
      },
    },
    "eu-non-schengen": {
      standard: {
        cost: 1190,
        currency: "EUR",
        estimatedDays: "5-7 jours ouvrés",
        carrier: "Colissimo International",
      },
      express: {
        cost: 1590,
        currency: "EUR",
        estimatedDays: "3-4 jours ouvrés",
        carrier: "Chronopost International",
      },
    },
    "non-eu": {
      standard: {
        cost: 1490,
        currency: "EUR",
        estimatedDays: "7-10 jours ouvrés",
        carrier: "Colissimo International",
      },
      express: {
        cost: 1990,
        currency: "EUR",
        estimatedDays: "4-6 jours ouvrés",
        carrier: "Chronopost International",
      },
    },
  };
}

/**
 * Get all shipping rates (for admin and clients)
 */
export async function getAllShippingRates(): Promise<ShippingRates> {
  return await readShippingRates();
}

/**
 * Update shipping rate (admin only)
 */
export async function updateShippingRate(
  region: CountryRegion,
  method: ShippingMethod,
  rate: ShippingRate
): Promise<void> {
  const rates = await readShippingRates();
  rates[region][method] = rate;
  await writeShippingRates(rates);
}

/**
 * Update all shipping rates (admin only)
 */
export async function updateAllShippingRates(rates: ShippingRates): Promise<void> {
  await writeShippingRates(rates);
}
