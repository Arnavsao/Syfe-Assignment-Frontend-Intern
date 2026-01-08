import { Goal, Contribution, GoalFormData, ContributionFormData, Currency } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { getStorageItem, setStorageItem } from "@/lib/utils";

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all goals from localStorage
 */
export function getGoals(): Goal[] {
  const goals = getStorageItem<Goal[]>(STORAGE_KEYS.GOALS);

  if (!goals) return [];

  // Convert string dates back to Date objects
  return goals.map((goal) => ({
    ...goal,
    createdAt: new Date(goal.createdAt),
    updatedAt: new Date(goal.updatedAt),
    contributions: goal.contributions.map((contribution) => ({
      ...contribution,
      date: new Date(contribution.date),
    })),
  }));
}

/**
 * Save goals to localStorage
 */
export function saveGoals(goals: Goal[]): boolean {
  return setStorageItem(STORAGE_KEYS.GOALS, goals);
}

/**
 * Create a new goal
 */
export function createGoal(formData: GoalFormData): Goal {
  const newGoal: Goal = {
    id: generateId(),
    name: formData.name.trim(),
    targetAmount: formData.targetAmount,
    currency: formData.currency,
    currentAmount: 0,
    contributions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const goals = getGoals();
  goals.push(newGoal);
  saveGoals(goals);

  return newGoal;
}

/**
 * Update a goal
 */
export function updateGoal(goalId: string, updates: Partial<Goal>): Goal | null {
  const goals = getGoals();
  const goalIndex = goals.findIndex((g) => g.id === goalId);

  if (goalIndex === -1) return null;

  const updatedGoal = {
    ...goals[goalIndex],
    ...updates,
    updatedAt: new Date(),
  };

  goals[goalIndex] = updatedGoal;
  saveGoals(goals);

  return updatedGoal;
}

/**
 * Delete a goal
 */
export function deleteGoal(goalId: string): boolean {
  const goals = getGoals();
  const filteredGoals = goals.filter((g) => g.id !== goalId);

  if (filteredGoals.length === goals.length) return false;

  saveGoals(filteredGoals);
  return true;
}

/**
 * Add contribution to a goal
 */
export function addContribution(
  goalId: string,
  formData: ContributionFormData
): Goal | null {
  const goals = getGoals();
  const goal = goals.find((g) => g.id === goalId);

  if (!goal) return null;

  const newContribution: Contribution = {
    id: generateId(),
    title: formData.title,
    amount: formData.amount,
    date: formData.date,
    currency: goal.currency,
  };

  goal.contributions.push(newContribution);
  goal.currentAmount += formData.amount;
  goal.updatedAt = new Date();

  saveGoals(goals);

  return goal;
}

/**
 * Get a single goal by ID
 */
export function getGoalById(goalId: string): Goal | null {
  const goals = getGoals();
  return goals.find((g) => g.id === goalId) || null;
}

/**
 * Calculate total saved across all goals in a specific currency
 */
export function calculateTotalSaved(goals: Goal[]): number {
  return goals.reduce((total, goal) => total + goal.currentAmount, 0);
}

/**
 * Calculate total target across all goals in a specific currency
 */
export function calculateTotalTarget(goals: Goal[]): number {
  return goals.reduce((total, goal) => total + goal.targetAmount, 0);
}

/**
 * Calculate overall progress percentage
 */
export function calculateOverallProgress(goals: Goal[]): number {
  if (goals.length === 0) return 0;

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  if (totalTarget === 0) return 0;

  return Math.min(Math.round((totalSaved / totalTarget) * 100), 100);
}

/**
 * Calculate extra savings (amount saved beyond total target)
 */
export function calculateExtraSavings(goals: Goal[]): number {
  if (goals.length === 0) return 0;

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  return Math.max(0, totalSaved - totalTarget);
}

/**
 * Update goal details (name, target amount, currency)
 */
export function updateGoalDetails(
  goalId: string,
  name: string,
  targetAmount: number,
  currency: Currency
): Goal | null {
  const goals = getGoals();
  const goalIndex = goals.findIndex((g) => g.id === goalId);

  if (goalIndex === -1) return null;

  const updatedGoal = {
    ...goals[goalIndex],
    name: name.trim(),
    targetAmount,
    currency,
    updatedAt: new Date(),
  };

  goals[goalIndex] = updatedGoal;
  saveGoals(goals);

  return updatedGoal;
}

/**
 * Update a contribution
 */
export function updateContribution(
  goalId: string,
  contributionId: string,
  formData: ContributionFormData
): Goal | null {
  const goals = getGoals();
  const goal = goals.find((g) => g.id === goalId);

  if (!goal) return null;

  const contributionIndex = goal.contributions.findIndex(
    (c) => c.id === contributionId
  );

  if (contributionIndex === -1) return null;

  const oldContribution = goal.contributions[contributionIndex];
  const amountDifference = formData.amount - oldContribution.amount;

  // Update contribution
  goal.contributions[contributionIndex] = {
    ...oldContribution,
    title: formData.title,
    amount: formData.amount,
    date: formData.date,
  };

  // Update goal's currentAmount
  goal.currentAmount = Math.max(0, goal.currentAmount + amountDifference);
  goal.updatedAt = new Date();

  saveGoals(goals);

  return goal;
}

/**
 * Delete a contribution from a goal
 */
export function deleteContribution(
  goalId: string,
  contributionId: string
): Goal | null {
  const goals = getGoals();
  const goal = goals.find((g) => g.id === goalId);

  if (!goal) return null;

  const contribution = goal.contributions.find((c) => c.id === contributionId);

  if (!contribution) return null;

  // Remove contribution
  goal.contributions = goal.contributions.filter((c) => c.id !== contributionId);

  // Update goal's currentAmount
  goal.currentAmount = Math.max(0, goal.currentAmount - contribution.amount);
  goal.updatedAt = new Date();

  saveGoals(goals);

  return goal;
}
