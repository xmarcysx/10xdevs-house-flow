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

// Common
export interface MessageDTO {
  message: string;
}

export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
}
