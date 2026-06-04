"use client";

import { BudgetBreakdownCard } from "./budget-breakdown-card";
import { BudgetCalculatorForm } from "./budget-calculator-form";
import type { BudgetDashboardProps } from "./types";

export function BudgetDashboard(props: BudgetDashboardProps) {
  return (
    <div className="flex flex-col gap-4 sm:grid lg:grid-cols-6">
      <BudgetCalculatorForm {...props} />
      <BudgetBreakdownCard {...props} />
    </div>
  );
}
