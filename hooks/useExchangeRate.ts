"use client";

import { useState, useEffect, useCallback } from "react";
import { ExchangeRate } from "@/types";
import { getExchangeRate } from "@/lib/api";

interface UseExchangeRateReturn {
  exchangeRate: ExchangeRate | null;
  isLoading: boolean;
  error: string | null;
  refetchRate: () => Promise<void>;
}

/**
 * Custom hook for managing exchange rate
 */
export function useExchangeRate(): UseExchangeRateReturn {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRate = useCallback(async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    setError(null);

    console.log(`[Exchange Rate] Fetching... (forceRefresh: ${forceRefresh})`);
    const startTime = Date.now();

    const response = await getExchangeRate(forceRefresh);

    if (response.success && response.data) {
      console.log(`[Exchange Rate] ✅ Success (${Date.now() - startTime}ms)`, {
        rate: response.data.rate,
        lastUpdated: response.data.lastUpdated,
        from: response.data.from,
        to: response.data.to,
      });
      setExchangeRate(response.data);
    } else {
      console.error(`[Exchange Rate] ❌ Failed:`, response.error);
      setError(response.error || "Failed to fetch exchange rate");
    }

    setIsLoading(false);
  }, []);

  const refetchRate = useCallback(async () => {
    await fetchRate(true);
  }, [fetchRate]);

  useEffect(() => {
    fetchRate(false);
  }, [fetchRate]);

  return {
    exchangeRate,
    isLoading,
    error,
    refetchRate,
  };
}
