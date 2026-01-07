"use client";

import { useMemo } from "react";
import { Goal, DashboardStats, ExchangeRate, Currency } from "@/types";
import {
  calculateTotalSaved,
  calculateTotalTarget,
  calculateOverallProgress,
  calculateExtraSavings,
} from "@/lib/api";
import { convertCurrency } from "@/lib/utils";

interface UseDashboardStatsParams {
  goals: Goal[];
  exchangeRate: ExchangeRate | null;
  displayCurrency?: Currency;
}

/**
 * Custom hook for calculating dashboard statistics
 */
export function useDashboardStats({
  goals,
  exchangeRate,
  displayCurrency = "INR",
}: UseDashboardStatsParams): DashboardStats {
  return useMemo(() => {
    // Separate goals by currency
    const goalsInDisplayCurrency = goals.filter(
      (g) => g.currency === displayCurrency
    );
    const goalsInOtherCurrency = goals.filter(
      (g) => g.currency !== displayCurrency
    );

    // Calculate totals for goals in display currency
    let totalSaved = calculateTotalSaved(goalsInDisplayCurrency);
    let totalTarget = calculateTotalTarget(goalsInDisplayCurrency);

    // Add converted amounts from other currency
    if (exchangeRate && goalsInOtherCurrency.length > 0) {
      const otherCurrency = displayCurrency === "INR" ? "USD" : "INR";

      const convertedSaved = goalsInOtherCurrency.reduce((sum, goal) => {
        return (
          sum +
          convertCurrency(
            goal.currentAmount,
            otherCurrency,
            displayCurrency,
            exchangeRate
          )
        );
      }, 0);

      const convertedTarget = goalsInOtherCurrency.reduce((sum, goal) => {
        return (
          sum +
          convertCurrency(
            goal.targetAmount,
            otherCurrency,
            displayCurrency,
            exchangeRate
          )
        );
      }, 0);

      totalSaved += convertedSaved;
      totalTarget += convertedTarget;
    }

    const overallProgress = calculateOverallProgress(goals);
    const extraSavings = Math.max(0, totalSaved - totalTarget);

    return {
      totalTarget,
      totalSaved,
      overallProgress,
      totalGoals: goals.length,
      extraSavings,
    };
  }, [goals, exchangeRate, displayCurrency]);
}
