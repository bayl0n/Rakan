"use client";

import { type FormEvent, useCallback, useState } from "react";

import type { BudgetSplit, Per } from "@/lib/budget";
import {
  getBudgetBreakdown,
  getExpenseAmountForPeriod,
  movePeriod,
} from "@/lib/budget";

import type { Expense, ExpenseChartDatum, ExpenseDraft } from "./types";

const today = new Date().toISOString().slice(0, 10);

type UseExpensesDashboardParams = {
  budgetIncome: number;
  budgetSplit: BudgetSplit;
  incomePeriod: Per;
};

export function useExpensesDashboard({
  budgetIncome,
  budgetSplit,
  incomePeriod,
}: UseExpensesDashboardParams) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetPeriod, setBudgetPeriod] = useState<Per>(incomePeriod);
  const [periodAnchorDate, setPeriodAnchorDate] = useState<string>(today);
  const activePeriodAnchorDate = periodAnchorDate || today;
  const budgetBreakdown = getBudgetBreakdown(
    budgetIncome,
    incomePeriod,
    budgetPeriod,
    budgetSplit,
  );
  const [draft, setDraft] = useState<ExpenseDraft>({
    amount: "",
    categoryId: budgetBreakdown[0]?.id ?? "fixedExpenses",
    frequency: "month",
    payer: "",
    description: "",
    date: today,
  });

  const trackedExpenses = expenses.map((expense) => ({
    ...expense,
    amountForPeriod: getExpenseAmountForPeriod(
      expense,
      budgetPeriod,
      activePeriodAnchorDate,
    ),
  }));

  const totalBudget = budgetBreakdown.reduce(
    (total, category) => total + category.amount,
    0,
  );
  const totalSpent = trackedExpenses.reduce(
    (total, expense) => total + expense.amountForPeriod,
    0,
  );
  const totalRemaining = totalBudget - totalSpent;
  const totalSpentPercent =
    totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const categorySummaries = budgetBreakdown.map((category) => {
    const spent = expenses
      .filter((expense) => expense.categoryId === category.id)
      .reduce(
        (total, expense) =>
          total +
          getExpenseAmountForPeriod(
            expense,
            budgetPeriod,
            activePeriodAnchorDate,
          ),
        0,
      );
    const remaining = category.amount - spent;
    const spentPercent =
      category.amount > 0 ? Math.min((spent / category.amount) * 100, 100) : 0;

    return {
      ...category,
      spent,
      remaining,
      spentPercent,
    };
  });

  const chartData: ExpenseChartDatum[] = [
    {
      status: "spent",
      amount: totalSpent,
      fill: "var(--color-spent)",
    },
    {
      status: "remaining",
      amount: Math.max(totalRemaining, 0),
      fill: "var(--color-remaining)",
    },
  ];

  const deleteExpense = useCallback((expenseId: string) => {
    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== expenseId),
    );
  }, []);

  function updateDraft<Field extends keyof ExpenseDraft>(
    field: Field,
    value: ExpenseDraft[Field],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amount = Number(draft.amount);
    const category = budgetBreakdown.find(
      (budgetCategory) => budgetCategory.id === draft.categoryId,
    );

    if (!category || !Number.isFinite(amount) || amount <= 0) return;

    setExpenses((currentExpenses) => [
      {
        id: crypto.randomUUID(),
        amount,
        amountForPeriod: getExpenseAmountForPeriod(
          {
            amount,
            date: draft.date || today,
            frequency: draft.frequency,
          },
          budgetPeriod,
          activePeriodAnchorDate,
        ),
        categoryId: category.id,
        categoryLabel: category.label,
        frequency: draft.frequency,
        payer: draft.payer.trim() || "Unassigned",
        description: draft.description.trim() || "Expense",
        date: draft.date || today,
      },
      ...currentExpenses,
    ]);
    setDraft((currentDraft) => ({
      ...currentDraft,
      amount: "",
      payer: "",
      description: "",
      date: today,
    }));
  }

  function shiftViewingPeriod(direction: "previous" | "next") {
    setPeriodAnchorDate((currentAnchorDate) =>
      movePeriod(currentAnchorDate || today, budgetPeriod, direction),
    );
  }

  return {
    activePeriodAnchorDate,
    addExpense,
    budgetBreakdown,
    budgetPeriod,
    categorySummaries,
    chartData,
    deleteExpense,
    draft,
    periodAnchorDate,
    setBudgetPeriod,
    setPeriodAnchorDate,
    shiftViewingPeriod,
    totalBudget,
    totalRemaining,
    totalSpent,
    totalSpentPercent,
    trackedExpenses,
    updateDraft,
  };
}
