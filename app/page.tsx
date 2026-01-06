"use client";

import { useState } from "react";
import { Currency, GoalFormData, ContributionFormData, ModalState } from "@/types";
import { useExchangeRate, useGoals, useDashboardStats } from "@/hooks";
import { DashboardHeader } from "@/components/dashboard";
import { GoalCard, AddGoalForm, AddContributionModal } from "@/components/goals";

export default function Home() {
  const [displayCurrency] = useState<Currency>("INR");
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    goalId: null,
  });

  const { exchangeRate, isLoading: isRateLoading, refetchRate } = useExchangeRate();
  const { goals, isLoading: isGoalsLoading, addGoal, addGoalContribution, removeGoal } = useGoals();
  const stats = useDashboardStats({ goals, exchangeRate, displayCurrency });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshRate = async () => {
    setIsRefreshing(true);
    await refetchRate();
    setIsRefreshing(false);
  };

  const handleAddGoal = async (formData: GoalFormData) => {
    await addGoal(formData);
  };

  const handleAddContribution = (goalId: string) => {
    setModalState({ isOpen: true, goalId });
  };

  const handleSubmitContribution = async (
    goalId: string,
    formData: ContributionFormData
  ) => {
    await addGoalContribution(goalId, formData);
    setModalState({ isOpen: false, goalId: null });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, goalId: null });
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      await removeGoal(goalId);
    }
  };

  const selectedGoal = goals.find((g) => g.id === modalState.goalId) || null;

  const isLoading = isRateLoading || isGoalsLoading;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <DashboardHeader
          stats={stats}
          displayCurrency={displayCurrency}
          exchangeRate={exchangeRate}
          isRefreshing={isRefreshing}
          onRefreshRate={handleRefreshRate}
        />

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Your Goals</h2>
          <AddGoalForm onSubmit={handleAddGoal} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No goals yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start by creating your first savings goal!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                exchangeRate={exchangeRate}
                onAddContribution={handleAddContribution}
                onDelete={handleDeleteGoal}
              />
            ))}
          </div>
        )}

        <AddContributionModal
          isOpen={modalState.isOpen}
          goal={selectedGoal}
          onClose={handleCloseModal}
          onSubmit={handleSubmitContribution}
        />
      </div>
    </main>
  );
}
