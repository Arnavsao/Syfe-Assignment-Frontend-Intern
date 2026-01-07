"use client";

import React from "react";
import { Goal } from "@/types";
import { Modal } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

interface ViewContributionsModalProps {
  isOpen: boolean;
  goal: Goal | null;
  onClose: () => void;
}

export function ViewContributionsModal({
  isOpen,
  goal,
  onClose,
}: ViewContributionsModalProps) {
  if (!goal) return null;

  const sortedContributions = [...goal.contributions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Contributions for ${goal.name}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total Contributions</p>
              <p className="text-2xl font-bold text-gray-900">
                {goal.contributions.length}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(goal.currentAmount, goal.currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Contributions Table */}
        {sortedContributions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>No contributions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedContributions.map((contribution) => (
                  <tr
                    key={contribution.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-0" title={contribution.title}>
                      {contribution.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(contribution.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
                      {formatCurrency(contribution.amount, contribution.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
}
