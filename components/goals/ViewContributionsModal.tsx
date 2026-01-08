"use client";

import React from "react";
import { Goal, Contribution } from "@/types";
import { Modal } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

interface ViewContributionsModalProps {
  isOpen: boolean;
  goal: Goal | null;
  onClose: () => void;
  onEditContribution: (goalId: string, contribution: Contribution) => void;
  onDeleteContribution: (
    goalId: string,
    contributionId: string,
    contributionTitle: string
  ) => void;
}

export function ViewContributionsModal({
  isOpen,
  goal,
  onClose,
  onEditContribution,
  onDeleteContribution,
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: "35%" }}>
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: "25%" }}>
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: "25%" }}>
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: "15%" }}>
                    Actions
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
                    <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit button */}
                        <button
                          onClick={() => onEditContribution(goal.id, contribution)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          aria-label="Edit contribution"
                          title="Edit contribution"
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
                        {/* Delete button */}
                        <button
                          onClick={() =>
                            onDeleteContribution(goal.id, contribution.id, contribution.title)
                          }
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          aria-label="Delete contribution"
                          title="Delete contribution"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
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
