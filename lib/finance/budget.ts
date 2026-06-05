import { convertIncomeForPeriod, type Per } from "./periods";

export type BudgetCategoryId =
  | "fixedExpenses"
  | "lifestyleExpenses"
  | "futureSavings";

export type BudgetCategory = {
  id: BudgetCategoryId;
  label: string;
  shortLabel: string;
  color: string;
};

export type BudgetCategoryWithAmount = BudgetCategory & {
  amount: number;
  percent: number;
};

export type BudgetSplit = Record<BudgetCategoryId, number>;

export const BudgetSplitPresetIds = [
  "barefoot",
  "needsFocused",
  "savingsFocused",
  "custom",
] as const;

export type BudgetSplitPresetId = (typeof BudgetSplitPresetIds)[number];

export type BudgetSplitPreset = {
  id: BudgetSplitPresetId;
  label: string;
  description: string;
  split: BudgetSplit;
};

export const budgetCategories = [
  {
    id: "fixedExpenses",
    label: "Fixed Expenses",
    shortLabel: "Fixed",
    color: "hsl(var(--chart-1))",
  },
  {
    id: "lifestyleExpenses",
    label: "Lifestyle Expenses",
    shortLabel: "Lifestyle",
    color: "hsl(var(--chart-2))",
  },
  {
    id: "futureSavings",
    label: "Future Savings",
    shortLabel: "Savings",
    color: "hsl(var(--chart-3))",
  },
] as const satisfies readonly BudgetCategory[];

export const budgetSplitPresets = [
  {
    id: "barefoot",
    label: "Current / Barefoot-style",
    description: "50% fixed, 30% lifestyle, 20% savings",
    split: {
      fixedExpenses: 50,
      lifestyleExpenses: 30,
      futureSavings: 20,
    },
  },
  {
    id: "needsFocused",
    label: "Needs-focused",
    description: "60% fixed, 20% lifestyle, 20% savings",
    split: {
      fixedExpenses: 60,
      lifestyleExpenses: 20,
      futureSavings: 20,
    },
  },
  {
    id: "savingsFocused",
    label: "Savings-focused",
    description: "50% fixed, 20% lifestyle, 30% savings",
    split: {
      fixedExpenses: 50,
      lifestyleExpenses: 20,
      futureSavings: 30,
    },
  },
] as const satisfies readonly BudgetSplitPreset[];

export const defaultBudgetSplit = budgetSplitPresets[0].split;

export function getBudgetSplitTotal(split: BudgetSplit) {
  return budgetCategories.reduce(
    (total, category) => total + split[category.id],
    0,
  );
}

export function getBudgetBreakdown(
  grossIncome: number,
  fromPer: Per,
  toPer: Per,
  split: BudgetSplit = defaultBudgetSplit,
): BudgetCategoryWithAmount[] {
  const incomeForPeriod = convertIncomeForPeriod(grossIncome, fromPer, toPer);

  return budgetCategories.map((category) => ({
    ...category,
    amount: incomeForPeriod * (split[category.id] / 100),
    percent: split[category.id],
  }));
}
