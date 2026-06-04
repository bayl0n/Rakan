import type { Dispatch, SetStateAction } from "react";

import type {
  BudgetSplit,
  BudgetSplitPresetId,
  PaySummary,
  Per,
  SuperMode,
} from "@/lib/budget";

export type BudgetDashboardProps = {
  grossIncome: number;
  setGrossIncome: Dispatch<SetStateAction<number>>;
  per: Per;
  setPer: Dispatch<SetStateAction<Per>>;
  superMode: SuperMode;
  setSuperMode: Dispatch<SetStateAction<SuperMode>>;
  superRate: number;
  setSuperRate: Dispatch<SetStateAction<number>>;
  hasHelpDebt: boolean;
  setHasHelpDebt: Dispatch<SetStateAction<boolean>>;
  paySummary: PaySummary;
  budgetSplitPresetId: BudgetSplitPresetId;
  setBudgetSplitPresetId: Dispatch<SetStateAction<BudgetSplitPresetId>>;
  customBudgetSplit: BudgetSplit;
  setCustomBudgetSplit: Dispatch<SetStateAction<BudgetSplit>>;
  activeBudgetSplit: BudgetSplit;
};

export type PaySummaryRow = {
  label: string;
  amount: number;
};
