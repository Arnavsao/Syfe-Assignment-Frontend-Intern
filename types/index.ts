// Currency Types
export type Currency = "INR" | "USD";

export interface ExchangeRate {
  rate: number;
  lastUpdated: Date;
  from: Currency;
  to: Currency;
}

export interface ExchangeRateResponse {
  conversion_rates: {
    INR: number;
    USD: number;
  };
  time_last_update_unix: number;
}

// Contribution Types
export interface Contribution {
  id: string;
  title: string;
  amount: number;
  date: Date;
  currency: Currency;
}

// Goal Types
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currency: Currency;
  currentAmount: number;
  contributions: Contribution[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalFormData {
  name: string;
  targetAmount: number;
  currency: Currency;
}

export interface ContributionFormData {
  title: string;
  amount: number;
  date: Date;
}

// Dashboard Statistics
export interface DashboardStats {
  totalTarget: number;
  totalSaved: number;
  overallProgress: number;
  totalGoals: number;
  extraSavings: number;
}

// UI State Types
export interface AppState {
  goals: Goal[];
  exchangeRate: ExchangeRate | null;
  isLoading: boolean;
  error: string | null;
}

export interface ModalState {
  isOpen: boolean;
  goalId: string | null;
}

// Validation Error Types
export interface ValidationError {
  field: string;
  message: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}
