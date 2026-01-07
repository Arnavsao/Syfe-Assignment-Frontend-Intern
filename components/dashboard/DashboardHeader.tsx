"use client";

import React from "react";
import { DashboardStats, Currency, ExchangeRate } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui";

interface DashboardHeaderProps {
  stats: DashboardStats;
  displayCurrency: Currency;
  exchangeRate: ExchangeRate | null;
  isRefreshing: boolean;
  onRefreshRate: () => void;
}

export function DashboardHeader({
  stats,
  displayCurrency,
  exchangeRate,
  isRefreshing,
  onRefreshRate,
}: DashboardHeaderProps) {
  return (
    <div>  {/* Header Section */}
      <div className="mb-6 md:mb-0 text-center md:p-5">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 text-gray-900">
          Syfe Savings Planner
        </h1>
        <p className="text-gray-800 text-md md:text-lg">Track your financial goals and monitor progress</p>
      </div>
      {/* Dashboard Section */}
    <div className="bg-gradient-to-r from-blue-700  to-indigo-700 rounded-xl shadow-xl p-6 md:p-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="text-xl  text-white">Financial Overview</h3>
        <div className="mt-4 md:mt-0 flex items-center gap-3">          
          <Button
            size="sm"
            variant="ghost"
            className="text-white"
            onClick={onRefreshRate}
            isLoading={isRefreshing}
          >
            <svg
              className={`w-4 h-4 mr-2 transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Rate
          </Button>
        </div>
      </div>

      <div className={`grid gap-4 md:gap-6 ${stats.extraSavings > 0 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
        <div className="">
          <p className="text-blue-100 text-sm mb-1">Total Saved</p>
          <p className="text-xl md:text-xl lg:text-2xl font-bold">
            {formatCurrency(stats.totalSaved, displayCurrency)}
          </p>
          <p className="text-blue-100 text-xs mt-1">
            Across {stats.totalGoals} {stats.totalGoals === 1 ? "goal" : "goals"}
          </p>
        </div>

        <div className="">
          <p className="text-blue-100 text-sm mb-1">Total Target</p>
          <p className="text-xl md:text-xl lg:text-2xl font-bold">
            {formatCurrency(stats.totalTarget, displayCurrency)}
          </p>
          <p className="text-blue-100 text-xs mt-1">
            {displayCurrency === "INR" ? "Indian Rupees" : "US Dollars"}
          </p>
        </div>

        <div className={stats.extraSavings > 0 ? "" : "col-span-2 md:col-span-1"}>
          <p className="text-blue-100 text-sm mb-1">Overall Progress</p>
          <p className="text-xl md:text-xl lg:text-2xl font-bold">{stats.overallProgress}%</p>
          <div className="mt-2 bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.overallProgress}%` }}
            />
          </div>
        </div>

        {stats.extraSavings > 0 && (
          <div className="col-span-2 md:col-span-1">
            <p className="text-blue-100 text-sm mb-1">Extra Savings</p>
            <p className="text-xl md:text-xl lg:text-2xl font-bold text-green-300">
              {formatCurrency(stats.extraSavings, displayCurrency)}
            </p>
            <p className="text-green-200 text-xs mt-1">
              Beyond target!
            </p>
          </div>
        )}
      </div>
      <hr className="border-gray-400 my-4" />
      <div className="text-sm text-blue-100 md:flex justify-between items-center">
        {exchangeRate ? (
          <>
            {/* Left: Exchange Rate */}
            <div className="text-sm">
              Exchange Rate{" "}
              <span className="font-semibold text-white">
                $1 = ₹{exchangeRate.rate.toFixed(2)}
              </span>
            </div>
      
            {/* Right: Last Updated */}
            <div className="text-xs ">
              Last updated: {formatDateTime(exchangeRate.lastUpdated)}
            </div>
          </>
        ) : (
          <div>Loading exchange rate...</div>
        )}
      </div>
    </div>
    </div>
  );
}
