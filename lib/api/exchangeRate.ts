import {
  ExchangeRate,
  ExchangeRateResponse,
  ApiResponse,
  Currency,
} from "@/types";
import {
  EXCHANGE_RATE_API_URL,
  EXCHANGE_RATE_BASE_CURRENCY,
  STORAGE_KEYS,
  EXCHANGE_RATE_CACHE_DURATION,
} from "@/lib/constants";
import {
  getStorageItem,
  setStorageItem,
  isExchangeRateStale,
} from "@/lib/utils";

/**
 * Fetch exchange rate from API
 */
export async function fetchExchangeRate(
  apiKey?: string
): Promise<ApiResponse<ExchangeRate>> {
  try {
    // Use API key from environment variable or parameter
    const key = apiKey || process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;

    if (!key) {
      // Return mock data if no API key is provided (for development)
      return {
        data: {
          rate: 83.5,
          lastUpdated: new Date(),
          from: "USD",
          to: "INR",
        },
        error: null,
        success: true,
      };
    }

    const response = await fetch(
      `${EXCHANGE_RATE_API_URL}/${key}/latest/${EXCHANGE_RATE_BASE_CURRENCY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: ExchangeRateResponse = await response.json();

    const exchangeRate: ExchangeRate = {
      rate: data.conversion_rates.INR,
      lastUpdated: new Date(), // Use current time when fetched
      from: "USD",
      to: "INR",
    };

    console.log("[Exchange Rate API] 🌐 Fetched from API", {
      rate: exchangeRate.rate,
      apiLastUpdate: new Date(data.time_last_update_unix * 1000).toISOString(),
      fetchedAt: exchangeRate.lastUpdated.toISOString(),
    });

    // Cache the exchange rate
    setStorageItem(STORAGE_KEYS.EXCHANGE_RATE, exchangeRate);
    setStorageItem(STORAGE_KEYS.LAST_RATE_FETCH, new Date().toISOString());

    return {
      data: exchangeRate,
      error: null,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch exchange rate",
      success: false,
    };
  }
}

/**
 * Get exchange rate from cache or fetch new one
 */
export async function getExchangeRate(
  forceRefresh: boolean = false
): Promise<ApiResponse<ExchangeRate>> {
  // Check cache first if not forcing refresh
  if (!forceRefresh) {
    const cachedRate = getStorageItem<ExchangeRate>(STORAGE_KEYS.EXCHANGE_RATE);
    const lastFetch = getStorageItem<string>(STORAGE_KEYS.LAST_RATE_FETCH);

    if (cachedRate && lastFetch) {
      const lastFetchDate = new Date(lastFetch);

      // If cache is fresh, return cached data
      if (!isExchangeRateStale(lastFetchDate, EXCHANGE_RATE_CACHE_DURATION)) {
        console.log("[Exchange Rate API] 📦 Returning cached rate", {
          rate: cachedRate.rate,
          cachedAt: lastFetch,
          age: `${Math.round((Date.now() - lastFetchDate.getTime()) / 1000)}s`,
        });
        // Convert string dates back to Date objects
        return {
          data: {
            ...cachedRate,
            lastUpdated: new Date(cachedRate.lastUpdated),
          },
          error: null,
          success: true,
        };
      } else {
        console.log("[Exchange Rate API] ⚠️ Cache is stale, fetching new rate");
      }
    } else {
      console.log("[Exchange Rate API] 📭 No cache found, fetching new rate");
    }
  } else {
    console.log("[Exchange Rate API] 🔄 Force refresh requested, fetching new rate");
  }

  // Fetch new rate if cache is stale or refresh is forced
  return await fetchExchangeRate();
}

/**
 * Convert amount between currencies
 */
export function convertAmount(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRate: ExchangeRate
): number {
  if (fromCurrency === toCurrency) return amount;

  // USD to INR
  if (fromCurrency === "USD" && toCurrency === "INR") {
    return amount * exchangeRate.rate;
  }

  // INR to USD
  if (fromCurrency === "INR" && toCurrency === "USD") {
    return amount / exchangeRate.rate;
  }

  return 0;
}
