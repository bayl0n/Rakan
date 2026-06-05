import type { Dispatch, SetStateAction } from "react";

import type {
  BudgetSplit,
  BudgetSplitPresetId,
} from "@/lib/finance/budget";
import type { Per } from "@/lib/finance/periods";
import type { PaySummary } from "@/lib/finance/pay";

export type BudgetDashboardProps = {
  paySummary: PaySummary;
  per: Per;
  budgetSplitPresetId: BudgetSplitPresetId;
  setBudgetSplitPresetId: Dispatch<SetStateAction<BudgetSplitPresetId>>;
  customBudgetSplit: BudgetSplit;
  setCustomBudgetSplit: Dispatch<SetStateAction<BudgetSplit>>;
  activeBudgetSplit: BudgetSplit;
};

export type BudgetSplitFormProps = {
  budgetSplitPresetId: BudgetSplitPresetId;
  setBudgetSplitPresetId: Dispatch<SetStateAction<BudgetSplitPresetId>>;
  customBudgetSplit: BudgetSplit;
  setCustomBudgetSplit: Dispatch<SetStateAction<BudgetSplit>>;
};
