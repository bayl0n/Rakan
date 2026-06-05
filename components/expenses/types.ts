import type {
  BudgetCategoryId,
  BudgetCategoryWithAmount,
} from "@/lib/finance/budget";
import type { ExpenseFrequency } from "@/lib/finance/expenses";

export type Expense = {
  id: string;
  amount: number;
  amountForPeriod: number;
  categoryId: BudgetCategoryId;
  categoryLabel: string;
  frequency: ExpenseFrequency;
  payer: string;
  description: string;
  date: string;
};

export type SavedExpense = Omit<Expense, "amountForPeriod">;

export type ExpenseDraft = {
  amount: string;
  categoryId: BudgetCategoryId;
  frequency: ExpenseFrequency;
  payer: string;
  description: string;
  date: string;
};

export type CategorySummary = BudgetCategoryWithAmount & {
  spent: number;
  remaining: number;
  spentPercent: number;
};

export type ExpenseChartDatum = {
  status: "spent" | "remaining";
  amount: number;
  fill: string;
};
