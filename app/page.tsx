"use client";

import { useState } from "react";
import { Currency, GoalFormData, ContributionFormData, ModalState } from "@/types";
import { useExchangeRate, useGoals, useDashboardStats } from "@/hooks";
import { DashboardHeader } from "@/components/dashboard";
import { GoalCard, AddGoalModal, AddContributionModal, ViewContributionsModal } from "@/components/goals";
import { Button, ConfirmationModal } from "@/components/ui";

export default function Home() {
  const [displayCurrency] = useState<Currency>("INR");
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    goalId: null,
  });
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [viewContributionsModalState, setViewContributionsModalState] = useState<ModalState>({
    isOpen: false,
    goalId: null,
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    goalId: string | null;
    goalName: string | null;
  }>({
    isOpen: false,
    goalId: null,
    goalName: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

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
    setIsAddGoalModalOpen(false);
  };

  const handleAddContribution = (goalId: string) => {
    setModalState({ isOpen: true, goalId });
  };

  const handleViewContributions = (goalId: string) => {
    setViewContributionsModalState({ isOpen: true, goalId });
  };

  const handleCloseViewContributions = () => {
    setViewContributionsModalState({ isOpen: false, goalId: null });
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

  const handleDeleteGoal = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    setDeleteConfirmation({
      isOpen: true,
      goalId,
      goalName: goal?.name || null,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation.goalId) return;

    setIsDeleting(true);
    try {
      await removeGoal(deleteConfirmation.goalId);
      setDeleteConfirmation({ isOpen: false, goalId: null, goalName: null });
    } catch (error) {
      console.error("Failed to delete goal:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, goalId: null, goalName: null });
  };

  const selectedGoal = goals.find((g) => g.id === modalState.goalId) || null;
  const selectedGoalForView = goals.find((g) => g.id === viewContributionsModalState.goalId) || null;

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

        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-gray-900 whitespace-nowrap pl-2 md:pl-0">Your Goals</h2>
          <Button
            onClick={() => setIsAddGoalModalOpen(true)}
            variant="primary"
            className="shrink-0"
          >
            <svg
              className="w-5 h-5 md:mr-2"
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
            <span className="hidden md:inline">Add New Goal</span>
          </Button>
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
                onViewContributions={handleViewContributions}
                onDelete={handleDeleteGoal}
              />
            ))}
          </div>
        )}

        <AddGoalModal
          isOpen={isAddGoalModalOpen}
          onClose={() => setIsAddGoalModalOpen(false)}
          onSubmit={handleAddGoal}
        />

        <AddContributionModal
          isOpen={modalState.isOpen}
          goal={selectedGoal}
          onClose={handleCloseModal}
          onSubmit={handleSubmitContribution}
        />

        <ViewContributionsModal
          isOpen={viewContributionsModalState.isOpen}
          goal={selectedGoalForView}
          onClose={handleCloseViewContributions}
        />

        <ConfirmationModal
          isOpen={deleteConfirmation.isOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Goal"
          message={`Are you sure you want to delete "${deleteConfirmation.goalName}"? This action cannot be undone and all contributions will be permanently removed.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </main>
  );
}
