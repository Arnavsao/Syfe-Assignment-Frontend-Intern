"use client";

import React, { useState, useEffect } from "react";
import { Currency, GoalFormData } from "@/types";
import { validateGoalForm } from "@/lib/utils";
import { Input, Select, Button, Modal } from "@/components/ui";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: GoalFormData) => Promise<void>;
}

export function AddGoalModal({
  isOpen,
  onClose,
  onSubmit,
}: AddGoalModalProps) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("INR");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setTargetAmount("");
      setCurrency("INR");
      setErrors({});
    }
  }, [isOpen]);

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
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        targetAmount: amount,
        currency,
      });

      setName("");
      setTargetAmount("");
      setCurrency("INR");
      onClose();
    } catch (error) {
      setErrors({ general: "Failed to create goal" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Goal" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-sm text-red-700">
            {errors.general}
          </div>
        )}

        <Input
          label="Goal Name"
          type="text"
          placeholder="e.g., Emergency Fund, Trip to Japan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
          autoFocus
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
          required
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
            variant="secondary"
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
