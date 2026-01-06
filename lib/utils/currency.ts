import { Currency, ExchangeRate } from "@/types";

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRate: ExchangeRate | null
): number {
  if (!exchangeRate) return 0;
  if (fromCurrency === toCurrency) return amount;

  // If converting from USD to INR
  if (fromCurrency === "USD" && toCurrency === "INR") {
    return amount * exchangeRate.rate;
  }

  // If converting from INR to USD
  if (fromCurrency === "INR" && toCurrency === "USD") {
    return amount / exchangeRate.rate;
  }

  return 0;
}

/**
 * Get the opposite currency
 */
export function getOppositeCurrency(currency: Currency): Currency {
  return currency === "INR" ? "USD" : "INR";
}

/**
 * Check if exchange rate is stale (older than cache duration)
 */
export function isExchangeRateStale(
  lastUpdated: Date,
  cacheDuration: number
): boolean {
  const now = new Date().getTime();
  const lastUpdateTime = lastUpdated.getTime();
  return now - lastUpdateTime > cacheDuration;
}
