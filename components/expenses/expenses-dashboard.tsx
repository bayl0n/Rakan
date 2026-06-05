"use client";

import { useMemo } from "react";

import { BudgetRemainingCard } from "./budget-remaining-card";
import { getExpenseColumns, type ExpenseTableMeta } from "./columns";
import { DataTable } from "./data-table";
import { ExpenseForm } from "./expense-form";
import { ExpensePeriodControls } from "./expense-period-controls";
import { ExpenseSummaryCards } from "./expense-summary-cards";
import { MobileExpenseList } from "./mobile-expense-list";
import { useExpensesDashboard } from "./use-expenses-dashboard";
import type { BudgetSplit } from "@/lib/finance/budget";
import type { Per } from "@/lib/finance/periods";

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
  const columns = useMemo(() => getExpenseColumns(), []);
  const tableMeta: ExpenseTableMeta = {
    budgetBreakdown: dashboard.budgetBreakdown,
    editingDraft: dashboard.editingDraft,
    editingExpenseId: dashboard.editingExpenseId,
    onCancelEditingExpense: dashboard.cancelEditingExpense,
    onDeleteExpense: dashboard.deleteExpense,
    onSaveEditingExpense: dashboard.saveEditingExpense,
    onStartEditingExpense: dashboard.startEditingExpense,
    onUpdateEditingDraft: dashboard.updateEditingDraft,
    payerOptions: dashboard.payerOptions,
  };

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-6">
      <ExpenseForm
        budgetBreakdown={dashboard.budgetBreakdown}
        budgetPeriod={dashboard.budgetPeriod}
        draft={dashboard.draft}
        onAddExpense={dashboard.addExpense}
        onUpdateDraft={dashboard.updateDraft}
        payerOptions={dashboard.payerOptions}
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
          budgetBreakdown={dashboard.budgetBreakdown}
          editingDraft={dashboard.editingDraft}
          editingExpenseId={dashboard.editingExpenseId}
          expenses={dashboard.trackedExpenses}
          onCancelEditingExpense={dashboard.cancelEditingExpense}
          onDeleteExpense={dashboard.deleteExpense}
          onSaveEditingExpense={dashboard.saveEditingExpense}
          onStartEditingExpense={dashboard.startEditingExpense}
          onUpdateEditingDraft={dashboard.updateEditingDraft}
          payerOptions={dashboard.payerOptions}
        />

        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={dashboard.trackedExpenses}
            meta={tableMeta}
          />
        </div>
      </div>
    </div>
  );
}
