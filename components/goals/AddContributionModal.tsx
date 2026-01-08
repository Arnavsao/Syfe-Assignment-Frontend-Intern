"use client";

import React, { useState, useEffect } from "react";
import { Goal, ContributionFormData, Contribution } from "@/types";
import { validateContributionForm } from "@/lib/utils";
import { Modal, Input, Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

interface AddContributionModalProps {
  isOpen: boolean;
  goal: Goal | null;
  onClose: () => void;
  onSubmit: (goalId: string, formData: ContributionFormData) => Promise<void>;
  contribution?: Contribution | null;
}

export function AddContributionModal({
  isOpen,
  goal,
  onClose,
  onSubmit,
  contribution,
}: AddContributionModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!contribution;

  useEffect(() => {
    if (isOpen) {
      if (contribution) {
        // Edit mode: prefill with contribution data
        setTitle(contribution.title);
        setAmount(contribution.amount.toString());
        setDate(contribution.date.toISOString().split("T")[0]);
      } else if (goal) {
        // Create mode: reset form with today's date
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
        setTitle("");
        setAmount("");
      }
      setErrors({});
    }
  }, [isOpen, goal, contribution]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!goal) return;

    const amountNum = parseFloat(amount);
    const dateObj = new Date(date);

    const validationErrors = validateContributionForm(title, amountNum, dateObj);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit(goal.id, {
        title: title.trim(),
        amount: amountNum,
        date: dateObj,
      });

      setTitle("");
      setAmount("");
      setDate("");
      onClose();
    } catch (error) {
      setErrors({
        general: isEditMode
          ? "Failed to update contribution"
          : "Failed to add contribution",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!goal) return null;

  const remaining = goal.targetAmount - goal.currentAmount;
  const willComplete = remaining > 0 && parseFloat(amount) >= remaining;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditMode
          ? "Edit Contribution"
          : `Add Contribution to ${goal.name}`
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Current Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(goal.currentAmount, goal.currency)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Target Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(goal.targetAmount, goal.currency)}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-gray-600 text-sm">Remaining</p>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(Math.max(0, remaining), goal.currency)}
            </p>
          </div>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {errors.general}
          </div>
        )}

        <Input
          label="Title"
          type="text"
          placeholder="e.g., Monthly Salary, Bonus, Gift"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          helperText="Brief description of this contribution"
          required
          autoFocus
        />

        <Input
          label="Contribution Amount"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          helperText={`Amount in ${goal.currency}`}
          required
        />

        <Input
          label="Contribution Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
          max={new Date().toISOString().split("T")[0]}
          required
        />

        {willComplete && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Goal Completion!
                </p>
                <p className="text-xs text-green-700 mt-1">
                  This contribution will complete your goal. Congratulations!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="flex-1"
          >
            {isEditMode ? "Update Contribution" : "Add Contribution"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
