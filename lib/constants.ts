import { Currency } from "@/types";

// API Configuration
export const EXCHANGE_RATE_API_URL = "https://v6.exchangerate-api.com/v6";
export const EXCHANGE_RATE_BASE_CURRENCY = "USD";

// Currency Symbols
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
};

// Currency Names
export const CURRENCY_NAMES: Record<Currency, string> = {
  INR: "Indian Rupee",
  USD: "US Dollar",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  GOALS: "syfe_goals",
  EXCHANGE_RATE: "syfe_exchange_rate",
  LAST_RATE_FETCH: "syfe_last_rate_fetch",
} as const;

// Cache Duration (in milliseconds)
export const EXCHANGE_RATE_CACHE_DURATION = 3600000; // 1 hour

// Validation Constants
export const VALIDATION = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999999,
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 100,
} as const;

// Date Format
export const DATE_FORMAT = "MMM dd, yyyy";
