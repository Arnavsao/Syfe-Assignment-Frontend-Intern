"use client";

import React from "react";
import { Goal, ExchangeRate, Currency } from "@/types";
import { formatCurrency, calculatePercentage, convertCurrency, getOppositeCurrency } from "@/lib/utils";
import { Card, Button, ProgressBar } from "@/components/ui";

interface GoalCardProps {
  goal: Goal;
  exchangeRate: ExchangeRate | null;
  onAddContribution: (goalId: string) => void;
  onViewContributions: (goalId: string) => void;
  onEdit?: (goalId: string) => void;
  onDelete?: (goalId: string) => void;
}

export function GoalCard({
  goal,
  exchangeRate,
  onAddContribution,
  onViewContributions,
  onEdit,
  onDelete,
}: GoalCardProps) {
  const progress = calculatePercentage(goal.currentAmount, goal.targetAmount);
  const oppositeCurrency = getOppositeCurrency(goal.currency);

  const convertedTarget = exchangeRate
    ? convertCurrency(
        goal.targetAmount,
        goal.currency,
        oppositeCurrency,
        exchangeRate
      )
    : 0;

  const convertedCurrent = exchangeRate
    ? convertCurrency(
        goal.currentAmount,
        goal.currency,
        oppositeCurrency,
        exchangeRate
      )
    : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {goal.name}
            </h3>
            {onEdit && (
              <button
                onClick={() => onEdit(goal.id)}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Edit goal"
                title="Edit goal"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Created {new Date(goal.createdAt).toLocaleDateString()}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(goal.id)}
            className="text-gray-400 hover:text-red-500 transition-colors ml-2"
            aria-label="Delete goal"
            title="Delete goal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Target</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(goal.targetAmount, goal.currency)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              ≈ {formatCurrency(convertedTarget, oppositeCurrency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Current</p>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(goal.currentAmount, goal.currency)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              ≈ {formatCurrency(convertedCurrent, oppositeCurrency)}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-blue-600">
              {progress}%
            </span>
          </div>
          <ProgressBar percentage={progress} height="md" color="gradient" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => onViewContributions(goal.id)}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1 group"
          >
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="font-medium">{goal.contributions.length}</span>{" "}
            {goal.contributions.length === 1 ? "contribution" : "contributions"}
          </button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onAddContribution(goal.id)}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Contribution
          </Button>
        </div>
      </div>
    </Card>
  );
}
