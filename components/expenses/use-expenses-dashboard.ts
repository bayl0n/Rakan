"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { BudgetSplit } from "@/lib/finance/budget";
import { getBudgetBreakdown } from "@/lib/finance/budget";
import { getExpenseAmountForPeriod } from "@/lib/finance/expenses";
import { movePeriod, Pers, type Per } from "@/lib/finance/periods";

import type {
  Expense,
  ExpenseChartDatum,
  ExpenseDraft,
  SavedExpense,
} from "./types";

const today = new Date().toISOString().slice(0, 10);
const expensesStorageKey =
  process.env.NEXT_PUBLIC_EXPENSES_STORAGE_KEY ?? "rakan:expenses:v1"; // v1 is just local storage

type UseExpensesDashboardParams = {
  budgetIncome: number;
  budgetSplit: BudgetSplit;
  incomePeriod: Per;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isExpenseFrequency(
  value: unknown,
): value is SavedExpense["frequency"] {
  return value === "oneOff" || Pers.includes(value as Per);
}

function isStoredExpense(value: unknown): value is SavedExpense {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.amount === "number" &&
    Number.isFinite(value.amount) &&
    typeof value.categoryId === "string" &&
    typeof value.categoryLabel === "string" &&
    isExpenseFrequency(value.frequency) &&
    typeof value.payer === "string" &&
    typeof value.description === "string" &&
    typeof value.date === "string"
  );
}

function readStoredExpenses() {
  try {
    const storedExpenses = window.localStorage.getItem(expensesStorageKey);
    if (!storedExpenses) return [];

    const parsedExpenses: unknown = JSON.parse(storedExpenses);
    if (!Array.isArray(parsedExpenses)) return [];

    return parsedExpenses.filter(isStoredExpense);
  } catch {
    return [];
  }
}

function writeStoredExpenses(expenses: SavedExpense[]) {
  try {
    window.localStorage.setItem(expensesStorageKey, JSON.stringify(expenses));
  } catch {
    // Ignore storage failures so the in-memory app can keep working.
  }
}

export function useExpensesDashboard({
  budgetIncome,
  budgetSplit,
  incomePeriod,
}: UseExpensesDashboardParams) {
  const [expenses, setExpenses] = useState<SavedExpense[]>([]);
  const hasHydratedStoredExpenses = useRef(false);
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
    frequency: "oneOff",
    payer: "",
    description: "",
    date: today,
  });
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<ExpenseDraft | null>(null);

  useEffect(() => {
    setExpenses(readStoredExpenses());
    hasHydratedStoredExpenses.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedStoredExpenses.current) return;
    writeStoredExpenses(expenses);
  }, [expenses]);

  const trackedExpenses = expenses.map((expense) => ({
    ...expense,
    amountForPeriod: getExpenseAmountForPeriod(
      expense,
      budgetPeriod,
      activePeriodAnchorDate,
    ),
  }));
  const payerOptions = Array.from(
    expenses
      .reduce((payerMap, expense) => {
        const payer = expense.payer.trim();
        const payerKey = payer.toLowerCase();

        if (payer && !payerMap.has(payerKey)) {
          payerMap.set(payerKey, payer);
        }

        return payerMap;
      }, new Map<string, string>())
      .values(),
  ).sort((firstPayer, secondPayer) => firstPayer.localeCompare(secondPayer));

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

  const deleteExpense = useCallback(
    (expenseId: string) => {
      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.id !== expenseId),
      );
      setEditingExpenseId((currentEditingExpenseId) =>
        currentEditingExpenseId === expenseId ? null : currentEditingExpenseId,
      );
      setEditingDraft((currentEditingDraft) =>
        editingExpenseId === expenseId ? null : currentEditingDraft,
      );
    },
    [editingExpenseId],
  );

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
      frequency: "oneOff",
      payer: "",
      description: "",
      date: today,
    }));
  }

  function startEditingExpense(expense: Expense) {
    setEditingExpenseId(expense.id);
    setEditingDraft({
      amount: String(expense.amount),
      categoryId: expense.categoryId,
      frequency: expense.frequency,
      payer: expense.payer,
      description: expense.description,
      date: expense.date,
    });
  }

  function updateEditingDraft<Field extends keyof ExpenseDraft>(
    field: Field,
    value: ExpenseDraft[Field],
  ) {
    setEditingDraft((currentEditingDraft) =>
      currentEditingDraft
        ? {
            ...currentEditingDraft,
            [field]: value,
          }
        : currentEditingDraft,
    );
  }

  function cancelEditingExpense() {
    setEditingExpenseId(null);
    setEditingDraft(null);
  }

  function saveEditingExpense() {
    if (!editingExpenseId || !editingDraft) return;

    const amount = Number(editingDraft.amount);
    const category = budgetBreakdown.find(
      (budgetCategory) => budgetCategory.id === editingDraft.categoryId,
    );

    if (!category || !Number.isFinite(amount) || amount <= 0) return;

    setExpenses((currentExpenses) =>
      currentExpenses.map((expense) => {
        if (expense.id !== editingExpenseId) return expense;

        return {
          ...expense,
          amount,
          categoryId: category.id,
          categoryLabel: category.label,
          frequency: editingDraft.frequency,
          payer: editingDraft.payer.trim() || "Unassigned",
          description: editingDraft.description.trim() || "Expense",
          date: editingDraft.date || today,
        };
      }),
    );
    cancelEditingExpense();
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
    cancelEditingExpense,
    deleteExpense,
    draft,
    editingDraft,
    editingExpenseId,
    payerOptions,
    periodAnchorDate,
    setBudgetPeriod,
    setPeriodAnchorDate,
    shiftViewingPeriod,
    saveEditingExpense,
    startEditingExpense,
    totalBudget,
    totalRemaining,
    totalSpent,
    totalSpentPercent,
    trackedExpenses,
    updateDraft,
    updateEditingDraft,
  };
}
