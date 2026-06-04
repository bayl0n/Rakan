"use client";

import { BudgetBreakdownCard } from "./budget-breakdown-card";
import { BudgetSplitForm } from "./budget-split-form";
import type { BudgetDashboardProps } from "./types";

export function BudgetDashboard(props: BudgetDashboardProps) {
  return (
    <div className="flex flex-col gap-4 sm:grid lg:grid-cols-6">
      <BudgetSplitForm
        budgetSplitPresetId={props.budgetSplitPresetId}
        setBudgetSplitPresetId={props.setBudgetSplitPresetId}
        customBudgetSplit={props.customBudgetSplit}
        setCustomBudgetSplit={props.setCustomBudgetSplit}
      />
      <BudgetBreakdownCard {...props} />
    </div>
  );
}
