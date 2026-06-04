"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  getBudgetSplitTotal,
  type BudgetSplit,
} from "@/lib/budget";

import { budgetFormSchema, type BudgetFormValues } from "./schema";
import type { BudgetDashboardProps } from "./types";

export function useBudgetForm({
  budgetSplitPresetId,
  customBudgetSplit,
  grossIncome,
  hasHelpDebt,
  per,
  setBudgetSplitPresetId,
  setCustomBudgetSplit,
  setGrossIncome,
  setHasHelpDebt,
  setPer,
  setSuperMode,
  setSuperRate,
  superMode,
  superRate,
}: BudgetDashboardProps) {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      grossIncome,
      per,
      superMode,
      superRate,
      hasHelpDebt: hasHelpDebt ? "yes" : "no",
      budgetSplitPresetId,
      fixedExpenses: customBudgetSplit.fixedExpenses,
      lifestyleExpenses: customBudgetSplit.lifestyleExpenses,
      futureSavings: customBudgetSplit.futureSavings,
    },
  });
  const selectedSplitPresetId = form.watch("budgetSplitPresetId");
  const customSplitTotal =
    Number(form.watch("fixedExpenses")) +
    Number(form.watch("lifestyleExpenses")) +
    Number(form.watch("futureSavings"));

  function submitBudgetDetails(values: BudgetFormValues) {
    const customSplit: BudgetSplit = {
      fixedExpenses: values.fixedExpenses,
      lifestyleExpenses: values.lifestyleExpenses,
      futureSavings: values.futureSavings,
    };

    if (
      values.budgetSplitPresetId === "custom" &&
      getBudgetSplitTotal(customSplit) !== 100
    ) {
      form.setError("futureSavings", {
        message: "Custom split must total 100%.",
      });
      return;
    }

    setGrossIncome(values.grossIncome);
    setPer(values.per);
    setSuperMode(values.superMode);
    setSuperRate(values.superRate);
    setHasHelpDebt(values.hasHelpDebt === "yes");
    setBudgetSplitPresetId(values.budgetSplitPresetId);
    setCustomBudgetSplit(customSplit);
  }

  return {
    customSplitTotal,
    form,
    selectedSplitPresetId,
    setShowAdvancedSettings,
    showAdvancedSettings,
    submitBudgetDetails,
  };
}
