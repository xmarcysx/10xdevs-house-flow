import type { Tables, TablesInsert } from "./db/database.types";

// Categories
export type CategoryDTO = Pick<Tables<"categories">, "id" | "name" | "is_default" | "created_at">;
export type CreateCategoryCommand = Pick<TablesInsert<"categories">, "name">;
export type UpdateCategoryCommand = Partial<Pick<TablesInsert<"categories">, "name">>;
export type UpdateCategoryDTO = Pick<Tables<"categories">, "id" | "name" | "is_default" | "updated_at">;

// Incomes
export type IncomeDTO = Pick<Tables<"incomes">, "id" | "amount" | "date" | "description" | "source" | "created_at">;
export type CreateIncomeCommand = Pick<TablesInsert<"incomes">, "amount" | "date" | "description" | "source">;
export type UpdateIncomeCommand = Partial<Pick<TablesInsert<"incomes">, "amount" | "date" | "description" | "source">>;

// Expenses
export type ExpenseDTO = Pick<
  Tables<"expenses">,
  "id" | "amount" | "date" | "description" | "category_id" | "created_at"
> & {
  category_name: string;
};

export type CreateExpenseCommand = Pick<TablesInsert<"expenses">, "amount" | "date" | "description" | "category_id">;
export type UpdateExpenseCommand = Partial<
  Pick<TablesInsert<"expenses">, "amount" | "date" | "description" | "category_id">
>;

// Goals
export type GoalDTO = Pick<Tables<"goals">, "id" | "name" | "target_amount" | "current_amount" | "created_at">;
export type CreateGoalCommand = Pick<TablesInsert<"goals">, "name" | "target_amount">;
export type UpdateGoalCommand = Partial<Pick<TablesInsert<"goals">, "name" | "target_amount">>;

// Goal Contributions
export type GoalContributionDTO = Pick<
  Tables<"goal_contributions">,
  "id" | "amount" | "date" | "description" | "created_at"
>;
export type CreateGoalContributionCommand = Pick<TablesInsert<"goal_contributions">, "amount" | "date" | "description">;
export type UpdateGoalContributionCommand = Partial<
  Pick<TablesInsert<"goal_contributions">, "amount" | "date" | "description">
>;

// Budget
export interface MonthlyBudgetDTO {
  total_income: number;
  total_expenses: number;
  remaining: number;
  category_breakdown: CategoryBreakdownDTO[];
}

export interface CategoryBreakdownDTO {
  category_name: string;
  percentage: number;
  amount: number;
}

// Reports
export interface MonthlyReportDTO {
  expenses: ExpenseReportItemDTO[];
  category_totals: CategoryTotalDTO[];
}

export interface ExpenseReportItemDTO {
  date: string;
  amount: number;
  category: string;
}

export interface CategoryTotalDTO {
  category: string;
  total: number;
}

export interface GoalsReportDTO {
  goals: GoalReportItemDTO[];
}

export interface GoalReportItemDTO {
  id: string;
  name: string;
  progress_percentage: number;
  remaining_amount: number;
  predicted_completion_date?: string;
}

// Expenses Query
export interface GetExpensesQuery {
  page: number;
  limit: number;
  month?: string;
  category_id?: string;
  sort: string;
}

// Incomes Query
export interface GetIncomesQuery {
  page: number;
  limit: number;
  month?: string;
  sort: string;
}

// ViewModel types for Incomes view

export interface IncomeFormData {
  amount: number; // Kwota wpływu (wymagana, > 0)
  date: string; // Data wpływu w formacie YYYY-MM-DD (wymagana)
  description?: string; // Opcjonalny opis wpływu (max 500 znaków)
  source?: string; // Opcjonalne źródło wpływu (max 100 znaków)
}

export interface IncomesFiltersData {
  month?: string; // Miesiąc w formacie YYYY-MM (opcjonalny)
}

export interface IncomesTableData {
  incomes: IncomeDTO[]; // Lista wpływów na bieżącej stronie
  pagination: PaginationDTO; // Metadane paginacji
}

// Register ViewModel types

export interface RegisterFormData {
  email: string; // Adres email użytkownika
  password: string; // Hasło użytkownika
  confirmPassword: string; // Potwierdzenie hasła
}

// Login ViewModel types

export interface LoginViewModel {
  email: string; // Adres email użytkownika
  password: string; // Hasło użytkownika
}

export interface ErrorDTO {
  message: string; // Komunikat błędu
}

export interface IncomesQuery extends GetIncomesQuery {
  // Dziedziczy po GetIncomesQuery z types.ts
  // Dodatkowe pola specyficzne dla widoku jeśli potrzebne
}

// Common
export interface MessageDTO {
  message: string;
}

export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
}

// Auth related types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// API Response types
export interface AuthResponse {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// Categories ViewModel types

export interface CategoriesListViewModel {
  categories: CategoryDTO[];
  pagination: PaginationDTO;
  isLoading: boolean;
  error?: string;
}

export interface CategoryFormViewModel {
  isOpen: boolean;
  mode: "create" | "edit";
  category?: CategoryDTO;
  formData: { name: string };
  errors: { name?: string };
  isSubmitting: boolean;
}
