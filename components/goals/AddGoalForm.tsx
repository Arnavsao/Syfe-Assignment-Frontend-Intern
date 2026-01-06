"use client";

import React, { useState } from "react";
import { Currency, GoalFormData } from "@/types";
import { validateGoalForm } from "@/lib/utils";
import { Input, Select, Button, Card } from "@/components/ui";

interface AddGoalFormProps {
  onSubmit: (formData: GoalFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function AddGoalForm({ onSubmit, isSubmitting = false }: AddGoalFormProps) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("INR");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(targetAmount);
    const validationErrors = validateGoalForm(name, amount);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      return;
    }

    setErrors({});

    await onSubmit({
      name: name.trim(),
      targetAmount: amount,
      currency,
    });

    setName("");
    setTargetAmount("");
    setCurrency("INR");
    setShowForm(false);
  };

  const handleCancel = () => {
    setName("");
    setTargetAmount("");
    setCurrency("INR");
    setErrors({});
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        variant="primary"
        className="w-full md:w-auto"
      >
        <svg
          className="w-5 h-5 mr-2"
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
        Add New Goal
      </Button>
    );
  }

  return (
    <Card className="border-2 border-blue-500">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Create New Goal
          </h3>
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close form"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <Input
          label="Goal Name"
          type="text"
          placeholder="e.g., Emergency Fund, Trip to Japan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />

        <Input
          label="Target Amount"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0.01"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          error={errors["target amount"]}
          required
        />

        <Select
          label="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          options={[
            { value: "INR", label: "₹ INR - Indian Rupee" },
            { value: "USD", label: "$ USD - US Dollar" },
          ]}
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="flex-1"
          >
            Create Goal
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
