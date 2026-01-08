"use client";

import { useState, useEffect, useCallback } from "react";
import { Goal, GoalFormData, ContributionFormData, Currency } from "@/types";
import {
  getGoals,
  createGoal,
  deleteGoal,
  addContribution,
  updateGoalDetails,
  updateContribution,
  deleteContribution,
} from "@/lib/api";

interface UseGoalsReturn {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  addGoal: (formData: GoalFormData) => Promise<Goal | null>;
  removeGoal: (goalId: string) => Promise<boolean>;
  addGoalContribution: (
    goalId: string,
    formData: ContributionFormData
  ) => Promise<Goal | null>;
  editGoal: (
    goalId: string,
    name: string,
    targetAmount: number,
    currency: Currency
  ) => Promise<Goal | null>;
  editContribution: (
    goalId: string,
    contributionId: string,
    formData: ContributionFormData
  ) => Promise<Goal | null>;
  removeContribution: (
    goalId: string,
    contributionId: string
  ) => Promise<Goal | null>;
  refreshGoals: () => void;
}

/**
 * Custom hook for managing goals
 */
export function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadGoals = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedGoals = getGoals();
      setGoals(loadedGoals);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load goals");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addGoal = useCallback(
    async (formData: GoalFormData): Promise<Goal | null> => {
      try {
        setError(null);
        const newGoal = createGoal(formData);
        setGoals((prev) => [...prev, newGoal]);
        return newGoal;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create goal");
        return null;
      }
    },
    []
  );

  const removeGoal = useCallback(async (goalId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = deleteGoal(goalId);
      if (success) {
        setGoals((prev) => prev.filter((g) => g.id !== goalId));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete goal");
      return false;
    }
  }, []);

  const addGoalContribution = useCallback(
    async (
      goalId: string,
      formData: ContributionFormData
    ): Promise<Goal | null> => {
      try {
        setError(null);
        const updatedGoal = addContribution(goalId, formData);
        if (updatedGoal) {
          setGoals((prev) =>
            prev.map((g) => (g.id === goalId ? updatedGoal : g))
          );
        }
        return updatedGoal;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to add contribution"
        );
        return null;
      }
    },
    []
  );

  const editGoal = useCallback(
    async (
      goalId: string,
      name: string,
      targetAmount: number,
      currency: Currency
    ): Promise<Goal | null> => {
      try {
        setError(null);
        const updatedGoal = updateGoalDetails(goalId, name, targetAmount, currency);
        if (updatedGoal) {
          setGoals((prev) =>
            prev.map((g) => (g.id === goalId ? updatedGoal : g))
          );
        }
        return updatedGoal;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update goal");
        return null;
      }
    },
    []
  );

  const editContribution = useCallback(
    async (
      goalId: string,
      contributionId: string,
      formData: ContributionFormData
    ): Promise<Goal | null> => {
      try {
        setError(null);
        const updatedGoal = updateContribution(goalId, contributionId, formData);
        if (updatedGoal) {
          setGoals((prev) =>
            prev.map((g) => (g.id === goalId ? updatedGoal : g))
          );
        }
        return updatedGoal;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update contribution"
        );
        return null;
      }
    },
    []
  );

  const removeContribution = useCallback(
    async (goalId: string, contributionId: string): Promise<Goal | null> => {
      try {
        setError(null);
        const updatedGoal = deleteContribution(goalId, contributionId);
        if (updatedGoal) {
          setGoals((prev) =>
            prev.map((g) => (g.id === goalId ? updatedGoal : g))
          );
        }
        return updatedGoal;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete contribution"
        );
        return null;
      }
    },
    []
  );

  const refreshGoals = useCallback(() => {
    loadGoals();
  }, [loadGoals]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  return {
    goals,
    isLoading,
    error,
    addGoal,
    removeGoal,
    addGoalContribution,
    editGoal,
    editContribution,
    removeContribution,
    refreshGoals,
  };
}
