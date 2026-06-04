"use client";

import { useMemo } from "react";

import { BudgetRemainingCard } from "./budget-remaining-card";
import { getExpenseColumns } from "./columns";
import { DataTable } from "./data-table";
import { ExpenseForm } from "./expense-form";
import { ExpensePeriodControls } from "./expense-period-controls";
import { ExpenseSummaryCards } from "./expense-summary-cards";
import { MobileExpenseList } from "./mobile-expense-list";
import { useExpensesDashboard } from "./use-expenses-dashboard";
import type { BudgetSplit, Per } from "@/lib/budget";

type ExpensesDashboardProps = {
  budgetIncome: number;
  budgetSplit: BudgetSplit;
  incomePeriod: Per;
};

export default function ExpensesDashboard({
  budgetIncome,
  budgetSplit,
  incomePeriod,
}: ExpensesDashboardProps) {
  const dashboard = useExpensesDashboard({
    budgetIncome,
    budgetSplit,
    incomePeriod,
  });
  const columns = useMemo(
    () => getExpenseColumns(dashboard.deleteExpense),
    [dashboard.deleteExpense],
  );

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-6">
      <ExpenseForm
        budgetBreakdown={dashboard.budgetBreakdown}
        budgetPeriod={dashboard.budgetPeriod}
        draft={dashboard.draft}
        onAddExpense={dashboard.addExpense}
        onUpdateDraft={dashboard.updateDraft}
      />

      <div className="min-w-0 space-y-4 lg:col-span-4">
        <ExpensePeriodControls
          activePeriodAnchorDate={dashboard.activePeriodAnchorDate}
          budgetPeriod={dashboard.budgetPeriod}
          onBudgetPeriodChange={dashboard.setBudgetPeriod}
          onPeriodAnchorDateChange={dashboard.setPeriodAnchorDate}
          onShiftViewingPeriod={dashboard.shiftViewingPeriod}
          periodAnchorDate={dashboard.periodAnchorDate}
        />

        <ExpenseSummaryCards
          totalBudget={dashboard.totalBudget}
          totalRemaining={dashboard.totalRemaining}
          totalSpent={dashboard.totalSpent}
        />

        <BudgetRemainingCard
          budgetPeriod={dashboard.budgetPeriod}
          categorySummaries={dashboard.categorySummaries}
          chartData={dashboard.chartData}
          totalSpentPercent={dashboard.totalSpentPercent}
        />

        <MobileExpenseList
          expenses={dashboard.trackedExpenses}
          onDeleteExpense={dashboard.deleteExpense}
        />

        <div className="hidden md:block">
          <DataTable columns={columns} data={dashboard.trackedExpenses} />
        </div>
      </div>
    </div>
  );
}
